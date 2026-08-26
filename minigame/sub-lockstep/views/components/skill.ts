// @ts-nocheck
import PIXI from '../../pixi-ref';
import config    from '../../config';

const dpr = 2;

export default class JoyStick extends PIXI.Sprite {
    constructor() {
        let button  = PIXI.Texture.from("sub-lockstep/images/attack.png");

        super(button);

        this.button       = button;
        this.buttonActive = PIXI.Texture.from("sub-lockstep/images/attacking.png")

        this.eventemitter = new PIXI.utils.EventEmitter();

        this.width  = 60 * dpr;
        this.height = 60 * dpr;

		this.hasDisable = true;

        this.bindEvent();
    }

    enable() {
        this.hasDisable = false;
    }

    disable() {
        this.hasDisable = true;
    }

    bindEvent() {
        this.interactive = true;

        this.x = config.GAME_WIDTH  - this.width - 50 * dpr;
        this.y = config.GAME_HEIGHT - this.height - 70 * dpr;

        this.on('pointerdown', () => {
            this.texture = this.buttonActive;

            if ( !this.hasDisable ) {
                this.eventemitter.emit('click');
            }
        });
        this.on('pointerup', () => {
            this.texture = this.button;
        });
        this.on('pointerout', () => {
            this.texture = this.button;
        });
    }
}

