// @ts-nocheck
import PIXI from '../../pixi-ref';

export default class Hp extends PIXI.Sprite {
    constructor(options={}) {
        super();

        this.options = options;
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.updateHp(this.options.hp);
    }

    updateHp(curr) {
        const graphics = this.graphics;
        const { width, height, hp} = this.options;

        graphics.clear();

        graphics.lineStyle(2, 6710886, 1);
        graphics.beginFill(14211288, 1);
        graphics.drawRoundedRect(0, 0, width, height, height / 2);

        graphics.lineStyle(2, 6710886, 1);
        graphics.beginFill(10002336, 1);
        graphics.drawRoundedRect(1, 1, width * ( curr / hp), height - 2, (height - 2) / 2);
        graphics.endFill();
    }

    setPos(x, y) {
        this.graphics.x = x;
        this.graphics.y = y;
    }
}
