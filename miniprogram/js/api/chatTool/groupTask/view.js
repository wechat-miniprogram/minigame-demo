"use strict";
const { p_button, p_text, p_box, p_scroll, p_line, } = require("../../../libs/component/index");
const fixedTemplate = require("../../../libs/template/fixed");
// 为taskInfoList指定类型
let taskInfoList = [];
module.exports = function (PIXI, app, obj, callBack) {
    const r = (value) => {
        return PIXI.ratio * value * 2; // 尚不清楚这个2哪里来
    };
    const contentWidth = r(322);
    let container = new PIXI.Container(), { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
        obj,
        title: "聊天工具",
        api_name: "群任务",
    });
    /**** taskList ****/
    // 任务列表
    let taskListBox = p_box(PIXI, {
        width: contentWidth,
        height: r(413),
        y: r(171),
        radius: r(8),
    });
    let taskList = p_scroll(PIXI, {
        width: contentWidth,
        height: r(413),
        x: 0,
        y: 0,
    });
    // 任务列表提示
    let taskListBoxPrompt = p_text(PIXI, {
        content: "当前暂无任务",
        fontSize: r(17),
        fill: "rgba(0,0,0,0.5)",
        align: "center",
        relative_middle: {
            containerWidth: taskListBox.width,
            containerHeight: taskListBox.height,
        },
    });
    function taskButton() {
        let buttonNumber = taskInfoList.length;
        let button = p_button(PIXI, {
            parentWidth: taskList.width,
            width: contentWidth,
            alpha: 0,
            y: buttonNumber * r(63 + 1),
            height: r(63 + 1),
        });
        button.myAddChildFn(p_text(PIXI, {
            content: "群任务" + taskInfoList[buttonNumber].groupName,
            x: r(16),
            fontSize: r(17),
            fill: 0x000000,
            align: "center",
            relative_middle: {
                containerHeight: button.height,
            },
        }), p_text(PIXI, {
            content: " >",
            x: r(291),
            fontSize: r(17),
            fill: 0x000000,
            align: "center",
            relative_middle: {
                containerHeight: button.height,
            },
        }), p_line(PIXI, {
            width: r(1),
            color: 0x000000,
            alpha: 0.1,
        }, [r(16), r(63.5)], [r(290), 0]));
        button.onClickFn(() => {
            // @ts-ignore 框架遗留
            window.router.navigateTo("groupTaskDetail", {
                activityId: taskInfoList[buttonNumber].activityId,
                groupName: taskInfoList[buttonNumber].groupName,
                isAuthor: true,
            });
        });
        return button;
    }
    taskListBox.addChild(taskList);
    taskListBox.addChild(taskListBoxPrompt);
    /**** taskList ****/
    /**** createGroupTaskBtn ****/
    let createGroupTaskBtn = p_button(PIXI, {
        width: r(196),
        height: r(48),
        y: r(608),
        radius: r(4),
        color: 0x07c160,
    });
    let createGroupTaskBtnText = p_text(PIXI, {
        content: "创建任务",
        fontSize: r(17),
        fill: 0xffffff,
        relative_middle: {
            containerWidth: createGroupTaskBtn.width,
            containerHeight: createGroupTaskBtn.height,
        },
    });
    createGroupTaskBtn.myAddChildFn(createGroupTaskBtnText);
    createGroupTaskBtn.onClickFn(() => {
        callBack({
            status: "openChatTool",
            drawFn() {
                setTimeout(() => {
                    // @ts-ignore 框架遗留
                    window.router.navigateTo("createGroupTask", {
                        onCreateTaskSuccess,
                        onDeleteTask,
                    });
                }, 0);
            },
        });
    });
    /**** createGroupTaskBtn ****/
    // 一定要加这个reload, 否则会报错
    // @ts-ignore 框架遗留
    window.router.getNowPage((page) => {
        page.reload = function () {
            logo.reloadImg({ src: "images/logo.png" });
        };
    });
    container.addChild(goBack, title, api_name, underline, taskListBox, createGroupTaskBtn, logo, logoName);
    app.stage.addChild(container);
    function onCreateTaskSuccess(activityId, groupName) {
        createGroupTaskBtnText.turnText("创建新任务");
        taskListBox.removeChild(taskListBoxPrompt);
        taskList.myAddChildFn(taskButton());
        taskInfoList.push({ activityId, groupName });
    }
    function onDeleteTask(activityId) {
        taskList.myRemoveChildrenFn(taskInfoList.length - 1, taskInfoList.length - 1); // 删除最后一个按钮
        taskInfoList = taskInfoList.filter((task) => task.activityId !== activityId);
    }
    return container;
};
