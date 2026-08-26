// @ts-nocheck
/**
 * 帧同步核心：wx.getGameServerManager() 封装
 *
 * ★ 这是整个 demo 里最重要的文件，完整演示了帧同步所有 API 的用法 ★
 *
 * ## 涉及的 wx API
 *
 * 登录 / 断线重连：
 *   wx.getGameServerManager()
 *   .login() / .onLogout / .getLastRoomInfo()
 *   .reconnect() / .onDisconnect
 *
 * 房间管理：
 *   .createRoom / .joinRoom / .getRoomInfo
 *   .memberLeaveRoom / .ownerLeaveRoom
 *   .updateReadyStatus / .onRoomInfoChange
 *
 * 帧同步：
 *   .startGame / .endGame / .onGameStart / .onGameEnd
 *   .uploadFrame / .onSyncFrame
 *
 * 匹配：
 *   .startMatch / .cancelMatch / .onMatch
 *
 * 广播：
 *   .broadcastInRoom / .onBroadcast
 *
 * ## 设计说明
 *
 * 本文件是 **纯 logic 层**，不依赖 PIXI、不渲染任何东西。
 * 渲染相关的回调通过 setter 暴露给 view 层：
 *   - setRenderUpdate(fn)：每帧渲染（view 层的 renderUpdate(dt)）
 *   - setLogicUpdate(fn)：每个逻辑帧（view 层的 logicUpdate(dt, frameId)）
 *   - setPreditUpdate(fn)：逻辑帧后的预测（view 层的 preditUpdate(dt)）
 *   - setDebugMsgUpdate(fn)：调试信息更新
 *   - setPlayerAction(fn)：收到玩家指令时通知 view 层操作玩家
 */

import compareVersion from '../compareVersion';
import config         from '../config';
import databus        from '../databus';
import { showTip }    from '../common/util';
import EventEmitter   from './event-emitter';

class GameServer {
    constructor() {
        if ( !wx.getGameServerManager ) {
            return showTip('当前微信版本不支持帧同步框架');
        }

        this.server = wx.getGameServerManager();
        this.event  = new EventEmitter();

        // 检测当前版本
        this.isVersionLow = compareVersion(wx.getSystemInfoSync().SDKVersion, '2.14.4') < 0;

        this.roomInfo           = {};
        this.hasGameStart       = false;
        this.fps                = 30;
        this.frameInterval      = parseInt(1000 / this.fps);
        this.frameJitLenght     = 2;
        this.gameResult         = [];
        this.reconnecting       = false;
        this.reconnectMaxFrameId = 0;
        this.reconnectSuccess   = 0;
        this.reconnectFail      = 0;

        // ===== view 层通过 setter 注入的回调（去除 databus.gameInstance 直接依赖）=====
        this._onRenderUpdate    = null;   // (dt) => void
        this._onLogicUpdate     = null;   // (dt, frameId) => void
        this._onPreditUpdate    = null;   // (dt) => void
        this._onDebugMsgUpdate  = null;   // (msgArr) => void
        this._onPlayerAction    = null;   // (msgObj) => void，收到玩家指令

        this.reset();
        this.bindEvents();

        this.isConnected = true;
        wx.getNetworkType({
            success: (res) => {
                this.isConnected = !!(res.networkType !== 'none');
            },
        });
    }

    // ===== view 层绑定点 =====
    setRenderUpdate(fn)   { this._onRenderUpdate = fn; }
    setLogicUpdate(fn)    { this._onLogicUpdate = fn; }
    setPreditUpdate(fn)   { this._onPreditUpdate = fn; }
    setDebugMsgUpdate(fn) { this._onDebugMsgUpdate = fn; }
    setPlayerAction(fn)   { this._onPlayerAction = fn; }

