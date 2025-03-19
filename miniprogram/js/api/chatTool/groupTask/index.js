import view from "./view";
module.exports = function (PIXI, app, obj) {
  return view(PIXI, app, obj, (data) => {
    let { status, drawFn } = data;

    function openChatTool() {
      wx.openChatTool({
        success: (res) => {
          drawFn();
        },
        fail: (err) => {
          console.error("openChatTool fail:", err);
        },
      });
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
