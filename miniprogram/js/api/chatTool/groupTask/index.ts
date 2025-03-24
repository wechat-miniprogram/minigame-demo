import view from "./view";
import { ActivityInfo } from "./types";
import { openChatTool, showToast } from "./util";

module.exports = function (PIXI: any, app: any, obj: any) {
  let activityList: ActivityInfo[] = [];

  function fetchActivityList(drawFn: (activityList: ActivityInfo[]) => void) {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchActivityList',
      }
    }).then((resp: any) => {
      console.info('fetchActivityList: ', resp)
      if (resp.result) {
        activityList = resp.result.dataList;
        drawFn(activityList);
        wx.hideLoading();
      }
    }).catch(err => {
      console.error('fetchActivityList fail: ', err)
      showToast("获取活动列表失败");
    })
  }

  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn } = data;

    switch (status) {
      case "createTask":
        openChatTool(
          undefined,
          undefined,
          () => {
            drawFn();
          },
          (err: any) => {
            console.error("openChatTool fail:", err);
          },
        )
        break;
      case "fetchActivityList":
        wx.showLoading({
          title: '加载中',
          mask: true,
        });
        fetchActivityList(drawFn);
        break;
    }
  });
};
