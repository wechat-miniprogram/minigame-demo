import view from "./view";
import { getGroupInfo, shareAppMessageToGroup, showToast } from "../util";
/**
 * 创建群任务页面的主模块
 * @param {any} PIXI - PIXI.js 实例
 * @param {any} app - 应用实例
 * @param {any} obj - 传入的参数对象，包含 fetchActivityList 方法用于刷新任务列表
 */
module.exports = function (PIXI, app, obj) {
    // 活动相关变量
    let activityId = ''; // 活动ID
    let isUsingSpecify = false; // 是否指定参与者
    let participant = []; // 参与者列表
    let taskTitle = ''; // 任务标题
    /**
     * 点击"所有群成员"按钮的处理函数
     */
    function clickAllParticipant() {
        console.log('clickAllParticipant');
        isUsingSpecify = false; // 设置为不指定参与者
    }
    /**
     * 点击"指定群成员"按钮的处理函数
     * @param {Function} drawFn - 视图更新回调函数，接收参与者数量作为参数
     */
    function clickSpecifyParticipant(drawFn) {
        console.log('specifyParticipant');
        isUsingSpecify = true; // 设置为指定参与者
        // @ts-ignore 声明未更新临时处理
        wx.selectGroupMembers({
            success: (res) => {
                console.log('!!! selectGroupMembers success', res);
                participant = res.members; // 更新参与者列表
                drawFn(res.members.length); // 更新视图，显示参与者数量
            },
            fail: (err) => {
                console.error('selectGroupMembers fail', err);
            },
        });
    }
    /**
     * 创建活动ID
     * @returns {Promise} 返回创建活动ID的Promise
     */
    function createActivityID() {
        return wx.cloud.callFunction({
            name: 'openapi',
            data: {
                action: 'createActivityId',
            }
        }).then((resp) => {
            if (resp.result) {
                activityId = resp.result.activityId; // 更新活动ID
            }
        }).catch((err) => {
            console.error("createActivityId fail : ", err);
        });
    }
    /**
     * 发布任务
     * @param {Function} drawFn - 视图更新回调函数
     */
    function publish(drawFn) {
        console.log('publish');
        // 任务标题验证
        if (!taskTitle) {
            wx.showToast({
                title: '请输入任务名称',
                icon: 'none',
            });
            return;
        }
        else if (taskTitle.includes(' ')) {
            wx.showToast({
                title: '任务名称不能包含空格',
                icon: 'none',
            });
            return;
        }
        wx.showLoading({ title: '发布中...', mask: true });
        // 如果没有活动ID，先创建
        if (!activityId) {
            createActivityID().then(() => {
                publish(drawFn);
            });
            return;
        }
        // 获取群信息并发布任务
        getGroupInfo().then((resp) => {
            function Fn() {
                wx.cloud.callFunction({
                    name: "quickstartFunctions",
                    data: {
                        type: "addRecord",
                        activityId,
                        roomid: resp.roomid,
                        chatType: resp.chatType,
                        participant,
                        signIn: [],
                        isUsingSpecify,
                        isFinished: false,
                        taskTitle,
                    },
                }).then(() => {
                    // 发布成功后分享到群聊
                    shareAppMessageToGroup({
                        activityId,
                        participant,
                        chooseType: isUsingSpecify ? 1 : 2, // 1: 指定人, 2: 所有人
                        taskTitle,
                        success: (res) => {
                            console.log("shareAppMessageToGroup success: ", res);
                            wx.hideLoading();
                            activityId = ""; // 清空活动ID
                            createActivityID(); // 创建新的活动id
                            drawFn();
                        },
                        fail: (err) => {
                            console.info("shareAppMessageToGroup fail: ", err);
                            showToast("分享失败");
                        }
                    });
                });
            }
            if (resp.chatType === 1 && participant.length === 0) { // 单聊强制上传参与双方，以便于在开放数据域中显示
                // @ts-ignore 声明未更新临时处理
                wx.selectGroupMembers({
                    success: (res) => {
                        console.log('!!! selectGroupMembers success', res);
                        participant = res.members; // 更新参与者列表
                        Fn();
                    },
                    fail: (err) => {
                        console.error('!!! selectGroupMembers fail', err);
                    },
                });
            }
            else {
                Fn();
            }
        }).catch((err) => {
            console.error("publish fail: ", err);
            showToast("发布失败");
        });
    }
    // 返回视图模块，处理各种事件
    return view(PIXI, app, obj, (data) => {
        let { status, drawFn, text } = data;
        switch (status) {
            case 'titleChange': // 任务标题变更
                taskTitle = text;
                break;
            case 'allParticipant': // 选择所有群成员
                clickAllParticipant();
                drawFn();
                break;
            case 'specifyParticipant': // 选择指定群成员
                clickSpecifyParticipant(drawFn);
                break;
            case 'publish': // 发布任务
                publish(drawFn);
                break;
        }
    });
};
