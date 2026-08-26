/**
 * scene → pathName 映射表
 * 用于扫小程序码时，通过短 scene 参数定位到具体示例页面。
 * 生成小程序码时使用相同的映射关系。
 */

export const SCENE_MAP: Record<string, string> = {
  // ===== 基础 =====
  '1': 'baseEnv',
  '2': 'baseSystem',
  '3': 'baseUpdate',
  '4': 'baseLifeCycle',
  '5': 'baseAppEvent',
  '6': 'basePerformance',
  '7': 'baseLoadSubpackage',
  '8': 'baseDebug',
  '9': 'baseCrypto',
  // ===== 跳转 =====
  '10': 'restartMiniProgram',
  '11': 'navigateToMiniProgram',
  '12': 'exitMiniProgram',
  // ===== 转发 =====
  '13': 'onShareAppMessage',
  '14': 'shareAppMessage',
  '15': 'shareTimeLine',
  '16': 'setMessageToFriendQuery',
  '17': 'shareActivity',
  '18': 'showShareImageMenu',
  // ===== 界面 =====
  '19': 'showActionSheet',
  '20': 'showModal',
  '21': 'showToast',
  '22': 'uiMenu',
  '23': 'uiWindow',
  // ===== 网络 =====
  '24': 'request',
  '25': 'downloadFile',
  '26': 'uploadFile',
  '27': 'WebSocket',
  // ===== 数据缓存 =====
  '30': 'storageOp',
  '31': 'backgroundFetch',
  '32': 'bufferUrl',
  // ===== 数据分析 =====
  '33': 'dataAnalysisReport',
  '34': 'dataAnalysisLogManager',
  // ===== 渲染 =====
  '35': 'toDataURL',
  '36': 'toTempFilePath',
  '37': 'setPreferredFramesPerSecond',
  '38': 'loadFont',
  '39': 'createImage',
  '40': 'renderCanvas',
  '41': 'cursor',
  // ===== 媒体 =====
  '42': 'video',
  '43': 'voiceFrequency',
  '44': 'voice',
  '45': 'camera',
  '46': 'innerAudio',
  '47': 'webAudio',
  '48': 'recorder',
  '49': 'livePusher',
  '50': 'voipChat',
  '51': 'videoDecoder',
  '52': 'mediaImage',
  '138': 'mediaAudioPlayer',
  // ===== 位置 =====
  '53': 'getLocation',
  // ===== 设备 =====
  '54': 'getUpdateManager',
  '55': 'vibrate',
  '56': 'clipboardData',
  '57': 'getNetworkType',
  '58': 'onNetworkStatusChange',
  '59': 'getBatteryInfo',
  '60': 'screenBrightness',
  '61': 'setKeepScreenOn',
  '62': 'compassChange',
  '63': 'accelerometerChange',
  '64': 'deviceMotionChange',
  '65': 'gyroscopeChange',
  '66': 'deviceOrientationChange',
  '67': 'bluetooth',
  '68': 'memoryWarning',
  '69': 'mouse',
  '70': 'scanCode',
  '71': 'gamePad',
  '72': 'keyboard',
  '73': 'touch',
  '74': 'wheel',
  // ===== 文件 =====
  '75': 'dir',
  '76': 'access',
  '77': 'rename',
  '78': 'saveFile',
  '79': 'readdir',
  '80': 'operationFile',
  '81': 'getFileInfo',
  '82': 'stat',
  '83': 'unzip',
  '84': 'savedFile',
  '85': 'fileSystemManager',
  '86': 'saveFileToDisk',
  // ===== 开放接口 =====
  '87': 'login',
  '88': 'getUserInfo',
  '89': 'openDataContext',
  '90': 'relationalChaininteractiveData',
  '91': 'directedSharing',
  '92': 'requestSubscribeMessage',
  '93': 'requestSubscribeSystemMessage',
  '94': 'matchedPattern',
  '95': 'VoIPChat',
  '96': 'startHandoff',
  '97': 'appletCode',
  '98': 'UnionID',
  '99': 'createGameClubButton',
  '100': 'customerService',
  '101': 'setting',
  '102': 'accountInfo',
  '103': 'authorize',
  '104': 'channels',
  '105': 'chooseAddress',
  '106': 'customerMessage',
  '107': 'groupInfo',
  '108': 'privacy',
  '109': 'weRun',
  '110': 'openBusinessView',
  // ===== 虚拟支付 =====
  '111': 'midasPay',
  '112': 'overseasPay',
  '113': 'merchantTransfer',
  // ===== 游戏对局回放 =====
  '115': 'getGameRecorder',
  // ===== 游戏服务 =====
  '116': 'getGameServerManager',
  // ===== 广告 =====
  '118': 'createBannerAd',
  '119': 'createRewardedVideoAd',
  '120': 'createInterstitialAd',
  '122': 'createCustomAd',
  // ===== 推荐 =====
  '123': 'createGameBanner',
  '124': 'createGameIcon',
  '125': 'createGamePortal',
  // ===== 工具 =====
  '126': 'utilEncode',
  // ===== Worker =====
  '127': 'worker',
  // ===== WASM =====
  '128': 'wxWebAssembly',
  // ===== 聊天工具 =====
  '129': 'groupTask',
  // ===== AI =====
  '130': 'visionkit-basic',
  '131': 'visionkit-basic-v2',
  '132': 'plane-ar',
  '133': 'face-detect',
  '134': 'aiInference',
  '135': 'vkSession',
  // ===== 服务端 =====
  '136': 'serverCloudFunctions',
  // ===== 性能 =====
  '137': 'perfFilePerf',
};

// 反向表：pathName → sceneId（用于批量生成小程序码）
export const PATH_TO_SCENE: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [k, v] of Object.entries(SCENE_MAP)) {
    map[v] = k;
  }
  return map;
})();

/**
 * 从启动/onShow 的 query 中解析出 pathName。
 * 支持三种来源：
 *   1. query.pathName 直接传入（分享/开发者工具自定义编译）
 *   2. query.scene 为短 ID（扫小程序码）
 *   3. query.scene 为 "pathName=xxx" 格式（备用兼容）
 */
export function resolvePathName(query: Record<string, any> | undefined): string | undefined {
  if (!query || !Object.keys(query).length) return undefined;

  // 优先直接 pathName
  if (query.pathName) return query.pathName;

  // 尝试 scene
  const scene = query.scene as string | undefined;
  if (!scene) return undefined;

  // 短 ID 映射
  if (SCENE_MAP[scene]) return SCENE_MAP[scene];

  // 兼容 "pathName=xxx" 格式
  const match = scene.match(/pathName=(.+)/);
  if (match) return match[1];

  return undefined;
}
