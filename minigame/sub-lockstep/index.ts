// @ts-nocheck
/**
 * 帧同步分包入口
 *
 * 从主 demo 的 router 跳转过来时调用 launch()。
 * 接管整个 PIXI stage，渲染帧同步游戏（Home/Room/Battle/Result 四个场景）。
 * 点击返回或游戏结束点"确定"时清理并还原主 demo。
 *
 * 涉及微信 API（GameServerManager 系列）：
 * - wx.getGameServerManager / login / createRoom / joinRoom
 * - onSyncFrame / uploadFrame / startGame / endGame / onGameStart / onGameEnd
 * - broadcastInRoom / onMatch / startMatch / cancelMatch
 * - onRoomInfoChange / updateReadyStatus
 * - onDisconnect / reconnect / onLogout
 */

import { setPIXI } from './pixi-ref';

// 启动状态
let _PIXI = null;
let _app = null;
let _root = null;            // 顶层容器（所有场景挂在这里，返回时整个销毁）
let _tickerFn = null;        // 加入 app.ticker 的主循环
let _onReturn = null;        // 返回主 demo 的回调
let _wxOnShowHandler = null; // 注册的 wx.onShow 监听（返回时移除）
let _config = null;
let _databus = null;
let _gameServer = null;
let _Tween = null;
let _scenes = null;          // { Home, Room, Battle, Result, BackGround }
let _timer = 0;
let _originalRendererSize = null; // 进入分包前 PIXI renderer 的尺寸（退出时还原）

/**
 * 主循环：驱动帧同步逻辑帧 + 缓动动画
 */
let _loopTick = 0;
function loop() {
    const now = +new Date();
    const dt = now - _timer;
    _timer = now;
    _gameServer.update(dt);
    _Tween.update();
    // 每 300 帧（约 5 秒）打一次心跳日志，验证主循环在跑
    if ((++_loopTick) % 300 === 0 && _gameServer.hasGameStart) {
        console.log('[lockstep][loop] tick', _loopTick,
            'frameStart:', _gameServer.frameStart,
            'frames queue:', _gameServer.frames && _gameServer.frames.length,
            'currFrameIndex:', _gameServer.currFrameIndex,
            'svrFrameIndex:', _gameServer.svrFrameIndex);
    }
}

/**
 * 切换场景：销毁旧场景 → 创建新场景 → launch
 */
function runScene(Scene) {
    let old = _root.getChildByName('scene');
    while (old) {
        if (old._destroy) old._destroy();
        old.destroy(true);
        _root.removeChild(old);
        old = _root.getChildByName('scene');
    }
    const scene = new Scene();
    scene.name = 'scene';
    scene.sceneName = Scene.name;
    scene.launch(_gameServer);
    _root.addChild(scene);
    return scene;
}

