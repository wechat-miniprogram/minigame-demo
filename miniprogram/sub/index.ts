import style from './render/style.js';
import tplFn from './render/tplfn.js';

import { showLoading } from './loading.js';

import {
  getFriendData,
  getGroupFriendData,
  setUserRecord,
  getUserInfo,
  findSelf,
  injectSelfToList,
  replaceSelfDataInList,
  gameServer,
} from './data.js';

import { interactive, directional, refreshDirected } from './pushMessage.js';

import { bindCheckHandoffEnabled, bindStartHandoff } from './PCHandoff.js';

let userinfo: any;
let selfData: any;
let key = 'rankid';
let currentMaxScore = 0;
let selfIndex = 0;

const Layout = requirePlugin('Layout').default;
GameGlobal.Layout = Layout;

const systemInfo = wx.getSystemInfoSync();
const { screenWidth, pixelRatio } = systemInfo;

const sharedCanvas = wx.getSharedCanvas();
const sharedContext = sharedCanvas.getContext('2d');

function draw(title: any, data: any = []) {
  Layout.clearAll();

  let isBillboard = typeof arguments[arguments.length - 1] !== 'string',
    template = tplFn({
      title: isBillboard ? title : null,
      data,
      self: selfData,
      selfIndex,
      isBillboard,
    });

  Layout.init(template, style);
  Layout.layout(sharedContext);
}

function renderData(data: any, info: any, title = '排行榜', mock = false, type?: any) {
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
  } else if (selfData && currentMaxScore !== undefined) {
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

function showGroupRank(shareTicket: any) {
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
  } else {
    getGroupFriendData(key, shareTicket, (data) => {
      console.log(key, shareTicket, data);
      renderData(data, userinfo, '群排行', false);
    });
  }
}

