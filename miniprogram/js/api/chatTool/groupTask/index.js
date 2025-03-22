import view from "./view";
import { openChatTool } from "./util";
module.exports = function (PIXI, app, obj) {
    let activityList = [];
    function fetchActivityList(drawFn) {
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'fetchActivityList',
            }
        }).then((resp) => {
            console.info('fetchActivityList: ', resp);
            if (resp.result) {
                activityList = resp.result.dataList;
                drawFn(activityList);
                wx.hideLoading();
            }
        }).catch(err => {
            console.error('fetchActivityList fail: ', err);
            wx.showToast({
                title: '获取活动列表失败',
            });
            wx.hideLoading();
        });
    }
    return view(PIXI, app, obj, (data) => {
        let { status, drawFn } = data;
        switch (status) {
            case "createTask":
                openChatTool(undefined, undefined, () => {
                    drawFn();
                }, (err) => {
                    console.error("openChatTool fail:", err);
                });
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
