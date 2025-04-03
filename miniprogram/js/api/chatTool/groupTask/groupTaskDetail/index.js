import view from "./view";
import { getGroupInfo, getGroupTaskDetailPath, shareAppMessageToGroup } from "../util";
import { ShareCanvas } from './ShareCanvas';
import { GROUP_TASK_RESULT_EMOJI_URL, ACTIVITY_TEMPLATE_ID_2 } from "../const";
import { drawProgress } from "./drawProgress";
import { openChatTool, showToast } from "../util";
// 获取当前小程序环境版本
const { envVersion } = wx.getAccountInfoSync().miniProgram;
/**
 * 根据环境版本返回对应的版本类型
 * @returns {number} 0: 正式版, 1: 开发版, 2: 体验版
 */
const getVersionType = () => {
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
/**
 * 群任务详情页面的主模块
 * @param {any} PIXI - PIXI.js 实例
 * @param {any} app - 应用实例
 * @param {any} obj - 传入的参数对象
 */
module.exports = function (PIXI, app, obj) {
    const { activityId } = obj; // 从启动参数中获取活动ID
    // 活动信息对象
    let activityInfo = {};
    // 群组信息对象
    let groupInfo;
    // 成员列表相关
    let signIn = []; // 已签到成员列表
    let notSignIn = []; // 未签到成员列表
    let participant = []; // 所有参与者列表
    // 任务统计相关
    let participantCnt = 0; // 参与人数
    let taskCnt = 0; // 已完成任务次数
    let selfTaskCnt = 0; // 自己完成的任务次数
    let targetTaskNum = 0; // 目标任务总次数
    // 用户身份标识
    let isOwner = false; // 是否为活动创建者
    let isParticipant = false; // 是否为参与者
    // 开放数据域显示状态
    let watchingParticipanted = true;
    // 视图刷新回调函数
    let drawRefresh;
    // 获取屏幕信息
    const { screenWidth, pixelRatio } = wx.getSystemInfoSync();
    // 初始化分享画布
    const SC = new ShareCanvas({
        width: 343,
        height: 329,
        x: 16,
        y: 231,
        pixelRatio,
        scale: screenWidth / 375, // 相对于设计稿的缩放比例
    });
    // 定时器相关
    let tick = () => {
        SC.rankTiker(PIXI, app);
    };
    let ticker = PIXI.ticker.shared;
    /**
     * 分享活动消息到群聊
     */
    function shareAppMessage() {
        if (!activityInfo._id) {
            console.warn('activityInfo._id is undefined', activityInfo);
            return;
        }
        shareAppMessageToGroup({
            activityId,
            participant,
            chooseType: activityInfo.isUsingSpecify ? 1 : 2, // 1: 指定人, 2: 所有人
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
    /**
     * 分享任务结果或进度到群聊
     */
    function share() {
        // 如果活动已完成或达到目标次数，分享结果表情
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
        else { // 否则分享任务进度
            const progressCanvas = drawProgress(taskCnt, targetTaskNum, pixelRatio);
            progressCanvas.toTempFilePath({
                success(res) {
                    console.log('!!! shareImageToGroup: ', res.tempFilePath, getGroupTaskDetailPath(activityId));
                    // @ts-ignore 声明未更新临时处理
                    wx.shareImageToGroup({
                        imagePath: res.tempFilePath,
                        needShowEntrance: true,
                        entrancePath: getGroupTaskDetailPath(activityId),
                    });
                },
                fail(err) {
                    console.error("toTempFilePath fail: ", err);
                },
            });
        }
    }
    /**
     * 处理按钮2的点击事件
     * 根据活动状态执行不同的操作
     */
    function Btn2() {
        console.log("Btn2", activityInfo.isUsingSpecify, activityInfo.isFinished, taskCnt, targetTaskNum);
        // 如果是指定人且活动未完成且未达到目标次数，则通知未签到成员
        if (activityInfo.isUsingSpecify && !activityInfo.isFinished && taskCnt < targetTaskNum) {
            // @ts-ignore 声明未更新临时处理
            wx.notifyGroupMembers({
                title: activityInfo.taskTitle || '示例',
                type: "participate",
                members: notSignIn,
                entrancePath: getGroupTaskDetailPath(activityId),
                complete(res) {
                    console.info("notifyGroupMembers: ", res);
                },
            });
        }
        else { // 否则分享任务结果或进度
            share();
        }
    }
    /**
     * 刷新活动数据
     * @param {ActivityInfo} activityInfo - 活动信息
     * @param {GroupInfo} groupInfo - 群组信息
     */
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
    /**
     * 更新聊天工具消息
     * @param {any} params - 更新参数
     */
    function updateChatToolMsg(params) {
        const { targetState, parameterList } = params;
        const templateId = ACTIVITY_TEMPLATE_ID_2; // 模版ID2
        console.log('!!! updateChatToolMsg', activityId, targetState, parameterList);
        wx.cloud.callFunction({
            name: "openapi",
            data: {
                action: "updateChatToolMsg",
                activityId,
                targetState: targetState || 1,
                templateId,
                parameterList: parameterList || [],
                versionType: getVersionType(),
            },
        }).then((resp) => {
            console.info("updateChatToolMsg: ", resp);
            fetchActivity();
        }).catch((err) => {
            console.info("updateChatToolMsg Fail: ", err);
            showToast("更新失败");
        });
    }
    /**
     * 提前终止活动
     */
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
    /**
     * 执行任务
     */
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
                    targetState: taskCnt >= targetTaskNum ? 3 : 1, // 如果已完成，则设置任务结束
                    parameterList: [
                        {
                            groupOpenID,
                            state: 1,
                        },
                    ],
                });
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
    /**
     * 获取活动信息
     */
    async function fetchActivity() {
        console.log('!!! fetchActivity');
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        await getGroupInfo().then((_groupInfo) => {
            groupInfo = _groupInfo;
            const selectRecord = () => {
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
            // @ts-ignore 声明未更新临时处理
            if (!wx.isChatTool()) { // 若当前不为聊天工具模式（动态卡片进入），则进入聊天工具模式
                openChatTool({
                    roomid: groupInfo.roomid,
                    chatType: groupInfo.chatType,
                    success: (res) => {
                        console.log('!!! openChatTool success', res);
                        selectRecord();
                    },
                    fail: (err) => {
                        console.error('!!! openChatTool fail: ', err);
                        showToast("进入聊天工具模式失败");
                    }
                });
            }
            else {
                selectRecord();
            }
        });
    }
    /**
     * 刷新开放数据域上下文
     */
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
    /**
     * 销毁开放数据域上下文
     */
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
                doTask();
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
