// @ts-nocheck
import PIXI from '../../pixi-ref';
import config from '../../config';

import {
    createText
} from '../../common/ui';

export default class Battle extends PIXI.Container {
    constructor() {
        super();
    }

    updateDebugMsg(msgArr = []) {
        if ( this.box ) {
            this.removeChild(this.box);
        }

        if ( !msgArr.length ) {
            return;
        }

        const w = 465;
        const font    = 22;
        const h = 108;

        let box = new PIXI.Container();
        this.box = box;
        this.addChild(box);
        box.x = (config.GAME_WIDTH - w) / 2;
        box.y = config.GAME_HEIGHT - h - 52;
        box.width = w;
        box.height = h + 4;

        let g = new PIXI.Graphics();
        g.lineStyle(2, 5729173, 1);
        g.beginFill(14211288, .7);
        g.drawRoundedRect(0, 0, w, h, 18);
        g.endFill();
        box.addChild(g);

        for (var i = 0, len = msgArr.length / 2, y = void 0; i < len; i++) {
            y = i ? msgArr[i * 2 - 1].y + msgArr[i * 2 - 1].height + 16 : 24;
            msgArr[i * 2] = createText({
                str: msgArr[i * 2],
                style: { fontSize: font, fill: "#576B95" },
                left: true,
                x: 22,
                y: y
            });
            msgArr[i * 2 + 1] = createText({
                str: msgArr[i * 2 + 1],
                style: { fontSize: font, fill: "#576B95" },
                left: true,
                x: 215,
                y: y
            });
        }
        box.addChild(...msgArr);
        msgArr = null;
    }
}
