import { TinyEmitter } from '../libs/tinyemitter';
class Screen extends TinyEmitter {
    _scenes = [
        {
            title: '首页场景',
            explanation: `<p>当前代码片段主要是为了演示</p>
        <p><strong>如何获取用户个人信息和隐私授权</strong></p>
        <br>
        <p>主要演示以下API的使用:
        <br>
        <span style="color: green">wx.createUserInfoButton</span>｜
        <span style="color: green">wx.getUserInfo</span>｜
        <span style="color: green">wx.authorize</span>｜
        <span style="color: green">wx.requirePrivacyAuthorize</span>｜
        <span style="color: green">wx.getPrivacySetting</span>｜
        <span style="color: green">wx.getSetting</span>｜
        <span style="color: green">wx.openSetting</span>
        </p>
        <p>主要的实现逻辑都在auth.ts中，可以直接复制该脚本使用</p>`,
        },
        {
            title: '其他场景',
            explanation: `<p>当前场景是为了模拟真实游戏过程中，需要切换场景时，userInfoButton的销毁和创建</p>`,
        },
        {
            title: '结算场景',
            explanation: `<p>当前场景是为了模拟需要使用开放数据域的场景，获取好友授权</p>
        <p>如果调试面板提示<span style="color: red">please go to mp open official popup</span>，请先在mp端设置隐私授权弹窗”</p>
        <p>如果调试面板提示<span style="color: red">game appid no privacy api permission</span>，请先在mp端配置《用户隐私保护指引》中增加“微信朋友关系”</p>`,
        },
    ];
    _currentIndex = 0;
    constructor() {
        super();
        this.emit('sceneChanged');
    }
    get currentIndex() {
        return this._currentIndex;
    }
    get currentScene() {
        return this._scenes[this._currentIndex];
    }
    changeScene(index) {
        this._currentIndex = index;
    }
    nextScene() {
        this._currentIndex += 1;
        if (this._currentIndex > this._scenes.length - 1) {
            this._currentIndex = 0;
        }
        this.emit('sceneChanged');
    }
    preScene() {
        this._currentIndex -= 1;
        if (this._currentIndex < 0) {
            this._currentIndex = this._scenes.length - 1;
        }
        this.emit('sceneChanged');
    }
}
export const scene = new Screen();