    bindEvents() {
        this.onBroadcastHandler      = this.onBroadcast.bind(this);
        this.onSyncFrameHandler      = this.onSyncFrame.bind(this);
        this.onRoomInfoChangeHandler = this.onRoomInfoChange.bind(this);
        this.onGameStartHandler      = this.onGameStart.bind(this);
        this.onGameEndHandler        = this.onGameEnd.bind(this);
        this.onMatchHandler          = this.onMatch.bind(this);

        this.server.onBroadcast(this.onBroadcastHandler);
        this.server.onSyncFrame(this.onSyncFrameHandler);
        this.server.onRoomInfoChange(this.onRoomInfoChangeHandler);
        this.server.onGameStart(this.onGameStartHandler);
        this.server.onGameEnd(this.onGameEndHandler);
        if (!this.isVersionLow) this.server.onMatch(this.onMatchHandler);

        // 断线重连逻辑
        const reconnect = () => {
            if ( this.isLogout && this.isDisconnect ) {
                this.server.login().then(res => {
                    console.log('networkType change -> login', res);
                    this.server.reconnect().then(res => {
                        console.log('networkType change -> reconnect', res);
                        ++this.reconnectSuccess;
                        wx.showToast({ title: '游戏已连接', icon: 'none', duration: 2000 });
                    });
                }).catch(() => ++this.reconnectFail);
            } else {
                if ( this.isLogout ) {
                    this.server.login().then(res => console.log('networkType change -> login', res));
                }
                if ( this.isDisconnect ) {
                    this.server.reconnect().then(res => {
                        ++this.reconnectSuccess;
                        console.log('networkType change -> reconnect', res);
                        wx.showToast({ title: '游戏已连接', icon: 'none', duration: 2000 });
                    }).catch(() => ++this.reconnectFail);
                }
            }
        };

        wx.onNetworkStatusChange((res) => {
            console.log('网络连接状态', res.isConnected);
            if ( !this.isConnected && res.isConnected ) reconnect();
            this.isConnected = res.isConnected;
        });

        this.server.onLogout(() => {
            console.log('onLogout');
            this.isLogout = true;
        });

        this.server.onDisconnect((res) => {
            console.log('onDisconnect', res);
            this.isDisconnect = true;
            res.type !== 'game' && wx.showToast({ title: '游戏已掉线...', icon: 'none', duration: 2000 });
            if (res.type === 'game') {
                const relink = () => {
                    this.server.reconnect().then(r => {
                        console.log('reconnect', r);
                        ++this.reconnectSuccess;
                    }).catch(relink);
                };
                relink();
            }
        });

        wx.onShow(() => reconnect());
    }

    reset() {
        this.frames             = [];
        this.frameStart         = false;
        this.startTime          = new Date();
        this.currFrameIndex     = 0;
        this.svrFrameIndex      = 0;
        this.hasSetStart        = false;
        this.statCount          = 0;
        this.avgDelay           = 0;
        this.delay              = 0;
        this.isDisconnect       = false;
        this.isLogout           = false;
    }

    // ===== 服务端事件回调 =====

    /** 玩家之间的广播，这里被用作"开始游戏"信号 */
    onBroadcast(res) {
        console.log('[lockstep][gs] onBroadcast:', res);

        // 防御：如果本端自己就是发送者，通常已经 startGame 过；但再次调也无副作用
        this.startGame().then(r => {
            console.log('[lockstep][gs] server.startGame ok:', r);

            // 5 秒后检查是否收到第一帧，没收到就提示用户
            setTimeout(() => {
                if (!this.svrFrameIndex) {
                    console.warn('[lockstep][gs] ⚠️ 5s elapsed, no frame received. Possible causes: ' +
                        '(1) 对端 startGame 未成功 (2) lockStepOptions 未生效 (3) 真机网络/服务端问题');
                    // 只在 Battle 场景提示，避免打扰到首页
                    if (this.hasGameStart && !this.svrFrameIndex) {
                        wx.showToast({
                            title: '服务端未下发帧，检查双端网络',
                            icon: 'none',
                            duration: 3000,
                        });
                    }
                }
            }, 5000);
        }).catch(e => {
            console.error('[lockstep][gs] server.startGame FAIL:', e);
            wx.showModal({
                title: 'startGame 失败',
                content: '错误：' + (e && e.errMsg || JSON.stringify(e)),
                showCancel: false,
            });
        });
    }

    /** 匹配成功 */
    onMatch(res) {
        const nickname = res.groupInfoList[0].memberInfoList[0].nickName;
        databus.currAccessInfo = this.accessInfo = res.roomServiceAccessInfo || '';

        this.joinRoom(databus.currAccessInfo).then(res => {
            const data = res.data || {};
            databus.selfClientId = data.clientId;
            this.updateReadyStatus(true);

            if (databus.userInfo.nickName !== nickname) {
                setTimeout(
                    this.server.broadcastInRoom.bind(this, { msg: 'START' }),
                    3000,
                );
            }

            wx.showToast({ title: '匹配成功！3秒后开始游戏', icon: 'none', duration: 2000 });
        }).catch(e => console.log(e));
    }

