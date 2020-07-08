import view from './view';
import * as show from '../../../libs/show';
import { gameAdError } from '../../../errMsg/index';
module.exports = function(PIXI, app, obj) {
    let gameBanner;
    return view(PIXI, app, obj, data => {
        let { status, style, drawFn } = data;
        switch (status) {
            case 'createGameBanner':
                // 创建 小游戏推荐 banner 组件;
                gameBanner = wx.createGameBanner({
                    adUnitId: 'PBgAA4PbVUA3tXjM',
                    style: {
                        left: style.left,
                        top: style.top
                    }
                });

                wx.showLoading({ title: '打开中...', mask: true });

                // 监听 小游戏推荐 banner 加载事件。
                gameBanner.onLoad(() => {
                    wx.hideLoading();

                    // 需要主动调用show函数小游戏推荐 banner 才会显示
                    gameBanner.show();

                    drawFn(); // 更新UI
                });

                // 监听 小游戏推荐 banner 错误事件。
                gameBanner.onError(res => {
                    wx.hideLoading();

                    show.Modal(gameAdError[res.errCode], '发生错误');

                    drawFn(res); // 更新UI
                });

                break;

            case 'hide':
                // 隐藏 小游戏推荐 banner
                gameBanner.hide();

                drawFn(); // 更新UI

                break;

            case 'show':
                // 显示 小游戏推荐 banner
                gameBanner.show();

                drawFn(); // 更新UI

                break;

            case 'destroy':
                if (!gameBanner) return;

                gameBanner.hide();

                // 销毁 小游戏推荐 banner
                gameBanner.destroy();
                gameBanner = null;

                drawFn && drawFn(); // 更新UI

                break;
        }
    });
};
