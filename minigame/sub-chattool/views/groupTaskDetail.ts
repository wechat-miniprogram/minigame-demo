/**
 * 群任务详情页 - 视图层
 */

import { deps } from '../index';
import * as logic from '../logic/groupTaskDetail';
import * as chattool from '../index';
import { ShareCanvas } from '../ShareCanvas';
import { DrawGroupTaskDetailOption } from '../shared/types';

export default function (PIXI: any, app: any, query: any) {
  const { p_button, p_text, p_box } = deps;
  const r = (value: number) => PIXI.ratio * value * 2;
  const container = new PIXI.Container();

  // 初始化 logic
  logic.init(query.activityId);

  // ========== 开放数据域 ==========
  const { screenWidth, pixelRatio } = wx.getSystemInfoSync();
  const SC = new ShareCanvas({ width: 343, height: 280, x: 16, y: 200, pixelRatio, scale: screenWidth / 375 });
  const tick = () => SC.rankTicker(PIXI, app);
  const ticker = PIXI.ticker.shared;

  // ========== 返回按钮 ==========
  const goBackBtn = p_button(PIXI, { x: r(16), y: r(20), width: r(60), height: r(30), alpha: 0 });
  goBackBtn.myAddChildFn(p_text(PIXI, { content: '< 返回', fontSize: r(16), fill: 0x576b95 }));
  goBackBtn.onClickFn(() => {
    destroyOpenDataContext();
    chattool.navigateBack();
  });

  // ========== 标题区域 ==========
  const titleText = p_text(PIXI, { content: '加载中...', fontSize: r(17), fill: 0x000000, x: r(16), y: r(70) });
  const detailText = p_text(PIXI, { content: '', fontSize: r(14), fill: 'rgba(0,0,0,0.7)', x: r(16), y: r(98) });

  // ========== 已参与/未参与 Tab ==========
  const tabBox = p_box(PIXI, { width: r(343), height: r(40), x: r(16), y: r(150) });
  const participatedTab = p_button(PIXI, { x: 0, width: r(170), height: r(40), alpha: 0, parentWidth: r(343) });
  const participatedTabText = p_text(PIXI, { content: '已参与', fontSize: r(16), fill: 0x07c160, relative_middle: { containerWidth: r(170), containerHeight: r(40) } });
  participatedTab.myAddChildFn(participatedTabText);
  participatedTab.onClickFn(() => {
    logic.switchToParticipated();
    participatedTabText.turnColors(0x07c160);
    notParticipatedTabText.turnColors('rgba(0,0,0,0.5)');
  });

  const notParticipatedTab = p_button(PIXI, { x: r(170), width: r(170), height: r(40), alpha: 0, parentWidth: r(343) });
  const notParticipatedTabText = p_text(PIXI, { content: '未参与', fontSize: r(16), fill: 'rgba(0,0,0,0.5)', relative_middle: { containerWidth: r(170), containerHeight: r(40) } });
  notParticipatedTab.myAddChildFn(notParticipatedTabText);
  notParticipatedTab.onClickFn(() => {
    logic.switchToNotParticipated();
    notParticipatedTabText.turnColors(0x07c160);
    participatedTabText.turnColors('rgba(0,0,0,0.5)');
  });
  tabBox.addChild(participatedTab, notParticipatedTab);

  // ========== 操作按钮 ==========
  const doTaskBtn = p_button(PIXI, { width: r(196), height: r(48), x: (r(375) - r(196)) / 2, y: r(520), radius: r(4), color: 0x07c160 });
  doTaskBtn.myAddChildFn(p_text(PIXI, { content: '做任务', fontSize: r(17), fill: 0xffffff, relative_middle: { containerWidth: r(196), containerHeight: r(48) } }));
  doTaskBtn.onClickFn(() => logic.doTask());

  const statusText = p_text(PIXI, { content: '', fontSize: r(17), fill: 'rgba(0,0,0,0.5)', x: r(16), y: r(530) });

  const endTaskBtn = p_button(PIXI, { x: r(260), y: r(70), width: r(80), height: r(28), alpha: 0 });
  endTaskBtn.myAddChildFn(p_text(PIXI, { content: '结束任务', fontSize: r(14), fill: 0x576b95 }));
  endTaskBtn.onClickFn(() => logic.earlyTerminate());

  const shareBtn = p_button(PIXI, { width: r(196), height: r(48), x: (r(375) - r(196)) / 2, y: r(580), radius: r(4), color: 0xf0f0f0 });
  const shareBtnText = p_text(PIXI, { content: '分享进度', fontSize: r(17), fill: 0x07c160, relative_middle: { containerWidth: r(196), containerHeight: r(48) } });
  shareBtn.myAddChildFn(shareBtnText);
  shareBtn.onClickFn(() => logic.handleShareOrNotify());

  // ========== 绑定 setter：logic 数据变化 → 更新 UI ==========
  logic.setOnDataRefresh((option: DrawGroupTaskDetailOption) => {
    titleText.turnText(`${option.taskTitle}，累积打${option.targetTaskNum}次`);
    detailText.turnText(`${option.participantCnt}人参与，进度${option.taskCnt}/${option.targetTaskNum}`);

    if (option.isFinished) {
      container.removeChild(doTaskBtn);
      statusText.turnText('已结束');
      container.addChild(statusText);
    } else if (!option.isParticipant) {
      container.removeChild(doTaskBtn);
      statusText.turnText('你无需参与');
      container.addChild(statusText);
    } else if (option.taskCnt >= option.targetTaskNum) {
      container.removeChild(doTaskBtn);
      statusText.turnText(option.isParticipated ? '任务已完成' : '未参与任务');
      container.addChild(statusText);
    } else {
      container.removeChild(statusText);
      container.addChild(doTaskBtn);
    }

    if (option.isOwner && !option.isFinished && option.taskCnt < option.targetTaskNum) {
      container.addChild(endTaskBtn);
    } else {
      container.removeChild(endTaskBtn);
    }

    if (option.isFinished || option.taskCnt >= option.targetTaskNum) {
      shareBtnText.turnText('分享结果');
    } else if (option.isUsingSpecify) {
      shareBtnText.turnText('提醒未参与的人');
    } else {
      shareBtnText.turnText('分享进度');
    }

    if (option.isUsingSpecify) {
      container.addChild(tabBox);
    } else {
      container.removeChild(tabBox);
    }
  });

  // 绑定开放数据域刷新
  logic.setOnOpenDataContextReady((data) => {
    if (!SC.sharedCanvasShowed) {
      SC.sharedCanvasShowed = true;
      ticker.add(tick);
    }
    SC.openDataContext.postMessage({
      event: 'renderGroupTaskMembersInfo',
      ...data,
    });
  });

  function destroyOpenDataContext() {
    SC.sharedCanvasShowed = false;
    ticker.remove(tick);
    SC.openDataContext.postMessage({ event: 'close' });
  }

  // ========== 组装 ==========
  container.addChild(goBackBtn, titleText, detailText, shareBtn);
  app.stage.addChild(container);

  // 启动
  logic.fetchActivity();

  return {
    container,
    onUnload() {
      destroyOpenDataContext();
      logic.reset();
    },
  };
}
