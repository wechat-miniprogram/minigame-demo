const signIn = [
  {
    label: '小游戏示例',
    name: 'APIentry',
    tabBar: 'index',
    children: [
      // ========== 基础能力 ==========
      {
        label: '基础',
        name: 'base',
        children: [
          {
            label: '环境变量',
            name: 'baseEnv',
            path: 'base/env/index',
          },
          {
            label: '系统信息',
            name: 'baseSystem',
            path: 'base/system/index',
          },
          {
            label: '更新',
            name: 'baseUpdate',
            path: 'base/update/index',
          },
          {
            label: '生命周期',
            name: 'baseLifeCycle',
            path: 'base/lifeCycle/index',
          },
          {
            label: '应用级事件',
            name: 'baseAppEvent',
            path: 'base/appEvent/index',
          },
          {
            label: '性能',
            name: 'basePerformance',
            path: 'base/performance/index',
          },
          {
            label: '分包加载',
            name: 'baseLoadSubpackage',
            path: 'base/loadSubpackage/index',
          },
          {
            label: '调试',
            name: 'baseDebug',
            path: 'base/debug/index',
          },
          {
            label: '用户加密',
            name: 'baseCrypto',
            path: 'base/crypto/index',
          },
        ],
      },
      {
        label: '跳转',
        name: 'navigate',
        children: [
          {
            label: '重启小程序',
            name: 'restartMiniProgram',
            path: 'navigate/restartMiniProgram/index',
          },
          {
            label: '跳转其他小程序',
            name: 'navigateToMiniProgram',
            path: 'navigate/navigateToMiniProgram/index',
          },
          {
            label: '返回上一个小程序',
            name: 'navigateBackMiniProgram',
            path: 'navigate/navigateBackMiniProgram/index',
          },
          {
            label: '退出小程序',
            name: 'exitMiniProgram',
            path: 'navigate/exitMiniProgram/index',
          },
        ],
      },
      {
        label: '转发',
        name: 'share',
        children: [
          {
            label: '转发',
            name: 'onShareAppMessage',
            path: 'share/onShareAppMessage/index',
          },
          {
            label: '主动分享',
            name: 'shareAppMessage',
            path: 'share/shareAppMessage/index',
          },
          {
            label: '转发菜单控制',
            name: 'shareMenu',
            path: 'share/shareMenu/index',
          },
          {
            label: '分享到好友',
            name: 'shareMessageToFriend',
            path: 'share/shareMessageToFriend/index',
          },
          {
            label: '图片分享菜单',
            name: 'showShareImageMenu',
            path: 'share/showShareImageMenu/index',
          },
          {
            label: '进群信息',
            name: 'getShareInfo',
            path: 'share/getShareInfo/index',
          },
          {
            label: '复制链接',
            name: 'copyUrl',
            path: 'share/copyUrl/index',
          },
          {
            label: '收藏',
            name: 'addToFavorites',
            path: 'share/addToFavorites/index',
          },
        ],
      },
      {
        label: '界面',
        name: 'ui',
        children: [
          {
            label: '交互',
            name: 'uiInteraction',
            path: 'ui/interaction/index',
          },
          {
            label: '菜单',
            name: 'uiMenu',
            path: 'ui/menu/index',
          },
          {
            label: '状态栏',
            name: 'uiStatusBar',
            path: 'ui/statusBar/index',
          },
          {
            label: '窗口',
            name: 'uiWindow',
            path: 'ui/window/index',
          },
        ],
      },

      // ========== 数据通信 ==========
      {
        label: '网络',
        name: 'network',
        children: [
          {
            label: '发送请求',
            name: 'request',
            path: 'network/request/index',
          },
          {
            label: '下载文件',
            name: 'downloadFile',
            path: 'network/downloadFile/index',
          },
          {
            label: '上传文件',
            name: 'uploadFile',
            path: 'network/uploadFile/index',
          },
          {
            label: 'WebSocket',
            name: 'WebSocket',
            path: 'network/webSocket/index',
          },
        ],
      },
      {
        label: '数据缓存',
        name: 'storage',
        children: [
          {
            label: '数据缓存',
            name: 'storageOp',
            path: 'storage/storage/index',
          },
          {
            label: '后台预拉取',
            name: 'backgroundFetch',
            path: 'storage/backgroundFetch/index',
          },
          {
            label: 'BufferURL',
            name: 'bufferUrl',
            path: 'storage/bufferUrl/index',
          },
        ],
      },
      {
        label: '数据分析',
        name: 'data-analysis',
        children: [
          {
            label: '事件 / 场景上报',
            name: 'dataAnalysisReport',
            path: 'data-analysis/report/index',
          },
          {
            label: '日志管理',
            name: 'dataAnalysisLogManager',
            path: 'data-analysis/logManager/index',
          },
        ],
      },

      // ========== 多媒体 ==========
      {
        label: '渲染',
        name: 'render',
        children: [
          {
            label: '画布',
            name: 'renderCanvas',
            path: 'render/canvas/index',
          },
          {
            label: 'Path2D',
            name: 'createPath2D',
            path: 'render/createPath2D/index',
          },
          {
            label: '渲染帧率',
            name: 'setPreferredFramesPerSecond',
            path: 'render/setPreferredFramesPerSecond/index',
          },
          {
            label: '帧回调',
            name: 'animationFrame',
            path: 'render/animationFrame/index',
          },
          {
            label: '加载自定义字体文件',
            name: 'loadFont',
            path: 'render/loadFont/index',
          },
          {
            label: '获取文本行高',
            name: 'getTextLineHeight',
            path: 'render/getTextLineHeight/index',
          },
          {
            label: '创建图片对象',
            name: 'createImage',
            path: 'render/createImage/index',
          },
          {
            label: '创建 ImageData',
            name: 'createImageData',
            path: 'render/createImageData/index',
          },
          {
            label: '光标 / 指针锁定',
            name: 'cursor',
            path: 'render/cursor/index',
          },
        ],
      },
      {
        label: '媒体',
        name: 'media',
        children: [
          {
            label: '视频',
            name: 'video',
            path: 'media/video/index',
          },
          {
            label: '相机',
            name: 'camera',
            path: 'media/camera/index',
          },
          {
            label: 'innerAudio',
            name: 'innerAudio',
            path: 'media/innerAudio/index',
          },
          {
            label: 'Web Audio',
            name: 'webAudio',
            path: 'media/webAudio/index',
          },
          {
            label: '媒体音频播放器',
            name: 'mediaAudioPlayer',
            path: 'media/mediaAudioPlayer/index',
          },
          {
            label: '录音管理器',
            name: 'recorder',
            path: 'media/recorder/index',
          },
          {
            label: '实时语音',
            name: 'voipChat',
            path: 'media/voipChat/index',
          },
          {
            label: '视频解码器',
            name: 'videoDecoder',
            path: 'media/videoDecoder/index',
          },
          {
            label: '图片选择 / 预览',
            name: 'mediaImage',
            path: 'media/image/index',
          },
        ],
      },

      // ========== 系统能力 ==========
      {
        label: '位置',
        name: 'location',
        children: [
          {
            label: '获取当前位置',
            name: 'getLocation',
            path: 'location/getLocation/index',
          },
        ],
      },
      {
        label: '设备',
        name: 'device',
        children: [
          {
            label: '振动',
            name: 'vibrate',
            path: 'device/vibrate/index',
          },
          {
            label: '剪贴板',
            name: 'clipboardData',
            path: 'device/clipboardData/index',
          },
          {
            label: '获取手机网络状态',
            name: 'getNetworkType',
            path: 'device/getNetworkType/index',
          },
          {
            label: '监听手机网络变化',
            name: 'onNetworkStatusChange',
            path: 'device/onNetworkStatusChange/index',
          },
          {
            label: '获取设备电量状态',
            name: 'getBatteryInfo',
            path: 'device/getBatteryInfo/index',
          },
          {
            label: '屏幕亮度',
            name: 'screenBrightness',
            path: 'device/screenBrightness/index',
          },
          {
            label: '设置保持常亮状态',
            name: 'setKeepScreenOn',
            path: 'device/setKeepScreenOn/index',
          },
          {
            label: '监听罗盘数据',
            name: 'compassChange',
            path: 'device/compassChange/index',
          },
          {
            label: '重力感应',
            name: 'accelerometerChange',
            path: 'device/accelerometerChange/index',
          },
          {
            label: '监听设备方向',
            name: 'deviceMotionChange',
            path: 'device/deviceMotionChange/index',
          },
          {
            label: '监听陀螺仪数据',
            name: 'gyroscopeChange',
            path: 'device/gyroscopeChange/index',
          },
          {
            label: '横竖屏切换',
            name: 'deviceOrientationChange',
            path: 'device/deviceOrientationChange/index',
          },
          {
            label: '蓝牙',
            name: 'bluetooth',
            path: 'device/bluetooth/index',
          },
          {
            label: '内存预警',
            name: 'memoryWarning',
            path: 'device/memoryWarning/index',
          },
          {
            label: '鼠标事件',
            name: 'mouse',
            path: 'device/mouse/index',
          },
          {
            label: '扫码',
            name: 'scanCode',
            path: 'device/scanCode/index',
          },
          {
            label: '手柄',
            name: 'gamePad',
            path: 'device/gamePad/index',
          },
          {
            label: '键盘',
            name: 'keyboard',
            path: 'device/keyboard/index',
          },
          {
            label: '触摸事件',
            name: 'touch',
            path: 'device/touch/index',
          },
          {
            label: '滚轮事件',
            name: 'wheel',
            path: 'device/wheel/index',
          },
        ],
      },
      {
        label: '文件',
        name: 'file',
        children: [
          {
            label: '创建/删除目录',
            name: 'dir',
            path: 'file/dir/index',
          },
          {
            label: '判断文件/目录是否存在',
            name: 'access',
            path: 'file/access/index',
          },
          {
            label: '重命名',
            name: 'rename',
            path: 'file/rename/index',
          },
          {
            label: '保存临时文件到本地',
            name: 'saveFile',
            path: 'file/saveFile/index',
          },
          {
            label: '查看目录内容',
            name: 'readdir',
            path: 'file/readdir/index',
          },
          {
            label: '获取文件信息',
            name: 'getFileInfo',
            path: 'file/getFileInfo/index',
          },
          {
            label: '判断文件路径是否是目录',
            name: 'stat',
            path: 'file/stat/index',
          },
          {
            label: '解压文件',
            name: 'unzip',
            path: 'file/unzip/index',
          },
          {
            label: '本地缓存文件',
            name: 'savedFile',
            path: 'file/savedFile/index',
          },
          {
            label: '文件系统综合',
            name: 'fileSystemManager',
            path: 'file/fileSystemManager/index',
          },
          {
            label: '保存到本机（PC）',
            name: 'saveFileToDisk',
            path: 'file/saveFileToDisk/index',
          },
        ],
      },
      {
        label: '第三方平台',
        name: 'extConfig',
        children: [
          {
            label: '获取配置',
            name: 'getExtConfig',
            path: 'extConfig/getExtConfig/index',
          },
        ],
      },

      // ========== 开放能力 ==========
      {
        label: '开放接口',
        name: 'open-api',
        children: [
          {
            label: '用户信息',
            name: 'getUserInfo',
            path: 'open-api/getUserInfo/index',
          },
          {
            label: '登录',
            name: 'login',
            path: 'open-api/login/index',
          },
          {
            label: '授权',
            name: 'authorize',
            path: 'open-api/authorize/index',
          },
          {
            label: '开放数据',
            name: 'openData',
            path: 'open-api/openData/index',
          },
          {
            label: '开放数据域',
            name: 'openDataContext',
            path: 'open-api/openDataContext/index',
          },
          {
            label: '意见反馈',
            name: 'customerMessage',
            path: 'open-api/customerMessage/index',
          },
          {
            label: '设置',
            name: 'setting',
            path: 'open-api/setting/index',
          },
          {
            label: '游戏圈',
            name: 'createGameClubButton',
            path: 'open-api/createGameClubButton/index',
          },
          {
            label: '客服消息',
            name: 'customerService',
            path: 'open-api/customerService/index',
          },
          {
            label: '微信运动',
            name: 'weRun',
            path: 'open-api/weRun/index',
          },
          {
            label: 'OPENLINK',
            name: 'openLink',
            path: 'open-api/openLink/index',
          },
          {
            label: '我的小程序',
            name: 'myMiniProgram',
            path: 'open-api/myMiniProgram/index',
          },
          {
            label: '人脸检测',
            name: 'facial',
            path: 'open-api/facial/index',
          },
          {
            label: '账号信息',
            name: 'accountInfo',
            path: 'open-api/accountInfo/index',
          },
          {
            label: '微信群',
            name: 'groupInfo',
            path: 'open-api/group/index',
          },
          {
            label: '隐私信息授权',
            name: 'privacy',
            path: 'open-api/privacy/index',
          },
          {
            label: '订阅消息',
            name: 'requestSubscribeMessage',
            path: 'open-api/requestSubscribeMessage/index',
          },
        ],
      },
      {
        label: '虚拟支付',
        name: 'pay',
        children: [
          {
            label: '米大师支付',
            name: 'midasPay',
            path: 'pay/midas/index',
          },
        ],
      },

      // ========== 游戏能力 ==========
      {
        label: '游戏对局回放',
        name: 'game-recorder',
        children: [
          {
            label: '游戏对局回放',
            name: 'getGameRecorder',
            path: 'game-recorder/getGameRecorder/index',
          },
        ],
      },
      {
        label: '游戏服务',
        name: 'game-server',
        children: [
          {
            label: '好友对战（帧同步）',
            name: 'getGameServerManager',
            // 走 sub-lockstep 分包（见 subMinigamePages 登记）
            // 源码参考：github.com/wechat-miniprogram/minigame-lockstep-demo
            path: 'game-server/getGameServerManager/index',
          },
        ],
      },

      // ========== 广告与推荐 ==========
      {
        label: '广告',
        name: 'ad',
        children: [
          {
            label: 'banner 广告',
            name: 'createBannerAd',
            path: 'ad/createBannerAd/index',
          },
          {
            label: '激励视频广告',
            name: 'createRewardedVideoAd',
            path: 'ad/createRewardedVideoAd/index',
          },
          {
            label: '插屏广告',
            name: 'createInterstitialAd',
            path: 'ad/createInterstitialAd/index',
          },
          {
            label: '自定义广告',
            name: 'createCustomAd',
            path: 'ad/createCustomAd/index',
          },

        ],
      },
      // ========== 工具与高级 ==========
      {
        label: '工具',
        name: 'util',
        children: [
          {
            label: '字符编解码',
            name: 'utilEncode',
            path: 'util/encode/index',
          },
        ],
      },
      {
        label: 'Worker',
        name: 'worker',
        path: 'worker/index',
      },
      {
        label: '聊天工具',
        name: 'chat-tool',
        children: [
          {
            label: '群活动',
            name: 'groupTask',
            path: 'chat-tool/groupTask/index',
          },
        ],
      },
      {
        label: 'AI',
        name: 'ai',
        children: [
          {
            label: 'VisionKit基础',
            name: 'visionkit-basic',
            path: 'ai/visionkit-basic/index',
          },
          {
            label: 'VisionKit基础-v2',
            name: 'visionkit-basic-v2',
            path: 'ai/visionkit-basic-v2/index',
          },
          {
            label: '水平面AR',
            name: 'plane-ar',
            path: 'ai/plane-ar/index',
          },
          {
            label: '人脸识别',
            name: 'face-detect',
            path: 'ai/face-detect/index',
          },
        ],
      },

      // ========== 服务端 & 性能 ==========
    ],
  },
];

