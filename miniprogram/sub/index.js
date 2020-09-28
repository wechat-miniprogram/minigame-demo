import style    from 'render/style.js';
import tplFn    from 'render/tplfn.js';
import Layout   from './engine.js';

import {
    getFriendData,
    getGroupFriendData,
    setUserRecord,
    getUserInfo,
    findSelf,
    injectSelfToList,
    replaceSelfDataInList,
} from 'data.js';

import {
    interactive,
    directional,
    refreshDirected
} from './pushMessage.js';

import { bindCheckHandoffEnabled, bindStartHandoff } from './PCHandoff.js';

let userinfo;
let selfData;
let key             = 'rankid';
let currentMaxScore = 0;
let selfIndex       = 0;

let sharedCanvas  = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
function draw(title, data = []) {
    Layout.clearAll();

    let isBillboard = typeof arguments[arguments.length -1] !== 'string',
    template = tplFn({
        title    : isBillboard ? title : null,
        data,
        self     : selfData,
        selfIndex,
        isBillboard
    });

    Layout.init(template, style);
    Layout.layout(sharedContext);
}

function renderData(data, info, title="排行榜", mock=false, type) {
    data.sort( (a, b) => b.score - a.score);
    let find  = findSelf(data, info);
    selfData  = find.self;
    selfIndex = find.index + 1;

    /**
        * 拉取排行榜的时候无法确定排行榜中是否有自己，或者即便有自己分数也是旧的
        * 如果拉取排行榜之前先调用setUserCloudStorage来上报分数再拉取排行榜
        * 那么第一次渲染排行榜会非常之慢。针对这种场景需要根据情况处理：
        * 1. 如果拉取排行榜之前有调用分数上报接口，将每次上报的分数缓存起来，然后插入或者替换排行榜中的自己
        * 2. 如果拉取排行榜之前没有调用分数上报接口，忽略1的逻辑
        */
    if ( !selfData && currentMaxScore !== undefined ) {
        injectSelfToList(data, info, currentMaxScore);
        let find  = findSelf(data, info);
        selfData  = find.self;
        selfIndex = find.index + 1;
    } else if ( selfData && currentMaxScore !== undefined ) {
        // 替换自己的分数
        replaceSelfDataInList(data, info, currentMaxScore);
    }

    // mock
    // if ( mock ) {
        // for ( let i = data.length; i < 20; i++ ) {
        //     data[i] = JSON.parse(JSON.stringify(selfData));
        //     data[i].rank = i;
        //     data[i].score = 0;
        //     data[i].nickname = 'mock__user';
        // }
    // }


    draw(title, data, selfData, currentMaxScore, type);

    // 关系链互动
    type === 'interaction' && interactive( data, selfData );
}

function showGroupRank(shareTicket) {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if ( !userinfo ) {
        getUserInfo((info) => {
            userinfo = info;
            getGroupFriendData(key, shareTicket, data =>{
                renderData(data, info, "群排行", false);
            });
        });
    } else {
        getGroupFriendData(key, shareTicket, data =>{
            renderData(data, userinfo, "群排行", false);
        });
    }
}

function showFriendRank(type) {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if ( !userinfo ) {
        getUserInfo((info) => {
            userinfo = info;
            getFriendData(key, (data) => {
                renderData(data, info, "排行榜", true, type);
            });
        });
    } else {
        getFriendData(key, (data) => {
            renderData(data, userinfo, "排行榜", true, type);
        });
    }
}

// 显示当前用户对游戏感兴趣的未注册的好友名单
function showPotentialFriendList(){
    wx.getPotentialFriendList({
        success( res ) {
            res.list.potential = true;
            res.list.length > 4 && res.list.pop();

            // 定向分享
            draw('', res.list, selfData, currentMaxScore, 'directional');

            directional(res.list);
            refreshDirected(showPotentialFriendList);
        }
    })
}

// PC 接力
function runPCHandoff() {
    // 绘制“查询是否支持接力按钮”
    draw('', { button: true, isEnabled: true, className: 'queryLoginStatus', content: '查询是否支持接力' });

    // 绑定“查询是否支持接力按钮”的点击事件
    bindCheckHandoffEnabled({
        className: 'queryLoginStatus',
        success(res) {
            if (!res.isEnabled) return draw('', { button: true, isEnabled: res.isEnabled, content: '不支持：电脑端微信未响应' });

            // 绘制“在电脑上打开按钮”
            draw('', { button: true, isEnabled: res.isEnabled, className: 'startHandoff', content: '在电脑上打开' });

            // 绑定“在电脑上打开按钮”的点击事件
            bindStartHandoff({className: 'startHandoff'})
        },
        fail(res) {
            // 错误处理
            let { errCode } = res;
            if (typeof errCode === 'number') errCode = { 0: '未知错误', 1: '用户取消', 2: '电脑微信未登录', 3: '电脑微信版本过低' }[errCode]

            draw('', { button: true, isEnabled: false, content: `不支持：${errCode || '微信版本过低'}` });
        },
    });
}

function init() {
    currentMaxScore = 0;

    wx.onMessage(data => {

        switch ( data.event ) {
            case 'updateViewPort':
                Layout.updateViewPort(data.box);
                break;
            case 'showFriendRank':
                showFriendRank();
                break;
            case 'showGroupRank':
                showGroupRank(data.shareTicket);
                break;
            case 'setUserRecord':
                setUserRecord(key, data.value);
                break;
            case 'relationalChaininteractiveData':
                showFriendRank('interaction');
                break;
            case 'directedSharing':
                showPotentialFriendList();
                break;
            case 'PCHandoff':
                runPCHandoff();
                break;
            case 'close':
                Layout.clearAll();
                break;
        }

    });
}

init();

