// @ts-nocheck
import PIXI from '../../pixi-ref';
import config    from '../../config';
import databus   from '../../databus';
import {
    velocityDecomposition,
    getDistance,
    getNumInRange,
} from '../../common/util';

const dpr = 2;

export default class Bullet extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from('sub-lockstep/images/bullet_blue.png');
        super(texture);

        this.width  = 10 * dpr;
        this.height = 5 * dpr;
        this.anchor.set(0.5);

        this.radius = Math.sqrt(Math.pow(parseInt(this.width / 2), 2) + Math.pow(parseInt(this.height / 2), 2))
    }

    get collisionCircle() {
        return {
            center: { x: this.frameX, y: this.frameY },
            radius: this.radius,
        }
    }

    reset(options={}) {
        this.speedX   = 0;
        this.speedY   = 0;
        this.speed    = 0;
        this.rotation = 0;

        ({
            speed    : this.speed,
            direction: this.direction,
            x        : this.x,
            y        : this.y,
            x        : this.frameX,
            y        : this.frameY,
            x        : this.preditX,
            y        : this.preditY,
        } = options);

        this.setDirection(this.direction);
    }

    setDirection(radian) {
        this.rotation = radian;
        let res = velocityDecomposition(this.speed, this.rotation);

        this.speedX = res.x;
        this.speedY = -res.y;
    }

    checkNotInScreen(x, y) {
        return !!(   x + this.radius < 0
                  || x - this.radius > config.GAME_WIDTH
                  || y + this.radius < 0
                  || y - this.radius > config.GAME_HEIGHT  );
    }

    renderUpdate(dt) {
        try {
            if ( this.x !== this.preditX || this.y !== this.preditY ) {
                let dis = getDistance({ x: this.x, y: this.y}, { x: this.preditX, y: this.preditY});
                let temp = dt / ( 1000 / 30) * ( this.speed * ( 1000 / 30) );
                let percent = getNumInRange(temp / dis, 0, 1);

                this.x += (this.preditX - this.x) * percent;
                this.y += (this.preditY - this.y) * percent;
            }
        } catch(e) {
            // 对象可能已被 destroy
        }
    }

    frameUpdate(dt) {
        this.frameX += this.speedX * dt;
        this.frameY += this.speedY * dt;

        // 真正的删除操作交给逻辑帧来实现，避免逻辑帧想修复的时候子弹已经消失了
        if ( this.checkNotInScreen(this.frameX, this.frameY) ) {
            databus.removeBullets(this);
        }
    }

    preditUpdate(dt) {
        this.preditX += this.speedX * dt;
        this.preditY += this.speedY * dt;
    }
}

