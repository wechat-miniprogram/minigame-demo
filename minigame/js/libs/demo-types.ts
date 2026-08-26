/**
 * API 示例页面的类型定义
 *
 * page-renderer 内部使用，业务页面无需直接引用。
 * 业务模块只需 export function，page-renderer 会自动生成按钮。
 *
 * 如果业务需要展示返回数据，请使用 rich-config + display 工厂
 * （参见 libs/rich-configs/display.ts 和 libs/display-slot.ts）。
 */

/** 单个操作按钮的配置 */
export interface ActionConfig {
  /** 按钮文案 */
  label: string;
  /** 点击回调 */
  handler: () => void | Promise<void>;
}

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title: string;
  /** API 名称（标题下方灰色小字） */
  apiName: string;
  /** 操作按钮列表 */
  actions: ActionConfig[];
  /** 页面初始化时执行（可用于创建广告组件、监听事件等） */
  onLoad?: () => void | Promise<void>;
  /** 页面销毁时执行（清理监听、销毁组件等） */
  onUnload?: () => void;
}
