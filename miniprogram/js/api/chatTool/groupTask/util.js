import { GROUP_TASK_SHARE_APP_MESSAGE_IMAGE_URL } from "./const";
/**
 * 显示版本提示弹窗
 * 提示用户需要更新微信客户端版本
 */
export function showVersionTip() {
    wx.showModal({
        content: '需更新到客户端版本 ≥ 8.0.57，基础库版本 ≥ 3.7.12',
        showCancel: false,
        confirmColor: '#02BB00',
    });
    wx.hideLoading();
}
/**
 * 获取群聊信息
 * @returns {Promise<GroupInfo>} 返回群聊信息的Promise对象
 */
export function getGroupInfo() {
    /**
     * 处理获取群聊信息成功的回调
     * @param {Function} resolve - Promise的resolve函数
     * @param {Function} reject - Promise的reject函数
     * @param {any} res - 微信API返回的结果
     */
    function getInfoSuccess(resolve, reject, res) {
        const cloudID = res.cloudID;
        // 使用云开发API获取群聊opengid等
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
        // 首先尝试通过getChatToolInfo获取群聊信息（需处于聊天工具模式才可获取到）
        // @ts-ignore 声明未更新临时处理
        wx.getChatToolInfo({
            success(res) {
                console.log("!!! getChatToolInfo success: ", res);
                getInfoSuccess(resolve, reject, res);
            },
            fail(err) {
                // console.log("!!! getChatToolInfo fail: ", err)
                // 如果获取聊天工具信息失败（未处于聊天工具模式下），尝试使用getGroupEnterInfo获取群聊信息
                wx.getGroupEnterInfo({
                    // @ts-ignore 声明未更新临时处理
                    allowSingleChat: true,
                    needGroupOpenID: true,
                    success(res) {
                        console.log("!!! getGroupEnterInfo success: ", res);
                        getInfoSuccess(resolve, reject, res);
                    },
                    fail(err2) {
                        console.error('!!! getGroupInfo fail: ', err, err2);
                        showToast("获取群聊信息失败");
                        reject(err2);
                    }
                });
            },
        });
    });
}
/**
 * 获取群任务详情页面的路径
 * @param {string} activityId - 活动ID
 * @returns {string} 群任务详情页面的路径
 */
export function getGroupTaskDetailPath(activityId) {
    return `?pathName=groupTaskDetail&activityId=${activityId}`;
}
/**
 * 打开聊天工具
 * @param {openChatToolOption} option - 打开聊天工具的选项
 */
export function openChatTool(option) {
    console.log('!!! openChatTool option: ', option);
    const { roomid, chatType, success, fail } = option;
    // @ts-ignore 声明未更新临时处理
    if (!wx.isChatTool) {
        showVersionTip();
        return;
    }
    // 如果当前处于聊天工具模式，则先退出
    // @ts-ignore 声明未更新临时处理
    if (wx.isChatTool()) {
        // @ts-ignore 声明未更新临时处理
        wx.exitChatTool({
            success: () => {
                openChatTool({ roomid, chatType, success, fail });
            },
            fail: (err) => {
                showToast("退出聊天工具模式失败");
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
/**
 * 分享消息到群聊
 * @param {shareAppMessageToGroupOption} option - 分享消息的选项
 */
export function shareAppMessageToGroup(option) {
    console.log('!!! shareAppMessageToGroup option: ', option);
    const { activityId, participant, chooseType, taskTitle, success, fail } = option;
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
    // 首先使用updateShareMenu更新分享信息
    wx.updateShareMenu({
        withShareTicket: true,
        isUpdatableMessage: true,
        activityId,
        participant,
        useForChatTool: true,
        chooseType,
        templateInfo,
        success(res) {
            // 该接口需在聊天工具模式下才可使用
            // @ts-ignore 声明未更新临时处理
            wx.shareAppMessageToGroup({
                title: '快来参加' + taskTitle + '活动',
                imageUrl: GROUP_TASK_SHARE_APP_MESSAGE_IMAGE_URL,
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
/**
 * 显示提示信息
 * @param {string} title - 提示内容
 * @param {string} [icon] - 提示图标，可选值：success/error/loading/none
 */
export function showToast(title, icon) {
    wx.hideLoading();
    wx.showToast({
        title,
        icon,
    });
}
