import view from "./view";
module.exports = function (PIXI, app, obj) {
  return view(PIXI, app, obj, (data) => {
    let { status, drawFn } = data;
    switch (status) {
      case "openChatTool":
        wx.openChatTool({
          success: (res) => {
            wx.showToast({
              title: "openChatTool success",
            });
            drawFn();
          },
          fail: (err) => {
            console.error("openChatTool fail:", err);
          },
        });
        break;
    }
  });
};
