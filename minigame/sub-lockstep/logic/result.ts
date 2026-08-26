// @ts-nocheck
/**
 * Result 场景 - logic 层
 *
 * ## 涉及 API
 * 通过 gameserver 封装：
 * - gameServer.clear()      清理状态、发 event.emit('backHome') 通知回到首页
 */

import gameServer from './gameserver';

/** 获取胜负结果（由 gameserver.settle() 填充） */
export function getGameResult() {
    return gameServer.gameResult || [];
}

/** 点确定回到首页：清理对局状态 */
export function backToHome() {
    gameServer.clear();
}
