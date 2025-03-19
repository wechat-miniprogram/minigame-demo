const {
  p_button,
  p_text,
  p_box,
  p_img,
  p_line,
  p_scroll,
} = require("../../../../libs/component/index");
const fixedTemplate = require("../../../../libs/template/fixed");

module.exports = function (PIXI: any, app: any, obj: any, callBack: (data: any) => void) {
  const r = (value: any) => {
    return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
  };

  const { activityId, groupName, isAuthor } = obj;

  let container = new PIXI.Container(),
    { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(
      PIXI,
      {
        obj,
        title: "聊天工具",
        api_name: groupName,
      }
    );

  const contentWidth = r(343);

  /**** title ****/
  // 任务标题
  let taskTitleText = p_text(PIXI, {
    content: "加入boss战，累积打5次",
    x: r(16),
    y: r(155),
    fontSize: r(17),
    fill: 0x000000,
    align: "center",
  });
  // 任务详情
  let taskDetailText = p_text(PIXI, {
    content: "0人参与，进度0/5",
    x: r(16),
    y: r(181),
    fontSize: r(14),
    fill: "rgba(0,0,0,0.7)",
    align: "center",
  });
  // 结束任务
  let endTaskBtn = p_button(PIXI, {
    width: r(56),
    height: r(20),
    x: r(149),
    y: r(181),
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
      drawFn() {
        // @ts-ignore 框架遗留
        window.router.navigateBack();
      },
    });
  });
  // 分享按钮
  let shareBtn = p_button(PIXI, {
    width: r(24),
    height: r(24),
    x: r(335),
    y: r(155),
    alpha: 0,
  });
  let shareBtnImg = p_img(PIXI, {
    src: "images/ic-line-iconsd-share.png",
    width: r(24),
    height: r(24),
  });
  shareBtn.addChild(shareBtnImg);
  shareBtn.onClickFn(() => {
    callBack({
      status: "share",
      drawFn() { },
    });
  });
  /**** title ****/

  /**** participant ****/
  let participantBox = p_box(PIXI, {
    width: contentWidth,
    height: r(329),
    x: r(16),
    y: r(231),
  });
  // 已参与按钮
  let participatedBtn = p_button(PIXI, {
    width: r(170),
    height: r(46),
    x: 0,
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

  // 成员列表
  let memberList = p_scroll(PIXI, {
    width: contentWidth,
    height: r(329 - 46),
    x: 0,
    y: r(46),
  });
  let memberListPrompt = p_text(PIXI, {
    content: "暂无参与记录",
    fontSize: r(16),
    fill: "rgba(0,0,0,0.3)",
    align: "center",
    relative_middle: {
      containerHeight: memberList.height,
      containerWidth: memberList.width,
    },
  });
  memberList.addChild(memberListPrompt);
  participantBox.addChild(participatedBtn, notParticipatedBtn, memberList);
  /**** participant ****/

  function showList(participantList: any, hasDesignatedPerson: boolean) {
    // 如果是发起人，则显示结束任务按钮
    if (isAuthor) {
      container.addChild(endTaskBtn);
    } else {
      container.removeChild(endTaskBtn);
    }

    participantBox.removeChild(memberList).destroy(true);
    memberList = p_scroll(PIXI, {
      width: contentWidth,
      height: r(329 - 46),
      x: 0,
      y: r(46),
    });
    if (hasDesignatedPerson) {
      memberList.addChild(memberList);
      memberListPrompt.hideFn();
    } else {
      memberList.addChild(memberListPrompt);
    }
    for (let i = 0, len = participantList.length; i < len; i++) {
      let participant = participantList[i];
      let participantItem = p_text(PIXI, {
        content: participant,
      });
    }
  }

  // 一定要加这个reload, 否则会报错
  // @ts-ignore 框架遗留
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
    taskDetailText,
    endTaskBtn,
    shareBtn,
    participantBox,
    logo,
    logoName
  );
  app.stage.addChild(container);

  return container;
};
