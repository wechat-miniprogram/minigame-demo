import style from './render/style.js';
import tplFn from './render/tplfn.js';
import { showLoading } from './loading.js';
import { getFriendData, getGroupFriendData, setUserRecord, getUserInfo, findSelf, injectSelfToList, replaceSelfDataInList, gameServer, } from './data.js';
import { interactive, directional, refreshDirected } from './pushMessage.js';
import { bindCheckHandoffEnabled, bindStartHandoff } from './PCHandoff.js';
let userinfo;
let selfData;
let key = 'rankid';
let currentMaxScore = 0;
let selfIndex = 0;
/********* v2 *********/
import getTipsXML from './openDataContext_v2/render/tpls/tips';
import getTipsStyle from './openDataContext_v2/render/styles/tips';
import getFriendRankXML from './openDataContext_v2/render/tpls/groupTaskFriendList';
import getFriendRankStyle from './openDataContext_v2/render/styles/groupTaskFriendList';
import { getGroupMembersInfo } from './openDataContext_v2/data/index';
const Layout = requirePlugin('Layout').default;
GameGlobal.Layout = Layout;
const sharedCanvas = wx.getSharedCanvas();
const sharedContext = sharedCanvas.getContext('2d');
console.log('!!! sharedCanvas', sharedCanvas, sharedContext);
const MessageType = {
    UPDATE_VIEW_PORT: 'updateViewPort',
    SHOW_FRIENDS_RANK: 'showFriendsRank',
    SHOW_GROUP_FRIENDS_RANK: 'showGroupFriendsRank',
    SET_USER_RECORD: 'setUserRecord',
    RELATIONAL_CHAIN_INTERACTIVE_DATA: 'relationalChainInteractiveData',
    DIRECTED_SHARING: 'directedSharing',
    PC_HANDOFF: 'PCHandoff',
    CLOSE: 'close',
    RENDER_GROUP_TASK_MEMBERS_INFO: 'renderGroupTaskMembersInfo',
    SHOW_FRIENDS_ONLINE_STATUS: 'showFriendsOnlineStatus',
};
/**
 * 初始化开放域，主要是使得 Layout 能够正确处理跨引擎的事件处理
 * 如果游戏里面有移动开放数据域对应的 RawImage，也需要抛事件过来执行Layout.updateViewPort
 */
