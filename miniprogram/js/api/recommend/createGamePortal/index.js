import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let gamePortal,
        codeObj = { 1000: '内部错误', 1001: '参数错误', 1002: '无效的推荐位，请检查推荐位id是否正确', 1004: '无合适的推荐', 1008: '推荐位已关闭' };

    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'createGamePortal':
                // 初始化 init

                // 创建小游戏推荐弹窗组件;
                gamePortal = wx.createGamePortal({ adUnitId: 'PBgAA4PbVUAwNWZA' });

                // 监听小游戏推荐弹窗错误事件
                gamePortal.onError(res => {
                    show.Modal(res.errMsg, codeObj[res.errCode]);
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
                                if (codeObj[res.errCode]) {
                                    show.Modal(res.errMsg, codeObj[res.errCode]);
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
