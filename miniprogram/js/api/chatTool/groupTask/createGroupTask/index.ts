import view from "./view";
import { getGroupInfo, shareAppMessageToGroup, showToast } from "../util";

module.exports = function (PIXI: any, app: any, obj: {
  fetchActivityList: () => void
}) {
  let activityId = '';
  let isUsingSpecify = false;
  let participant = [];
  let taskTitle = '';
  function clickAllParticipant(drawFn: () => void) {
    console.log('clickAllParticipant');
    isUsingSpecify = false;
    drawFn();
  }

  function clickSpecifyParticipant(drawFn: (participantCnt: number) => void) {
    console.log('specifyParticipant');
    isUsingSpecify = true;
    // @ts-ignore 声明未更新临时处理
    wx.selectGroupMembers({
      success: (res: any) => {
        console.log('!!! selectGroupMembers success', res);
        participant = res.members;
        drawFn(res.members.length);
      },
      fail: (err: any) => {
        console.error('selectGroupMembers fail', err);
      },
    });
  }

  function createActivityID() {
    return wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'createActivityId',
      }
    }).then((resp: any) => {
      if (resp.result) {
        activityId = resp.result.activityId;
      }
    }).catch((err: any) => {
      console.error("createActivityId fail : ", err);
    });
  }

  function publish(drawFn: () => void) {
    console.log('publish');
    if (!taskTitle) {
      wx.showToast({
        title: '请输入任务名称',
        icon: 'none',
      });
      return;
    } else if (taskTitle.includes(' ')) {
      wx.showToast({
        title: '任务名称不能包含空格',
        icon: 'none',
      });
      return;
    }
    wx.showLoading({ title: '发布中...', mask: true });

    if (!activityId) {
      createActivityID().then(() => {
        publish(drawFn);
      });
      return;
    }

    getGroupInfo().then((resp: any) => {
      wx.cloud.callFunction({
        name: "quickstartFunctions",
        data: {
          type: "addRecord",
          activityId,
          roomid: resp.roomid,
          chatType: resp.chatType,
          // startTime: dateTextStart,
          // endTime: dateTextEnd,
          participant,
          signIn: [],
          isUsingSpecify,
          isFinished: false,
          taskTitle,
        },
      }).then(() => {
        shareAppMessageToGroup({
          activityId,
          participant,
          chooseType: isUsingSpecify ? 1 : 2,
          taskTitle,
          success: (res) => {
            console.log("shareAppMessageToGroup success: ", res);
            wx.hideLoading();
            activityId = "";
            createActivityID(); // 刷新待创建的活动id
            drawFn();
          },
          fail: (err) => {
            console.info("shareAppMessageToGroup fail: ", err);
            showToast("分享失败");
          }
        });
      });
    }).catch((err) => {
      console.error("publish fail: ", err);
      showToast("发布失败");
    });
  }

  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn, text } = data;
    switch (status) {
      case 'titleChange':
        taskTitle = text;
        break;
      case 'allParticipant':
        clickAllParticipant(drawFn);
        break;
      case 'specifyParticipant':
        clickSpecifyParticipant(drawFn);
        break;
      case 'publish':
        publish(drawFn);
        break;
    }
  });
};
