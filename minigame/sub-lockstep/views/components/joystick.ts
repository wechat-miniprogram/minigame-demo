// @ts-nocheck
import PIXI from '../../pixi-ref';
import config    from '../../config';
import Tween     from './tween';
import { createCircle } from '../../common/ui';
import {
    none,
    convertRadian2Degree,
    convertDegree2Radian
} from '../../common/util';

const dpr = 2;

// 组件所用到事件
const DOWN = "touchstart";
const MOVE = "touchmove";
const UP   = "touchend";
const OUT  = "touchendoutside";

// 虚拟摇杆的大小
const JOYSTICKWIDTH  = 128.7 * dpr;
const JOYSTICKHEIGHT = 128.7 * dpr;

// 虚拟摇杆的位置
const WRAPPER_X = 40 * dpr;
const WRAPPER_Y = config.GAME_HEIGHT - JOYSTICKHEIGHT - 40.3 * dpr;

/**
 * @constructor
 * 虚拟摇杆类
 */
export default class JoyStick extends PIXI.Container {
	/**
	 * @param { Function } eventDispatch: 当操作虚拟摇杆的时候
	 * 通过这个函数告知外界当前虚拟摇杆的状态
	 */
	constructor(eventDispatch = none) {
        super();

		this.eventDispatch = eventDispatch;

		this.init();
	}

	init() {
        this.directionCount  = 360;
        this.directionDegree = 360 / this.directionCount;
        this.currentDegree   = 0;
        this.halfDirection   = 360 / this.directionCount / 2;

		// 用于限制区域内不能进行多点触控
		this.touchId = -1;

		// 	标识当前虚拟摇杆是否禁止
		this.hasDisable = true;

		// 渲染虚拟摇杆UI
		this.renderUI();

        this.moveCbk = this.onTouchMove.bind(this);
        this.upCbk   = this.onTouchUp.bind(this);
	}

	// 允许虚拟摇杆操作
	enable() {
		this.hasDisable = false;
	}

	// 禁止虚拟摇杆操作
	disable() {
		this.hasDisable = true;
		this.onTouchUp();
	}

	/**
	 * 将点的运动限制在一个圆内
	 */
	getPointInCircle(center, r, x, y) {
		let resultX = x;
		let resultY = y;

		let offsetX = x - center.x;
		let offsetY = y - center.y;

		let tan  = Math.atan2(offsetY, offsetX);
		let maxX = Math.cos(tan) * r;
		let maxY = Math.sin(tan) * r;

        let degree = (360 + parseInt(convertRadian2Degree(tan))) % 360;

		if ( Math.abs(offsetX) > Math.abs(maxX) )
			resultX = center.x + maxX;

		if ( Math.abs(offsetY) > Math.abs(maxY) )
			resultY = center.y +  maxY;

		return { resultX, resultY, degree, radian: convertDegree2Radian(degree)};
	}

	renderUI() {
		this.radius = JOYSTICKWIDTH / 2;

		// 添加小圆点区域限制
		const wrap = createCircle({
			x: WRAPPER_X + this.radius,
			y: WRAPPER_Y + this.radius,
			radius: this.radius,
			alpha: 0
		}),
		img = PIXI.Sprite.from('sub-lockstep/images/joystick_wrap.png');
		
        wrap.interactive = true;
        wrap.width  = JOYSTICKWIDTH;
        wrap.height = JOYSTICKHEIGHT;
        img.x      	= WRAPPER_X - 16;
        img.y      	= WRAPPER_Y - 6;

        this.wrap   = wrap;
        this.wrap.name = 'wrap';
        this.wrap.on(DOWN, this.onTouchDown.bind(this));
        this.addChild(img, wrap);

        this.center = {
			x: this.wrap.x,
            y: this.wrap.y
        }

        this.button = PIXI.Sprite.from('sub-lockstep/images/joystick.png');
        this.button.width  = 50 * dpr;
        this.button.height = 50 * dpr;
        this.button.radius = 25 * dpr;

        // 小圆点的起始位置，小圆点与大圆起始位置圆心重合
        this.button.buttonStartX = this.radius - this.button.radius + WRAPPER_X;
        this.button.buttonStartY = this.radius - this.button.radius + WRAPPER_Y;

        this.button.x = this.button.buttonStartX;
        this.button.y = this.button.buttonStartY;

        this.addChild(this.button);
	}

	bindEventHandler() {
        this.offEventHandler();

		this.wrap.on(MOVE, this.moveCbk);
        this.wrap.on(OUT, this.upCbk);
        this.wrap.on(UP, this.upCbk);
	}

	offEventHandler() {
		this.wrap.off(MOVE, this.moveCbk);
        this.wrap.off(UP, this.upCbk);
        this.wrap.off(OUT, this.upCbk);
	}

	onTouchDown(evt) {
		// 防止多点触控
		if ( this.touchId !== -1 )
			return;
		this.touchId === evt.touchId;

		if ( this.tweener ) {
			this.tweener.clear();
			this.tweener = null;
		}

        const position = evt.data.getLocalPosition(this.parent);
        if ( !position ) return;
		let bx = position.x;
		let by = position.y;

		this.lastStageX = bx;
		this.lastStageY = by;

		let limit  = this.getPointInCircle(this.center, this.radius - this.button.radius, bx, by);

		this.button.x = limit.resultX - this.button.radius;
		this.button.y = limit.resultY - this.button.radius;

		this.bindEventHandler();
	}

	onTouchUp() {
		this.touchId        = -1;
        this.currIdentifier = undefined;

		// 小圆点缓慢回到中心
        this.tweener = Tween.to(
            this.button,
            {
                x: this.button.buttonStartX,
                y: this.button.buttonStartY
            },
            250,
            'circOut',
        );

		this.offEventHandler();

		if ( !this.hasDisable ) {
			this.eventDispatch && this.eventDispatch(-9999);
        }
	}

    eventFilter(limit) {
        let degree = limit.degree;
        let low  = this.currentDegree - this.halfDirection;
        let high = this.currentDegree + this.halfDirection;

        if ( degree >= low && degree < high ) {
            return false;
        } else {
            this.currentDegree = parseInt(degree / this.directionDegree) * this.directionDegree;
            limit.radian = convertDegree2Radian(this.currentDegree);
            this.eventDispatch && this.eventDispatch(limit);
        }
    }

	onTouchMove(evt) {
        /**
         * https://github.com/pixijs/pixi.js/issues/1979
         * PIXI的多点触控会依赖evt.data.identifier字段，所以每次开始接收move事件的时候
         * 缓存evt.data.identifier，后续的move事件只认该事件
         */
        if ( this.currIdentifier !== undefined && evt.data.identifier !== this.currIdentifier ) {
            return;
        }

        this.currIdentifier = evt.data.identifier;

        const position = evt.data.getLocalPosition(this.parent);
        if ( !position ) return;
		let bx = position.x;
		let by = position.y;

		this.lastStageX = bx;
		this.lastStageY = by;

		let limit = this.getPointInCircle(this.center, this.radius - this.button.radius, bx, by);

		this.button.x = limit.resultX - this.button.radius;
		this.button.y = limit.resultY - this.button.radius;

        if ( !this.hasDisable ) {
			this.eventFilter(limit);
        }
	}
}

