import view from "./view";
import { ActivityInfo } from "./types";

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
      wx.showToast({
        title: '获取活动列表失败',
      });
      wx.hideLoading();
    })
  }

  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn } = data;

    function openChatTool() {
      // @ts-ignore 声明未更新临时处理
      wx.openChatTool({
        success: () => {
          drawFn();
        },
        fail: (err: any) => {
          console.error("openChatTool fail:", err);
        },
      });
    }
    switch (status) {
      case "createTask":
        // @ts-ignore 声明未更新临时处理
        if (wx.isChatTool()) {
          // @ts-ignore 声明未更新临时处理
          wx.exitChatTool({
            success: () => {
              openChatTool();
            },
            fail: (err: any) => {
              wx.showToast({
                title: "exitChatTool fail",
              });
              console.error("exitChatTool fail", err);
            },
          });
        } else {
          openChatTool();
        }
        break;
      case "fetchActivityList":
        wx.showLoading({
          title: '加载中',
        });
        fetchActivityList(drawFn);
        break;
    }
  });
};