    /** 游戏开始：通知 view 层切到 Battle 场景 + 启动统计心跳 */
    onGameStart(from) {
        console.log('[lockstep][gs] onGameStart triggered, from:', from);

        // 防重入：微信框架可能重复触发 onGameStart（如广播 + 服务端回调各一次）
        if (this.hasGameStart) {
            console.warn('[lockstep][gs] ⚠️ onGameStart 重复触发，已忽略');
            return;
        }

        this.event.emit('onGameStart');
        this.hasGameStart = true;

        // 每秒发一个 STAT 帧用于测延迟 + 更新 debug 信息
        this.debugTime = setInterval(() => {
            this.uploadFrame([
                JSON.stringify({
                    c: ++this.statCount,
                    t: +new Date(),
                    e: config.msg.STAT,
                    id: databus.selfClientId,
                }),
            ]);

            const time = new Date() - this.startTime;
            const msg = [
                `游戏时间: ${parseInt(time / 1000) + 's'}`,
                `期望帧数: ${Math.floor(time / this.frameInterval)}帧`,
                `实收帧数: ${this.svrFrameIndex}帧`,
                `指令延迟: ${this.avgDelay.toFixed(1) + '(' + this.delay + ')'}ms`,
            ];
            if (this.reconnectSuccess) msg.push(`重连成功: ${this.reconnectSuccess}`);
            if (this.reconnectFail)    msg.push(`重连失败: ${this.reconnectFail}`);

            this._onDebugMsgUpdate && this._onDebugMsgUpdate(msg);
        }, 1000);
    }

    /** 游戏结束：通知 view 层切到 Result 场景 */
    onGameEnd() {
        this.settle();
        this.reset();
        this.event.emit('onGameEnd');
        clearInterval(this.debugTime);
    }

    /** 主动结束游戏 */
    endGame() {
        return this.server.endGame();
    }

    /** 清理并返回首页 */
    clear() {
        this.reset();
        databus.reset();
        this.event.emit('backHome');
    }

    /** 每一逻辑帧服务端广播到所有客户端 */
    onSyncFrame(res) {
        if ( res.frameId === 1 || res.frameId % 100 === 0 ) {
            console.log('[lockstep][gs] onSyncFrame frameId =', res.frameId, 'frames queue =', this.frames.length + 1);
        }
        this.svrFrameIndex = res.frameId;
        this.frames.push(res);

        if ( !this.reconnecting ) {
            (res.actionList || []).forEach(oneFrame => {
                const obj = JSON.parse(oneFrame);
                if ( obj.e === config.msg.STAT && obj.id === databus.selfClientId ) {
                    this.delay    = new Date() - obj.t;
                    this.avgDelay = ((this.avgDelay * (obj.c - 1)) + this.delay) / obj.c;
                }
            });
        }

        if ( this.frames.length > this.frameJitLenght ) this.frameStart = true;

        if ( !this.hasSetStart ) {
            console.log('get first frame');
            this.startTime = new Date() - this.frameInterval;
            this.hasSetStart = true;
        }

        // 重连完成
        if ( this.reconnecting && res.frameId >= this.reconnectMaxFrameId ) {
            this.reconnecting = false;
            this.startTime = new Date() - this.frameInterval * this.reconnectMaxFrameId;
            wx.hideLoading();
        }
    }

    /** 房间信息变化 */
    onRoomInfoChange(roomInfo) {
        this.roomInfo = roomInfo;
        this.event.emit('onRoomInfoChange', roomInfo);
    }

    // ===== 主动调用 =====