function showFriendRank(type?: any) {
  /**
   * 用户信息会在子域初始化的时候去拉取
   * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
   */
  if (!userinfo) {
    getUserInfo((info: any) => {
      userinfo = info;
      getFriendData(key, (data: any) => {
        renderData(data, info, '排行榜', false, type);
      });
    });
  } else {
    getFriendData(key, (data: any) => {
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
  // 绘制"查询是否支持接力按钮"
  draw('', {
    button: true,
    isEnabled: true,
    className: 'queryLoginStatus',
    content: '查询是否支持接力',
  });

  // 绑定"查询是否支持接力按钮"的点击事件
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

      // 绘制"在电脑上打开按钮"
      draw('', {
        button: true,
        isEnabled: res.isEnabled,
        className: 'startHandoff',
        content: '在电脑上打开',
      });

      // 绑定"在电脑上打开按钮"的点击事件
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

// 给定 xml 和 style，渲染至 sharedCanvas
function LayoutWithTplAndStyle(xml: any, style: any) {
  // 清空布局
  Layout.clear();
  // 使用xml和style初始化布局
  Layout.init(xml, style);
  // 在sharedCanvas上渲染布局
  Layout.layout(sharedContext);
}

// 仅仅渲染一些提示，比如数据加载中、当前无授权等
function renderTips(tips = '', subTips = '', boxData: {
  left: number,
  top: number,
  width: number,
  height: number,
  scale: number,
}) {
  LayoutWithTplAndStyle(
    getTipsXML({
      tips,
      subTips,
    }),
    getTipsStyle(boxData),
  );
}

/********* 群活动 *********/
import getTipsXML from './render/tpls/tips.js';
import getTipsStyle from './render/styles/tips.js';
import getGroupTaskFriendListXML from './render/tpls/groupTaskFriendList.js';
import getGroupTaskFriendListStyle from './render/styles/groupTaskFriendList.js';
import { getGroupMembersInfo } from './data/index';

// 获取群活动成员参与信息布局
function getGroupTaskBox(hasAssigned: Boolean) {
  // 有指定人时
  if (hasAssigned) {
    return {
      left: 0,
      top: 50,
      width: 343,
      height: 329 - 50,
      scale: (screenWidth / 375) * pixelRatio, // 设计稿屏幕宽度375
    };
  } else { // 无指定人时
    return {
      left: 0,
      top: 0,
      width: 343,
      height: 329,
      scale: (screenWidth / 375) * pixelRatio,
    };
  }
}

async function renderGroupTaskMembers(data: {
  event: string,
  members: string[],
  isRenderCount: boolean,
  isUsingSpecify: boolean,
  chatType: number,
  roomid: string,
  participant: string[],
}) {
  console.log("!!! renderGroupTaskMembers: ", data);
  // 显示加载中
  showLoading();
  const memberCountList: Record<string, number> = {}; // 用于存储每个 openid 的计数
  try {
    // 开放数据域 获取群成员信息
    const groupMembersInfo = await getGroupMembersInfo(data.members);

    // 单聊用
    let participantInfo: any = {};
    // 群聊用
    let groupInfo: any = {};

    function Fn() {
      // 参与人提示信息
      let participantTips;
      if (data.chatType === 1) {
        participantTips = data.participant.length === 2 // 旧版本单聊上传的数据participant可能为[]
          ? `仅${participantInfo.groupMembers[0].nickName}、${participantInfo.groupMembers[1].nickName}可参与`
          : '';
      } else {
        participantTips = data.isUsingSpecify
          ? `仅${groupInfo.name}群指定成员可参与`
          : `仅${groupInfo.name}群成员可参与`;
      }

      // 没有参与记录时
      if (!groupMembersInfo.groupMembers.length) {
        renderTips(
          '暂无记录',
          participantTips,
          getGroupTaskBox(data.isUsingSpecify)
        );
        return;
      }

      if (data.isRenderCount) {
        // 统计每个 openid 的出现次数，用于计算每个成员参与次数
        data.members.forEach((member: string) => {
          if (memberCountList[member]) {
            memberCountList[member]++;
          } else {
            memberCountList[member] = 1;
          }
        });

        // 计算每个成员参与次数
        groupMembersInfo.groupMembers.forEach((member: any) => {
          member.count = memberCountList[member.groupOpenID] || 0;
        });
      }

      // 渲染群活动成员参与信息
      LayoutWithTplAndStyle(
        getGroupTaskFriendListXML({
          data: groupMembersInfo.groupMembers,
          participantTips,
        }),
        getGroupTaskFriendListStyle(getGroupTaskBox(data.isUsingSpecify)),
      );
    }

    // 单聊首先获取参与成员信息
    if (data.chatType === 1) {
      participantInfo = await getGroupMembersInfo(data.participant);
      console.log("!!! participantInfo: ", participantInfo);
      Fn();
    } else { // 群聊首先获取群名称
      // 开放数据域 获取群名称
      wx.getGroupInfo({
        openGId: data.roomid,
        success: (res) => {
          console.log("!!! getGroupInfo success: ", res);
          groupInfo = res;
          Fn();
        },
        fail: (err: any) => {
          console.error("!!! getGroupInfo error: ", err);
          if (err.err_code === -12006) { // 未授权
            wx.showToast({
              title: '未授权',
              icon: 'none',
            });
            Fn();
          }
        },
      });
    }
  } catch (e) {
    console.error('renderGroupTaskMembersInfo error', e);
  }
}
/********* 群活动 *********/

function init() {
  currentMaxScore = 0;

  wx.onMessage((data) => {
    switch (data.event) {
      // 更新Layout视口
      case 'updateViewPort':
        Layout.updateViewPort(data.box);
        break;
      case 'showFriendRank':
        showLoading();
        showFriendRank();
        break;
      case 'showGroupRank':
        showLoading();
        showGroupRank(data.shareTicket);
        break;
      case 'setUserRecord':
        setUserRecord(key, data.value);
        break;
      case 'relationalChaininteractiveData':
        showLoading();
        showFriendRank('interaction');
        break;
      case 'directedSharing':
        showLoading();
        showPotentialFriendList();
        break;
      case 'PCHandoff':
        runPCHandoff();
        break;
      case 'showFriendsOnlineStatus':
        showFriendsOnlineStatus();
        break;
      // 关闭开放数据域Canvas
      case 'close':
        Layout.clearAll();
        break;
      // 渲染群活动成员参与信息
      case 'renderGroupTaskMembersInfo':
        renderGroupTaskMembers(data);
        break;
    }
  });
}

init();
