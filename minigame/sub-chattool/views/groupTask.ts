/**
 * 群任务列表页 - 视图层
 */

import { deps } from '../index';
import * as logic from '../logic/groupTask';
import * as chattool from '../index';
import { ActivityInfo, CreateTaskButtonOption } from '../shared/types';

export default function (PIXI: any, app: any, _query: any) {
  const { p_button, p_text, p_box, p_scroll, p_line, p_img } = deps;
  const r = (value: number) => PIXI.ratio * value * 2;
  const contentWidth = r(322);
  const container = new PIXI.Container();

  // ========== 返回按钮（避开左上角调试信息区域）==========
  const goBackBtn = p_button(PIXI, { x: r(16), y: r(36), width: r(60), height: r(30), alpha: 0 });
  goBackBtn.myAddChildFn(p_text(PIXI, { content: '< 返回', fontSize: r(16), fill: 0x576b95 }));
  goBackBtn.onClickFn(() => chattool.navigateBack());

  // ========== 标题 ==========
  const titleText = p_text(PIXI, {
    content: '聊天工具 - 群活动', fontSize: r(20), fill: 0x000000, x: r(26), y: r(76), fontWeight: 'bold',
  });

  // ========== 任务列表 ==========
  const taskListBox = p_box(PIXI, { width: contentWidth, height: r(413), x: r(26), y: r(136), radius: r(8) });
  // scroll 必须显式设置 x:0 y:0，否则默认 x=(canvas.width-width)/2 会导致内容在 box 内部偏移
  const taskList = p_scroll(PIXI, { width: contentWidth, height: r(413), x: 0, y: 0 });
  const taskListPrompt = p_text(PIXI, {
    content: '当前暂无任务', fontSize: r(17), fill: 'rgba(0,0,0,0.5)',
    relative_middle: { containerWidth: taskListBox.width, containerHeight: taskListBox.height },
  });
  taskListBox.addChild(taskList);
  taskListBox.addChild(taskListPrompt);

  function createTaskButton(option: CreateTaskButtonOption) {
    const { buttonNumber, activityId, roomid, chatType, taskTitle } = option;
    const button = p_button(PIXI, { parentWidth: taskList.width, width: contentWidth, alpha: 0, y: buttonNumber * r(64), height: r(64) });
    button.myAddChildFn(
      p_text(PIXI, { content: taskTitle, x: r(16), fontSize: r(17), fill: 0x000000, relative_middle: { containerHeight: button.height } }),
      p_img(PIXI, { width: r(7.5), height: r(13), x: r(295), src: 'images/right_arrow.png', relative_middle: { containerHeight: button.height } }),
      p_line(PIXI, { width: r(1), height: r(0.5), color: 0x000000, alpha: 0.1 }, [r(16), r(63.5)], [r(290), 0]),
    );
    button.onClickFn(() => {
      logic.openChatToolThen(() => {
        chattool.navigateTo('groupTaskDetail', { activityId });
      }, { roomid, chatType });
    });
    return button;
  }

  function reloadButtons(list: ActivityInfo[]) {
    // 注意：不能用 taskList.removeChildren()，那会删除 scroll 内部的 container 和 mask，
    // 导致整个滚动容器崩溃。必须用 myRemoveChildrenFn 只清空内容区域。
    taskList.myRemoveChildrenFn(0);
    if (list.length === 0) {
      if (!taskListBox.children.includes(taskListPrompt)) {
        taskListBox.addChild(taskListPrompt);
      }
    } else {
      if (taskListBox.children.includes(taskListPrompt)) {
        taskListBox.removeChild(taskListPrompt);
      }
      list.forEach((item, i) => {
        taskList.myAddChildFn(createTaskButton({
          buttonNumber: i,
          activityId: item.activityId || '',
          roomid: item.roomid || '',
          chatType: item.chatType || 3,
          taskTitle: item.taskTitle || '示例',
        }));
      });
    }
  }

  // ========== 绑定 setter：logic 数据变化 → 更新 UI ==========
  logic.setOnListUpdate((list) => reloadButtons(list));

  // ========== 创建任务按钮 ==========
  const createGroupTaskBtn = p_button(PIXI, { width: r(196), height: r(48), x: (r(375) - r(196)) / 2, y: r(576), radius: r(4), color: 0x07c160 });
  createGroupTaskBtn.myAddChildFn(p_text(PIXI, {
    content: '创建任务', fontSize: r(17), fill: 0xffffff,
    relative_middle: { containerWidth: createGroupTaskBtn.width, containerHeight: createGroupTaskBtn.height },
  }));
  createGroupTaskBtn.onClickFn(() => {
    logic.openChatToolThen(() => {
      chattool.navigateTo('createGroupTask', { fetchActivityList: logic.fetchActivityList });
    });
  });

  // ========== 刷新按钮 ==========
  const refreshBtn = p_button(PIXI, { width: r(196), height: r(48), x: (r(375) - r(196)) / 2, y: r(636), radius: r(4), color: 0x07c160 });
  refreshBtn.myAddChildFn(p_text(PIXI, {
    content: '刷新任务列表', fontSize: r(17), fill: 0xffffff,
    relative_middle: { containerWidth: refreshBtn.width, containerHeight: refreshBtn.height },
  }));
  refreshBtn.onClickFn(() => logic.fetchActivityList());

  // ========== 组装 ==========
  container.addChild(goBackBtn, titleText, taskListBox, createGroupTaskBtn, refreshBtn);
  app.stage.addChild(container);

  // 启动
  logic.fetchActivityList();

  return {
    container,
    onUnload() { logic.reset(); },
  };
}
