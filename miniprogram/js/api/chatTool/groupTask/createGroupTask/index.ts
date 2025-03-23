import view from "./view";
import { getGroupInfo, shareAppMessageToGroup } from "../util";

module.exports = function (PIXI: any, app: any, obj: {
  fetchActivityList: () => void
}) {
  let activityId = '';
  let useAssigner = false;
  let participant = [];

  function clickAllParticipant(drawFn: () => void) {
    console.log('clickAllParticipant');
    useAssigner = false;
    drawFn();
  }

  function clickSpecifyParticipant(drawFn: (participantCnt: number) => void) {
    console.log('specifyParticipant');
    useAssigner = true;
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
    wx.showLoading({ title: '发布中...', mask: true });

    if (!activityId) {
      createActivityID().then(() => {
        publish(drawFn);
      });
      return;
    }

    getGroupInfo()
      .then((resp: any) => {
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
            useAssigner,
            finished: false,
          },
        }).then(() => {
          shareAppMessageToGroup(
            activityId,
            participant,
            useAssigner ? 1 : 2,
            (res) => {
              console.log("shareAppMessageToGroup success: ", res);
              wx.hideLoading({});
              activityId = "";
              createActivityID(); // 刷新待创建的活动id
              drawFn();
            },
            (err) => {
              console.info("shareAppMessageToGroup fail: ", err);
              wx.showToast({
                title: "分享失败",
                icon: "none",
              });
            }
          );
        });
      })
      .catch((err) => {
        console.error("publish fail: ", err);
        wx.showToast({
          icon: "none",
          title: "发布失败",
        });
      });
  }

  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn } = data;
    switch (status) {
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
