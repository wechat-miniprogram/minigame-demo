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

import { pushMessage } from './pushMessage.js';


let userinfo;
let selfData;
let key             = 'score';
let currentMaxScore = 0;
let selfIndex       = 0;

let sharedCanvas  = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
function draw(title, data = []) {
    Layout.clear();
    let template = tplFn({
        title,
        data,
        self     : selfData,
        selfIndex,
    });

    Layout.init(template, style);
    Layout.layout(sharedContext);
}

function renderData(data, info, title="排行榜", mock=false) {
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
    //     for ( let i = data.length; i < 20; i++ ) {
    //         data[i] = JSON.parse(JSON.stringify(selfData));
    //         data[i].rank = i;
    //         data[i].score = 0;
    //         data[i].nickname = 'mock__user';
    //     }
    // }


    draw(title, data, selfData, currentMaxScore);

    if ( mock ) if ( mock ) pushMessage( data, selfData );
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

function showFriendRank() {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if ( !userinfo ) {
        getUserInfo((info) => {
            userinfo = info;
            getFriendData(key, (data) => {
                renderData(data, info, "排行榜", true);
            });
        });
    } else {
        getFriendData(key, (data) => {
            renderData(data, userinfo, "排行榜", true);
        });
    }
}

function init() {
    currentMaxScore = 0;

    wx.onMessage(data => {
        if ( data.event === 'updateViewPort' ) {
            Layout.updateViewPort(data.box);
        } else if ( data.event === 'showFriendRank' ) {
            showFriendRank();
        } else if ( data.event === 'showGroupRank' ) {
            showGroupRank(data.shareTicket);
        } else if ( data.event === 'setUserRecord' ) {
            setUserRecord(key, data.value);
        } else if ( data.event === 'close' ) {
            Layout.clearAll();
        }
    });
}

init();

