import { p_button, p_text, p_box } from "../../../libs/component/index";
import fixedTemplate from "../../../libs/template/fixed";

module.exports = function (PIXI, app, obj, callBack) {
  const r = (value) => {
    return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
  };

  let container = new PIXI.Container(),
    { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(
      PIXI,
      {
        obj,
        title: "聊天工具",
        api_name: "群任务",
      }
    );
  /**** taskBox ****/
  // 任务列表
  let taskBox = p_box(PIXI, {
    width: r(322),
    height: r(413),
    y: r(171),
    radius: r(8),
  });
  // 任务列表提示
  let taskBoxPrompt = p_text(PIXI, {
    content: "当前暂无任务",
    fontSize: r(17),
    fill: "rgba(0,0,0,0.5)",
    align: "center",
    lineHeight: r(24),
    relative_middle: {
      containerWidth: taskBox.width,
      containerHeight: taskBox.height,
    },
  });

  taskBox.addChild(taskBoxPrompt);
  /**** taskBox ****/

  /**** createGroupTaskBtn ****/
  let createGroupTaskBtn = p_button(PIXI, {
    width: r(196),
    height: r(48),
    y: r(608),
    radius: r(4),
    color: 0x07c160,
  });
  let createGroupTaskBtnText = p_text(PIXI, {
    content: "创建任务",
    fontSize: r(17),
    fill: 0xffffff,
    relative_middle: {
      containerWidth: createGroupTaskBtn.width,
      containerHeight: createGroupTaskBtn.height,
    },
  });
  createGroupTaskBtn.myAddChildFn(createGroupTaskBtnText);
  createGroupTaskBtn.onClickFn(() => {
    callBack({
      status: "openChatTool",
      drawFn() {
        createGroupTaskBtnText.turnText("创建新任务");
        // window.router.delPage();
        setTimeout(() => {
          window.router.navigateTo("showModal", {});
        }, 0);
      },
    });
  });
  /**** createGroupTaskBtn ****/

  window.router.getNowPage((page) => {
    page.reload = function () {
      logo.reloadImg({ src: "images/logo.png" });
    };
  });

  container.addChild(
    goBack,
    title,
    api_name,
    underline,
    taskBox,
    createGroupTaskBtn,
    logo,
    logoName
  );
  app.stage.addChild(container);

  return container;
};
