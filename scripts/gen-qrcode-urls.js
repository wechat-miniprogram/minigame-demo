/**
 * 生成小程序码 URL 映射表。
 *
 * 使用方法：
 * 1. 先在微信开发者工具中部署并调用 genDemoQRCodes 云函数
 * 2. 云函数会把所有小程序码上传到云存储 demo-qrcodes/{pathName}.png
 * 3. 在小游戏端调用以下代码获取临时链接（也可在云开发控制台手动获取永久链接）：
 *
 * ```js
 * const res = await wx.cloud.callFunction({ name: 'genDemoQRCodes' });
 * // res.result.results 就是 { pathName: { sceneId, fileID, cloudPath } } 映射
 * ```
 *
 * 4. 或者在云开发控制台 → 存储 → demo-qrcodes/ 下找到所有 PNG，
 *    点击"获取链接"得到永久 HTTPS URL。
 *
 * 5. 把这些 URL 填入基础库源码注释中（见下方示例）。
 *
 * ─── 在 wxapplib 源码注释中嵌入的写法 ───
 *
 * 假设 wx.getSystemInfo 对应 sceneId='2'，生成的小程序码 URL 为：
 *   https://xxx.tcb.qcloud.la/demo-qrcodes/baseSystem.png
 *
 * 则在 sdk 源码注释中这样写：
 *
 * ```js
 * / **
 * @function wx.getSystemInfo
 * @wx-type app|game
 * @wx-output document/system/system-info
 * @description 获取系统信息
 *
 * @example
 * <p>扫码体验</p>
 * <code>
 * // 扫描下方小程序码，可在微信中直接体验此 API
 * </code>
 *
 * <img src="https://xxx.tcb.qcloud.la/demo-qrcodes/baseSystem.png" width="200" alt="扫码体验 wx.getSystemInfo" />
 *
 * @example
 * <p>基础用法</p>
 * <code>
 * wx.getSystemInfo({
 *   success(res) {
 *     console.log(res.model)
 *   }
 * })
 * </code>
 * * /
 * ```
 *
 * ─── 完整场景映射（方便查找 sceneId）───
 */

const SCENE_MAP = {
  '1': 'baseEnv',
  '2': 'baseSystem',
  '3': 'baseUpdate',
  '4': 'baseLifeCycle',
  '5': 'baseAppEvent',
  '6': 'basePerformance',
  '7': 'baseLoadSubpackage',
  '8': 'baseDebug',
  '9': 'baseCrypto',
  '10': 'restartMiniProgram',
  '11': 'navigateToMiniProgram',
  '12': 'exitMiniProgram',
  '13': 'onShareAppMessage',
  '14': 'shareAppMessage',
  '15': 'shareTimeLine',
  '16': 'setMessageToFriendQuery',
  '17': 'shareActivity',
  '18': 'showShareImageMenu',
  '19': 'showActionSheet',
  '20': 'showModal',
  '21': 'showToast',
  '22': 'uiMenu',
  '23': 'uiWindow',
  '24': 'request',
  '25': 'downloadFile',
  '26': 'uploadFile',
  '27': 'WebSocket',
  '28': 'tcpSocket',
  '29': 'udpSocket',
  '30': 'storageOp',
  '31': 'backgroundFetch',
  '32': 'bufferUrl',
  '33': 'dataAnalysisReport',
  '34': 'dataAnalysisLogManager',
  '35': 'toDataURL',
  '36': 'toTempFilePath',
  '37': 'setPreferredFramesPerSecond',
  '38': 'loadFont',
  '39': 'createImage',
  '40': 'renderCanvas',
  '41': 'cursor',
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
  '53': 'getLocation',
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
  '111': 'midasPay',
  '112': 'overseasPay',
  '113': 'merchantTransfer',
  '114': 'storeGift',
  '115': 'getGameRecorder',
  '116': 'getGameServerManager',
  '117': 'gameServerManagerBasic',
  '118': 'createBannerAd',
  '119': 'createRewardedVideoAd',
  '120': 'createInterstitialAd',
  '122': 'createCustomAd',
  '123': 'createGameBanner',
  '124': 'createGameIcon',
  '125': 'createGamePortal',
  '126': 'utilEncode',
  '127': 'worker',
  '128': 'wxWebAssembly',
  '129': 'groupTask',
  '130': 'visionkit-basic',
  '131': 'visionkit-basic-v2',
  '132': 'plane-ar',
  '133': 'face-detect',
  '134': 'aiInference',
  '135': 'vkSession',
  '136': 'serverCloudFunctions',
  '137': 'perfFilePerf',
};

// 输出 markdown 格式的表格，方便复制到文档
console.log('| sceneId | pathName | 云存储路径 | 注释中嵌入写法 |');
console.log('|---------|----------|-----------|---------------|');
Object.entries(SCENE_MAP).forEach(([id, name]) => {
  const cloudPath = `demo-qrcodes/${name}.png`;
  const imgTag = `<img src="https://{YOUR_ENV}.tcb.qcloud.la/${cloudPath}" width="200" />`;
  console.log(`| ${id} | ${name} | ${cloudPath} | \`${imgTag}\` |`);
});

console.log('\n总计:', Object.keys(SCENE_MAP).length, '个示例');
console.log('\n提示: 请将 {YOUR_ENV} 替换为你的云开发环境 ID (当前项目是: example-69d3b)');
