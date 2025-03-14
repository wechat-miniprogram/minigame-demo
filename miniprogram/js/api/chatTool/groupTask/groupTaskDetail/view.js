import {
  p_button,
  p_text,
  p_box,
  p_img,
  p_line,
} from "../../../../libs/component/index";
import fixedTemplate from "../../../../libs/template/fixed";

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
        api_name: "抓羊大队",
      }
    );

  const contentWidth = r(322);

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
        window.router.navigateBack();
      },
    });
  });
  /**** title ****/

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
    taskTitleText,
    taskDetailText,
    endTaskBtn,
    logo,
    logoName
  );
  app.stage.addChild(container);

  return container;
};