function joinToRoom() {
    // joinRoom 失败 4009 是因为房间 needUserInfo:true，需要先授权
    // 但 getUserProfile 必须在用户点击事件回调里同步调用，
    // 所以这里弹一个 modal，让用户点"接受邀请"后再走授权 + joinRoom 流程
    const doJoin = () => {
        wx.showLoading({ title: '加入房间中' });
        _gameServer.joinRoom(_databus.currAccessInfo).then((res: any) => {
            wx.hideLoading();
            const data = res.data || {};
            _databus.selfClientId = data.clientId;
            _gameServer.accessInfo = _databus.currAccessInfo;
            runScene(_scenes.Room);
        }).catch((e: any) => {
            wx.hideLoading();
            console.log('[lockstep] joinRoom fail:', e);
            const errCode = e && e.errCode;
            let msg = e && e.errMsg || '加入房间失败';
            if (errCode === 4009) msg = '需要授权头像/昵称才能加入房间';
            else if (errCode === 4002) msg = '房间不存在或已解散';
            wx.showModal({
                title: '加入房间失败',
                content: msg + '（errCode: ' + errCode + '）',
                showCancel: false,
                success: () => {
                    _databus.currAccessInfo = '';
                    runScene(_scenes.Home);
                },
            });
        });
    };

    // 已有用户信息（之前授权过本会话） → 直接 join
    if (_databus.userInfo && _databus.userInfo.nickName) {
        doJoin();
        return;
    }

    // 没有用户信息 → 弹"接受邀请"按钮，用户点击后授权 + join
    wx.showModal({
        title: '对方邀请你加入帧同步对战',
        content: '点击"接受"将获取你的头像和昵称用于房间内展示',
        confirmText: '接受',
        cancelText: '拒绝',
        success: (modalRes: any) => {
            if (!modalRes.confirm) {
                // 用户拒绝：清掉 accessInfo，回主页
                _databus.currAccessInfo = '';
                runScene(_scenes.Home);
                return;
            }

            if (!wx.getUserProfile) {
                // 老版基础库降级
                _databus.userInfo = { avatarUrl: '', nickName: '玩家' };
                doJoin();
                return;
            }

            wx.getUserProfile({
                desc: '用于在帧同步对战房间内展示',
                success: (profileRes: any) => {
                    _databus.userInfo = profileRes.userInfo;
                    doJoin();
                },
                fail: (err: any) => {
                    console.warn('[lockstep] getUserProfile fail:', err);
                    wx.showToast({ title: '需要授权才能加入房间', icon: 'none' });
                    _databus.currAccessInfo = '';
                    runScene(_scenes.Home);
                },
            });
        },
    });
}

function bindGameServerEvents() {
    _gameServer.event.on('backHome', () => runScene(_scenes.Home));
    _gameServer.event.on('createRoom', () => runScene(_scenes.Room));
    _gameServer.event.on('onGameStart', () => {
        runScene(_scenes.Battle);
    });
    _gameServer.event.on('onGameEnd', () => {
        runScene(_scenes.Result);
    });
}

function bindWxOnShow() {
    _wxOnShowHandler = (res) => {
        const accessInfo = res.query && res.query.accessInfo;
        if (!accessInfo) return;

        if (!_databus.currAccessInfo) {
            _databus.currAccessInfo = accessInfo;
            joinToRoom();
            return;
        }

        if (accessInfo !== _databus.currAccessInfo) {
            wx.showModal({
                title: '温馨提示',
                content: '你要离开当前房间，接受对方的对战邀请吗？',
                success: (modal) => {
                    if (!modal.confirm) return;
                    const room = _databus.selfMemberInfo.role === _config.roleMap.owner
                        ? 'ownerLeaveRoom' : 'memberLeaveRoom';
                    _gameServer[room](() => {
                        _databus.currAccessInfo = accessInfo;
                        joinToRoom();
                    });
                }
            });
        }
    };
    wx.onShow(_wxOnShowHandler);
}

/**
 * 清理：返回主 demo 之前调用
 * - 销毁所有场景和顶层容器
 * - 停止主循环
 * - 恢复竖屏
 * - 尝试 endGame（如果在游戏中）
 */
function cleanup() {
    // 关掉可能残留的 loading（登录中点返回时）
    try { wx.hideLoading(); } catch (e) { /* ignore */ }

    // 退出游戏
    try {
        if (_gameServer && _gameServer.hasGameStart) {
            _gameServer.endGame && _gameServer.endGame();
        }
    } catch (e) { /* ignore */ }

    // 停止主循环
    if (_tickerFn && _app) {
        _app.ticker.remove(_tickerFn);
        _tickerFn = null;
    }

    // 销毁场景容器
    if (_root) {
        _root.destroy({ children: true });
        if (_app && _app.stage) _app.stage.removeChild(_root);
        _root = null;
    }

    // 注销 wx.onShow
    if (_wxOnShowHandler) {
        try { wx.offShow && wx.offShow(_wxOnShowHandler); } catch (e) { /* 部分基础库可能没 offShow */ }
        _wxOnShowHandler = null;
    }

    // 注销 resize 监听
    if (_resizeHandler) {
        try { wx.offWindowResize && wx.offWindowResize(_resizeHandler); } catch (e) { /* ignore */ }
        _resizeHandler = null;
    }

    // 恢复竖屏
    try { wx.setDeviceOrientation({ value: 'portrait' }); } catch (e) { /* ignore */ }

    // 恢复 PIXI renderer 原始尺寸（不影响主 demo 其他页面）
    if (_originalRendererSize && _app && _app.renderer) {
        try {
            _app.renderer.resize(_originalRendererSize.w, _originalRendererSize.h);
            console.log('[lockstep] restored renderer size:', _originalRendererSize);
        } catch (e) { /* ignore */ }
        _originalRendererSize = null;
    }
}

