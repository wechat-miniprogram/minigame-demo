/**
 * 环境变量
 * wx.env：小游戏运行环境的常量集合
 *   - USER_DATA_PATH：本地用户文件目录路径（仅小程序/小游戏可用）
 *
 * 调用结果示例：
 *   USER_DATA_PATH: wxfile://usr
 *   CLIENT_DATA_PATH: null
 *   isSupportEmcriptenGLX: false
 *   isSupportMetal: false
 *   isAndroidHighPerformance: false
 *   isSupportStandardWorker: false
 *   HAS_SPLASHSCREEN: false
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取环境变量信息（如 USER_DATA_PATH），结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'env';
export function getEnv() {
  const env = wx.env;
  setInfo(formatJSON(env));
}
