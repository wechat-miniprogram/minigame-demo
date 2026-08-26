// @ts-nocheck
import PIXI from '../../pixi-ref';
import config from '../../config';

import {
    velocityDecomposition,
    convertDegree2Radian,
    getDistance,
    getNumInRange,
    limitNumInRange,
    getMove
} from '../../common/util';

import Bullet  from './bullet';
import databus from '../../databus';

const dpr = 2;

export default class Player extends PIXI.extras.AnimatedSprite {
    constructor() {
        let alienImages = [
            "sub-lockstep/images/aircraft1.png",
            "sub-lockstep/images/aircraft2.png"
        ];

        let textureArray = alienImages.map(item => {
            return PIXI.Texture.from(item);
        });

        super(textureArray);

        this.init();
    }

    init() {
        this.width  = 45 * dpr;
        this.height = 45 * dpr;

        this.setSpeed(0);
        this.hp      = config.playerHp;
        this.anchor.set(0.5);
        this.rotation = 0;
        this.frameRotation = 0;
        this.animationSpeed = parseFloat((20 / 120).toFixed(2));
        this.play();

        this.setPos(config.GAME_WIDTH / 2, config.GAME_HEIGHT / 2);

        this.radius  = parseInt(this.width / 2);
        this.userData = {};
        this.frameX  = 0;
        this.frameY  = 0;
        this.preditX = 0;
        this.preditY = 0;

        this.desDegree   = 0;
        this.frameDegree = 0;
        this.currDegree  = 0;
    }

    setDirection(degree) {
        this.desDegree   = degree;
        this.frameDegree = degree;
        this.currDegree  = degree;
        this.rotation    = convertDegree2Radian(degree);
        this.frameRotation = this.rotation;
    }

    setData(data) {
        this.userData = data;
    }

    get collisionCircle() {
        return {
            center: { x: this.frameX, y: this.frameY },
            radius: this.radius,
        }
    }

    setPos(x, y) {
        // 注意：不要因为 position 为空就静默跳过，否则角色会停留在 (0,0) 不可见
        try {
            if ( x !== undefined ) {
                this.position.x = x;
            }

            if ( y !== undefined ) {
                this.position.y = y;
            }
        } catch(e) {
            console.warn('[lockstep][Player] setPos error:', e);
        }
    }

    setSpeed(speed, rotation) {
        this.speed = speed;
        rotation = rotation || this.rotation;

        let {x, y} = velocityDecomposition(this.speed, rotation);
        this.speedX = x;
        this.speedY = -y;
    }

    shoot() {
        let bullet = new Bullet();
        databus.bullets.push(bullet);

        bullet.reset({
            //direction: this.rotation,
            direction: this.frameRotation,
            speed    : 0.7,
            x        : this.shootPoint.x,
            y        : this.shootPoint.y,
        });

        bullet.sourcePlayer = this;

        this.parent.addChild(bullet);
    }

    // 子弹发射点的位置
    get shootPoint() {
        let half = parseInt(this.width / 2);
        return {
            x: this.x + half * Math.cos(this.rotation),
            y: this.y + half * Math.sin(this.rotation),
        }
    }

    setDestDegree(degree) {
        this.desDegree = degree;
    }

    /**
     * 为了表现平滑，渲染帧都会以一个比逻辑帧的速度执行
     * 逻辑帧也会计算该逻辑帧最终的表现数据
     */
    renderUpdate(dt) {
        try {
            if ( this.x !== this.preditX || this.y !== this.preditY ) {
                let dis = getDistance({ x: this.x, y: this.y}, { x: this.preditX, y: this.preditY});
                let temp = dt / ( 1000 / 30) * ( 0.2 * ( 1000 / 30) );
                let percent = getNumInRange(temp / dis, 0, 1);

                this.x += (this.preditX - this.x) * percent;
                this.y += (this.preditY - this.y) * percent;
            }

            if ( this.currDegree !== this.frameDegree ) {
                const dis = getMove(this.currDegree, this.frameDegree);

                let temp = dt / ( 1000 / 30) * 10;
                let percent = getNumInRange(temp / Math.abs(dis), 0, 1);

                this.currDegree += dis * percent;

                this.currDegree = limitNumInRange(this.currDegree, 0, 360);
                this.rotation  = convertDegree2Radian(this.currDegree);
            }
        } catch(e) {
            // 对象可能已被 destroy，忽略
        }
    }

    // 每个逻辑帧执行
    frameUpdate(dt) {
        let newX = this.frameX + this.speedX * dt;
        let newY = this.frameY + this.speedY * dt;

        // 碰到边缘
        if ( newX  - this.radius >= 0 && newX + this.radius <= config.GAME_WIDTH ) {
            this.frameX = newX;
        }

        if ( newY - this.radius >= 0 && newY + this.radius <= config.GAME_HEIGHT ) {
            this.frameY = newY;
        }

        // 当前方向与目标方向不一致，朝着目标方向推进
        if ( this.frameDegree !== this.desDegree ) {
            const dis = getMove(this.frameDegree, this.desDegree);

            if ( Math.abs(dis) <= 10 ) {
                this.frameDegree = this.desDegree;
            } else {
                if ( dis > 0 ) {
                    this.frameDegree += 10;
                } else {
                    this.frameDegree -= 10;
                }
            }

            this.frameDegree = limitNumInRange(this.frameDegree, 0, 360);

            let radian = convertDegree2Radian(this.frameDegree);
            this.frameRotation = radian;
            this.setSpeed(0.2, radian);
        }
    }

    preditUpdate(dt) {
        let newX = this.frameX + this.speedX * dt;
        let newY = this.frameY + this.speedY * dt;

        // 碰到边缘
        if ( newX  - this.radius >= 0 && newX + this.radius <= config.GAME_WIDTH ) {
            this.preditX = newX;
        }

        if ( newY - this.radius >= 0 && newY + this.radius <= config.GAME_HEIGHT ) {
            this.preditY = newY;
        }
    }
}