const renderPage = require('../libs/page-renderer');
const richRenderer = require('../libs/rich-renderer');
const apiEntry = require('../libs/apiEntry');

// 走 rich-renderer 的页面：key 是路由 name，value 是对应的 rich-config 路径
const richPages: Record<string, string> = {
  worker: '../libs/rich-configs/worker',
  setPreferredFramesPerSecond:
    '../libs/rich-configs/setPreferredFramesPerSecond',
  createImage: '../libs/rich-configs/render-createImage',
  loadFont: '../libs/rich-configs/render-loadFont',
  accelerometerChange: '../libs/rich-configs/accelerometerChange',
  compassChange: '../libs/rich-configs/compassChange',
  gyroscopeChange: '../libs/rich-configs/gyroscopeChange',
  deviceMotionChange: '../libs/rich-configs/deviceMotionChange',
  screenBrightness: '../libs/rich-configs/screenBrightness',
  camera: '../libs/rich-configs/camera',
  videoDecoder: '../libs/rich-configs/videoDecoder',
  mediaAudioPlayer: '../libs/rich-configs/mediaAudioPlayer',
  getGameRecorder: '../libs/rich-configs/getGameRecorder',
  request: '../libs/rich-configs/network-request',
  downloadFile: '../libs/rich-configs/network-downloadFile',
  uploadFile: '../libs/rich-configs/network-uploadFile',
  WebSocket: '../libs/rich-configs/network-webSocket',
  voipChat: '../libs/rich-configs/voipChat',
  // file
  access: '../libs/rich-configs/file-access',
  dir: '../libs/rich-configs/file-dir',
  getFileInfo: '../libs/rich-configs/file-getFileInfo',
  readdir: '../libs/rich-configs/file-readdir',
  rename: '../libs/rich-configs/file-rename',
  saveFile: '../libs/rich-configs/file-saveFile',
  savedFile: '../libs/rich-configs/file-savedFile',
  stat: '../libs/rich-configs/file-stat',
  unzip: '../libs/rich-configs/file-unzip',
};

