// @ts-nocheck
/**
 * Battle 场景 - logic 层（帧同步指令上传 / 订阅）
 *
 * ## 涉及的 wx API
 * 通过 gameserver 封装间接使用：
 * - .uploadFrame(actionList)              玩家指令上传
 * - .onSyncFrame                          服务端广播的逻辑帧（gameserver 内部消费）
 * - .endGame                              主动结束游戏
 * - .onRoomInfoChange                     监控对方中途离开
 * - .memberLeaveRoom / .ownerLeaveRoom    主动离开游戏
 *
 * ## 帧同步输入 → 输出路径
 *
 *   view 层（摇杆/射击按钮）
 *      ↓ 触发
 *   logic.sendMoveDirection / sendMoveStop / sendShoot
 *      ↓ uploadFrame(JSON 字符串)
 *   服务器
 *      ↓ onSyncFrame 广播给所有客户端
 *   gameserver.onSyncFrame 缓冲到 frames[]
 *      ↓ 主循环 update() 按 33ms 节奏消费
 *   gameserver.execFrame
 *      ↓ _onPlayerAction(action)
 *   view 层消费（执行玩家射击 / 转向 / 停止）
 */

import gameServer from './gameserver';
import databus    from '../databus';
import config     from '../config';

// ===== setter：view 层绑定渲染回调 =====
let _onOpponentLeave = null;   // (memberList) => void

/** 对方离开房间时通知 view 层 */
export function setOnOpponentLeave(fn) { _onOpponentLeave = fn; }

// ===== 订阅 / 取消订阅 =====

export function subscribe() {
    gameServer.event.on('onRoomInfoChange', _onRoomInfoChange);
}

export function unsubscribe() {
    gameServer.event.off('onRoomInfoChange', _onRoomInfoChange);
    _onOpponentLeave = null;
}

function _onRoomInfoChange(res) {
    const memberList = res && res.memberList || res && res.data && res.data.roomInfo && res.data.roomInfo.memberList || [];
    if ( memberList.length < 2 && _onOpponentLeave ) {
        _onOpponentLeave(memberList);
    }
}

// ===== 输入指令：view 层 → server =====

/** 玩家按住摇杆改变方向 */
export function sendMoveDirection(degree) {
    gameServer.uploadFrame([
        JSON.stringify({
            e: config.msg.MOVE_DIRECTION,
            n: databus.selfClientId,
            d: degree,
        }),
    ]);
}

/** 玩家松开摇杆停止移动 */
export function sendMoveStop() {
    gameServer.uploadFrame([
        JSON.stringify({
            e: config.msg.MOVE_STOP,
            n: databus.selfClientId,
        }),
    ]);
}

/** 玩家点击射击按钮 */
export function sendShoot() {
    gameServer.uploadFrame([
        JSON.stringify({
            e: config.msg.SHOOT,
            n: databus.selfClientId,
        }),
    ]);
}

// ===== 主动离开游戏（带确认）=====

export function confirmLeaveGame(message, isCancel) {
    wx.showModal({
        title: '温馨提示',
        content: message || '离开房间会游戏结束！你确定吗？',
        showCancel: !isCancel,
        success: (res) => {
            if ( res.confirm ) {
                if ( databus.selfMemberInfo.role === config.roleMap.owner ) {
                    gameServer.ownerLeaveRoom();
                } else {
                    gameServer.memberLeaveRoom();
                }
            }
        },
    });
}

/**
 * 派发玩家指令给 view 层
 * view 层在 launch 时调 gameServer.setPlayerAction(this.handleAction.bind(this))
 * 指令格式：{ e: 事件类型, n: clientId, d: 方向（仅 MOVE_DIRECTION） }
 */
export const msgType = config.msg;
