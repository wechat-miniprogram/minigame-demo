// @ts-nocheck
/**
 * Room 场景 - 视图层
 *
 * 仅负责 UI 渲染。所有 wx API 调用（邀请分享、准备、开始、离开）都委托给
 * ../../logic/room.js。房间信息数据解析也在 logic 层完成，view 层只渲染。
 */

import PIXI from '../../pixi-ref';
import config from '../../config';
import { createBtn } from '../../common/ui';
import databus from '../../databus';
import { showTip } from '../../common/util';
import * as roomLogic from '../../logic/room';

export default class Room extends PIXI.Container {
    constructor() {
        super();
    }

    initUI() {
        const title = new PIXI.Text('1V1对战', { fontSize: 56, align: 'center', fill: '#515151' });
        title.x = config.GAME_WIDTH / 2 - title.width / 2;
        title.y = 96;
        this.addChild(title);

        const vs = new PIXI.Text('VS', { fontSize: 64, align: 'center', fill: '#515151' });
        vs.x = config.GAME_WIDTH / 2 - vs.width / 2;
        vs.y = 307;
        this.addChild(vs);
    }

    /** 左上角返回按钮 */
    appendBackBtn() {
        const back = createBtn({
            img: 'sub-lockstep/images/goBack.png',
            x: 104,
            y: 68,
            onclick: () => roomLogic.leaveRoom(),
        });
        this.addChild(back);
    }

    /** 底部操作按钮：准备 + （房主的）开始 */
    appendOpBtn(member) {
        const { isReady, role } = member;
        const isOwner = role === config.roleMap.owner;

        const getReady = createBtn({
            img: 'sub-lockstep/images/getReady.png',
            x: config.GAME_WIDTH / 2 - 159,
            y: config.GAME_HEIGHT - 160,
            onclick: () => roomLogic.toggleReady(isReady),
        });

        const start = createBtn({
            img: 'sub-lockstep/images/start.png',
            x: config.GAME_WIDTH / 2 + 159,
            y: config.GAME_HEIGHT - 160,
            onclick: () => {
                if (this._startClicked) return; // 防止重复点击
                if (!this.allReady) {
                    showTip('全部玩家准备后方可开始');
                } else {
                    this._startClicked = true;
                    start.alpha = 0.5;
                    roomLogic.startGame();
                }
            },
        });

        if (isReady) getReady.alpha = 0.5;
        if (!this.allReady) start.alpha = 0.5;

        isOwner ? this.addChild(getReady, start) : this.addChild(getReady);
    }

    clearUI() {
        this.removeChildren();
    }

    /** 渲染一个玩家位 */
    createOneUser(options) {
        const { headimg, index, nickname, role, isReady } = options;
        const padding = 136;

        const user = new PIXI.Sprite.from(headimg);
        user.name = 'player';
        user.width = 144;
        user.height = 144;
        user.x = index === 0
            ? config.GAME_WIDTH / 2 - user.width - padding
            : config.GAME_WIDTH / 2 + padding;
        user.y = 266;
        this.addChild(user);

        const name = new PIXI.Text(nickname, { fontSize: 36, align: 'center', fill: '#515151' });
        name.anchor.set(0.5);
        name.x = user.width / 2;
        name.y = user.height + 23;
        user.addChild(name);

        if (role === config.roleMap.owner) {
            const host = new PIXI.Sprite.from('sub-lockstep/images/hosticon.png');
            host.scale.set(0.8);
            host.y = -30;
            user.addChild(host);
        }

        if (isReady && !databus.matchPattern) {
            const ready = new PIXI.Sprite.from('sub-lockstep/images/iconready.png');
            ready.width = 40;
            ready.height = 40;
            ready.x = user.width;
            user.addChild(ready);
        }

        return user;
    }

    /** 房间信息变化回调（由 logic 推送） */
    handleRoomInfo(res) {
        this.clearUI();
        this.initUI();

        // 由 logic 层负责数据解析
        const { memberList, allReady } = roomLogic.parseRoomInfo(res);
        this.allReady = allReady;

        memberList.forEach((member) => {
            const user = this.createOneUser(member);

            // 是自己 → 显示准备/开始按钮
            if (databus.selfClientId === member.clientId && !databus.matchPattern) {
                this.appendOpBtn(member);
            }

            // 空位 → 点击触发分享邀请
            if (member.isEmpty) {
                user.interactive = true;
                user.on('pointerdown', () => roomLogic.inviteFriend());
            }
        });

        this.appendBackBtn();
    }

    _destroy() {
        roomLogic.unsubscribe();
    }

    launch() {
        // 绑定 logic → view 的数据更新点
        roomLogic.setOnRoomInfo((res) => this.handleRoomInfo(res));
        // 订阅 + 拉首次房间信息
        roomLogic.subscribe();
    }
}
