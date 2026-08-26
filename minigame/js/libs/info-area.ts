/**
 * 信息展示区共享工具
 *
 * 提供与 base/lifeCycle/index.ts 一致的 setInfo / onInfoTextReady 模式，
 * 避免每个 API 模块重复编写回调注册逻辑。
 *
 * 用法：
 *   import { createDisplay } from '../../../libs/display-slot';
 *   import { createInfoArea } from '../../../libs/info-area';
 *
 *   const display = createDisplay();
 *   export const setDisplay = display.setter;
 *
 *   const { setInfo, onInfoTextReady, infoArea } = createInfoArea('初始提示文案');
 *   export { onInfoTextReady, infoArea };
 *
 *   // 在业务函数中调用 setInfo('结果文本') 即可更新信息区
 *   // rich-config 渲染时会调用 onInfoTextReady 注入真实的 setText 回调
 */

export interface InfoAreaConfig {
  initialText: string;
}

export interface InfoAreaResult {
  /** 更新信息区文本（rich-config 未挂载时为安全空操作） */
  setInfo: (text: string) => void;
  /** 暴露给 rich-renderer 的回调注册入口 */
  onInfoTextReady: (fn: (text: string) => void) => void;
  /** 信息区配置对象，需 export 给 rich-config 读取 */
  infoArea: InfoAreaConfig;
}

/**
 * 创建信息展示区实例
 * @param initialText 初始显示文本（可选）
 */
export function createInfoArea(initialText: string = ''): InfoAreaResult {
  let setText: ((text: string) => void) | null = null;

  const setInfo = (text: string) => {
    setText?.(text);
  };

  const onInfoTextReady = (fn: (text: string) => void) => {
    setText = fn;
  };

  const infoArea: InfoAreaConfig = { initialText };

  return { setInfo, onInfoTextReady, infoArea };
}
