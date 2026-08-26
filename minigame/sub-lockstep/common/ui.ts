// @ts-nocheck
import PIXI from '../pixi-ref';

export function createBtn(options) {
    let { img, text, x, y, onclick, width, height, style } = options;

    let btn = PIXI.Sprite.from(img);
    btn.anchor.set(.5);
    btn.x = x;
    btn.y = y;

    if ( width ) {
        btn.width = width;
    }
    if ( height ) {
        btn.height = height;
    }

    if ( onclick && typeof onclick === 'function' ) {
        btn.interactive = true;
        btn.buttonMode = true;
        // 加 hitArea 兜底（默认是 texture.bounds，纹理还没加载完时是 0）
        btn.on('pointerdown', (ev) => {
            console.log('[lockstep] btn pointerdown:', img, 'global:', ev && ev.data && ev.data.global);
            try { onclick(ev); } catch (e) {
                console.error('[lockstep] btn onclick error:', e && e.stack || e);
            }
        });
    }

    if ( text ){
        let _text = new PIXI.Text(text, style || {fontSize: 32, align: 'center'});
        _text.anchor.set(0.5);
    
        btn.addChild(_text);
    }


    return btn;
}

export function createText(options) {
    const { str, x, y } = options;
    const style = options.style || { fontSize: 36, align : 'center'};

    let text = new PIXI.Text(str, style);
    if ( !options.left ) {
        text.anchor.set(0.5);
    }
    text.x = x || 0;
    text.y = y || 0;

    return text;
}

export function createCircle(options) {
    const { x, y, radius, color = 0 , alpha } = options;

    let circle = new PIXI.Graphics();
    circle.beginFill(color, alpha).drawCircle(0, 0, radius || 0).endFill();
    circle.x = x || 0;
    circle.y = y || 0;

    return circle;
}