import view from "./view";
import { getGroupInfo, getGroupTaskDetailPath, shareAppMessageToGroup } from "../util";
import { ShareCanvas } from './ShareCanvas';
import { GROUP_TASK_RESULT_EMOJI_URL } from "../const";
import { drawProgress } from "./drawProgress";
const roleType = ["unkown", "owner", "participant", "nonParticipant"]; // 定义角色类型
const { envVersion } = wx.getAccountInfoSync().miniProgram;
const getVersionType = () => {
    // 根据环境版本返回对应的版本类型
    if (envVersion === "release") {
        return 0;
    }
    else if (envVersion === "develop") {
        return 1;
    }
    else if (envVersion === "trial") {
        return 2;
    }
    return 0;
};
module.exports = function (PIXI, app, obj) {
    let drawRefresh; // 视图层回调
    const { screenWidth, pixelRatio } = wx.getSystemInfoSync();
    const SC = new ShareCanvas(343, 329, 16, 231, pixelRatio, screenWidth / 375); // 设计稿宽度
    let tick = () => {
        SC.rankTiker(PIXI, app);
    };
    let ticker = PIXI.ticker.shared;
    const { activityId } = obj; // 获取启动信息
    let watchingParticipanted = true; // 是否正在观看参与人
    let role = roleType[0]; // 当前用户角色
    let activityInfo = {}; // 活动信息
    let signIn = []; // 签到成员列表
    let notSignIn = []; // 未签到成员列表
    let participant = []; // 参与者列表
    let participantCnt = 0; // 参与人数
    let taskCnt = 0; // 已做任务次数
    let selfTaskCnt = 0; // 自己做的次数
    let totalTaskNum = 0; // 总任务次数
    let isOwner = false; // 是否为活动创建者
    let groupInfo; // 群组信息
    let signInStatus = false; // 签到状态
    function shareAppMessage() {
        if (!activityInfo._id) {
            console.warn('activityInfo._id is undefined', activityInfo);
            return;
        }
        shareAppMessageToGroup(activityId, participant, activityInfo.useAssigner ? 1 : 2, activityInfo.taskTitle || '示例', (res) => {
            console.log("shareAppMessageToGroup success: ", res);
        }, (err) => {
            console.error("shareAppMessageToGroup fail: ", err);
            wx.showToast({
                title: "分享失败",
                icon: "none",
            });
        });
    }
    function share() {
        // 分享结果
        if (activityInfo.finished || taskCnt >= totalTaskNum) {
            wx.downloadFile({
                url: GROUP_TASK_RESULT_EMOJI_URL,
                success(res) {
                    // @ts-ignore 声明未更新临时处理
                    wx.shareEmojiToGroup({
                        imagePath: res.tempFilePath,
                        entrancePath: getGroupTaskDetailPath(activityId),
                    });
                },
                fail(err) {
                    console.error("downloadFile fail: ", err);
                },
            });
        }
        else { // 分享进度
            const progressCanvas = drawProgress(taskCnt, totalTaskNum, pixelRatio);
            progressCanvas.toTempFilePath({
                success(res) {
                    // @ts-ignore 声明未更新临时处理
                    wx.shareImageToGroup({
                        imagePath: res.tempFilePath,
                        entrancePath: getGroupTaskDetailPath(activityId),
                    });
                },
                fail(err) {
                    console.error("toTempFilePath fail: ", err);
                },
            });
        }
    }
    function Btn2() {
        console.log("Btn2", activityInfo.useAssigner, activityInfo.finished, taskCnt, totalTaskNum);
        // 指定人且进行中
        if (activityInfo.useAssigner && !activityInfo.finished && taskCnt < totalTaskNum) {
            // @ts-ignore 声明未更新临时处理
            wx.notifyGroupMembers({
                title: "公会任务",
                type: "participate",
                members: notSignIn,
                entrancePath: getGroupTaskDetailPath(activityId),
                complete(res) {
                    console.info("notifyGroupMembers: ", res);
                },
            });
        }
        else {
            share();
        }
    }
    function refreshData(activityInfo, groupInfo) {
        console.log('!!! refreshData', activityInfo, groupInfo);
        const { groupOpenID, roomid, openid } = groupInfo;
        // 刷新活动数据
        participant = activityInfo.participant || [];
        signIn = activityInfo.signIn || [];
        taskCnt = signIn.length; // 已做任务次数
        selfTaskCnt = signIn.filter((i) => i === groupOpenID).length; // 自己做的次数
        const uniqueSignIn = Array.from(new Set(signIn));
        participantCnt = uniqueSignIn.length; // 参与人数
        totalTaskNum = 5; // 总任务次数
        const { creator } = activityInfo;
        notSignIn = participant?.filter((i) => !signIn?.includes(i)) || []; // 计算未签到成员
        isOwner = creator === openid; // 判断是否为活动创建者
        if (roomid !== activityInfo.roomid) {
            role = roleType[3]; // 非参与者
        }
        else {
            role = participant?.includes(groupOpenID || '')
                ? roleType[2] // 参与者
                : (isOwner ? roleType[1] : roleType[3]); // 创建者或非参与者
        }
        if (participant?.length === 0) {
            role = roleType[2]; // 如果没有参与者，默认角色为参与者
        }
        signInStatus = signIn?.includes(groupOpenID || '') || false;
        console.log("drawRefresh start", isOwner, activityInfo.useAssigner || false, participantCnt, taskCnt, totalTaskNum, activityInfo.finished || false, signInStatus, activityInfo.taskTitle);
        drawRefresh(isOwner, activityInfo.useAssigner || false, participantCnt, taskCnt, totalTaskNum, activityInfo.finished || false, signInStatus, activityInfo.taskTitle || '示例');
    }
    function updateChatToolMsg(params) {
        const { targetState, parameterList } = params;
        // const templateId = '2A84254B945674A2F88CE4970782C402795EB607' // 参与
        const templateId = "4A68CBB88A92B0A9311848DBA1E94A199B166463"; // 完成
        wx.cloud
            .callFunction({
            name: "openapi",
            data: {
                action: "updateChatToolMsg",
                activityId,
                targetState: targetState || 1,
                templateId: templateId,
                parameterList: parameterList || [],
                versionType: getVersionType(),
            },
        })
            .then((resp) => {
            console.info("updateChatToolMsg: ", resp);
            if (targetState === 3) {
                fetchActivity();
            }
        })
            .catch((err) => {
            console.info("updateChatToolMsg Fail: ", err);
        });
    }
    function earlyTerminate() {
        wx.showLoading({
            title: '结束中',
            mask: true,
        });
        // 提前终止活动
        updateChatToolMsg({
            targetState: 3,
        });
    }
    // 做任务
    function doTask() {
        wx.showLoading({
            title: '做任务中',
            mask: true,
        });
        const { roomid, groupOpenID } = groupInfo;
        wx.cloud.callFunction({
            name: "quickstartFunctions",
            data: {
                type: "signIn",
                roomid,
                groupOpenID,
                activityId,
            },
        }).then((resp) => {
            if (resp.result.success) {
                const { signIn } = activityInfo;
                signIn?.push(groupOpenID || '');
                refreshData(activityInfo, groupInfo);
                updateChatToolMsg({
                    targetState: 1,
                    parameterList: [
                        {
                            groupOpenID,
                            state: 1,
                        },
                    ],
                });
                fetchActivity();
                wx.hideLoading();
                wx.showToast({
                    title: `已加入，打了${selfTaskCnt}次`,
                    icon: "none",
                });
            }
            else {
                wx.hideLoading();
                wx.showToast({
                    title: "做任务失败",
                    icon: "none",
                });
            }
        }).catch((err) => {
            console.error("signIn fail: ", err);
        });
    }
    async function fetchActivity() {
        console.log('!!! fetchActivity');
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        await getGroupInfo().then((_groupInfo) => {
            groupInfo = _groupInfo;
            wx.cloud.callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "selectRecord",
                    activityId,
                },
            }).then((resp) => {
                console.info('!!! selectRecord resp: ', resp);
                if (resp.result.success) {
                    activityInfo = resp.result.activityInfo;
                    refreshData(activityInfo, groupInfo);
                    refreshOpenDataContext();
                }
                else {
                    wx.hideLoading();
                    wx.showToast({
                        title: "活动未找到",
                        icon: "none",
                    });
                }
            }).catch((err) => {
                console.info("fetchActivity fail: ", err);
                wx.hideLoading();
                wx.showToast({
                    title: "加载失败",
                    icon: "none",
                });
            });
        });
    }
    function refreshOpenDataContext() {
        if (!SC.sharedCanvasShowed) {
            SC.sharedCanvasShowed = true;
            ticker.add(tick);
        }
        const isParticipated = !activityInfo.useAssigner || watchingParticipanted; // 未指定人或正在观看参与人
        SC.openDataContext.postMessage({
            event: 'renderGroupTaskMembersInfo',
            members: isParticipated ? signIn : notSignIn,
            renderCount: isParticipated,
            hasAssigned: activityInfo.useAssigner,
        });
        wx.hideLoading();
    }
    function destroyOpenDataContext() {
        SC.openDataContext.postMessage({
            event: 'close',
        });
    }
    return view(PIXI, app, obj, async (data) => {
        let { status, drawFn } = data;
        switch (status) {
            case "refresh":
                drawRefresh = drawFn;
                fetchActivity();
                break;
            case "endTask":
                earlyTerminate();
                break;
            case "smallShare":
                shareAppMessage();
                break;
            case "participated":
                watchingParticipanted = true;
                refreshOpenDataContext();
                drawFn();
                break;
            case "notParticipated":
                watchingParticipanted = false;
                refreshOpenDataContext();
                drawFn();
                break;
            case "doTask":
                await doTask();
                break;
            case "Btn2":
                Btn2();
                break;
            case "shareResult":
                share();
                break;
            case "destroyOpenDataContext":
                destroyOpenDataContext();
                break;
        }
    });
};