    /** 登录 + 查询断线续玩 */
    login() {
        return this.server.login().then((loginRes) => {
            console.log('[lockstep][gs] login resolved:', loginRes);
            this.server.getLastRoomInfo().then((res) => {
                console.log('[lockstep][gs] getLastRoomInfo ok:', res);
                if ( res.data && res.data.roomInfo && res.data.roomInfo.roomState === config.roomState.gameStart ) {
                    console.log('查询到还有没结束的游戏', res.data);
                    const lastAccessInfo = res.data.accessInfo;
                    const lastRoomInfo = res.data.roomInfo;

                    wx.showModal({
                        title: '温馨提示',
                        content: '查询到之前还有尚未结束的游戏，是否重连继续游戏？',
                        success: (modalRes) => {
                            if ( modalRes.confirm ) {
                                // 用户选择续玩
                                this.onRoomInfoChange(lastRoomInfo);
                                wx.showLoading({ title: '重连中...' });
                                this.server.reconnect({ accessInfo: lastAccessInfo }).then(connectRes => {
                                    console.log('断线重连结果', connectRes);
                                    this.reconnectMaxFrameId = connectRes.maxFrameId || 0;
                                    this.reconnecting = true;
                                    this.onGameStart('人工'); // 手动模拟正常开局
                                }).catch((e) => {
                                    console.log(e);
                                    wx.showToast({ title: '重连失败，请重新开房间', icon: 'none', duration: 2000 });
                                });
                            } else {
                                // 用户选择不续玩：主动清理旧房间，避免和新房间冲突
                                // 关键：如果不 leave，服务端认为玩家仍在旧房间，新 createRoom 会报错
                                // 或者导致 startGame 后不发帧
                                console.log('[lockstep][gs] user declined reconnect, cleaning up old room');
                                this.accessInfo = lastAccessInfo;

                                // 先尝试作为房主离开（更彻底，会解散房间）
                                // 若失败再作为成员离开
                                // 再失败就调 endGame 强制终结
                                const tryOwnerLeave = () => this.server.ownerLeaveRoom({
                                    accessInfo: lastAccessInfo,
                                    assignToMinPosNum: true,
                                });
                                const tryMemberLeave = () => this.server.memberLeaveRoom({ accessInfo: lastAccessInfo });
                                const tryEndGame = () => this.server.endGame();

                                tryOwnerLeave().then(r => {
                                    console.log('[lockstep][gs] ownerLeaveRoom ok:', r);
                                }).catch(e1 => {
                                    console.warn('[lockstep][gs] ownerLeaveRoom failed:', e1, '→ try memberLeaveRoom');
                                    tryMemberLeave().then(r => {
                                        console.log('[lockstep][gs] memberLeaveRoom ok:', r);
                                    }).catch(e2 => {
                                        console.warn('[lockstep][gs] memberLeaveRoom failed:', e2, '→ try endGame');
                                        tryEndGame().then(r => {
                                            console.log('[lockstep][gs] endGame ok:', r);
                                        }).catch(e3 => {
                                            console.warn('[lockstep][gs] endGame failed too:', e3);
                                        });
                                    });
                                });
                            }
                        },
                        fail: () => {
                            // modal 被系统关闭（如按 home 键回来等）也清理
                            console.log('[lockstep][gs] modal closed without confirm, cleaning up');
                        },
                    });
                }
            }).catch((err) => {
                // 4002 record not exist 表示"没有上次未结束的房间"，属于正常情况，吞掉即可
                console.log('[lockstep][gs] getLastRoomInfo no last room (or err):', err);
            });
        }).catch((err) => {
            console.error('[lockstep][gs] login FAIL:', err);
            throw err;
        });
    }

    /** 创建房间（手动邀请好友路径） */
    createRoom(options = {}, callback) {
        this.server.createRoom({
            maxMemberNum: options.maxMemberNum || 2,
            startPercent: options.startPercent || 0,
            needUserInfo: true,
        }).then(res => {
            const data = res.data || {};
            databus.currAccessInfo = this.accessInfo = data.accessInfo || '';
            databus.selfClientId   = data.clientId;
            this.event.emit('createRoom');
            console.log('createRoom result:', data);
            callback && callback();
        }).catch(err => {
            console.error('[lockstep] createRoom failed:', err);
            wx.hideLoading();
            const errCode = err && err.errCode;
            let msg = err && err.errMsg || '创建房间失败';
            if (errCode === 4009) {
                msg = '需要授权用户头像/昵称才能创建房间';
            } else if (errCode === 4002) {
                msg = '匹配规则不存在，请检查后台配置';
            }
            wx.showModal({
                title: '创建房间失败',
                content: msg + '（errCode: ' + errCode + '）',
                showCancel: false,
            });
            callback && callback();
        });
    }

