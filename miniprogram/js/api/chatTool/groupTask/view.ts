import {
  p_button,
  p_text,
  p_box,
  p_scroll,
  p_line,
  p_img,
} from "../../../libs/component/index";
import fixedTemplate from "../../../libs/template/fixed";
import { ActivityInfo, CreateTaskButtonOption } from "./types";
import { openChatTool } from "./util";

export default function (PIXI: any, app: any, obj: any, callBack: (data: any) => void) {
  const r = (value: any) => {
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
  let taskList = p_scroll(PIXI, {
    width: contentWidth,
    height: r(413),
    x: 0,
    y: 0,
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

  function taskButton(option: CreateTaskButtonOption) {
    console.log('!!! taskButton', option);
    const { buttonNumber, activityId, roomid, chatType, taskTitle } = option;
    let button = p_button(PIXI, {
      parentWidth: taskList.width,
      width: contentWidth,
      alpha: 0,
      y: buttonNumber * r(63 + 1),
      height: r(63 + 1),
    });
    button.myAddChildFn(
      p_text(PIXI, {
        content: taskTitle,
        x: r(16),
        fontSize: r(17),
        fill: 0x000000,
        align: "center",
        relative_middle: {
          containerHeight: button.height,
        },
      }),
      p_img(PIXI, {
        width: r(7.5),
        height: r(13),
        x: r(295),
        src: 'images/right_arrow.png',
        relative_middle: {
          containerHeight: button.height
        },
      }),
      p_line(
        PIXI,
        {
          width: r(1),
          height: r(0.5),
          color: 0x000000,
          alpha: 0.1,
        },
        [r(16), r(63.5)],
        [r(290), 0]
      )
    );
    button.onClickFn(() => {
      openChatTool(
        roomid,
        chatType,
        (res: any) => {
          console.log('!!! openChatTool success', res);
          // @ts-ignore 框架遗留
          window.router.navigateTo("groupTaskDetail", {
            activityId,
          });
        },
        (err: any) => {
          console.error('!!! openChatTool fail: ', err);
        }
      )
    });
    return button;
  }
  function reloadButtons(activityList: ActivityInfo[]) {
    if (activityList.length === 0) {
      taskListBox.addChild(taskListBoxPrompt);
    } else {
      taskListBox.removeChild(taskListBoxPrompt);
      for (let i = 0; i < activityList.length; i++) {
        taskList.myAddChildFn(taskButton({
          buttonNumber: i,
          activityId: activityList[i].activityId || '',
          roomid: activityList[i].roomid || '',
          chatType: activityList[i].chatType || 3,
          taskTitle: activityList[i].taskTitle || '示例'
        }));
      }
    }
  }
  function fetchActivityList() {
    callBack({
      status: "fetchActivityList",
      drawFn(activityList: ActivityInfo[]) {
        reloadButtons(activityList);
      },
    });
  }

  taskListBox.addChild(taskList);
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
      status: "createTask",
      drawFn() {
        // @ts-ignore 框架遗留
        window.router.navigateTo("createGroupTask", {
          fetchActivityList, // 创建成功后刷新任务列表
        });
      },
    });
  });
  /**** createGroupTaskBtn ****/

  /**** 刷新任务列表 ****/
  let refreshTaskBtn = p_button(PIXI, {
    width: r(196),
    height: r(48),
    y: r(608 + 48 + 24),
    radius: r(4),
    color: 0x07c160,
  });
  refreshTaskBtn.myAddChildFn(p_text(PIXI, {
    content: "刷新任务列表",
    fontSize: r(17),
    fill: 0xffffff,
    relative_middle: {
      containerWidth: refreshTaskBtn.width,
      containerHeight: refreshTaskBtn.height,
    },
  }));
  refreshTaskBtn.onClickFn(() => {
    fetchActivityList();
  });
  /**** 刷新任务列表 ****/

  fetchActivityList();

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
    taskListBox,
    createGroupTaskBtn,
    // refreshTaskBtn,
    logo,
    logoName
  );
  app.stage.addChild(container);

  return container;
};
