import view from "./view";
module.exports = function (PIXI, app, obj) {
  return view(PIXI, app, obj, (data) => {
    let { status, drawFn } = data;
    switch (status) {
      case "allParticipant":
        console.log("allParticipant");
        wx.updateShareMenu({
          withShareTicket: true,
          isUpdatableMessage: true,
          activityId: "xxx", // TODO: 需要从后端获取
          useForChatTool: true,
          chooseType: 2,
          templateInfo: "2A84254B945674A2F88CE4970782C402795EB607", // 模板id常量
        });
        drawFn();
        break;
      case "specifyParticipant":
        console.log("specifyParticipant");
        wx.selectGroupMembers({
          success: (res) => {
            wx.updateShareMenu({
              withShareTicket: true,
              isUpdatableMessage: true,
              activityId: "xxx", // TODO: 需要从后端获取
              useForChatTool: true,
              chooseType: 1,
              participant: res.members,
              templateInfo: "2A84254B945674A2F88CE4970782C402795EB607", // 模板id常量
            });
            let participantCnt = res.members.length;
            drawFn(participantCnt);
          },
          fail: (err) => {
            console.error("selectGroupMembers fail", err);
          },
        });
        break;
      case "publish":
        wx.showToast({
          title: "发布成功",
        });
        obj.onCreateTaskSuccess();
        drawFn();
        break;
    }
  });
};
