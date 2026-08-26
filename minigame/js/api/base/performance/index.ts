/**
 * 性能
 * wx.triggerGC / wx.reportPerformance / wx.getPerformance
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/performance/wx.getPerformance.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮触发 GC 或获取性能数据，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'performance';
/** 主动触发 JavaScriptCore 垃圾回收 */
export function triggerGC() {
  wx.triggerGC();
  wx.showToast({ title: ' triggerGC 已调用（GC 时机由引擎控制）', icon: 'none' });
}

/** 上报自定义性能指标 */
export function reportPerformance() {
  const perf: any = wx.getPerformance();
  wx.reportPerformance(10001, perf.now());
  wx.showToast({ title: 'reportPerformance 已调用，entryId=10001', icon: 'none' });
}

/** 获取 Performance 对象并打印 now() */
export function getPerformance() {
  const perf: any = wx.getPerformance();
  const now = perf.now();
  setInfo(
    formatObj({
      'performance.now()': now,
      单位: '微秒（μs）',
    })
  );
}

/** 连续两次 now() 计算时间差，验证计时精度 */
export function measureDelta() {
  const perf: any = wx.getPerformance();
  const t1 = perf.now();
  // 做点小事
  let sum = 0;
  for (let i = 0; i < 100000; i++) sum += i;
  const t2 = perf.now();
  setInfo(
    formatObj({
      起始时刻: t1,
      结束时刻: t2,
      耗时: `${(t2 - t1).toFixed(2)} μs`,
      校验和: sum,
    })
  );
}
