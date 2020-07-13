import view from './view';
import * as show from '../../../libs/show';
import { gameAdError } from '../../../errMsg/index';
module.exports = function(PIXI, app, obj) {
    let gamePortal;

    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'createGamePortal':
                // 初始化 init

                // 创建小游戏推荐弹窗组件;
                gamePortal = wx.createGamePortal({ adUnitId: 'PBgAA4PbVUAwNWZA' });

                // 监听小游戏推荐弹窗错误事件
                gamePortal.onError(res => {
                    show.Modal(gameAdError[res.errCode], '发生错误');
                });

                break;

            case 'show':
                // 显示 小游戏推荐弹窗
                gamePortal
                    .show()
                    .then(drawFn) // 更新UI
                    .catch(() => {
                        // 显示失败 再次加载弹窗
                        gamePortal
                            .load()
                            .then(() => {
                                // 显示 小游戏推荐弹窗
                                gamePortal.show();

                                drawFn(); // 更新UI
                            })
                            .catch(res => {
                                if (res.errCode) {
                                    show.Modal(gameAdError[res.errCode], '发生错误');
                                } else {
                                    // 显示 小游戏推荐弹窗
                                    gamePortal.show();
                                }

                                drawFn(); // 更新UI
                            });
                    });

                break;

            case 'destroy':
                if (!gamePortal) return;

                // 销毁 小游戏推荐弹窗
                gamePortal.destroy();
                gamePortal = null;

                break;
        }
    });
};
