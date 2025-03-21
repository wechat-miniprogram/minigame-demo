import view from "./view";
import { getChatToolInfo, getGroupTaskDetailPath } from "../util";
module.exports = function (PIXI, app, obj) {
    let activityId = '';
    let useAssigner = false;
    let participant = [];
    function clickAllParticipant(drawFn) {
        console.log('clickAllParticipant');
        useAssigner = false;
        drawFn();
    }
    function clickSpecifyParticipant(drawFn) {
        console.log('specifyParticipant');
        useAssigner = true;
        // @ts-ignore 声明未更新临时处理
        wx.selectGroupMembers({
            success: (res) => {
                console.log('!!! selectGroupMembers success', res);
                participant = res.members;
                drawFn(res.members.length);
            },
            fail: (err) => {
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
        }).then((resp) => {
            if (resp.result) {
                activityId = resp.result.activityId;
            }
        }).catch((err) => {
            console.error("createActivityId fail : ", err);
        });
    }
    function publish(drawFn) {
        console.log('publish');
        if (!activityId) {
            createActivityID().then(() => {
                publish(drawFn);
            });
            return;
        }
        wx.showLoading({ title: '发布中...' });
        getChatToolInfo()
            .then((resp) => {
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
                const params = {
                    withShareTicket: true,
                    isUpdatableMessage: true,
                    activityId,
                    participant,
                    useForChatTool: true,
                    chooseType: useAssigner ? 1 : 2,
                    templateInfo: {
                        templateId: "2A84254B945674A2F88CE4970782C402795EB607", // 模版ID常量
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
                };
                wx.updateShareMenu({
                    ...params,
                    success(res) {
                        console.info("updateShareMenu success: ", res);
                        // @ts-ignore 声明未更新临时处理
                        wx.shareAppMessageToGroup({
                            title: "群友们，为了星球而战～",
                            path: getGroupTaskDetailPath(activityId),
                            success(res) {
                                console.info("shareAppMessageToGroup success: ", res);
                                wx.hideLoading({});
                                activityId = "";
                                createActivityID(); // 刷新待创建的活动id
                                drawFn();
                            },
                            fail(err) {
                                console.info("shareAppMessageToGroup fail: ", err);
                                wx.showToast({
                                    title: "分享失败",
                                    icon: "none",
                                });
                            },
                        });
                    },
                    fail(res) {
                        console.info("updateShareMenu fail: ", res);
                    },
                });
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
    return view(PIXI, app, obj, (data) => {
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