const initOpenDataCanvas = async (data) => {
    console.log('!!! initOpenDataCanvas', data);
    Layout.updateViewPort({
        x: data.x / data.devicePixelRatio,
        y: data.y / data.devicePixelRatio,
        width: data.width / data.devicePixelRatio,
        height: data.height / data.devicePixelRatio,
    });
};
// const { screenWidth, screenHeight } = wx.getSystemInfoSync();
setTimeout(() => {
    initOpenDataCanvas({
        x: 0,
        y: 0,
        width: sharedCanvas.width,
        height: sharedCanvas.height,
    });
    // 假设 sharedContext 已经被正确初始化
    // const size = 50; // 正方形的边长
    // const x = 100; // 正方形的 x 坐标
    // const y = 100; // 正方形的 y 坐标
    // // 设置填充颜色
    // sharedContext.fillStyle = '#FF0000'; // 红色
    // // 绘制正方形
    // sharedContext.fillRect(x, y, size, size);
}, 1000);
// 给定 xml 和 style，渲染至 sharedCanvas
function LayoutWithTplAndStyle(xml, style) {
    console.log('!!! LayoutWithTplAndStyle', xml, style);
    Layout.clear();
    Layout.init(xml, style);
    Layout.layout(sharedContext);
    console.log('!!! LayoutWithTplAndStyle', Layout);
}
// 仅仅渲染一些提示，比如数据加载中、当前无授权等
function renderTips(tips = '') {
    LayoutWithTplAndStyle(getTipsXML({
        tips,
    }), getTipsStyle({
        width: sharedCanvas.width,
        height: sharedCanvas.height,
    }));
}
async function renderGroupTaskMembers(data) {
    showLoading();
    try {
        const res = await getGroupMembersInfo(data.members);
        console.log('!!! renderGroupTaskMembers', res);
        if (!res.groupMembers.length) {
            renderTips('暂无参与记录');
            return;
        }
        LayoutWithTplAndStyle(getFriendRankXML({
            data: res.groupMembers,
        }), getFriendRankStyle());
        // initShareEvents();
    }
    catch (e) {
        console.error('renderGroupTaskMembersInfo error', e);
    }
}
/********* v2 *********/
function draw(title, data = []) {
    Layout.clearAll();
    let isBillboard = typeof arguments[arguments.length - 1] !== 'string', template = tplFn({
        title: isBillboard ? title : null,
        data,
        self: selfData,
        selfIndex,
        isBillboard,
    });
    Layout.init(template, style);
    Layout.layout(sharedContext);
}
function renderData(data, info, title = '排行榜', mock = false, type) {
    data.sort((a, b) => b.score - a.score);
    let find = findSelf(data, info);
    selfData = find.self;
    selfIndex = find.index + 1;
    /**
     * 拉取排行榜的时候无法确定排行榜中是否有自己，或者即便有自己分数也是旧的
     * 如果拉取排行榜之前先调用setUserCloudStorage来上报分数再拉取排行榜
     * 那么第一次渲染排行榜会非常之慢。针对这种场景需要根据情况处理：
     * 1. 如果拉取排行榜之前有调用分数上报接口，将每次上报的分数缓存起来，然后插入或者替换排行榜中的自己
     * 2. 如果拉取排行榜之前没有调用分数上报接口，忽略1的逻辑
     */
    if (!selfData && currentMaxScore !== undefined) {
        injectSelfToList(data, info, currentMaxScore);
        let find = findSelf(data, info);
        selfData = find.self;
        selfIndex = find.index + 1;
    }
    else if (selfData && currentMaxScore !== undefined) {
        // 替换自己的分数
        replaceSelfDataInList(data, info, currentMaxScore);
    }
    // mock
    if (mock) {
        for (let i = data.length; i < 20; i++) {
            data[i] = JSON.parse(JSON.stringify(selfData));
            data[i].rank = i;
            data[i].score = 0;
            data[i].nickname = 'mock__user';
        }
    }
    draw(title, data);
    // 关系链互动
    type === 'interaction' && interactive(data, selfData);
}
function showGroupRank(shareTicket) {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if (!userinfo) {
        getUserInfo((info) => {
            userinfo = info;
            getGroupFriendData(key, shareTicket, (data) => {
                console.log(key, shareTicket, data);
                renderData(data, info, '群排行', false);
            });
        });
    }
    else {
        getGroupFriendData(key, shareTicket, (data) => {
            console.log(key, shareTicket, data);
            renderData(data, userinfo, '群排行', false);
        });
    }
}
function showFriendRank(type) {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if (!userinfo) {
        getUserInfo((info) => {
            userinfo = info;
            getFriendData(key, (data) => {
                renderData(data, info, '排行榜', false, type);
            });
        });
    }
    else {
        getFriendData(key, (data) => {
            renderData(data, userinfo, '排行榜', false, type);
        });
    }
}
// 显示当前用户对游戏感兴趣的未注册的好友名单
function showPotentialFriendList() {
    wx.getPotentialFriendList({
        success(res) {
            // res.list.potential = true; // 声明里没有 暂时注释了
            res.list.length > 4 && res.list.pop();
            // 定向分享
            draw('', res.list);
            directional(res.list);
            refreshDirected(showPotentialFriendList);
        },
    });
}
// 显示当前用户所有好友的在线状态
function showFriendsOnlineStatus() {
    gameServer.getFriendsStateData({
        success(res) {
            res.list = res.list.slice(0, 20);
            res.list.onLine = true;
            draw('我的好友', res.list);
        },
    });
}
// PC 接力
function runPCHandoff() {
    // 绘制“查询是否支持接力按钮”
    draw('', {
        button: true,
        isEnabled: true,
        className: 'queryLoginStatus',
        content: '查询是否支持接力',
    });
    // 绑定“查询是否支持接力按钮”的点击事件
    bindCheckHandoffEnabled({
        className: 'queryLoginStatus',
        success(res) {
            console.log('bindCheckHandoffEnabled', res);
            if (!res.isEnabled)
                return draw('', {
                    button: true,
                    isEnabled: res.isEnabled,
                    content: '请下载/登录最新版windows电脑端微信',
                });
            // 绘制“在电脑上打开按钮”
            draw('', {
                button: true,
                isEnabled: res.isEnabled,
                className: 'startHandoff',
                content: '在电脑上打开',
            });
            // 绑定“在电脑上打开按钮”的点击事件
            bindStartHandoff({
                className: 'startHandoff',
            });
        },
        fail(res) {
            console.warn('bindCheckHandoffEnabled', res);
            // 错误处理
            let { errCode } = res;
            if (typeof errCode === 'number')
                errCode = {
                    0: '未知错误',
                    1: '用户取消',
                    2: '电脑微信未登录',
                    3: '电脑微信版本过低',
                }[errCode];
            draw('', {
                button: true,
                isEnabled: false,
                content: `不支持：${errCode || '权限没有开通'}`,
            });
        },
    });
}
function init() {
    currentMaxScore = 0;
    wx.onMessage((data) => {
        switch (data.event) {
            case MessageType.UPDATE_VIEW_PORT:
                Layout.updateViewPort(data.box);
                break;
            case MessageType.SHOW_FRIENDS_RANK:
                showLoading();
                showFriendRank();
                break;
            case MessageType.SHOW_GROUP_FRIENDS_RANK:
                showLoading();
                showGroupRank(data.shareTicket);
                break;
            case MessageType.SET_USER_RECORD:
                setUserRecord(key, data.value);
                break;
            case MessageType.RELATIONAL_CHAIN_INTERACTIVE_DATA:
                showLoading();
                showFriendRank('interaction');
                break;
            case MessageType.DIRECTED_SHARING:
                showLoading();
                showPotentialFriendList();
                break;
            case MessageType.PC_HANDOFF:
                runPCHandoff();
                break;
            case MessageType.SHOW_FRIENDS_ONLINE_STATUS:
                showFriendsOnlineStatus();
                break;
            case MessageType.CLOSE:
                Layout.clearAll();
                break;
            /********* v2 *********/
            case MessageType.RENDER_GROUP_TASK_MEMBERS_INFO:
                renderGroupTaskMembers(data);
                break;
            /********* v2 *********/
        }
    });
}
init();
