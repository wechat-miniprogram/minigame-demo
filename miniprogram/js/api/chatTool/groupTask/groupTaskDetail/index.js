import view from "./view";
import { getGroupInfo, getGroupTaskDetailPath, shareAppMessageToGroup } from "../util";
import { ShareCanvas } from './ShareCanvas';
import { GROUP_TASK_RESULT_EMOJI_URL, ACTIVITY_TEMPLATE_ID_2 } from "../const";
import { drawProgress } from "./drawProgress";
import { openChatTool, showToast } from "../util";
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
    const { activityId } = obj; // 获取启动信息
    let watchingParticipanted = true; // 是否正在观看参与人
    let activityInfo = {}; // 活动信息
    let groupInfo; // 群组信息
    let signIn = []; // 签到成员列表
    let notSignIn = []; // 未签到成员列表
    let participant = []; // 参与者列表
    let participantCnt = 0; // 参与人数
    let taskCnt = 0; // 已做任务次数
    let selfTaskCnt = 0; // 自己做的次数
    let targetTaskNum = 0; // 目标任务次数
    let isOwner = false; // 是否为活动创建者
    let isParticipant = false; // 是否为参与者
    let drawRefresh; // 视图层回调
    const { screenWidth, pixelRatio } = wx.getSystemInfoSync();
    const SC = new ShareCanvas({
        width: 343,
        height: 329,
        x: 16,
        y: 231,
        pixelRatio,
        scale: screenWidth / 375, // 相对于设计稿比例
    });
    let tick = () => {
        SC.rankTiker(PIXI, app);
    };
    let ticker = PIXI.ticker.shared;
    function shareAppMessage() {
        if (!activityInfo._id) {
            console.warn('activityInfo._id is undefined', activityInfo);
            return;
        }
        shareAppMessageToGroup({
            activityId,
            participant,
            chooseType: activityInfo.isUsingSpecify ? 1 : 2,
            taskTitle: activityInfo.taskTitle || '示例',
            success: (res) => {
                console.log("shareAppMessageToGroup success: ", res);
            },
            fail: (err) => {
                console.error("shareAppMessageToGroup fail: ", err);
                showToast("分享失败");
            }
        });
    }
    function share() {
        // 分享结果
        if (activityInfo.isFinished || taskCnt >= targetTaskNum) {
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
            const progressCanvas = drawProgress(taskCnt, targetTaskNum, pixelRatio);
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
        console.log("Btn2", activityInfo.isUsingSpecify, activityInfo.isFinished, taskCnt, targetTaskNum);
        // 指定人且进行中
        if (activityInfo.isUsingSpecify && !activityInfo.isFinished && taskCnt < targetTaskNum) {
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
        targetTaskNum = 5; // 总任务次数
        const { creator } = activityInfo;
        notSignIn = participant?.filter((i) => !signIn?.includes(i)) || []; // 计算未签到成员
        isOwner = creator === openid; // 判断是否为活动创建者
        if (roomid !== activityInfo.roomid) { // 非当前群组活动
            isParticipant = false;
        }
        else {
            if (!activityInfo.isUsingSpecify) { // 未指定参与者
                isParticipant = true;
            }
            else { // 指定参与者
                isParticipant = participant?.includes(groupOpenID || '');
            }
        }
        const option = {
            isOwner,
            isUsingSpecify: activityInfo.isUsingSpecify || false,
            isFinished: activityInfo.isFinished || false,
            isParticipated: selfTaskCnt > 0,
            isParticipant,
            participantCnt,
            taskCnt,
            targetTaskNum: targetTaskNum,
            taskTitle: activityInfo.taskTitle || '示例',
        };
        console.log("!!! groupTaskDetail draw", option);
        drawRefresh(option);
    }
    function updateChatToolMsg(params) {
        const { targetState, parameterList } = params;
        const templateId = ACTIVITY_TEMPLATE_ID_2; // 模版ID2
        wx.cloud.callFunction({
            name: "openapi",
            data: {
                action: "updateChatToolMsg",
                activityId,
                targetState: targetState || 1,
                templateId: templateId,
                parameterList: parameterList || [],
                versionType: getVersionType(),
            },
        }).then((resp) => {
            console.info("updateChatToolMsg: ", resp);
            if (targetState === 3) {
                fetchActivity();
            }
        }).catch((err) => {
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
                showToast(`已加入，打了${selfTaskCnt}次`);
            }
            else {
                console.error("signIn fail: ", resp);
                showToast("做任务失败");
            }
        }).catch((err) => {
            console.error("signIn fail: ", err);
            showToast("做任务失败");
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
            const Fn = () => {
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
                        showToast("活动未找到");
                    }
                }).catch((err) => {
                    console.info("fetchActivity fail: ", err);
                    showToast("加载活动失败");
                });
            };
            // @ts-ignore
            if (!wx.isChatTool()) { // 若当前不为聊天工具模式（动态卡片进入），则进入聊天工具模式
                openChatTool({
                    roomid: groupInfo.roomid,
                    chatType: groupInfo.chatType,
                    success: (res) => {
                        console.log('!!! openChatTool success', res);
                        Fn();
                    },
                    fail: (err) => {
                        console.error('!!! openChatTool fail: ', err);
                        showToast("进入聊天工具模式失败");
                    }
                });
            }
            else {
                Fn();
            }
        });
    }
    function refreshOpenDataContext() {
        if (!SC.sharedCanvasShowed) {
            SC.sharedCanvasShowed = true;
            ticker.add(tick);
        }
        const isParticipated = !activityInfo.isUsingSpecify || watchingParticipanted; // 未指定人或正在观看参与人
        SC.openDataContext.postMessage({
            event: 'renderGroupTaskMembersInfo',
            members: isParticipated ? signIn : notSignIn,
            renderCount: isParticipated,
            hasAssigned: activityInfo.isUsingSpecify,
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
