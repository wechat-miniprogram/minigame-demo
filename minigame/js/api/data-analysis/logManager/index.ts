/**
 * 日志上报
 * wx.getGameLogManager / wx.getMiniReportManager
 * GameLogManager.log / tag / getCommonInfo / updateCommonInfo
 * MiniReportManager.report
 *
 * GameLogManager API 说明：
 *   log(Object)       — 上报日志（支持设置 level / tag / content）
 *   tag(String)       — 设置标签 key，返回 { info, warn, error, debug } 四个上报方法
 *   getCommonInfo()   — 读取当前 logger 全局 commonInfo 对象
 *   updateCommonInfo(Object) — 合并更新全局 commonInfo
 *
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/data-analysis/wx.getGameLogManager.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatJSON } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮写入普通日志/实时日志，日志写入状态将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'logManager';

/** 延迟初始化 logManager */
function getLogManager(): any {
  if (!logManager) {
    logManager = (wx as any).getGameLogManager();
  }
  return logManager;
}

let logManager: any = null;
let reportManager: any = null;

/** 通过 log(Object) 方法写入小游戏日志 */
export function writeGameLog() {
  const mgr = getLogManager();
  mgr.log({
    level: 'info',
    content: 'demo log: ts=' + Date.now(),
  });
  setInfo('已通过 log({level, content}) 上报');
}

/** tag 方法 — tag(key) 返回 {info, warn, error, debug}，用返回的方法上报 */
export function useTag() {
  const mgr = getLogManager();
  const t = mgr.tag?.('demo_tag');
  if (!t) {
    setInfo('tag 方法不可用');
    return;
  }
  t.info?.('通过 tag.info 上报的日志');
  t.warn?.('通过 tag.warn 上报的日志');
  t.error?.('通过 tag.error 上报的日志');
  t.debug?.('通过 tag.debug 上报的日志');
  setInfo('已通过 tag(demo_tag) 调用 info/warn/error/debug 各一条');
}

/** 读取当前 logger 的全局 commonInfo 对象 */
export function getCommonInfo() {
  const mgr = getLogManager();
  const info = mgr.getCommonInfo?.();
  setInfo(formatJSON(info || {}));
}

/** 将对象与全局 commonInfo 合并（仅第一层属性） */
export function updateCommonInfo() {
  const mgr = getLogManager();
  mgr.updateCommonInfo?.({ demo_key: 'demo_value_' + Date.now() });
  setInfo('已合并更新 commonInfo');
}

/** 实时上报指标（MiniReportManager） */
export function reportMiniMetric() {
  if (!reportManager) {
    reportManager = (wx as any).getMiniReportManager();
  }
  try {
    reportManager.report?.('demo_event', { ts: Date.now() });
    setInfo('MiniReportManager.report 已上报');
  } catch (e: any) {
    setInfo(`上报失败: ${e.message || e}`);
  }
}