/**
 * 从主 demo 返回（由内部触发，例如 Home 场景的返回按钮）
 */
export function exitToMain() {
    cleanup();
    if (_onReturn) {
        const cb = _onReturn;
        _onReturn = null;
        cb();
    }
}

/**
 * 入口：由主 demo 的 router.loadPage 调用
 *
 * @param {any} PIXI      - 主包注入的 PIXI 实例
 * @param {any} app       - 主包的 PIXI.Application
 * @param {any} _params   - 路由参数（暂未使用）
 * @param {Function} onReturn - 返回主 demo 的回调
 */
/**
 * 获取当前真实屏幕尺寸
 *
 * 注意：在微信小游戏里，横屏切换后 `window.innerWidth/Height` **不会更新**（仍是初始竖屏值）
 * 必须用 wx.getWindowInfo() / wx.getSystemInfoSync() 拿真实尺寸。
 */
function getScreenSize() {
    try {
        if (wx.getWindowInfo) {
            const info = wx.getWindowInfo();
            return { w: info.windowWidth, h: info.windowHeight };
        }
    } catch (e) { /* ignore */ }
    try {
        const info = wx.getSystemInfoSync();
        return { w: info.windowWidth, h: info.windowHeight };
    } catch (e) { /* ignore */ }
    return { w: window.innerWidth, h: window.innerHeight };
}

/**
 * 获取 devicePixelRatio（主 demo 创建 renderer 时用的是 windowWidth * pixelRatio，
 * 所以这里计算也必须带上 dpr 才能和主 demo 坐标系一致）
 */
function getDPR() {
    try {
        const info = wx.getSystemInfoSync();
        return info.pixelRatio || 1;
    } catch (e) { return 1; }
}

/**
 * 根据当前 window 尺寸重新计算 _root 的缩放和偏移
 * 需要在横竖屏切换后、resize 事件后调用
 *
 * 关键：
 * 1. renderer 尺寸必须用物理像素（CSS 像素 × dpr），和主 demo 初始化时一致
 *    - 主 demo 重写了 mapPositionToPoint 为 point.x = x * pixelRatio
 *    - 意味着 PIXI 坐标系 = 屏幕 CSS 坐标系 × dpr
 *    - renderer buffer 也必须是物理像素，否则点击映射坐标会超出 buffer 范围
 * 2. _root 的 scale 也要乘上 dpr，让逻辑尺寸（GAME_WIDTH/HEIGHT）铺满物理 buffer
 */
function relayout() {
    if (!_root || !_config || !_app) return;
    const { w: screenW, h: screenH } = getScreenSize();
    const dpr = getDPR();

    // 物理像素尺寸（和主 demo 初始化时一致）
    const bufferW = screenW * dpr;
    const bufferH = screenH * dpr;

    // ★ 关键：renderer 尺寸用物理像素
    try {
        if (_app.renderer && typeof _app.renderer.resize === 'function') {
            _app.renderer.resize(bufferW, bufferH);
        }
    } catch (e) {
        console.warn('[lockstep] renderer.resize failed:', e);
    }

    // _root scale：让 GAME_WIDTH/HEIGHT 的逻辑画布铺到 bufferW/bufferH 物理像素
    const scaleX = bufferW / _config.GAME_WIDTH;
    const scaleY = bufferH / _config.GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    _root.scale.set(scale, scale);
    _root.x = (bufferW - _config.GAME_WIDTH * scale) / 2;
    _root.y = (bufferH - _config.GAME_HEIGHT * scale) / 2;
    console.log('[lockstep] relayout:', { screenW, screenH, dpr, bufferW, bufferH, scale, x: _root.x, y: _root.y });
}

