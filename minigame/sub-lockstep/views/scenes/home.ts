// @ts-nocheck
/**
 * Home 场景 - 视图层
 *
 * 仅负责 UI 渲染和用户交互，所有 wx API 调用都委托给 ../../logic/home.js。
 */

import PIXI from '../../pixi-ref';
import config from '../../config';
import { createBtn, createText } from '../../common/ui';

import * as homeLogic from '../../logic/home';

export default class Home extends PIXI.Container {
    constructor() {
        super();
    }

    /** 创建对战房间按钮 */
    appendOpBtn() {
        this.addChild(
            createText({
                str: '小游戏帧同步功能示例',
                x: config.GAME_WIDTH / 2,
                y: 287,
                style: { fontSize: 64, fill: '#515151' },
            }),
            createBtn({
                img: 'sub-lockstep/images/createRoom.png',
                x: config.GAME_WIDTH / 2,
                y: 512,
                onclick: () => {
                    if (this.handling) return;
                    this.handling = true;
                    homeLogic.createRoom(() => { this.handling = false; });
                },
            }),
        );
    }

    /** 返回主 demo 的按钮（左上角） */
    appendBackBtn() {
        const back = createBtn({
            img: 'sub-lockstep/images/goBack.png',
            x: 104,
            y: 68,
            onclick: () => {
                // 延迟 require 避免循环依赖
                const { exitToMain } = require('../../index');
                exitToMain();
            },
        });
        this.addChild(back);
    }

    launch(/* gameServer 已由 logic 层内部持有，view 不再需要 */) {
        homeLogic.onEnter();     // 重置 matchPattern
        this.appendBackBtn();
        this.appendOpBtn();
    }
}
