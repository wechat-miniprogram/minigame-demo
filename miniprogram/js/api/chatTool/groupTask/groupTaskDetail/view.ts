import {
  p_button,
  p_text,
  p_box,
  p_img,
  p_line,
} from "../../../../libs/component/index";
import fixedTemplate from "../../../../libs/template/fixed";
import { DrawGroupTaskDetailOption } from "../types";

export default function (PIXI: any, app: any, obj: any, callBack: (data: any) => void) {
  const r = (value: any) => {
    return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
  };

  let container = new PIXI.Container(),
    { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(
      PIXI,
      {
        obj,
        title: "群活动",
        api_name: "示例",
      }
    );

  const contentWidth = r(343);

  /**** title ****/
  // 任务标题
  let taskTitleText = p_text(PIXI, {
    content: "加入boss战，累积打5次",
    x: r(16),
    y: r(115),
    fontSize: r(17),
    fill: 0x000000,
    align: "center",
  });
  // 任务详情
  let taskDetailText = p_text(PIXI, {
    content: "0人参与，进度0/5",
    x: r(16),
    y: r(143),
    fontSize: r(14),
    fill: "rgba(0,0,0,0.7)",
    align: "center",
  });
  // 结束任务
  let endTaskBtn = p_button(PIXI, {
    x: r(149),
    y: r(143),
    width: r(56),
    height: r(20),
    alpha: 0,
  });
  let endTaskBtnText = p_text(PIXI, {
    content: "结束任务",
    fontSize: r(14),
    fill: 0x576b95,
    align: "center",
  });
  endTaskBtn.addChild(endTaskBtnText);
  endTaskBtn.onClickFn(() => {
    callBack({
      status: "endTask",
    });
  });
  // 分享按钮
  let smallShareBtn = p_button(PIXI, {
    x: r(335),
    y: r(115),
    width: r(24),
    height: r(24),
    alpha: 0,
  });
  let shareBtnImg = p_img(PIXI, {
    src: "images/ic-line-iconsd-share.png",
    width: r(24),
    height: r(24),
  });
  smallShareBtn.addChild(shareBtnImg);
  smallShareBtn.onClickFn(() => {
    callBack({
      status: "smallShare",
    });
  });
  /**** title ****/

  /**** participant ****/
  let participantBox = p_box(PIXI, {
    x: r(16),
    y: r(187),
    width: contentWidth,
    height: r(329),
  });
  // 已参与按钮
  let participatedBtn = p_button(PIXI, {
    x: 0,
    width: r(170),
    height: r(46),
    alpha: 0,
  });
  let participatedBtnText = p_text(PIXI, {
    content: "已参与",
    fontSize: r(16),
    fontWeight: 500,
    fill: 0x07c160,
    align: "center",
    relative_middle: {
      containerHeight: participatedBtn.height,
      containerWidth: participatedBtn.width,
    },
  });
  let participatedBtnLine = p_line(
    PIXI,
    {
      width: r(2),
      color: 0x07c160,
    },
    [r(73), participatedBtn.height],
    [r(24), 0]
  );
  participatedBtn.addChild(participatedBtnText, participatedBtnLine);
  // 未参与按钮
  let notParticipatedBtn = p_button(PIXI, {
    width: r(170),
    height: r(46),
    x: participatedBtn.width,
    alpha: 0,
  });
  let notParticipatedBtnText = p_text(PIXI, {
    content: "未参与",
    fontSize: r(16),
    fontWeight: 500,
    fill: "rgba(0,0,0,0.5)",
    align: "center",
    relative_middle: {
      containerHeight: notParticipatedBtn.height,
      containerWidth: notParticipatedBtn.width,
    },
  });
  let notParticipatedBtnLine = p_line(
    PIXI,
    {
      width: r(2),
      color: 0x07c160,
    },
    [r(73), notParticipatedBtn.height],
    [r(24), 0]
  );
  notParticipatedBtn.addChild(notParticipatedBtnText);
  participatedBtn.onClickFn(() => {
    callBack({
      status: "participated",
      drawFn() {
        participatedBtnText.turnColors(0x07c160);
        participatedBtn.addChild(participatedBtnLine);
        notParticipatedBtnText.turnColors("rgba(0,0,0,0.5)");
        notParticipatedBtn.removeChild(notParticipatedBtnLine);
      },
    });
  });
  notParticipatedBtn.onClickFn(() => {
    callBack({
      status: "notParticipated",
      drawFn() {
        notParticipatedBtnText.turnColors(0x07c160);
        notParticipatedBtn.addChild(notParticipatedBtnLine);
        participatedBtnText.turnColors("rgba(0,0,0,0.5)");
        participatedBtn.removeChild(participatedBtnLine);
      },
    });
  });
  /**** participant ****/

  /**** Buttons ****/
  // 做任务
  let doTaskBtn = p_button(PIXI, {
    y: r(543),
    width: r(196),
    height: r(48),
    color: 0x07c160,
    radius: r(4),
  });
  let doTaskBtnText = p_text(PIXI, {
    content: "做任务",
    fontSize: r(17),
    fill: 0xffffff,
    align: "center",
    relative_middle: {
      containerWidth: doTaskBtn.width,
      containerHeight: doTaskBtn.height,
    },
  });
  doTaskBtn.addChild(doTaskBtnText);
  doTaskBtn.onClickFn(() => {
    callBack({
      status: "doTask",
    });
  });
  // 任务已完成/已结束/未参与任务
  let taskFinishedBox = p_box(PIXI, {
    y: r(543),
    width: r(196),
    height: r(48),
    background: {
      color: 0x07c160,
      alpha: 0.3,
    },
    radius: r(4),
  });
  let taskFinishedBoxText = p_text(PIXI, {
    content: "任务已完成",
    fontSize: r(17),
    fill: 0xffffff,
    align: "center",
    relative_middle: {
      containerWidth: taskFinishedBox.width,
      containerHeight: taskFinishedBox.height,
    },
  });
  taskFinishedBox.addChild(taskFinishedBoxText);
  // 提醒未参与的人/分享结果/分享进度
  let Btn2 = p_button(PIXI, {
    y: r(603),
    width: r(196),
    height: r(48),
    color: 0x000000,
    alpha: 0.05,
    radius: r(4),
  });
  let Btn2Text = p_text(PIXI, {
    content: "提醒未参与的人",
    fontSize: r(17),
    fill: 0x07c160,
    align: "center",
    relative_middle: {
      containerWidth: Btn2.width,
      containerHeight: Btn2.height,
    },
  });
  Btn2.addChild(Btn2Text);
  Btn2.onClickFn(() => {
    callBack({
      status: "Btn2",
    });
  });
  // 分享进度
  let shareBtn = p_button(PIXI, {
    y: r(663),
    width: r(196),
    height: r(48),
    color: 0x000000,
    alpha: 0.05,
    radius: r(4),
  });
  let shareBtnText = p_text(PIXI, {
    content: "分享进度",
    fontSize: r(17),
    fill: 0x07c160,
    align: "center",
    relative_middle: {
      containerWidth: shareBtn.width,
      containerHeight: shareBtn.height,
    },
  });
  shareBtn.addChild(shareBtnText);
  shareBtn.onClickFn(() => {
    callBack({
      status: "shareResult",
    });
  });

  function clearDraw() {
    console.log('!!! clearDraw');
    container.removeChild(endTaskBtn);
    participantBox.removeChild(participatedBtn);
    participantBox.removeChild(notParticipatedBtn);
    container.removeChild(taskFinishedBox);
    container.removeChild(doTaskBtn);
    container.removeChild(Btn2);
    container.removeChild(shareBtn);
    callBack({
      status: "destroyOpenDataContext",
    });
  }

  function doTaskBtnRefresh(isBtnAvailable: boolean) {
    if (isBtnAvailable) {
      container.addChild(doTaskBtn);
      container.removeChild(taskFinishedBox);
    } else {
      container.addChild(taskFinishedBox);
      container.removeChild(doTaskBtn);
    }
  }

  function refreshDraw(option: DrawGroupTaskDetailOption) {
    const { isOwner, isUsingSpecify, participantCnt,
      taskCnt, targetTaskNum, isFinished,
      isParticipated, taskTitle, isParticipant } = option;
    api_name.turnText(taskTitle);
    // 如果是发起人并且任务未结束，则显示结束任务按钮
    if (isOwner && !isFinished && taskCnt < targetTaskNum) {
      container.addChild(endTaskBtn);
    } else {
      container.removeChild(endTaskBtn);
    }
    // 文字描述
    taskTitleText.turnText(`加入boss战，累积打${targetTaskNum}次`)
    taskDetailText.turnText(`${participantCnt}人参与，进度${taskCnt}/${targetTaskNum}`)

    // 做任务按钮
    if (isFinished) { // 已结束
      doTaskBtnRefresh(false);
      taskFinishedBoxText.turnText("已结束")
    } else {
      if (!isParticipant) {
        doTaskBtnRefresh(false);
        taskFinishedBoxText.turnText("你无需参与")
      } else if (taskCnt < targetTaskNum) { // 做任务
        doTaskBtnRefresh(true);
      } else { // 任务已完成/未参与任务
        doTaskBtnRefresh(false);
        if (!isParticipated) {
          taskFinishedBoxText.turnText("未参与任务")
        } else {
          taskFinishedBoxText.turnText("任务已完成")
        }
      }
    }

    container.addChild(Btn2);
    // 已指定参与人
    if (isUsingSpecify) {
      // 已参与/未参与
      participantBox.addChild(participatedBtn);
      participantBox.addChild(notParticipatedBtn);
      // 第二个按钮
      if (isFinished || taskCnt >= targetTaskNum) { // 已结束/已完成
        Btn2Text.turnText("分享结果")
        container.removeChild(shareBtn);
      } else { // 进行中
        Btn2Text.turnText("提醒未参与的人")
        container.addChild(shareBtn); // 只有进行中才显示第三个按钮
      }
    } else { // 未指定参与人
      // 已参与/未参与
      participantBox.removeChild(participatedBtn);
      participantBox.removeChild(notParticipatedBtn);
      // 分享进度
      container.removeChild(shareBtn);
      // 第二个按钮
      if (isFinished || taskCnt >= targetTaskNum) { // 已结束/已完成
        Btn2Text.turnText("分享结果")
      } else { // 进行中
        Btn2Text.turnText("分享进度")
      }
    }
  }

  function detailRefresh() {
    clearDraw();
    callBack({
      status: "refresh",
      drawFn(option: DrawGroupTaskDetailOption) {
        refreshDraw(option);
      }
    })
  }

  detailRefresh();

  // 点击返回按钮时销毁开放数据域
  goBack.callBack = clearDraw;

  container.addChild(
    goBack,
    title,
    // api_name,
    // underline,
    taskTitleText,
    taskDetailText,
    smallShareBtn,
    participantBox,
  );
  app.stage.addChild(container);

  return container;
};
