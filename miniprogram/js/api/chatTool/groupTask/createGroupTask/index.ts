import view from "./view";

module.exports = function (PIXI: any, app: any, obj: {
  onCreateTaskSuccess: (activityId: string, groupName: string, participantOpenGIDList: string[]) => void
}) {
  let activityId = '';
  function updateAllParticipantShareMenu() {
    wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage: true,
      activityId,
      useForChatTool: true,
      chooseType: 2,
      templateInfo: {
        templateId: '2A84254B945674A2F88CE4970782C402795EB607', // 模板id常量
        parameterList: [
          {
            name: 'member_count',
            value: '0',
          },
          {
            name: 'room_limit',
            value: '5',
          },
        ],
      },
      success: () => {
        console.log('!!! updateAllParticipantShareMenu success');
      },
      fail: (err) => {
        console.error('!!! updateAllParticipantShareMenu fail', err);
      },
    });
  }

  function updateSpecifyParticipantShareMenu(participant: any) {
    wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage: true,
      activityId,
      useForChatTool: true,
      chooseType: 1,
      participant,
      templateInfo: {
        templateId: '2A84254B945674A2F88CE4970782C402795EB607', // 模板id常量
        parameterList: [
          {
            name: 'member_count',
            value: '0',
          },
          {
            name: 'room_limit',
            value: '5',
          },
        ],
      },
      success: () => {
        console.log('!!! updateShareMenu success');
      },
      fail: (err) => {
        console.error('!!! updateShareMenu fail', err);
      },
    });
  }

  wx.cloud.callFunction({
    name: 'createActivityId',
    success: (res) => {
      console.log('!!! createActivityId success', res);
      const result = res.result as { activityId: string };
      activityId = result.activityId;
      updateAllParticipantShareMenu();
    },
    fail: (err) => {
      wx.showToast({
        title: '创建活动失败',
      });
      console.error('!!! createActivityId fail', err);
    },
  });

  return view(PIXI, app, obj, (data: any) => {
    let { status, drawFn } = data;
    switch (status) {
      case 'allParticipant':
        console.log('allParticipant');
        if (!activityId) {
          wx.showToast({
            title: '尚未生成活动ID，请稍后重试',
          });
          return;
        }
        updateAllParticipantShareMenu();
        drawFn();
        break;
      case 'specifyParticipant':
        console.log('specifyParticipant');
        if (!activityId) {
          wx.showToast({
            title: '尚未生成活动ID，请稍后重试',
          });
          return;
        }
        // @ts-ignore 声明未更新临时处理
        wx.selectGroupMembers({
          success: (res: any) => {
            console.log('!!! selectGroupMembers success', res);
            // const members = res?.members || [];
            // let openDataContext = wx.getOpenDataContext();
            // openDataContext.postMessage({
            //   event: 'renderGroupTaskMembersInfo',
            //   members,
            // });
            updateSpecifyParticipantShareMenu(res.members);
            drawFn(res.members.length);
          },
          fail: (err: any) => {
            console.error('selectGroupMembers fail', err);
          },
        });
        break;
      case 'publish':
        if (!activityId) {
          wx.showToast({
            title: '尚未生成活动ID，请稍后重试',
          });
          return;
        }
        // @ts-ignore 声明未更新临时处理
        wx.shareAppMessageToGroup({
          title: '群友们，为了星球而战～',
          path: '?pathName=groupTaskDetail&activityId=' + activityId,
          success: (res: any) => {
            console.log('!!! shareAppMessageToGroup success', res);
            obj.onCreateTaskSuccess(activityId, '示例', []);
            drawFn();
          },
          fail: (err: any) => {
            wx.showToast({
              title: '分享失败',
            });
            console.error('!!! shareAppMessageToGroup fail', err);
          },
        });
        break;
    }
  });
};
