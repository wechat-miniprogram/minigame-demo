export function showVersionTip() {
    wx.showModal({
        content: '你的微信版本过低，无法演示该功能！',
        showCancel: false,
        confirmColor: '#02BB00',
    });
    wx.hideLoading();
}
export function getGroupInfo() {
    function getInfoSuccess(resolve, reject, res) {
        const cloudID = res.cloudID;
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getGroupEnterInfo',
                groupInfo: wx.cloud.CloudID(cloudID)
            }
        }).then((resp) => {
            console.info('getGroupEnterInfo resp: ', resp);
            const groupInfo = resp.result.groupInfo;
            if (groupInfo && groupInfo.data) {
                const openid = resp.result.openid;
                const opengid = groupInfo.data.opengid;
                const openSingleRoomID = groupInfo.data.open_single_roomid;
                const groupOpenID = groupInfo.data.group_openid;
                const data = {
                    openid,
                    groupOpenID,
                    roomid: opengid || openSingleRoomID,
                    chatType: groupInfo.data.chat_type
                };
                resolve(data);
            }
            else {
                reject();
            }
        }).catch(err => {
            console.info('getGroupEnterInfo fail: ', err);
            reject(err);
        });
    }
    return new Promise((resolve, reject) => {
        // @ts-ignore 声明未更新临时处理
        if (!wx.getChatToolInfo) {
            showVersionTip();
            reject("微信版本过低");
        }
        // @ts-ignore 声明未更新临时处理
        wx.getChatToolInfo({
            success(res) {
                console.log("!!! getChatToolInfo success: ", res);
                getInfoSuccess(resolve, reject, res);
            },
            fail(err) {
                console.log("!!! getChatToolInfo fail: ", err);
                wx.getGroupEnterInfo({
                    success(res) {
                        console.log("!!! getGroupEnterInfo success: ", res);
                        getInfoSuccess(resolve, reject, res);
                    },
                    fail(err2) {
                        console.error('!!! getGroupInfo fail: ', err, err2);
                        reject(err2);
                    }
                });
            },
        });
    });
}
export function getGroupTaskDetailPath(activityId) {
    return `?pathName=groupTaskDetail&activityId=${activityId}`;
}
export function openChatTool(roomid, chatType, success, fail) {
    // @ts-ignore 声明未更新临时处理
    if (!wx.isChatTool) {
        showVersionTip();
        return;
    }
    // @ts-ignore 声明未更新临时处理
    if (wx.isChatTool()) {
        // @ts-ignore 声明未更新临时处理
        wx.exitChatTool({
            success: () => {
                openChatTool(roomid, chatType, success, fail);
            },
            fail: (err) => {
                wx.showToast({
                    title: "exitChatTool fail",
                });
                console.error('!!! exitChatTool fail: ', err);
            }
        });
    }
    else {
        // @ts-ignore 声明未更新临时处理
        wx.openChatTool({
            roomid,
            chatType,
            success,
            fail,
        });
    }
}
export function shareAppMessageToGroup(activityId, participant, chooseType, taskTitle, success, fail) {
    const templateInfo = {
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
        ]
    };
    wx.updateShareMenu({
        withShareTicket: true,
        isUpdatableMessage: true,
        activityId,
        participant,
        useForChatTool: true,
        chooseType,
        templateInfo,
        success(res) {
            // @ts-ignore 声明未更新临时处理
            wx.shareAppMessageToGroup({
                title: taskTitle,
                imageUrl: "https://mmgame.qpic.cn/image/264eef4359b95dffc552149c15b9d53723d56d836411841a37710f1c7c3b4878/0",
                path: getGroupTaskDetailPath(activityId),
                success,
                fail,
            });
        },
        fail(err) {
            console.error("updateShareMenu fail: ", err);
        },
    });
}
