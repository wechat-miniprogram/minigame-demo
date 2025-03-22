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
