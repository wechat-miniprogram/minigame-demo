import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let gameIcon;
    return view(PIXI, app, obj, data => {
        let { status, style, drawFn } = data;
        switch (status) {
            case 'createGameIcon':
                // 创建 小游戏推荐icon 组件;
                gameIcon = wx.createGameIcon({
                    adUnitId: 'PBgAA4PbVUA7satk',
                    count: style.length,
                    style: style.map(item => {
                        return {
                            appNameHidden: true,
                            color: '#ffffff',
                            size: 64,
                            borderWidth: 5,
                            borderColor: '#ffffff',
                            left: item.left,
                            top: item.top
                        };
                    })
                });

                // 监听 小游戏推荐icon 加载事件。
                gameIcon.onLoad(() => {
                    // 需要主动调用show函数小游戏推荐icon 才会显示
                    gameIcon.show();

                    drawFn(); // 更新UI
                });

                // 监听 小游戏推荐icon 错误事件。
                gameIcon.onError(res => {
                    wx.hideLoading();

                    show.Modal(res.errMsg, '发生错误');

                    drawFn(res); // 更新UI
                });

                break;

            case 'hide':
                // 隐藏 小游戏推荐icon
                gameIcon.hide();

                drawFn(); // 更新UI

                break;

            case 'show':
                // 显示 小游戏推荐icon
                gameIcon.show();

                drawFn(); // 更新UI

                break;

            case 'destroy':
                if (!gameIcon) return;

                gameIcon.hide();

                // 销毁 小游戏推荐icon
                gameIcon.destroy();
                gameIcon = null;

                drawFn && drawFn(); // 更新UI

                break;
        }
    });
};
