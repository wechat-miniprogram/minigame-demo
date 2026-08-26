/**
 * sub-chattool 分包入口
 *
 * 从主 demo 的路由跳转过来时调用此模块，
 * 接管整个 PIXI stage，渲染群任务的完整业务流程。
 * 点击返回时清理并还原主 demo 的页面。
 *
 * 注意：分包不能跨包 require 主包模块，组件库通过 launch 的 deps 参数注入。
 */

declare function require(path: string): any;

// sub-minigame 内部的简单路由栈
let pageStack: Array<{ name: string; container: any; onUnload?: () => void }> = [];
let _PIXI: any;
let _app: any;
let _returnToMain: () => void;

/** 主包注入的依赖（组件库） */
export let deps: {
  p_button: any;
  p_text: any;
  p_box: any;
  p_scroll: any;
  p_line: any;
  p_img: any;
  p_textarea: any;
} = {} as any;

/**
 * 启动 chattool 子项目
 * @param PIXI - PIXI 实例
 * @param app - PIXI.Application 实例
 * @param params - 路由参数（包含 width/height 等）
 * @param onReturn - 返回主 demo 时的回调
 * @param injectedDeps - 主包注入的组件库依赖
 */
export function launch(PIXI: any, app: any, params: any, onReturn: () => void, injectedDeps: any) {
  _PIXI = PIXI;
  _app = app;
  _returnToMain = onReturn;
  deps = injectedDeps;

  // 如果是从分享链接进入（带 activityId），直接跳到详情页
  if (params.activityId) {
    navigateTo('groupTaskDetail', params);
  } else {
    // 正常入口：群任务列表页
    navigateTo('groupTask', params);
  }
}

/** 内部导航：进入子页面 */
export function navigateTo(pageName: string, query: any = {}) {
  // 隐藏当前子页面
  const current = pageStack[pageStack.length - 1];
  if (current) {
    current.container.visible = false;
  }

  let pageModule: any;
  switch (pageName) {
    case 'groupTask':
      pageModule = require('./views/groupTask');
      break;
    case 'createGroupTask':
      pageModule = require('./views/createGroupTask');
      break;
    case 'groupTaskDetail':
      pageModule = require('./views/groupTaskDetail');
      break;
    default:
      console.error(`[chattool] 未知页面: ${pageName}`);
      return;
  }

  const result = pageModule.default(_PIXI, _app, query);
  const container = result.container || result;
  const onUnload = result.onUnload;

  pageStack.push({ name: pageName, container, onUnload });
}

/** 内部导航：返回上一个子页面，如果已经是最外层则返回主 demo */
export function navigateBack() {
  if (pageStack.length <= 1) {
    cleanup();
    _returnToMain();
    return;
  }

  const current = pageStack.pop()!;
  current.onUnload?.();
  current.container.destroy({ children: true });
  _app.stage.removeChild(current.container);

  const prev = pageStack[pageStack.length - 1];
  if (prev) {
    prev.container.visible = true;
  }
}

/** 清理所有子页面 */
function cleanup() {
  while (pageStack.length > 0) {
    const page = pageStack.pop()!;
    page.onUnload?.();
    page.container.destroy({ children: true });
    _app.stage.removeChild(page.container);
  }
}
