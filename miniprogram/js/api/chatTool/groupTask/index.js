"use strict";
const view = require("./view");
module.exports = function (PIXI, app, obj) {
    return view(PIXI, app, obj, (data) => {
        let { status, drawFn } = data;
        function openChatTool() {
            // @ts-ignore 声明未更新临时处理
            wx.openChatTool({
                success: () => {
                    drawFn();
                },
                fail: (err) => {
                    console.error("openChatTool fail:", err);
                },
            });
        }
        switch (status) {
            case "openChatTool":
                // @ts-ignore 声明未更新临时处理
                if (wx.isChatTool()) {
                    // @ts-ignore 声明未更新临时处理
                    wx.exitChatTool({
                        success: () => {
                            openChatTool();
                        },
                        fail: (err) => {
                            wx.showToast({
                                title: "exitChatTool fail",
                            });
                            console.error("exitChatTool fail", err);
                        },
                    });
                }
                else {
                    openChatTool();
                }
                break;
        }
    });
};
