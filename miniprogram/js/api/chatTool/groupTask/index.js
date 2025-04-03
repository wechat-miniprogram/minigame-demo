import view from "./view";
import { openChatTool, showToast } from "./util";
/**
 * 群任务模块的主入口
 * @param {any} PIXI - PIXI.js 实例
 * @param {any} app - 应用实例
 * @param {any} obj - 传入的参数对象
 */
module.exports = function (PIXI, app, obj) {
    // 活动列表数据
    let activityList = [];
    /**
     * 获取活动列表
     * @param {Function} drawFn - 视图更新回调函数，接收活动列表作为参数
     */
    function fetchActivityList(drawFn) {
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'fetchActivityList',
            }
        }).then((resp) => {
            console.info('fetchActivityList: ', resp);
            if (resp.result) {
                activityList = resp.result.dataList; // 更新活动列表数据
                drawFn(activityList); // 更新视图
                wx.hideLoading();
            }
        }).catch(err => {
            console.error('fetchActivityList fail: ', err);
            showToast("获取活动列表失败");
        });
    }
    // 返回视图模块，处理各种事件
    return view(PIXI, app, obj, (data) => {
        let { status, drawFn } = data;
        switch (status) {
            case "createTask": // 创建新任务
                openChatTool({
                    success: () => {
                        drawFn();
                    },
                    fail: (err) => {
                        console.error("openChatTool fail:", err);
                    },
                });
                break;
            case "fetchActivityList": // 获取活动列表
                wx.showLoading({
                    title: '加载中',
                    mask: true,
                });
                fetchActivityList(drawFn);
                break;
        }
    });
};
