const view = require("./view");

module.exports = function (PIXI: any, app: any, obj: any) {
  const { activityId, groupName } = obj;
  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn } = data;
    switch (status) {
      case "endTask":
        wx.showToast({
          title: "任务已结束",
        });
        drawFn();
        break;
      case "share":
        // @ts-ignore 声明未更新临时处理
        wx.shareAppMessageToGroup({
          title: "群友们，为了星球而战～",
          path:
            "?pathName=groupTaskDetail&activityId=" +
            activityId +
            "&groupName=" +
            groupName +
            "&isAuthor=false",
        });
        drawFn();
        break;
      case "participated":
        drawFn();
        break;
      case "notParticipated":
        drawFn();
        break;
    }
  });
};
