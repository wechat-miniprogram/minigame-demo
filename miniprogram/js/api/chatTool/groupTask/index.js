import view from "./view";
module.exports = function (PIXI, app, obj) {
  obj.taskButtonCount = 0;
  obj.taskButtonMaxCount = 5;

  return view(PIXI, app, obj, (data) => {
    let { status, drawFn } = data;

    function openChatTool() {
      if (obj.taskButtonCount < obj.taskButtonMaxCount) {
        wx.openChatTool({
          success: (res) => {
            obj.taskButtonCount++;
            drawFn();
          },
          fail: (err) => {
            console.error("openChatTool fail:", err);
          },
        });
      } else {
        wx.showToast({
          title: "已达最大数量",
        });
      }
    }
    switch (status) {
      case "openChatTool":
        if (wx.isChatTool()) {
          wx.exitChatTool({
            success: () => {
              openChatTool();
            },
            fail: (rej) => {
              wx.showToast({
                title: "exitChatTool fail",
              });
              console.error("exitChatTool fail", rej);
            },
          });
        } else {
          openChatTool();
        }
        break;
    }
  });
};
