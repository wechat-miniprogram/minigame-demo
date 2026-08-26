// @ts-nocheck
/**
 * 极简事件发射器
 *
 * 替代 PIXI.utils.EventEmitter，让 logic 层彻底不依赖 PIXI。
 * 开发者无需关心实现，用法跟 EventEmitter 完全一样：
 *   ee.on('event', fn)
 *   ee.off('event', fn?)    // fn 省略则清空该事件全部监听
 *   ee.emit('event', ...args)
 */
export default class EventEmitter {
    constructor() {
        this._h = {};
    }

    on(name, fn) {
        (this._h[name] = this._h[name] || []).push(fn);
        return this;
    }

    off(name, fn) {
        if (!this._h[name]) return this;
        if (!fn) { delete this._h[name]; return this; }
        this._h[name] = this._h[name].filter(f => f !== fn);
        return this;
    }

    emit(name, ...args) {
        (this._h[name] || []).slice().forEach(fn => {
            try { fn.apply(null, args); } catch (e) { console.error('[EE] handler error:', e); }
        });
        return this;
    }
}