// 走通用 display 工厂的页面：key 是路由 name，value 是业务模块路径
// 业务模块需 export setDisplay（通过 createDisplay() 生成）
const displayPages: Record<string, string> = {
  // base/
  baseSystem: 'base/system/index',
  baseEnv: 'base/env/index',
  baseUpdate: 'base/update/index',
  baseLifeCycle: 'base/lifeCycle/index',
  baseAppEvent: 'base/appEvent/index',
  basePerformance: 'base/performance/index',
  baseLoadSubpackage: 'base/loadSubpackage/index',
  baseDebug: 'base/debug/index',
  baseCrypto: 'base/crypto/index',
  // navigate/
  restartMiniProgram: 'navigate/restartMiniProgram/index',
  navigateToMiniProgram: 'navigate/navigateToMiniProgram/index',
  navigateBackMiniProgram: 'navigate/navigateBackMiniProgram/index',
  exitMiniProgram: 'navigate/exitMiniProgram/index',
  // util / data-analysis / pay
  utilEncode: 'util/encode/index',
  dataAnalysisReport: 'data-analysis/report/index',
  dataAnalysisLogManager: 'data-analysis/logManager/index',
  midasPay: 'pay/midas/index',
  // game-server / ai / ad
  // AR 模块（visionkit-basic/v2, plane-ar, face-detect）走 arPages 专用渲染
  createCustomAd: 'ad/createCustomAd/index',
  // device 新增
  bluetooth: 'device/bluetooth/index',
  memoryWarning: 'device/memoryWarning/index',
  mouse: 'device/mouse/index',
  scanCode: 'device/scanCode/index',
  gamePad: 'device/gamePad/index',
  keyboard: 'device/keyboard/index',
  touch: 'device/touch/index',
  wheel: 'device/wheel/index',
  // file 新增
  fileSystemManager: 'file/fileSystemManager/index',
  saveFileToDisk: 'file/saveFileToDisk/index',
  // media 新增
  innerAudio: 'media/innerAudio/index',
  webAudio: 'media/webAudio/index',
  recorder: 'media/recorder/index',
  mediaImage: 'media/image/index',
  // open-api 新增
  accountInfo: 'open-api/accountInfo/index',
  facial: 'open-api/facial/index',
  myMiniProgram: 'open-api/myMiniProgram/index',
  openLink: 'open-api/openLink/index',
  authorize: 'open-api/authorize/index',
  customerMessage: 'open-api/customerMessage/index',
  groupInfo: 'open-api/group/index',
  privacy: 'open-api/privacy/index',
  weRun: 'open-api/weRun/index',
  openData: 'open-api/openData/index',
  // render 新增
  renderCanvas: 'render/canvas/index',
  cursor: 'render/cursor/index',
  createPath2D: 'render/createPath2D/index',
  animationFrame: 'render/animationFrame/index',
  getTextLineHeight: 'render/getTextLineHeight/index',
  createImageData: 'render/createImageData/index',
  // share 新增
  shareMenu: 'share/shareMenu/index',
  showShareImageMenu: 'share/showShareImageMenu/index',
  getShareInfo: 'share/getShareInfo/index',
  copyUrl: 'share/copyUrl/index',
  addToFavorites: 'share/addToFavorites/index',
  shareMessageToFriend: 'share/shareMessageToFriend/index',
  handoff: 'share/handoff/index',
  // storage 新增
  backgroundFetch: 'storage/backgroundFetch/index',
  bufferUrl: 'storage/bufferUrl/index',
  // ui 新增
  uiInteraction: 'ui/interaction/index',
  uiMenu: 'ui/menu/index',
  uiStatusBar: 'ui/statusBar/index',
  uiWindow: 'ui/window/index',
  // 已有
  getBatteryInfo: 'device/getBatteryInfo/index',
  getNetworkType: 'device/getNetworkType/index',
  clipboardData: 'device/clipboardData/index',
  onNetworkStatusChange: 'device/onNetworkStatusChange/index',
  deviceOrientationChange: 'device/deviceOrientationChange/index',
  vibrate: 'device/vibrate/index',
  setKeepScreenOn: 'device/setKeepScreenOn/index',
  getLocation: 'location/getLocation/index',
  login: 'open-api/login/index',
  getUserInfo: 'open-api/getUserInfo/index',
  setting: 'open-api/setting/index',
  requestSubscribeMessage: 'open-api/requestSubscribeMessage/index',
  createGameClubButton: 'open-api/createGameClubButton/index',
  storageOp: 'storage/storage/index',
  // ui
  getGameRecorder: 'game-recorder/getGameRecorder/index',
  getExtConfig: 'extConfig/getExtConfig/index',
  createBannerAd: 'ad/createBannerAd/index',
  createInterstitialAd: 'ad/createInterstitialAd/index',
  createRewardedVideoAd: 'ad/createRewardedVideoAd/index',
  customerService: 'open-api/customerService/index',
};