/**
 * 轮询等待横屏就位
 * 每 100ms 读一次屏幕尺寸，直到 W > H 或超时（3 秒），每次变化都 relayout。
 */
function waitForLandscape() {
    let elapsed = 0;
    const step = 100;
    const timeout = 3000;
    let last = getScreenSize();

    const timer = setInterval(() => {
        elapsed += step;
        const now = getScreenSize();
        if (now.w !== last.w || now.h !== last.h) {
            last = now;
            console.log('[lockstep] screen size changed:', now);
            relayout();
        }
        if (now.w > now.h || elapsed >= timeout) {
            clearInterval(timer);
            console.log('[lockstep] waitForLandscape done:', { ...now, elapsed });
            relayout();
        }
    }, step);
}

let _resizeHandler = null;

/**
 * 入口：由主 demo 的 router.loadPage 调用
 *
 * @param PIXI      - 主包注入的 PIXI 实例
 * @param app       - 主包的 PIXI.Application
 * @param params    - 路由参数（query 对象）。如果有 accessInfo 则自动加入房间（好友点击分享链接进来）
 * @param onReturn  - 返回主 demo 的回调
 */
export function launch(PIXI, app, params, onReturn) {
    console.log('[lockstep] === launch start ===, params:', params);
    _PIXI = PIXI;
    _app = app;
    _onReturn = onReturn;
    setPIXI(PIXI);
    console.log('[lockstep] 1) setPIXI done');

    // 保存 renderer 原始尺寸，退出时恢复（不影响其他页面）
    try {
        if (app.renderer) {
            _originalRendererSize = { w: app.renderer.width, h: app.renderer.height };
            console.log('[lockstep] saved original renderer size:', _originalRendererSize);
        }
    } catch (e) { /* ignore */ }

    // 切到横屏（异步，尺寸要等 resize 事件后才更新）
    // 注意：必须 game.json 里 "resizable": true 才能动态切换
    try {
        wx.setDeviceOrientation({
            value: 'landscape',
            success: (res) => {
                const sz = getScreenSize();
                console.log('[lockstep] setDeviceOrientation success:', res, 'size:', sz);
                relayout();
            },
            fail: (err) => {
                console.warn('[lockstep] setDeviceOrientation FAIL:', err);
            },
            complete: () => {
                console.log('[lockstep] setDeviceOrientation complete, size:', getScreenSize());
            },
        });
        console.log('[lockstep] 2) setDeviceOrientation called');
    } catch (e) {
        console.warn('[lockstep] setDeviceOrientation threw:', e);
    }

    // 懒加载：此时 setPIXI 已执行，pixi-ref 可以用了，可以 require 其他模块
    try {
        _config = require('./config').default;
        _databus = require('./databus').default;
        _gameServer = require('./logic/gameserver').default;
        _Tween = require('./views/components/tween').default;
        _scenes = {
            Home: require('./views/scenes/home').default,
            Room: require('./views/scenes/room').default,
            Battle: require('./views/scenes/battle').default,
            Result: require('./views/scenes/result').default,
        };
        console.log('[lockstep] 3) modules required, config.GAME_WIDTH =', _config.GAME_WIDTH);

        // 如果好友是从分享链接进来的，params 里会带 accessInfo，
        // 写到 databus，登录完成后 doLogin() 内会自动 joinToRoom()
        if (params && params.accessInfo) {
            _databus.currAccessInfo = params.accessInfo;
            console.log('[lockstep] entered with accessInfo from share link:', params.accessInfo);
        }
    } catch (e) {
        console.error('[lockstep] 3) require modules FAILED:', e && e.stack || e);
        return;
    }

    let BackGround;
    try {
        BackGround = require('./views/components/bg').default;
        console.log('[lockstep] 4) BackGround required');
    } catch (e) {
        console.error('[lockstep] 4) require BackGround FAILED:', e && e.stack || e);
        return;
    }

    // 创建顶层容器
    _root = new PIXI.Container();
    _root.name = 'lockstep-root';
    app.stage.addChild(_root);
    console.log('[lockstep] 5) _root added to stage');

    // 首次布局（可能还是竖屏尺寸，横屏 resize 后会重算）
    relayout();

    // 监听 resize 事件：横屏切换完成后重新布局
    _resizeHandler = (res) => {
        console.log('[lockstep] window resize:', res);
        relayout();
    };
    try { wx.onWindowResize(_resizeHandler); } catch (e) {
        console.warn('[lockstep] onWindowResize not supported:', e);
    }

    // 轮询等待横屏就位（onWindowResize 不稳定，轮询更可靠）
    waitForLandscape();

    // 预加载资源（在创建任何 Sprite 前完成，否则 Texture.from 会得到空纹理）
    const toLoad = [];
    for (const src of _config.resources) {
        if (!PIXI.loader.resources[src]) toLoad.push(src);
    }
    console.log('[lockstep] 7) resources to load:', toLoad.length, '/', _config.resources.length);

    const onReady = () => {
        console.log('[lockstep] 8) onReady - resources ready');

        // 资源加载完毕时，横屏一般已就位，再保险地重算一次
        relayout();

        // 背景
        try {
            const bg = new BackGround();
            _root.addChild(bg);
            console.log('[lockstep] 9) background added');
        } catch (e) {
            console.error('[lockstep] 9) background FAILED:', e && e.stack || e);
        }

        // 绑定游戏服务事件
        bindGameServerEvents();
        // 绑定分享点击事件
        bindWxOnShow();
        console.log('[lockstep] 10) events bound');

        // 启动主循环（先启动，让 Tween 等动画在 loading 期间也能动）
        _timer = +new Date();
        _tickerFn = loop;
        _app.ticker.add(_tickerFn);
        console.log('[lockstep] 11) ticker started');

        // 阻塞式登录：登录中显示 loading，成功后进 Home，失败显示错误对话框
        doLogin();
    };

    if (toLoad.length) {
        toLoad.forEach(src => PIXI.loader.add(src));
        PIXI.loader.load((_, resources) => {
            console.log('[lockstep] loader.load done');
            onReady();
        });
    } else {
        onReady();
    }
}

