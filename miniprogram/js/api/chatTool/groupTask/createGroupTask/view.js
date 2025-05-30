import { p_button, p_text, p_box, p_img, p_line, p_textarea, } from "../../../../libs/component/index";
import fixedTemplate from "../../../../libs/template/fixed";
export default function (PIXI, app, obj, callBack) {
    const r = (value) => {
        return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
    };
    let container = new PIXI.Container(), { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
        obj,
        title: "创建任务",
        api_name: "群活动",
    });
    const contentWidth = r(322);
    /**** taskTitle ****/
    // 任务示例标题
    let taskTitleText = p_text(PIXI, {
        content: "活动名",
        x: r(26),
        y: r(155),
        fontSize: r(14),
        fill: "rgba(0,0,0,0.5)",
        align: "center",
    });
    // 任务标题输入框
    let taskTitleInput = p_textarea(PIXI, {
        width: contentWidth,
        height: r(72),
        y: r(179),
        radius: r(8),
        fontSize: r(17),
        padding: r(13),
        placeholder: {
            content: "请输入活动名",
            color: "rgba(0,0,0,0.3)",
        },
    });
    const taskTitleInputCompleteFn = (text) => {
        refreshPublishBtn(text);
        callBack({
            status: 'titleChange',
            text,
        });
    };
    taskTitleInput.initFn({ onComplete: taskTitleInputCompleteFn });
    function refreshPublishBtn(btnText) {
        console.log('活动名：', btnText);
        if (btnText.length > 0) {
            container.removeChild(publishBox);
            container.addChild(publishBtn);
        }
        else {
            container.removeChild(publishBtn);
            container.addChild(publishBox);
        }
    }
    /**** taskTitle ****/
    /**** taskDesc ****/
    // 任务描述
    let taskDescText = p_text(PIXI, {
        content: "任务（此处为示例）",
        x: r(26),
        y: r(282),
        fontSize: r(14),
        fill: "rgba(0,0,0,0.5)",
        align: "center",
    });
    let taskDescBox = p_box(PIXI, {
        width: contentWidth,
        height: r(72),
        x: r(26),
        y: r(306),
        radius: r(8),
    });
    let taskDescBoxText = p_text(PIXI, {
        content: "加入boss战，累计打5次",
        fontSize: r(17),
        fill: 0x000000,
        align: "center",
        relative_middle: {
            containerHeight: taskDescBox.height,
            containerWidth: taskDescBox.width,
        },
    });
    taskDescBox.addChild(taskDescBoxText);
    /**** taskDesc ****/
    /**** Participant ****/
    // 参与人标题
    let participantTitleText = p_text(PIXI, {
        content: "参与人",
        x: r(26),
        y: r(394),
        fontSize: r(14),
        fill: "rgba(0,0,0,0.5)",
        align: "center",
    });
    let BtnBox = p_box(PIXI, {
        width: contentWidth,
        height: r(134),
        y: r(418),
        radius: r(8),
    });
    // 全员可参与
    let allParticipantBtn = p_button(PIXI, {
        parentWidth: BtnBox.width,
        width: contentWidth,
        height: r(56),
        color: 0xffffff,
        radius: r(8),
    });
    let allParticipantBtnText = p_text(PIXI, {
        content: "全员可参与",
        fontSize: r(17),
        fill: 0x000000,
        align: "center",
        x: r(16),
        relative_middle: {
            containerHeight: allParticipantBtn.height,
        },
    });
    let allParticipantSelectedImg = p_img(PIXI, {
        src: "images/ic-line-done.png",
        x: r(282),
        width: r(24),
        relative_middle: {
            containerHeight: allParticipantBtn.height,
        },
    });
    // 分割线
    let splitLine = p_line(PIXI, {
        width: r(0.5),
        color: 0x000000,
        alpha: 0.1,
    }, [0, allParticipantBtn.y + allParticipantBtn.height], [contentWidth, 0]);
    // 指定参与人
    let specifyParticipantBtn = p_button(PIXI, {
        y: allParticipantBtn.y + allParticipantBtn.height + splitLine.height,
        parentWidth: BtnBox.width,
        width: contentWidth,
        height: r(78) - splitLine.height,
        color: 0xffffff,
        radius: r(8),
    });
    let specifyParticipantBtnTitleText = p_text(PIXI, {
        content: "指定参与人",
        fontSize: r(17),
        fill: 0x000000,
        align: "center",
        x: r(16),
        y: r(16),
    });
    let specifyParticipantBtnDescText = p_text(PIXI, {
        content: "可发送@消息提醒未参与的用户",
        fontSize: r(14),
        fill: "rgba(0,0,0,0.55)",
        align: "center",
        x: r(16),
        y: r(42),
    });
    let specifyParticipantBtnArrow = p_img(PIXI, {
        src: "images/right_arrow_black.png",
        width: r(7.5),
        height: r(13),
        x: r(136),
        y: r(18),
    });
    let specifyParticipantSelectedImg = p_img(PIXI, {
        src: "images/ic-line-done.png",
        x: r(282),
        width: r(24),
        relative_middle: {
            containerHeight: specifyParticipantBtn.height,
        },
    });
    BtnBox.addChild(allParticipantBtn);
    BtnBox.addChild(splitLine);
    BtnBox.addChild(specifyParticipantBtn);
    allParticipantBtn.addChild(allParticipantBtnText);
    allParticipantBtn.addChild(allParticipantSelectedImg);
    allParticipantBtn.onClickFn(() => {
        callBack({
            status: "allParticipant",
            drawFn() {
                allParticipantBtn.addChild(allParticipantSelectedImg);
                specifyParticipantBtn.removeChild(specifyParticipantSelectedImg);
                specifyParticipantBtnTitleText.turnText("指定参与人");
                specifyParticipantBtn.removeChild(specifyParticipantBtnArrow);
            },
        });
    });
    specifyParticipantBtn.addChild(specifyParticipantBtnTitleText);
    specifyParticipantBtn.addChild(specifyParticipantBtnDescText);
    specifyParticipantBtn.onClickFn(() => {
        callBack({
            status: "specifyParticipant",
            drawFn(participantCnt) {
                specifyParticipantBtn.addChild(specifyParticipantSelectedImg);
                allParticipantBtn.removeChild(allParticipantSelectedImg);
                specifyParticipantBtnTitleText.turnText(`指定参与人：${participantCnt}`);
                specifyParticipantBtn.addChild(specifyParticipantBtnArrow);
            },
        });
    });
    /**** Participant ****/
    /**** publish ****/
    let publishBtn = p_button(PIXI, {
        width: r(196),
        height: r(48),
        y: r(666),
        radius: r(4),
        color: 0x07c160,
    });
    let publishBtnText = p_text(PIXI, {
        content: "发布",
        fontSize: r(17),
        fill: 0xffffff,
        align: "center",
        relative_middle: {
            containerWidth: publishBtn.width,
            containerHeight: publishBtn.height,
        },
    });
    publishBtn.addChild(publishBtnText);
    publishBtn.onClickFn(() => {
        callBack({
            status: "publish",
            drawFn() {
                obj.fetchActivityList();
                window.router.navigateBack();
            },
        });
    });
    let publishBox = p_box(PIXI, {
        width: r(196),
        height: r(48),
        y: r(666),
        radius: r(4),
        background: {
            color: 0x07c160,
            alpha: 0.3,
        },
    });
    let publishBoxText = p_text(PIXI, {
        content: "发布",
        fontSize: r(17),
        fill: 0xffffff,
        align: "center",
        relative_middle: {
            containerWidth: publishBox.width,
            containerHeight: publishBox.height,
        },
    });
    publishBox.addChild(publishBoxText);
    /**** publish ****/
    container.addChild(goBack, title, api_name, underline, taskTitleText, taskTitleInput, taskDescText, taskDescBox, 
    // taskTitleBox,
    participantTitleText, BtnBox, publishBox);
    app.stage.addChild(container);
    return container;
}
;
