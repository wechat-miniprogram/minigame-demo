// @ts-nocheck
/**
 * 帧同步游戏配置
 *
 * 注意：
 * - 不再创建 PIXI.Application（view/pixiOptions 已移除），使用主 demo 注入的 app
 * - 已去除 theme 层（直接用原始资源路径）和 ad 相关配置
 */
import { getDeviceInfo } from './common/util';

const deviceinfo = getDeviceInfo();

export default {
    dpr         : deviceinfo.devicePixelRatio,
    windowWidth : deviceinfo.windowWidth,
    windowHeight: deviceinfo.windowHeight,

    GAME_WIDTH  : 667 * 2,
    GAME_HEIGHT : 375 * 2,

    roomState: {
        inTeam   : 1,
        gameStart: 2,
        gameEnd  : 3,
        roomDestroy: 4,
    },

    deviceinfo,

    // 资源预加载列表（分包路径）
    resources: [
        "sub-lockstep/images/bg.png",
        "sub-lockstep/images/aircraft1.png",
        "sub-lockstep/images/aircraft2.png",
        "sub-lockstep/images/bullet_blue.png",
        "sub-lockstep/images/avatar_default.png",
        "sub-lockstep/images/hosticon.png",
        "sub-lockstep/images/iconready.png",
        "sub-lockstep/images/quickStart.png",
        "sub-lockstep/images/createRoom.png",
        "sub-lockstep/images/goBack.png",
        "sub-lockstep/images/getReady.png",
        "sub-lockstep/images/start.png",
        "sub-lockstep/images/btn_bg.png",
        "sub-lockstep/images/attack.png",
        "sub-lockstep/images/attacking.png",
        "sub-lockstep/images/joystick_wrap.png",
        "sub-lockstep/images/joystick.png",
    ],

    msg: {
        "SHOOT"         : 1,
        "MOVE_DIRECTION": 2,
        "MOVE_STOP"     : 3,
        "STAT"          : 4,
    },

    roleMap: {
        owner  : 1,
        partner: 0,
    },

    playerHp: 20,
}
