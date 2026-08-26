// @ts-nocheck
/**
 * Home 场景 - logic 层（wx API 调用）
 *
 * ## 涉及的 wx API
 * 通过 gameserver 封装间接使用：
 * - wx.getGameServerManager().startMatch       → quickStart()
 * - wx.getGameServerManager().createRoom       → createRoom()
 * 直接调用：
 * - wx.getUserProfile                           创建房间前拿用户授权（昵称、头像）
 *
 * ## 两种进房方式
 * 1. **快速开始（自动匹配）**：后台按 match_id 自动撮合 2 人 → onMatch → joinRoom
 * 2. **创建对战房间**：自己开房 → shareAppMessage 分享 → 好友点击进入
 *
 * ## 关于用户授权
 * createRoom 传 needUserInfo:true 时，房间会向参与者展示昵称和头像。
 * 微信新版基础库要求授权必须由用户主动点击触发（不能在页面加载时调用），
 * 所以授权在按钮 onclick 里做。
 */

import gameServer from './gameserver';
import databus    from '../databus';

/**
 * 拿用户头像/昵称授权
 * 必须在用户点击事件回调里同步调用，不能 setTimeout 等异步包装
 */
function ensureUserProfile(): Promise<any> {
    if (databus.userInfo && databus.userInfo.nickName) {
        return Promise.resolve(databus.userInfo);
    }

    return new Promise((resolve, reject) => {
        if (!wx.getUserProfile) {
            // 老版基础库降级：用空 profile（房主不会展示昵称头像，但不阻塞流程）
            console.warn('[lockstep] wx.getUserProfile not available, fallback to empty profile');
            databus.userInfo = { avatarUrl: '', nickName: '玩家' };
            return resolve(databus.userInfo);
        }
        wx.getUserProfile({
            desc: '用于在帧同步对战房间内展示',
            success: (res) => {
                databus.userInfo = res.userInfo;
                resolve(res.userInfo);
            },
            fail: (err) => {
                console.warn('[lockstep] getUserProfile fail:', err);
                wx.showToast({ title: '需要授权才能创建房间', icon: 'none' });
                reject(err);
            },
        });
    });
}

/**
 * 快速匹配
 */
export function quickStart() {
    if ( gameServer.isVersionLow ) {
        wx.showModal({
            content: '你的微信版本过低，无法演示该功能！',
            showCancel: false,
            confirmColor: '#02BB00',
        });
        return Promise.reject(new Error('version_low'));
    }
    return ensureUserProfile().then(() => {
        gameServer.createMatchRoom();
    });
}

/**
 * 创建自定义房间
 * @param onDone 房间创建完成后的回调（UI 隐藏 loading 等）
 */
export function createRoom(onDone: () => void) {
    ensureUserProfile().then(() => {
        wx.showLoading({ title: '房间创建中...' });
        gameServer.createRoom({}, () => {
            wx.hideLoading();
            onDone && onDone();
        });
    }).catch(() => {
        // 用户拒绝授权，立即结束 loading
        onDone && onDone();
    });
}

/** 进入 Home 时重置匹配标志位 */
export function onEnter() {
    databus.matchPattern = void 0;
}

