import {
  p_button,
  p_text,
  p_box,
  p_img,
  p_line,
} from "../../../../libs/component/index";
import fixedTemplate from "../../../../libs/template/fixed";

export default function (PIXI: any, app: any, obj: any, callBack: (data: any) => void) {
  const r = (value: number) => {
    return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
  };

  let container = new PIXI.Container(),
    { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(
      PIXI,
      {
        obj,
        title: "创建任务",
        api_name: "群任务",
      }
    );

  const contentWidth = r(322);

  /**** taskTitle ****/
  // 任务示例标题
  let taskTitleText = p_text(PIXI, {
    content: "任务（此处为示例）",
    x: r(26),
    y: r(155),
    fontSize: r(14),
    fill: "rgba(0,0,0,0.5)",
    align: "center",
  });
  // 任务示例
  let taskTitleBox = p_box(PIXI, {
    width: contentWidth,
    height: r(72),
    y: r(179),
    radius: r(8),
  });
  // 任务示例文字
  let taskTitleBoxText = p_text(PIXI, {
    content: "加入boss战，累积打5次",
    fontSize: r(17),
    fill: 0x000000,
    align: "center",
    relative_middle: {
      containerWidth: taskTitleBox.width,
      containerHeight: taskTitleBox.height,
    },
  });

  taskTitleBox.addChild(taskTitleBoxText);
  /**** taskTitle ****/

  /**** Participant ****/
  // 参与人标题
  let participantTitleText = p_text(PIXI, {
    content: "参与人",
    x: r(26),
    y: r(263),
    fontSize: r(14),
    fill: "rgba(0,0,0,0.5)",
    align: "center",
  });
  let BtnBox = p_box(PIXI, {
    width: contentWidth,
    height: r(134),
    y: r(287),
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
  let splitLine = p_line(
    PIXI,
    {
      width: r(0.5),
      color: 0x000000,
      alpha: 0.1,
    },
    [0, allParticipantBtn.y + allParticipantBtn.height],
    [contentWidth, 0]
  );
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
      },
    });
  });

  specifyParticipantBtn.addChild(specifyParticipantBtnTitleText);
  specifyParticipantBtn.addChild(specifyParticipantBtnDescText);
  specifyParticipantBtn.onClickFn(() => {
    callBack({
      status: "specifyParticipant",
      drawFn(participantCnt: number) {
        specifyParticipantBtn.addChild(specifyParticipantSelectedImg);
        allParticipantBtn.removeChild(allParticipantSelectedImg);
        specifyParticipantBtnTitleText.turnText(
          `指定参与人：${participantCnt} >`
        );
      },
    });
  });
  /**** Participant ****/

  /**** publish ****/
  let publishBtn = p_button(PIXI, {
    width: r(196),
    height: r(48),
    color: 0x07c160,
    y: BtnBox.y + BtnBox.height + r(245),
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
        // @ts-ignore 框架遗留问题
        window.router.navigateBack();
      },
    });
  });
  /**** publish ****/

  // 一定要加这个reload, 否则会报错
  // @ts-ignore 框架遗留问题
  window.router.getNowPage((page: any) => {
    page.reload = function () {
      logo.reloadImg({ src: "images/logo.png" });
    };
  });

  container.addChild(
    goBack,
    title,
    api_name,
    underline,
    taskTitleText,
    taskTitleBox,
    participantTitleText,
    BtnBox,
    publishBtn,
    logo,
    logoName
  );
  app.stage.addChild(container);

  return container;
};