// AR 可视化页面：走 aiAr rich-config（Three.js + YUV + VKSession 全链路渲染）
const arPages: Record<string, string> = {
  'visionkit-basic': 'ai/visionkit-basic/index',
  'visionkit-basic-v2': 'ai/visionkit-basic-v2/index',
  'plane-ar': 'ai/plane-ar/index',
  'face-detect': 'ai/face-detect/index',
};

// 走 sub-minigame 分包的页面：key 是路由 name，value 是分包名
const subMinigamePages: Record<string, string> = {
  groupTask: 'chattool',
  getGameServerManager: 'lockstep',
};

// 分包入口元数据：分包名 → { modulePath, backFn }
// - modulePath：loadSubpackage 成功后 require 的入口文件
// - backFn：供 delPage 路径调用的反向清理方法名（主动销毁整个分包时用）
const subMinigameEntries: Record<
  string,
  { modulePath: string; backFn: string }
> = {
  chattool: { modulePath: '../../sub-chattool/index', backFn: 'navigateBack' },
  lockstep: { modulePath: '../../sub-lockstep/index', backFn: 'exitToMain' },
};

// 组件库引用（传给分包使用）
const components = require('../libs/component/index');

function loadPage(
  name: string,
  path: string,
  PIXI: any,
  app: any,
  params: any,
  label?: string,
  treePage?: any
) {
  // 路径 C：sub-minigame 分包（异步加载，接管 stage，拥有独立路由）
  if (subMinigamePages[name]) {
    const subpackageName = subMinigamePages[name];
    const entry = subMinigameEntries[subpackageName];

    // 创建占位 container 给主路由管理
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // 显示加载提示
    wx.showLoading({ title: '加载中', mask: true });

    // 异步加载分包
    wx.loadSubpackage({
      name: subpackageName,
      success() {
        wx.hideLoading();
        const mod = require(entry.modulePath);
        mod.launch(
          PIXI,
          app,
          params,
          () => {
            // 分包返回主 demo 时：弹出 treeView，恢复上一页
            const routerObj = window.router as any;
            if (routerObj.treeView.length >= 2) {
              const pageName = routerObj.treeView.pop();
              if (treePage[pageName]?.page) {
                treePage[pageName].page.visible = false;
                app.stage.removeChild(treePage[pageName].page);
                treePage[pageName].page.destroy(true);
              }
              treePage[pageName].page = null;
              treePage[pageName].init = false;
              const prevName = routerObj.getNowPageName();
              if (treePage[prevName]?.page) {
                treePage[prevName].page.visible = true;
              }
            }
          },
          components
        ); // 注入组件库（chattool 用，lockstep 忽略）
      },
      fail(err: any) {
        wx.hideLoading();
        console.error('分包加载失败:', err);
        wx.showModal({ content: '分包加载失败', showCancel: false });
      },
      complete() {
        /* 类型补齐，运行时无副作用 */
      },
    });

    // 存 onUnload（主动 delPage 时触发）
    if (treePage) {
      treePage[name]._onUnload = () => {
        try {
          const mod = require(entry.modulePath);
          mod[entry.backFn] && mod[entry.backFn]();
        } catch (e) {
          /* 分包可能还没加载 */
        }
      };
    }
    return container;
  }

  if (richPages[name]) {
    const { config } = require(richPages[name]);
    // onUnload 统一由 delPage 里的 _onUnload 调用（rich-renderer 的 goBack.callBack
    // 已改为 no-op，避免异步资源销毁被调用两次导致返回卡住）
    if (treePage && config.onUnload) {
      treePage[name]._onUnload = () => config.onUnload(null);
    }
    return richRenderer(PIXI, app, params, config);
  }

  // 开放数据域专用渲染（集成 sharedCanvas 显示）
  if (name === 'openDataContext') {
    const mod = require(path);
    const { createOpenDataContextConfig } = require('../libs/rich-configs/openDataContext');
    const config = createOpenDataContextConfig(mod, label);
    if (treePage && config.onUnload) {
      treePage[name]._onUnload = () => config.onUnload(null);
    }
    return richRenderer(PIXI, app, params, config);
  }

  // AR 可视化渲染（Three.js + YUV + VKSession 全链路）
  if (arPages[name]) {
    try {
      console.log('[router] 加载 AR 页面:', name, '路径:', arPages[name]);
      const mod = require(arPages[name]);
      console.log('[router] AR 模块加载成功:', !!mod);

      const { createArConfig } = require('../libs/rich-configs/aiAr');
      console.log('[router] aiAr 模块加载成功');

      const config = createArConfig(mod, label);
      console.log('[router] createArConfig 成功');

      if (treePage && config.onUnload) {
        treePage[name]._onUnload = () => config.onUnload(null);
      }
      return richRenderer(PIXI, app, params, config);
    } catch (e: any) {
      console.error('[router] AR 页面加载失败:', e?.stack || e);
      // 不再向上抛，改为返回错误提示页面
      const { p_text } = require('../libs/component/index');
      const errContainer = new PIXI.Container();
      const errBg = new PIXI.Graphics();
      errBg.beginFill(0xffffff).drawRect(0, 0, params.width, params.height).endFill();
      errContainer.addChild(errBg);
      const errMsg = p_text(PIXI, {
        content: 'AR 模块加载失败\n\n' + (e?.message || e?.errMsg || String(e)) + '\n\n请在 vConsole 中查看详细日志',
        fontSize: 28 * PIXI.ratio,
        fill: 0xff0000,
        x: 40 * PIXI.ratio,
        y: 200 * PIXI.ratio,
      });
      errContainer.addChild(errMsg);
      return errContainer;
    }
  }

  // 走通用 display 工厂：业务模块用 setDisplay 接收展示 api，rich-config 自动生成
  if (displayPages[name]) {
    const mod = require(displayPages[name]);
    const { createDisplayConfig } = require('../libs/rich-configs/display');
    const config = createDisplayConfig(mod, label);
    if (treePage && config.onUnload) {
      treePage[name]._onUnload = () => config.onUnload(null);
    }
    return richRenderer(PIXI, app, params, config);
  }
  const mod = require(path);
  // 把模块的 onUnload 存到 treePage，供 delPage 路径调用
  if (treePage && typeof mod.onUnload === 'function') {
    treePage[name]._onUnload = () => mod.onUnload();
  }
  return renderPage(PIXI, app, params, mod, label);
}

