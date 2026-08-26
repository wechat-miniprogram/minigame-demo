/**
 * 展示槽（Display Slot）
 *
 * 业务层用它来连接 rich-config 的展示区。
 * 典型用法：
 *
 *   import { createDisplay } from '../../../libs/display-slot';
 *   const display = createDisplay();
 *   export const setDisplay = display.setter;
 *
 *   export function getBatteryInfo() {
 *     wx.getBatteryInfo({
 *       success: (res) => display.data({ '电量': res.level + '%' }),
 *     });
 *   }
 *
 * 业务层不关心渲染。rich-config 挂载后，display.* 就会真正绘制到页面上；
 * rich-config 没挂载（比如单元测试）时，调用 display.* 是安全的空操作。
 */

import type { DisplayApi } from './rich-configs/display';

export interface DisplaySlot extends DisplayApi {
  /** 暴露给 rich-config 的 setter，注入真实的 DisplayApi */
  setter: (api: DisplayApi) => void;
}

export function createDisplay(): DisplaySlot {
  let api: DisplayApi | null = null;

  return {
    setter(real: DisplayApi) {
      api = real;
    },
    text(content: string) {
      api?.text(content);
    },
    data(kv: Record<string, any>) {
      api?.data(kv);
    },
    image(src: string) {
      api?.image(src);
    },
    clear() {
      api?.clear();
    },
    showCanvas() {
      api?.showCanvas?.();
    },
    onClose(cb: () => void) {
      api?.onClose?.(cb);
    },
  };
}
