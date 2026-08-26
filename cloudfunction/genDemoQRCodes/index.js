/**
 * 批量生成 demo 示例的小程序码并上传到云存储。
 *
 * 调用方式（小程序端或开发者工具控制台）：
 *   wx.cloud.callFunction({ name: 'genDemoQRCodes' })
 *
 * 返回每个示例对应的 fileID（云存储地址），可直接用于文档。
 *
 * 也可传 event.sceneIds = ['1','2','3'] 仅生成部分。
 */
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// scene → pathName 映射（和客户端 sceneMap.ts 保持一致）
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

// 为避免触发频率限制，加延时
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.main = async (event) => {
  const sceneIds = event.sceneIds || Object.keys(SCENE_MAP);
  const results = {};
  const errors = [];

  for (const sceneId of sceneIds) {
    const pathName = SCENE_MAP[sceneId];
    if (!pathName) {
      errors.push({ sceneId, error: 'unknown sceneId' });
      continue;
    }

    try {
      // 生成小程序码
      const result = await cloud.openapi.wxacode.getUnlimited({
        scene: sceneId,
        checkPath: false,
        envVersion: event.envVersion || 'release',
        width: event.width || 280,
      });

      if (result.errCode !== 0 && result.errCode !== undefined) {
        errors.push({ sceneId, pathName, error: result.errMsg });
        continue;
      }

      // 上传到云存储
      const cloudPath = `demo-qrcodes/${pathName}.png`;
      const uploadResult = await cloud.uploadFile({
        cloudPath,
        fileContent: result.buffer,
      });

      results[pathName] = {
        sceneId,
        fileID: uploadResult.fileID,
        cloudPath,
      };

      console.log(`✓ ${sceneId} → ${pathName} → ${uploadResult.fileID}`);
    } catch (err) {
      errors.push({ sceneId, pathName, error: err.message || err.errMsg });
      console.error(`✗ ${sceneId} → ${pathName}:`, err);
    }

    // 间隔 200ms 避免频率限制
    await sleep(200);
  }

  return { results, errors, total: sceneIds.length, success: Object.keys(results).length };
};
