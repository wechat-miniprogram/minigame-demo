import {
  screenWidth,
  screenHeight,
  changeTips,
  canvas,
  pixelRatio,
  startTicker,
  stopTicker,
  canRenderBox,
} from './common/render';
import { scene } from './common/scene';
import {
  getSubscribeSystemMessage,
  getWxFriendInteraction,
  SYSTEM_MESSAGE,
  SYSTEM_MESSAGE_TYPE,
} from './message';

// 获取开放数据域的canvas并设置长宽
const openDataContext = wx.getOpenDataContext();
const sharedCanvas = openDataContext.canvas;
sharedCanvas.width = screenWidth * pixelRatio;
sharedCanvas.height = screenHeight * pixelRatio;
const context = canvas.getContext('2d');

// 每帧绘制sharecanvas
function drawShareCanvas() {
  context.drawImage(sharedCanvas, 0, 0);
}

scene.init([
  {
    title: '首页场景',
    explanation: `<p>当前代码片段主要是为了演示</p>
      <p><strong>如何使用系统订阅消息</strong></p>
      <br>
      <p>本项目主要演示以下API的使用:
      <br>
      <span style="color: green">wx.requestSubscribeSystemMessage</span>｜
      <span style="color: green">wx.modifyFriendInteractiveStorage</span>｜
      <span style="color: green">wx.authorize</span>｜
      <span style="color: green">wx.getOpenDataContext</span>｜
      <span style="color: green">wx.getSetting</span>｜
      <span style="color: green">wx.onMessage</span>｜
      <span style="color: green">wx.setUserCloudStorage</span>
      <span style="color: green">wx.getFriendCloudStorage</span>
      </p>
      <br>
      <p>主要的实现逻辑都在<span style="color: blue"> message.ts、openDataContext、jsserver </span> 中</p>
      <p>主要的调用逻辑都在<span style="color: blue"> game.ts </span> 中，可以参考如何调用</p>
      <br>
      <p>通过点击下方的“下一场景”或“上一场景”来切换场景体验</p>`,
  },
  {
    title: '权限校验场景',
    explanation: `<p>当前场景是为了演示如何授权使用系统订阅消息</p>
      <p>主要演示<span style="color: green"> wx.requestSubscribeSystemMessage </span>的使用</p>
      <p>可以查看<span style="color: blue"> message.ts </span> 中 <span style="color: blue"> getSubscribeSystemMessage &nbsp; </span> 函数</p>
      <br>
      <p>该场景通过使用<span style="color: green"> wx.getSetting </span> 判断用户是否已授权（必须两个权限都已授权才能使用后续功能）</p>`,
    exposed: () => {
      changeTipText();
      wx.onShow(changeTipText);
    },
    buttons: [
      {
        name: '获取朋友权限',
        callback: () => {
          getWxFriendInteraction().then(() => {
            changeTipText();
          });
        },
      },
      {
        name: '获取消息权限',
        callback: () => {
          getSubscribeSystemMessage().then(() => {
            changeTipText();
          });
        },
      },
    ],
    destroyed: () => {
      changeTips();
      wx.offShow(changeTipText);
    },
  },
  {
    title: '好友互动场景',
    explanation: `<p>当前场景是为了模拟真实游戏过程中，需要与好友互动的情况</p>
      <p>演示<span style="color: green">wx.modifyFriendInteractiveStorage</span>和<span style="color: green">wx.getFriendCloudStorage</span>的使用</p>
      <p>代码可以查看<span style="color: blue">openDataContext</span></p>`,
    exposed: () => {
      openDataContext.postMessage({
        command: 'renderFriend',
        box: canRenderBox,
      });
      startTicker(drawShareCanvas);
    },
    destroyed: () => {
      stopTicker(drawShareCanvas);
    },
  },
]);

function changeTipText() {
  changeTips();
  wx.getSetting({
    withSubscriptions: true,
    success(res) {
      let friendTip = '';
      if (res.authSetting['scope.WxFriendInteraction']) {
        friendTip = '微信朋友信息：已授权使用';
      } else {
        friendTip = '微信朋友信息：未授权使用，拒绝后可在设置页打开';
      }
      const SYS_MSG_TYPE_INTERACTIVE =
        res.subscriptionsSetting.itemSettings?.SYS_MSG_TYPE_INTERACTIVE;
      let systemTip =
        SYSTEM_MESSAGE[SYS_MSG_TYPE_INTERACTIVE as keyof SYSTEM_MESSAGE_TYPE];
      if (systemTip === undefined || systemTip === null) {
        systemTip = '发生错误，麻烦联系官方说明情况';
      }
      if (res.subscriptionsSetting.mainSwitch === false) {
        systemTip = '系统消息订阅权限：需打开主开关设置';
      }
      changeTips([friendTip, systemTip]);
    },
  });
}
