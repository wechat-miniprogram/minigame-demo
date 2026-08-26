// @ts-nocheck
/**
 * PIXI 引用中转
 *
 * 分包不能自己加载 PIXI（主包已加载过），所以由 index.js 的 launch() 入口把
 * 主包注入的 PIXI 实例保存到这里，其他文件统一从这里 import。
 */

let _PIXI = null;

export function setPIXI(PIXI) {
  _PIXI = PIXI;
}

// 通过 Proxy 做惰性转发，这样 `import PIXI from './pixi-ref'` 后可直接 `PIXI.Sprite`
const handler = {
  get(_t, prop) {
    if (!_PIXI) throw new Error('[lockstep] PIXI not injected yet, launch() must be called first');
    return _PIXI[prop];
  },
};

export default new Proxy({}, handler);
