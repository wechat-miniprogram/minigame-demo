import view from "./view";
module.exports = function (PIXI, app, obj) {
  return view(PIXI, app, obj, (data) => {
    let { status, drawFn } = data;
    switch (status) {
      case "endTask":
        wx.showToast({
          title: "任务已结束",
        });
        drawFn();
        break;
    }
  });
};
