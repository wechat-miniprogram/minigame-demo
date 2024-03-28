import { hideUserInfoButton, createUserInfoButton, requirePrivacyAuthorize, getAuth, scope, AuthKey, } from './auth';
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
      <p>主要的实现逻辑都在auth.ts中，可以直接复制该脚本使用</p>
      <br>
      <p>当前场景是为了演示如何获取用户信息</p>`,
        exposed: () => {
            // 当切换到首页场景，需要登录
            if (scope.userInfo) {
                changeTips('昵称: ' + userInfo.nickName);
            }
            else {
                createUserInfoButton('首页-获取信息', userInfoButtonRect, (res) => {
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
        explanation: `<p>当前场景是为了模拟真实游戏过程中，需要切换场景时，userInfoButton的销毁和创建</p>`,
        exposed: () => {
            // 当切换到其他有需要登录的场景
            if (scope.userInfo) {
                changeTips('昵称: ' + userInfo.nickName);
            }
            else {
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
        title: 'loading场景',
        explanation: `<p>当前场景是为了模拟提前弹出隐私协议弹窗，避免在其他需要用到隐私数据的场景弹出</p>
      <br>
      <p>如果是开发者工具中，可以通过“清缓存”来清除隐私授权信息来进行测试</p>`,
        exposed: () => {
            // 当需要提前弹出授权弹窗时，可以提前弹出让用户授权，requirePrivacyAuthorize不是必须的
            requirePrivacyAuthorize()
                .then(() => {
                changeTips('用户同意隐私协议');
            })
                .catch(() => {
                changeTips('用户拒绝隐私协议');
            });
        },
        destroyed: () => {
            changeTips('');
        },
    },
    {
        title: '好友数据场景',
        explanation: `<p>当前场景是为了模拟需要使用开放数据域的场景，获取好友授权</p>
      <br>
      <p>如果调试面板提示<span style="color: red">please go to mp open official popup</span>，请先在mp端设置隐私授权弹窗”</p>
      <p>如果调试面板提示<span style="color: red">game appid no privacy api permission</span>，请先在mp端配置《用户隐私保护指引》中增加“微信朋友关系”</p>`,
        exposed: () => {
            // 当需要展示排行榜时，需要好友授权
            if (scope.WxFriendInteraction) {
                changeTips('同意好友授权\n可以使用开放数据域接口');
            }
            else {
                changeTips('尚未授权\n无法使用开放数据域接口');
                getAuth(AuthKey.WxFriendInteraction)
                    .then(() => {
                    changeTips('同意好友授权\n可以使用开放数据域接口');
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
        explanation: `<p>当前场景是为了模拟需要保存图片的场景</p>
      <br>
      <p>这个示例并不会成功保存图片，只是演示授权逻辑</p>
      <br>
      <p>如果调试面板提示<span style="color: red">please go to mp open official popup</span>，请先在mp端设置隐私授权弹窗”</p>
      <p>如果调试面板提示<span style="color: red">game appid no privacy api permission</span>，请先在mp端配置《用户隐私保护指引》中增加“相册（仅写入）权限”</p>`,
        exposed: () => { },
        buttons: [
            {
                name: '保存图片',
                callback: () => {
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
