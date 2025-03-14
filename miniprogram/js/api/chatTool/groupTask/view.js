import { p_button, p_text, p_box, p_line } from "../../../libs/component/index";
import fixedTemplate from "../../../libs/template/fixed";

module.exports = function (PIXI, app, obj, callBack) {
  const r = (value) => {
    return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
  };

  const contentWidth = r(322);

  let container = new PIXI.Container(),
    { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(
      PIXI,
      {
        obj,
        title: "聊天工具",
        api_name: "群任务",
      }
    );
  /**** taskList ****/
  // 任务列表
  let taskListBox = p_box(PIXI, {
    width: contentWidth,
    height: r(413),
    y: r(171),
    radius: r(8),
  });
  // 任务列表提示
  let taskListBoxPrompt = p_text(PIXI, {
    content: "当前暂无任务",
    fontSize: r(17),
    fill: "rgba(0,0,0,0.5)",
    align: "center",
    relative_middle: {
      containerWidth: taskListBox.width,
      containerHeight: taskListBox.height,
    },
  });
  function taskButton(parent, lastButton) {
    return p_button(PIXI, {
      parentWidth: parent.width,
      width: contentWidth,
      color: 0xffffff,
      y: lastButton ? lastButton.y + lastButton.height : 0,
      height: r(63 + 1),
      radius: r(8),
    });
  }
  function taskButtonText(container) {
    return p_text(PIXI, {
      content: "群任务",
      x: r(16),
      fontSize: r(17),
      fill: 0x000000,
      align: "center",
      relative_middle: {
        containerHeight: container.height,
      },
    });
  }
  function taskButtonArrow(container) {
    return p_text(PIXI, {
      content: " >",
      x: r(291),
      fontSize: r(17),
      fill: 0x000000,
      align: "center",
      relative_middle: {
        containerHeight: container.height,
      },
    });
  }
  function taskButtonLine() {
    return p_line(
      PIXI,
      {
        width: r(1),
        color: 0x000000,
        alpha: 0.1,
      },
      [r(16), r(63.5)],
      [r(290), 0]
    );
  }
  let taskButtonList = [];
  let previousButton = null;

  for (let i = 0; i < 5; i++) {
    let button = taskButton(taskListBox, previousButton);
    button.addChild(taskButtonText(button));
    button.addChild(taskButtonArrow(button));
    button.addChild(taskButtonLine());
    taskButtonList.push(button);
    previousButton = button;
  }

  taskListBox.addChild(taskListBoxPrompt);
  /**** taskList ****/

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
        setTimeout(() => {
          window.router.navigateTo("createGroupTask", { onCreateTaskSuccess });
        }, 0);
      },
    });
  });
  /**** createGroupTaskBtn ****/

  // 一定要加这个reload, 否则会报错
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
    taskListBox,
    createGroupTaskBtn,
    logo,
    logoName
  );
  app.stage.addChild(container);

  function onCreateTaskSuccess() {
    createGroupTaskBtnText.turnText("创建新任务");
    taskListBox.addChild(taskButtonList[obj.taskButtonCount - 1]);
    taskListBox.removeChild(taskListBoxPrompt);
  }

  return container;
};
