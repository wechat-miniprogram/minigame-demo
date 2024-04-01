import {
  hideUserInfoButton,
  createUserInfoButton,
  requirePrivacyAuthorize,
  getAuth,
  scope,
  AuthKey,
} from './auth';
import { screenWidth, screenHeight, changeTips } from './common/render';
import { scene } from './common/scene';

// 当前的坐标位置只是示例，实际使用时需要根据具体需求对齐游戏UI
const userInfoButtonRect = {
  x: screenWidth / 2 - 70,
  y: screenHeight / 2 + 50,
  width: 140,
  height: 40,
};

let userInfo = {
  nickName: '',
};

scene.init([
  {
    title: '首页场景',
    explanation: `<p>当前代码片段主要是为了演示</p>
      <p><strong>如何获取用户个人信息和隐私授权</strong></p>
      <br>
      <p>本项目主要演示以下API的使用:
      <br>
      <span style="color: green">wx.createUserInfoButton</span>｜
      <span style="color: green">wx.getUserInfo</span>｜
      <span style="color: green">wx.authorize</span>｜
      <span style="color: green">wx.requirePrivacyAuthorize</span>｜
      <span style="color: green">wx.getPrivacySetting</span>｜
      <span style="color: green">wx.getSetting</span>｜
      <span style="color: green">wx.openSetting</span>
      </p>
      <br>
      <p>主要的实现逻辑都在<span style="color: blue">auth.ts</span>中，可以直接复制该脚本使用</p>
      <p>主要的调用逻辑都在<span style="color: blue">game.ts</span>中，可以参考如何调用</p>
      <br>
      <p>通过点击下方的“下一场景”或“上一场景”来切换场景体验</p>`,
  },
  {
    title: '登录场景',
    explanation: `<p>当前场景是为了演示如何获取用户信息</p>
      <p>主要演示<span style="color: green">wx.createUserInfoButton</span>的使用</p>
      <p>可以查看<span style="color: blue">auth.ts</span>中<span style="color: blue">createUserInfoButton</span>函数</p>
      <br>
      <p>先通过<span style="color: green">wx.getSetting</span>判断用户是否已授权</p>
      <p>如果用户未曾授权过个人信息，则本场景会出现获取个人信息按钮</p>
      <p>如果用户已授权过个人信息，则会直接通过<span style="color: green">wx.getUserInfo</span>来获取信息</p>
      <p>如果用户授权了个人信息，则本场景会展示获取的用户昵称：</p>`,
    exposed: () => {
      // 当切换到首页场景，需要登录
      if (scope.userInfo) {
        changeTips('昵称: ' + userInfo.nickName);
      } else {
        createUserInfoButton('登录-获取信息', userInfoButtonRect, (res) => {
          console.log('用户登录成功', res);
          userInfo = res.userInfo;
          changeTips('昵称: ' + userInfo.nickName);
        });
      }
    },
    destroyed: () => {
      hideUserInfoButton();
      changeTips('');
    },
  },
  {
    title: '其他用户信息场景',
    explanation: `<p>当前场景是为了模拟真实游戏过程中，需要切换场景时，<strong>userInfoButton的销毁和创建</strong></p>
      <p>可以查看<span style="color: blue">auth.ts</span>中<span style="color: blue">hideUserInfoButton</span>函数</p>
      <br>
      <p>注意：由于按钮的创建是异步的，如果来回切换场景，则可能出现重叠情况，实际场景中不要出现频繁的创建，建议只使用一个</p>
      <br>
      <p>如果用户未曾授权过个人信息，则依然会创建一个获取个人信息的按钮</p>
      <br>
      <p>如果用户授权了个人信息，则本场景会展示获取的用户昵称：</p>`,
    exposed: () => {
      // 当切换到其他有需要登录的场景
      if (scope.userInfo) {
        changeTips('昵称: ' + userInfo.nickName);
      } else {
        createUserInfoButton('其他-获取信息', userInfoButtonRect, (res) => {
          console.log('用户登录成功', res);
          userInfo = res.userInfo;
          changeTips('昵称: ' + userInfo.nickName);
        });
      }
    },
    destroyed: () => {
      hideUserInfoButton();
      changeTips('');
    },
  },
  {
    title: 'Loading场景',
    explanation: `<p>当前场景是为了模拟<strong>提前弹出隐私协议弹窗</strong>，避免在其他需要用到隐私数据的场景弹出</p>
      <p>主要演示<span style="color: green">wx.requirePrivacyAuthorize</span>的使用</p>
      <p>可以查看<span style="color: blue">auth.ts</span>中<span style="color: blue">requirePrivacyAuthorize</span>函数</p>
      <br>
      <p>如果是开发者工具中，可以通过<strong>“清缓存-全部清除-编译”</strong>来清除隐私授权信息来重新进行测试</p>
      <br>
      <p>下方会有文案说明用户是否同意了隐私协议：</p>`,
    exposed: () => {
      // 当需要提前弹出授权弹窗时，可以提前弹出让用户授权，requirePrivacyAuthorize不是必须的
      requirePrivacyAuthorize()
        .then(() => {
          changeTips('用户同意了隐私协议');
        })
        .catch(() => {
          changeTips('用户拒绝了隐私协议');
        });
    },
    destroyed: () => {
      changeTips('');
    },
  },
  {
    title: '好友数据场景',
    explanation: `<p>当前场景是为了模拟需要<strong>使用开放数据域的场景</strong>，获取好友授权</p>
      <p>主要演示<span style="color: green">wx.authorize</span>的使用</p>
      <p>除个人信息外，都可以使用wx.authorize提前向用户发起授权请求，及时我们并没有调用到相关的接口</p>
      <p>可以查看<span style="color: blue">auth.ts</span>中<span style="color: blue">getAuth</span>函数</p>
      <br>
      <p>如果调试面板提示<span style="color: red">please go to mp to announce your privacy usage</span>，请先在mp端更新隐私协议”</p>
      <p>如果调试面板提示<span style="color: red">please go to mp open official popup</span>，请先在mp端设置隐私授权弹窗”</p>
      <p>如果调试面板提示<span style="color: red">api scope is not declared in the privacy agreement</span>，请先在mp端配置《用户隐私保护指引》中增加“微信朋友关系”</p>
      <br>
      <p>下方会有文案说明用户是否同意了好友授权：</p>`,
    exposed: () => {
      // 当需要展示排行榜时，需要好友授权
      if (scope.WxFriendInteraction) {
        changeTips('同意好友授权\n可以使用开放数据域接口');
      } else {
        changeTips('尚未授权\n无法使用开放数据域接口');
        getAuth(AuthKey.WxFriendInteraction)
          .then(() => {
            changeTips('已同意好友授权\n可以使用开放数据域接口');
          })
          .catch(() => {
            changeTips('不同意好友授权\n无法使用开放数据域接口');
          });
      }
    },
    destroyed: () => {
      changeTips('');
    },
  },
  {
    title: '保存图片场景',
    explanation: `<p>当前场景是为了模拟需要<strong>保存图片的场景</strong></p>
      <br>
      <p>主要演示<span style="color: green">wx.openSetting</span>的使用</p>
      <p>在不使用wx.authorize的情况下，直接调用需要隐私授权的接口，也会向用户发起授权请求</p>
      <br>
      <p>如果调试面板提示<span style="color: red">please go to mp to announce your privacy usage</span>，请先在mp端更新隐私协议”</p>
      <p>如果调试面板提示<span style="color: red">please go to mp open official popup</span>，请先在mp端设置隐私授权弹窗”</p>
      <p>如果调试面板提示<span style="color: red">api scope is not declared in the privacy agreement</span>，请先在mp端配置《用户隐私保护指引》中增加“相册（仅写入）权限”</p>
      <br>
      <p>这个示例并不会成功保存图片，仅演示授权逻辑，请点击下方按钮调用接口：</p>`,

    exposed: () => {},
    buttons: [
      {
        name: '保存图片',
        callback: () => {
          changeTips('');
          // 这个示例并不会成功保存图片，只是演示授权逻辑
          wx.saveImageToPhotosAlbum({
            filePath: '',
            success: (res) => {
              console.log('保存成功', res);
            },
            fail: (res) => {
              console.error('保存失败', res);
              if (res.errMsg.indexOf('auth') > -1) {
                getAuth(AuthKey.writePhotosAlbum);
              } else {
                changeTips('调用了保存，但是保存失败');
              }
            },
          });
        },
      },
    ],
    destroyed: () => {
      changeTips('');
    },
  },
]);
