// @ts-nocheck
import PIXI from '../../pixi-ref';
import config    from '../../config';

export default class BackGround extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from('sub-lockstep/images/bg.png');
        super(texture);

        this.fill();
    }

    fill() {
        let width  = this.texture.width;
        let height = this.texture.height;

        if ( width / height > config.GAME_WIDTH / config.GAME_HEIGHT ) {
            this.height = config.GAME_HEIGHT;
            this.width = width * ( config.GAME_HEIGHT / height);
        } else {
            this.width = config.GAME_WIDTH;
            this.height = height * ( config.GAME_WIDTH / width);
        }
    }
}