    /** 快速匹配（需要后台配置 match_id） */
    createMatchRoom() {
        const { avatarUrl, nickName } = databus.userInfo;

        // 注意：这个 match_id 是官方 lockstep-demo 的匹配规则，绑定在 appId
        // wx4f4a4549a1069d03 下。在你自己的 appId 下需要在小游戏后台重新创建一个
        // 1v1 匹配规则，把这里的 match_id 替换掉。否则会报 errCode:4002 record not exist。
        const matchPromise = this.server.startMatch({
            match_id: 'CuQJHh6u_WqqGQ1UEzMhnfeIIgqdgCAqw12FNbl6l3E',
        });
        if (matchPromise && matchPromise.catch) {
            matchPromise.catch(err => {
                console.warn('[lockstep] startMatch failed:', err);
                wx.showModal({
                    title: '匹配规则未配置',
                    content: '当前 appId 下未配置匹配规则，请使用"创建对战房间"功能，或在小游戏后台创建 1v1 匹配规则后替换 match_id。',
                    showCancel: false,
                });
                databus.matchPattern = void 0;
            });
        }

        databus.matchPattern = true;
        this.event.emit('createRoom');
        this.event.emit('onRoomInfoChange', {
            memberList: [
                { headimg: avatarUrl, nickname: nickName },
                { headimg: 'sub-lockstep/images/avatar_default.png', nickname: '正在匹配玩家...' },
            ],
        });
    }

    joinRoom(accessInfo) { return this.server.joinRoom({ accessInfo }); }

    uploadFrame(actionList) {
        this.hasGameStart && this.server.uploadFrame({ actionList });
    }

    getRoomInfo() { return this.server.getRoomInfo(); }
    startGame()   { return this.server.startGame(); }

    memberLeaveRoom(callback) {
        this.server.memberLeaveRoom({ accessInfo: this.accessInfo }).then((res) => {
            if ( res.errCode === 0 ) this.clear();
            callback && callback(res);
        });
    }

    ownerLeaveRoom(callback) {
        this.server.ownerLeaveRoom({
            accessInfo: this.accessInfo,
            assignToMinPosNum: true,
        }).then((res) => {
            if ( res.errCode === 0 ) this.clear();
            callback && callback(res);
        });
    }

    cancelMatch(res) { this.server.cancelMatch(res); }

    updateReadyStatus(isReady) {
        return this.server.updateReadyStatus({ accessInfo: this.accessInfo, isReady });
    }

    // ===== 主循环驱动（每帧执行）=====
    update(dt) {
        if ( !this.frameStart ) return;

        // 重连中不执行渲染
        if ( !this.reconnecting ) {
            this._onRenderUpdate && this._onRenderUpdate(dt);
        }

        // 本地从游戏开始到现在的运行时间
        const nowFrameTick = new Date() - this.startTime;
        const preFrameTick = this.currFrameIndex * this.frameInterval;
        const currTimeDelta = nowFrameTick - preFrameTick;

        if ( currTimeDelta >= this.frameInterval ) {
            if ( this.frames.length ) {
                this.execFrame();
                this.currFrameIndex++;
            }
        }

        // 断线重连后的快进
        if ( this.frames.length > this.frameJitLenght ) {
            while ( this.frames.length ) {
                this.execFrame();
                this.currFrameIndex++;
            }
        }
    }

    /** 消费一帧：把 server 下发的 actionList 派发给 view 层 */
    execFrame() {
        const frame = this.frames.shift();

        // 逻辑帧推进
        this._onLogicUpdate && this._onLogicUpdate(this.frameInterval, frame.frameId);

        // 派发玩家指令：view 层决定怎么表现（shoot / setDestDegree / setSpeed）
        (frame.actionList || []).forEach(oneFrame => {
            const obj = JSON.parse(oneFrame);
            this._onPlayerAction && this._onPlayerAction(obj);
        });

        // 预测下一帧，方便渲染帧插值逼近
        this._onPreditUpdate && this._onPreditUpdate(this.frameInterval);
    }

    /** 胜负判定（view 层填完 hp 后调用） */
    settle() {
        databus.gameover = true;
        if ( databus.playerList[0].hp > databus.playerList[1].hp ) {
            databus.playerList[0].userData.win = true;
        } else {
            databus.playerList[1].userData.win = true;
        }
        this.gameResult = databus.playerList.map(player => player.userData);
    }
}

export default new GameServer();
