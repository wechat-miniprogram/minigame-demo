/**
 * 创建群任务页 - 视图层
 */

import { deps } from '../index';
import * as logic from '../logic/createGroupTask';
import * as chattool from '../index';

export default function (PIXI: any, app: any, query: any) {
  const { p_button, p_text, p_box, p_textarea } = deps;
  const r = (value: number) => PIXI.ratio * value * 2;
  const container = new PIXI.Container();
  const contentWidth = r(322);

  // ========== 返回按钮 ==========
  const goBackBtn = p_button(PIXI, { x: r(16), y: r(20), width: r(60), height: r(30), alpha: 0 });
  goBackBtn.myAddChildFn(p_text(PIXI, { content: '< 返回', fontSize: r(16), fill: 0x576b95 }));
  goBackBtn.onClickFn(() => chattool.navigateBack());

  // ========== 标题 ==========
  const titleText = p_text(PIXI, { content: '创建群任务', fontSize: r(20), fill: 0x000000, x: r(26), y: r(60), fontWeight: 'bold' });

  // ========== 活动名输入框 ==========
  const taskTitleLabel = p_text(PIXI, { content: '活动名', x: r(26), y: r(110), fontSize: r(14), fill: 'rgba(0,0,0,0.5)' });
  const taskTitleInput = p_textarea(PIXI, {
    width: contentWidth, height: r(72), x: r(26), y: r(134), radius: r(8), fontSize: r(17), padding: r(13),
    placeholder: { content: '请输入活动名', color: 'rgba(0,0,0,0.3)' },
  });
  taskTitleInput.initFn({
    onComplete(text: string) {
      logic.setTaskTitle(text);
      publishBtn.visible = text.length > 0;
    },
  });

  // ========== 任务描述（示例） ==========
  const taskDescLabel = p_text(PIXI, { content: '任务（此处为示例）', x: r(26), y: r(230), fontSize: r(14), fill: 'rgba(0,0,0,0.5)' });
  const taskDescBox = p_box(PIXI, { width: contentWidth, height: r(72), x: r(26), y: r(254), radius: r(8) });
  taskDescBox.addChild(p_text(PIXI, {
    content: '加入boss战，累计打5次', fontSize: r(17), fill: 0x000000,
    relative_middle: { containerHeight: taskDescBox.height, containerWidth: taskDescBox.width },
  }));

  // ========== 参与人选择 ==========
  const participantLabel = p_text(PIXI, { content: '参与人', x: r(26), y: r(345), fontSize: r(14), fill: 'rgba(0,0,0,0.5)' });

  const allBtn = p_button(PIXI, { width: contentWidth, height: r(56), x: r(26), y: r(369), color: 0xffffff, radius: r(8) });
  const allBtnText = p_text(PIXI, { content: '全员可参与 ✓', fontSize: r(17), fill: 0x000000, x: r(16), relative_middle: { containerHeight: allBtn.height } });
  allBtn.myAddChildFn(allBtnText);
  allBtn.onClickFn(() => {
    logic.selectAllParticipant();
    allBtnText.turnText('全员可参与 ✓');
    specifyBtnText.turnText('指定参与人');
  });

  const specifyBtn = p_button(PIXI, { width: contentWidth, height: r(56), x: r(26), y: r(427), color: 0xffffff, radius: r(8) });
  const specifyBtnText = p_text(PIXI, { content: '指定参与人', fontSize: r(17), fill: 0x000000, x: r(16), relative_middle: { containerHeight: specifyBtn.height } });
  specifyBtn.myAddChildFn(specifyBtnText);
  specifyBtn.onClickFn(() => logic.selectSpecifyParticipant());

  // 绑定 setter：选人成功 → 更新按钮文案
  logic.setOnParticipantUpdate((count) => {
    specifyBtnText.turnText(`指定参与人：${count}人 ✓`);
    allBtnText.turnText('全员可参与');
  });

  // ========== 发布按钮 ==========
  const publishBtn = p_button(PIXI, { width: r(196), height: r(48), x: (r(375) - r(196)) / 2, y: r(530), radius: r(4), color: 0x07c160 });
  publishBtn.myAddChildFn(p_text(PIXI, {
    content: '发布', fontSize: r(17), fill: 0xffffff,
    relative_middle: { containerWidth: publishBtn.width, containerHeight: publishBtn.height },
  }));
  publishBtn.visible = false;
  publishBtn.onClickFn(() => logic.publish());

  // 绑定 setter：发布成功 → 回到列表页并刷新
  logic.setOnPublishSuccess(() => {
    query?.fetchActivityList?.();
    chattool.navigateBack();
  });

  // ========== 组装 ==========
  container.addChild(goBackBtn, titleText, taskTitleLabel, taskTitleInput, taskDescLabel, taskDescBox, participantLabel, allBtn, specifyBtn, publishBtn);
  app.stage.addChild(container);

  return {
    container,
    onUnload() { logic.reset(); },
  };
}
