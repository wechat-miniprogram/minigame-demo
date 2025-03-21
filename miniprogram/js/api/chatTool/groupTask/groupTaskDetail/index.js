import view from "./view";
import { getChatToolInfo, getGroupTaskDetailPath } from "../util";
// const roleType = ["unkown", "owner", "participant", "nonParticipant"]; // 定义角色类型
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
    const { activityId } = obj; // 获取启动信息
    let watchingParticipanted = true; // 是否正在观看参与人
    // let members: string[] = []; // 成员列表
    // let role = roleType[0]; // 当前用户角色
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
    // let activityStatusStar = ""; // 活动状态
    // let showProgress = false; // 是否显示进度
    // let percent = "0"; // 签到百分比
    // let progressImage = ""; // 进度图片路径
    // let triggered = false; // 下拉刷新触发状态;
    function shareAppMessage() {
        if (!activityInfo._id) {
            console.warn('activityInfo._id is undefined', activityInfo);
            return;
        }
        wx.updateShareMenu({
            withShareTicket: true,
            isUpdatableMessage: true,
            activityId,
            participant,
            useForChatTool: true,
            chooseType: activityInfo.useAssigner ? 1 : 2,
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
            success(res) {
                console.info("updateShareMenu success: ", res);
                // @ts-ignore 声明未更新临时处理
                wx.shareAppMessageToGroup({
                    title: "群友们，为了星球而战～",
                    path: getGroupTaskDetailPath(activityId),
                    success(res) {
                        console.info("shareAppMessageToGroup success: ", res);
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
            fail(err) {
                console.info("updateShareMenu fail: ", err);
            },
        });
    }
    function share() {
        // 分享结果
        if (activityInfo.finished || obj.taskCnt >= obj.totalTaskNum) {
            wx.downloadFile({
                url: 'https://mmbiz.qpic.cn/mmbiz_gif/EXAZAY4U1KCcdEB1gicNwIL4lUrpVQ5H5jOSfiaVHJ5n4EQyPrLqgRtbb6X1hRIiaZqMIibVME51FYRf7p2kC4OdLA/0',
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
            wx.downloadFile({
                url: 'https://res.wx.qq.com/wxdoc/dist/assets/img/demo.ef5c5bef.jpg',
                success(res) {
                    // @ts-ignore 声明未更新临时处理
                    wx.shareImageToGroup({
                        imagePath: res.tempFilePath,
                        entrancePath: getGroupTaskDetailPath(activityId),
                    });
                },
                fail(err) {
                    console.error("downloadFile fail: ", err);
                },
            });
        }
    }
    function Btn2() {
        // 指定人且进行中
        if (activityInfo.useAssigner && !activityInfo.finished && obj.taskCnt < obj.totalTaskNum) {
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
        // const percent = participant.length
        //   ? Math.ceil((signIn.length / participant.length) * 100)
        //   : 0; // 计算签到百分比
        isOwner = creator === openid; // 判断是否为活动创建者
        // if (roomid !== activityInfo.roomid) {
        //   role = roleType[3]; // 非参与者
        // } else {
        //   role = participant?.includes(groupOpenID || '')
        //     ? roleType[2] // 参与者
        //     : obj.isOwner
        //       ? roleType[1]
        //       : roleType[3]; // 创建者或非参与者
        // }
        // if (participant?.length === 0) {
        //   role = roleType[2]; // 如果没有参与者，默认角色为参与者
        // }
        // this.setData({
        //   role,
        //   isOwner,
        signInStatus = signIn?.includes(groupOpenID || '') || false;
        // activityInfo,
        // members = signIn || [];
        //   signIn,
        //   notSignIn,
        //   participant,
        //   percent,
        // });
        // updateProgressImage(); // 更新进度图片
        drawRefresh(isOwner, activityInfo.useAssigner || false, participantCnt, taskCnt, totalTaskNum, activityInfo.finished || false, signInStatus);
    }
    function updateChatToolMsg(params = {}) {
        // 更新聊天工具消息
        // @ts-ignore
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
        });
        const { roomid, groupOpenID } = groupInfo;
        wx.cloud
            .callFunction({
            name: "quickstartFunctions",
            data: {
                type: "signIn",
                roomid,
                groupOpenID,
                activityId,
            },
        })
            .then((resp) => {
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
        })
            .catch((err) => {
            console.error("signIn fail: ", err);
        });
    }
    async function fetchActivity() {
        console.log('!!! fetchActivity');
        wx.showLoading({
            title: '加载中',
        });
        await getChatToolInfo().then((_groupInfo) => {
            groupInfo = _groupInfo;
            wx.cloud
                .callFunction({
                name: "quickstartFunctions",
                data: {
                    type: "selectRecord",
                    activityId,
                },
            })
                .then((resp) => {
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
            })
                .catch((err) => {
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
        let openDataContext = wx.getOpenDataContext();
        const isParticipated = !activityInfo.useAssigner || watchingParticipanted; // 未指定人或正在观看参与人
        openDataContext.postMessage({
            event: 'renderGroupTaskMembersInfo',
            members: isParticipated ? signIn : notSignIn,
            renderCount: isParticipated,
            hasAssigned: activityInfo.useAssigner,
        });
        wx.hideLoading();
    }
    function destroyOpenDataContext() {
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
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
                drawFn();
                break;
            case "smallShare":
                shareAppMessage();
                drawFn();
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
                drawFn();
                break;
            case "Btn2":
                Btn2();
                drawFn();
                break;
            case "shareResult":
                share();
                drawFn();
                break;
            case "destroy":
                destroyOpenDataContext();
                break;
        }
    });
};
