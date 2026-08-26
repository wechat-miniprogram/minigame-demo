/**
 * 调试与日志
 * wx.setEnableDebug / wx.getLogManager / wx.getRealtimeLogManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/debug/wx.setEnableDebug.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮开关调试模式或写入日志，日志输出状态将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'debug';
/** 打开调试模式（正式版生效，调用后会重启小游戏） */
export function enableDebug() {
  wx.setEnableDebug({
    enableDebug: true,
    success() {
      wx.showToast({ title: '已开启调试，重启后右下角出现调试按钮', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `开启失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
  });
}

/** 关闭调试模式 */
export function disableDebug() {
  wx.setEnableDebug({
    enableDebug: false,
    success() {
      wx.showToast({ title: '已关闭调试', icon: 'none', duration: 1000 });
    },
    fail(err: any) {
      wx.showToast({ title: `关闭失败：${err?.errMsg || '未知错误'}`, icon: 'none', duration: 1000 });
    },
  });
}

/** 写入 LogManager 各级别日志 */
export function writeLogManager() {
  const logger: any = wx.getLogManager({ level: 0 });
  if (!logger) { setInfo('获取 LogManager 失败'); return; }
  const time = Date.now();
  const logs: Record<string, any> = {
    log: { time },
    info: 'hello',
    debug: 'hello',
    warn: 'hello',
  };
  logger.log('LogManager log:', { time });
  logger.info('LogManager info:', 'hello');
  logger.debug('LogManager debug:', 'hello');
  logger.warn('LogManager warn:', 'hello');
  setInfo('已写入 4 条 LogManager 日志\n\n' + formatObj(logs));
}

/** 写入 RealtimeLogManager 实时日志 */
export function writeRealtimeLog() {
  const logger: any = wx.getRealtimeLogManager();
  if (!logger) { setInfo('获取 RealtimeLogManager 失败'); return; }
  const logs: Record<string, any> = {
    info: 'realtime info: hello',
    warn: 'realtime warn: hello',
    error: 'realtime error: hello',
    filterMsg: 'demoFilter',
  };
  logger.info('realtime info:', 'hello');
  logger.warn('realtime warn:', 'hello');
  logger.error('realtime error:', 'hello');
  logger.addFilterMsg && logger.addFilterMsg('demoFilter');
  setInfo(
    '已写入 3 条实时日志（可通过 mp 后台查看）\n\n' + formatObj(logs)
  );
}

/** console 各级输出（打开 vConsole 观察） */
export function consoleAllLevels() {
  console.debug('console debug test');
  console.info('console info test');
  console.log('console log test');
  console.warn('console warn test');
  console.error('console error test');
  console.group?.('group test');
  console.log('group log inside');
  console.groupEnd?.();
  setInfo(
    '已输出 5 个级别 + 1 个分组到 console\n\n' +
      formatObj({
        debug: 'console debug test',
        info: 'console info test',
        log: 'console log test',
        warn: 'console warn test',
        error: 'console error test',
        group: 'group test -> group log inside',
      })
  );
}
