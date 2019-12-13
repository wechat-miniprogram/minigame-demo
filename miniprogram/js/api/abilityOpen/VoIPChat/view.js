import { p_button, p_text, p_box, p_img } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '语音对话房间',
            api_name: 'join/exit/VoIPChat'
        }),
        muteMicrophoneBox = p_box(PIXI, {
            height: 89 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 24 * PIXI.ratio
        }),
        muteEarphoneBox = p_box(PIXI, {
            height: 90 * PIXI.ratio,
            y: muteMicrophoneBox.height + muteMicrophoneBox.y
        }),
        showRoomNumBox = p_box(PIXI, {
            height: 372 * PIXI.ratio,
            y: muteEarphoneBox.height + muteEarphoneBox.y + 38 * PIXI.ratio
        }),
        roomNumText = p_text(PIXI, {
            content: '',
            fontSize: 30 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: showRoomNumBox.width, containerHeight: showRoomNumBox.height }
        });
    showRoomNumBox.addChild(roomNumText);

    let roomName, share, leave;

    // 是否静音麦克风 start
    let muteMicrophoneOff = p_img(PIXI, {
        width: 142 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        src: 'images/off.png',
        x: muteMicrophoneBox.width - 152 * PIXI.ratio,
        relative_middle: { containerHeight: muteMicrophoneBox.height }
    });
    let muteMicrophoneOn = p_img(PIXI, {
        width: 122 * PIXI.ratio,
        height: 87 * PIXI.ratio,
        src: 'images/on.png',
        x: muteMicrophoneBox.width - 142 * PIXI.ratio
    });
    muteMicrophoneOff.hideFn();
    muteMicrophoneOff.onClickFn(e => {
        updateVoIPChatMuteConfigFn(e, 'muteMicrophone', false, () => {
            muteMicrophoneOff.hideFn();
            muteMicrophoneOn.showFn();
        });
    });
    muteMicrophoneOn.onClickFn(e => {
        updateVoIPChatMuteConfigFn(e, 'muteMicrophone', true, () => {
            muteMicrophoneOff.showFn();
            muteMicrophoneOn.hideFn();
        });
    });
    muteMicrophoneBox.addChild(
        p_text(PIXI, {
            content: `麦克风`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: muteMicrophoneBox.height }
        }),
        muteMicrophoneOff,
        muteMicrophoneOn
    );
    // 是否静音麦克风 end

    // 是否静音耳机 start
    let muteEarphoneOff = p_img(PIXI, {
        width: 142 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        src: 'images/off.png',
        x: muteEarphoneBox.width - 152 * PIXI.ratio,
        relative_middle: { containerHeight: muteEarphoneBox.height }
    });
    let muteEarphoneOn = p_img(PIXI, {
        width: 122 * PIXI.ratio,
        height: 87 * PIXI.ratio,
        src: 'images/on.png',
        x: muteEarphoneBox.width - 142 * PIXI.ratio
    });
    muteEarphoneOff.hideFn();
    muteEarphoneOff.onClickFn(e => {
        updateVoIPChatMuteConfigFn(e, 'muteEarphone', false, () => {
            muteEarphoneOff.hideFn();
            muteEarphoneOn.showFn();
        });
    });
    muteEarphoneOn.onClickFn(e => {
        updateVoIPChatMuteConfigFn(e, 'muteEarphone', true, () => {
            muteEarphoneOff.showFn();
            muteEarphoneOn.hideFn();
        });
    });
    muteEarphoneBox.addChild(
        p_text(PIXI, {
            content: `耳机`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: muteEarphoneBox.height }
        }),
        muteEarphoneOff,
        muteEarphoneOn
    );
    // 是否静音耳机 end

    function updateVoIPChatMuteConfigFn(e, name, boolean, Fn) {
        let target = e.target;
        if (target.clickOnce) return;
        target.clickOnce = !target.clickOnce;
        callBack({
            status: 'updateVoIPChatMuteConfig',
            [name]: boolean,
            drawFn() {
                target.clickOnce = !target.clickOnce;
                Fn && Fn();
            }
        });
    }

    // 分享房间 start
    share = p_button(PIXI, {
        width: 580 * PIXI.ratio,
        y: showRoomNumBox.height + showRoomNumBox.y + 38 * PIXI.ratio
    });
    share.myAddChildFn(
        p_text(PIXI, {
            content: `邀请好友进入房间`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: share.width, containerHeight: share.height }
        })
    );
    share.onClickFn(() => {
        callBack({
            status: 'shareAppMessage',
            groupId: roomName
        });
    });
    // 分享房间 end

    // 退出房间按钮 start
    leave = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: { width: (2 * PIXI.ratio) | 0, color: 0xd1d1d1 },
        y: share.height + share.y + 32 * PIXI.ratio,
        alpha: 0
    });
    leave.myAddChildFn(
        p_text(PIXI, {
            content: '退出房间',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            relative_middle: { containerWidth: leave.width, containerHeight: leave.height }
        })
    );
    leave.onClickFn(() => {
        callBack({
            status: 'exitVoIPChat'
        });
        window.router.delPage();
    });
    // 退出房间按钮 end

    function isShowChildFn(isShow) {
        for (let i = 0, len = container.children.length; i < len; i++) {
            container.children[i].visible = isShow;
        }
    }

    !wx.joinVoIPChat && wx.joinVoIPChat();

    goBack.callBack = () => {
        callBack({ status: 'exitVoIPChat' });
    };

    callBack({
        status: 'joinVoIPChat',
        groupId: obj.roomName,
        re_enter: obj.re_enter,
        drawFn(res, name) {
            roomName = name;
            roomNumText.turnText(`当前房间人数：${res.openIdList.length} 人`);

            !obj.pathName && isShowChildFn(true);
        },
        drawRoomNumFn(num) {
            roomNumText.turnText(`当前房间人数：${num} 人`);
        }
    });

    container.addChild(goBack, title, api_name, underline, muteMicrophoneBox, muteEarphoneBox, showRoomNumBox, share, leave, logo, logoName);
    !obj.pathName && isShowChildFn(false);
    app.stage.addChild(container);

    return container;
};