/**
 * 阻塞式登录流程：
 *   显示 loading → wx login → getLastRoomInfo → 进入 Home
 *   失败 → 隐藏 loading → 弹出错误 modal（确定后退回主 demo）
 */
function doLogin() {
    console.log('[lockstep] login: start...');
    wx.showLoading({ title: '登录中...', mask: true });

    _gameServer.login().then(() => {
        wx.hideLoading();
        console.log('[lockstep] login: ✅ OK', {
            hasGameStart: _gameServer.hasGameStart,
            isLogout: _gameServer.isLogout,
            isDisconnect: _gameServer.isDisconnect,
            accessInfo: _gameServer.accessInfo,
            isVersionLow: _gameServer.isVersionLow,
        });

        // 进入 Home / 或恢复未结束的房间
        try {
            if (_databus.currAccessInfo) {
                joinToRoom();
            } else {
                runScene(_scenes.Home);
                console.log('[lockstep] login: Home scene shown');
            }
        } catch (e) {
            console.error('[lockstep] login: runScene Home FAILED:', e && e.stack || e);
            showLoginError('启动失败：' + (e && e.message || e));
        }
    }).catch(err => {
        wx.hideLoading();
        console.error('[lockstep] login: ❌ FAIL:', err);
        const msg = err && (err.errMsg || err.message) || JSON.stringify(err) || '未知错误';
        showLoginError('登录失败：' + msg);
    });
}

/**
 * 登录失败处理：弹错误对话框，确认后退回主 demo
 */
function showLoginError(message) {
    wx.showModal({
        title: '帧同步登录失败',
        content: message + '\n\n请检查网络后重试。',
        showCancel: false,
        confirmText: '返回',
        success: () => {
            exitToMain();
        },
    });
}
