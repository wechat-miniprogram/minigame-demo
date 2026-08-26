/**
 * voipChat rich-config
 * 完全照抄 demo2/miniprogram/js/api/abilityOpen/VoIPChat/view.js
 */

import * as logic from '../../api/media/voipChat/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '语音对话房间',
  apiName: 'voipChat',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_img, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;

    const container = new PIXI.Container();

    // ===== 麦克风开关框 =====
    let muteMicrophoneBox = p_box(PIXI, {
      height: 89 * PIXI.ratio,
      border: { width: PIXI.ratio, color: 0xe5e5e5 },
      y: underlineBottom + 24 * PIXI.ratio,
    });

    // ===== 耳机开关框 =====
    let muteEarphoneBox = p_box(PIXI, {
      height: 90 * PIXI.ratio,
      y: muteMicrophoneBox.height + muteMicrophoneBox.y,
    });

    // ===== 房间人数显示框 =====
    let showRoomNumBox = p_box(PIXI, {
      height: 372 * PIXI.ratio,
      y: muteEarphoneBox.height + muteEarphoneBox.y + 38 * PIXI.ratio,
    });
    let roomNumText = p_text(PIXI, {
      content: '',
      fontSize: 30 * PIXI.ratio,
      fill: 0x353535,
      relative_middle: {
        containerWidth: showRoomNumBox.width,
        containerHeight: showRoomNumBox.height,
      },
    });
    showRoomNumBox.addChild(roomNumText);

    // ===== 麦克风 on/off 开关 start =====
    let muteMicrophoneOff = p_img(PIXI, {
      width: 142 * PIXI.ratio,
      height: 90 * PIXI.ratio,
      src: 'images/off.png',
      x: muteMicrophoneBox.width - 152 * PIXI.ratio,
      relative_middle: { containerHeight: muteMicrophoneBox.height },
    });
    let muteMicrophoneOn = p_img(PIXI, {
      width: 122 * PIXI.ratio,
      height: 87 * PIXI.ratio,
      src: 'images/on.png',
      x: muteMicrophoneBox.width - 142 * PIXI.ratio,
    });
    muteMicrophoneOff.hideFn();
    muteMicrophoneOff.onClickFn((e: any) => {
      let target = e.target;
      if (target.clickOnce) return;
      target.clickOnce = !target.clickOnce;
      logic.toggleMicrophone(() => {
        target.clickOnce = !target.clickOnce;
        muteMicrophoneOff.hideFn();
        muteMicrophoneOn.showFn();
      });
    });
    muteMicrophoneOn.onClickFn((e: any) => {
      let target = e.target;
      if (target.clickOnce) return;
      target.clickOnce = !target.clickOnce;
      logic.toggleMicrophone(() => {
        target.clickOnce = !target.clickOnce;
        muteMicrophoneOff.showFn();
        muteMicrophoneOn.hideFn();
      });
    });
    muteMicrophoneBox.addChild(
      p_text(PIXI, {
        content: '麦克风',
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: muteMicrophoneBox.height },
      }),
      muteMicrophoneOff,
      muteMicrophoneOn,
    );
    // ===== 麦克风 on/off 开关 end =====

    // ===== 耳机 on/off 开关 start =====
    let muteEarphoneOff = p_img(PIXI, {
      width: 142 * PIXI.ratio,
      height: 90 * PIXI.ratio,
      src: 'images/off.png',
      x: muteEarphoneBox.width - 152 * PIXI.ratio,
      relative_middle: { containerHeight: muteEarphoneBox.height },
    });
    let muteEarphoneOn = p_img(PIXI, {
      width: 122 * PIXI.ratio,
      height: 87 * PIXI.ratio,
      src: 'images/on.png',
      x: muteEarphoneBox.width - 142 * PIXI.ratio,
    });
    muteEarphoneOff.hideFn();
    muteEarphoneOff.onClickFn((e: any) => {
      let target = e.target;
      if (target.clickOnce) return;
      target.clickOnce = !target.clickOnce;
      logic.toggleEarphone(() => {
        target.clickOnce = !target.clickOnce;
        muteEarphoneOff.hideFn();
        muteEarphoneOn.showFn();
      });
    });
    muteEarphoneOn.onClickFn((e: any) => {
      let target = e.target;
      if (target.clickOnce) return;
      target.clickOnce = !target.clickOnce;
      logic.toggleEarphone(() => {
        target.clickOnce = !target.clickOnce;
        muteEarphoneOff.showFn();
        muteEarphoneOn.hideFn();
      });
    });
    muteEarphoneBox.addChild(
      p_text(PIXI, {
        content: '耳机',
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: muteEarphoneBox.height },
      }),
      muteEarphoneOff,
      muteEarphoneOn,
    );
    // ===== 耳机 on/off 开关 end =====

    // ===== 分享房间按钮 start =====
    let share = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: showRoomNumBox.height + showRoomNumBox.y + 38 * PIXI.ratio,
    });
    share.myAddChildFn(
      p_text(PIXI, {
        content: '邀请好友进入房间',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: { containerWidth: share.width, containerHeight: share.height },
      }),
    );
    share.onClickFn(() => {
      logic.inviteFriend();
    });
    // ===== 分享房间按钮 end =====

    // ===== 退出房间按钮 start =====
    let leave = p_button(PIXI, {
      width: 576 * PIXI.ratio,
      height: 90 * PIXI.ratio,
      border: { width: (2 * PIXI.ratio) | 0, color: 0xd1d1d1 },
      y: share.height + share.y + 32 * PIXI.ratio,
      alpha: 0,
    });
    leave.myAddChildFn(
      p_text(PIXI, {
        content: '退出房间',
        fontSize: 36 * PIXI.ratio,
        fill: 0x353535,
        relative_middle: { containerWidth: leave.width, containerHeight: leave.height },
      }),
    );
    leave.onClickFn(() => {
      logic.exitChat();
    });
    // ===== 退出房间按钮 end =====

    // 显隐控制：加入房间前隐藏内容元素
    const children = [muteMicrophoneBox, muteEarphoneBox, showRoomNumBox, share, leave];
    function isShowChildFn(isShow: boolean) {
      for (let i = 0, len = children.length; i < len; i++) {
        children[i].visible = isShow;
      }
    }

    // 回调：加入房间成功 → 更新房间人数 + 显示内容
    logic.setOnJoin((_roomName: string, memberCount: number) => {
      roomNumText.turnText(`当前房间人数：${memberCount} 人`);
      isShowChildFn(true);
    });

    // 回调：成员变化 → 更新人数
    logic.setOnMemberChange((num: number) => {
      roomNumText.turnText(`当前房间人数：${num} 人`);
    });

    // 回调：退出/中断 → 隐藏内容
    logic.setOnExit(() => {
      isShowChildFn(false);
      roomNumText.turnText('');
    });

    // 初始：已加入则直接显示内容（从分享返回等场景），否则隐藏
    if (logic.isJoined()) {
      roomNumText.turnText(`当前房间人数：- 人`);
      isShowChildFn(true);
    } else {
      isShowChildFn(false);
    }

    container.addChild(
      muteMicrophoneBox,
      muteEarphoneBox,
      showRoomNumBox,
      share,
      leave,
    );
    return container;
  },

  actions: [],

  onLoad: () => logic.joinChat(),
  onUnload: () => logic.onUnload(),
};
