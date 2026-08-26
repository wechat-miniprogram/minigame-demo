/**
 * Worker 多线程
 * wx.createWorker
 */

let worker: any = null;
export let fabonacciIndex = 35;

let _onResult: ((result: number) => void) | null = null;
/** 由 rich-configs 绑定，用于更新页面显示 */
export function setOnResult(fn: ((result: number) => void) | null) {
  _onResult = fn;
}

export function setFabonacciIndex(n: number) {
  fabonacciIndex = n;
}

/** 初始化 Worker */
export function onLoad() {
  try {
    worker = wx.createWorker('workers/index.js');
  } catch (e: any) {
    console.error('createWorker error:', e);
    wx.showModal({
      content: `创建 Worker 失败: ${e?.message || e}`,
      showCancel: false,
    });
  }
}

/** 主线程计算 fibonacci（计算期间主线程阻塞，动画会卡顿） */
export function mainThreadFib() {
  function fib(n: number): number {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
  }
  const result = fib(fabonacciIndex);
  if (_onResult) _onResult(result);
  else
    wx.showModal({
      title: '计算结果',
      content: String(result),
      showCancel: false,
    });
}

/** Worker 线程计算 fibonacci（不阻塞主线程，动画保持流畅） */
let _onWorkerMessage: ((res: any) => void) | null = null;
export function workerFib() {
  if (!worker) return;
  // 移除旧监听，避免重复注册
  if (_onWorkerMessage) {
    worker.offMessage?.(_onWorkerMessage);
  }
  _onWorkerMessage = (res: any) => {
    if (_onResult) _onResult(res?.msg);
    else
      wx.showModal({
        title: '计算结果',
        content: String(res?.msg),
        showCancel: false,
      });
  };
  worker.onMessage(_onWorkerMessage);
  worker.postMessage({ msg: fabonacciIndex });
}

/** 页面销毁时清理 */
export function onUnload() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  _onResult = null;
}