function router(PIXI, app, parameter) {
  const treePage = {};
  function regroup(circularArr) {
    circularArr = circularArr.slice(0);
    while (circularArr.length) {
      const page = circularArr.shift();
      parameter = { ...parameter, name: page.name, isTabBar: !!page.tabBar };
      page.path &&
        (treePage[page.name] = {
          label: page.label,
          path: page.path,
          parameter,
        });
      (page.children || []).length &&
        circularArr.unshift(...page.children.slice(0));
    }
  }
  regroup(signIn);

  // 首页单独初始化（不走 page-renderer）
  const entryName = signIn[0].name;
  const entryParam = { ...parameter, name: entryName, isTabBar: true };
  treePage[entryName] = { label: signIn[0].label, parameter: entryParam };
  treePage[entryName].page = apiEntry(
    PIXI,
    app,
    entryParam,
    signIn[0].children
  );
  treePage[entryName].init = true;

  window.router = new (function () {
    this.treeView = ['APIentry'];
    this.navigateTo = function (newPage, query, res) {
      const lastOne = this.treeView.length - 1,
        name = this.treeView[lastOne];
      if (name === newPage) return;

      // 防崩：页面不在路由树中时给出明确提示
      if (!treePage[newPage]) {
        console.error('!!! navigateTo 未知页面:', newPage, '可用页面:', Object.keys(treePage));
        wx.showModal({ content: `找不到页面: ${newPage}`, showCancel: false });
        return;
      }

      if (typeof treePage[newPage].path === 'function')
        return treePage[newPage].path();

      this.treeView.push(newPage);
      treePage[newPage].reload && treePage[newPage].reload();

      try {
        if (!treePage[newPage].init) {
          console.warn('!!! newPage', newPage, treePage[newPage].path);
          treePage[newPage].page = loadPage(
            newPage,
            treePage[newPage].path,
            PIXI,
            app,
            {
              ...treePage[newPage].parameter,
              ...query,
              ...res,
            },
            treePage[newPage].label,
            treePage
          );
          treePage[newPage].init = true;
        }

        treePage[name].page.visible = false;
        treePage[newPage].page.visible = true;
      } catch (e) {
        console.error('!!! 功能错误:', e?.stack || e);
        this.treeView.pop();
        wx.showModal({
          content: '功能加载失败：' + (e?.message || e?.errMsg || String(e)),
          showCancel: false,
          confirmColor: '#02BB00',
        });
      }
    };
    this.navigateBack = function () {
      if (this.treeView.length < 2) return;

      if (!treePage[this.getNowPageName()].reload) {
        this.delPage();
        treePage[this.getNowPageName()].reload?.();
        return;
      }

      treePage[this.treeView.pop()].page.visible = false;
      treePage[this.getNowPageName()].page.visible = true;
    };
    this.delPage = function () {
      if (this.treeView.length < 2) return;
      const name = this.treeView.pop();
      // 先调业务层清理（video/camera/worker/socket 等资源销毁）
      if (treePage[name]._onUnload) {
        try {
          treePage[name]._onUnload();
        } catch (e) {
          console.error('onUnload error:', e);
        }
        treePage[name]._onUnload = null;
      }
      treePage[name].page.visible = false;
      app.stage.removeChild(treePage[name].page).destroy(true);
      treePage[name].page = null;
      treePage[name].init = false;
      treePage[this.getNowPageName()].page.visible = true;
    };
    this.getNowPageName = function () {
      return this.treeView[this.treeView.length - 1];
    };
    this.getNowPageLabel = function () {
      return treePage[this.treeView[this.treeView.length - 1]].label;
    };
    this.getNowPage = function (callBack) {
      callBack(treePage[this.treeView[this.treeView.length - 1]]);
    };
  })();
}
module.exports = router;
