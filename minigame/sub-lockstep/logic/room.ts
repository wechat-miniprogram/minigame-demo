// @ts-nocheck
/**
 * Room 场景 - logic 层（wx API 调用）
 *
 * ## 涉及的 wx API
 * 通过 gameserver 封装间接使用：
 * - .getRoomInfo / .onRoomInfoChange         房间信息同步
 * - .updateReadyStatus                       玩家准备状态
 * - .broadcastInRoom({msg:'START'})          开始游戏信号
 * - .memberLeaveRoom / .ownerLeaveRoom       离开房间
 * - .cancelMatch                             取消匹配
 * 直接 wx API：
 * - wx.shareAppMessage                       分享邀请链接
 * - wx.showModal                             离开确认
 */

import gameServer from './gameserver';
import databus    from '../databus';
import config     from '../config';

// ===== setter：view 层绑定数据更新点 =====
let _onRoomInfo = null;      // (roomInfo) => void
export function setOnRoomInfo(fn) { _onRoomInfo = fn; }

/** 进入房间场景时调用：拉一次初始房间信息 + 监听变化 */
export function subscribe() {
    // 快速匹配模式下 databus.matchPattern === true，房间信息由 onMatch 驱动
    if ( !databus.matchPattern ) {
        gameServer.getRoomInfo(gameServer.accessInfo).then((res) => {
            console.log('getRoomInfo result:', res);
            _onRoomInfo && _onRoomInfo(res);
        });
    }

    // 订阅后续变化（onRoomInfoChange 由 server 广播）
    gameServer.event.on('onRoomInfoChange', onRoomInfoChangeHandler);
}

function onRoomInfoChangeHandler(roomInfo) {
    console.log('onRoomInfoChange:', roomInfo);
    _onRoomInfo && _onRoomInfo({ data: { roomInfo } });
}

/** 离开房间场景时清理订阅 */
export function unsubscribe() {
    gameServer.event.off('onRoomInfoChange', onRoomInfoChangeHandler);
    _onRoomInfo = null;
}

/** 切换自己的准备状态 */
export function toggleReady(currentReady) {
    return gameServer.updateReadyStatus(!currentReady);
}

/** 房主开始游戏：向全房间广播 START 信号 */
export function startGame() {
    gameServer.server.broadcastInRoom({ msg: 'START' });
}

/** 分享邀请好友进房（创建房间模式才会显示邀请位） */
export function inviteFriend() {
    wx.shareAppMessage({
        title: '帧同步demo',
        // 必须带 pathName，让主 demo 入口路由能跳到分包；accessInfo 由分包内部 wx.onShow 处理
        query: 'pathName=getGameServerManager&accessInfo=' + gameServer.accessInfo,
        imageUrl: 'https://res.wx.qq.com/wechatgame/product/luban/assets/img/sprites/bk.jpg',
    });
}

/**
 * 离开房间（带确认弹窗）
 * 根据当前模式（匹配 / 创建）和角色（房主 / 成员）调用对应 API
 * 不管 API 是否成功，用户点了确认就应退出到主 demo
 */
export function leaveRoom() {
    wx.showModal({
        title: '温馨提示',
        content: '是否离开房间？',
        success: (res) => {
            if ( !res.confirm ) return;

            // 延迟 require 避免循环依赖
            const { exitToMain } = require('../index');

            if ( databus.matchPattern ) {
                gameServer.cancelMatch({ match_id: 'CuQJHh6u_WqqGQ1UEzMhnfeIIgqdgCAqw12FNbl6l3E' });
                exitToMain();
                return;
            }

            // 尝试离开房间（服务端清理，不管成功失败都退回主 demo）
            const accessInfo = gameServer.accessInfo;
            if ( accessInfo ) {
                if ( databus.selfMemberInfo && databus.selfMemberInfo.role === config.roleMap.owner ) {
                    gameServer.server.ownerLeaveRoom({ accessInfo, assignToMinPosNum: true }).catch(() => {});
                } else {
                    gameServer.server.memberLeaveRoom({ accessInfo }).catch(() => {});
                }
            }

            exitToMain();
        },
    });
}

/**
 * 解析服务端房间信息，返回 view 层需要的结构化数据
 * （把数据处理逻辑留在 logic 层，view 层只管渲染）
 */
export function parseRoomInfo(res) {
    const emptyUser = {
        nickname: '点击邀请好友',
        headimg: 'sub-lockstep/images/avatar_default.png',
        isEmpty: true,
        isReady: false,
    };

    const data       = res.data            || {};
    const roomInfo   = data.roomInfo       || {};
    const memberList = roomInfo.memberList || [];

    const allReady = !memberList.find(member => !member.isReady);

    if ( memberList.length === 1 ) {
        memberList.push(emptyUser);
    }

    // 找到自己，更新 databus
    memberList.forEach((member, index) => {
        member.index = index;
        if ( databus.selfClientId === member.clientId ) {
            databus.selfPosNum     = member.posNum;
            databus.selfMemberInfo = member;
        }
    });

    return { memberList, allReady };
}
