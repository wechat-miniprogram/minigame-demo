import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let gamePortal;
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'createGamePortal':
                // 初始化 init

                // 创建小游戏推荐弹窗组件;
                gamePortal = wx.createGamePortal({ adUnitId: 'PBgAA4PbVUAwNWZA' });

                // 监听小游戏推荐弹窗错误事件
                gamePortal.onError(res => {
                    show.Modal(res.errMsg, '发生错误');
                });

                break;

            case 'show':
                // 加载 小游戏推荐弹窗
                gamePortal
                    .load()
                    .then(() => {
                        // 显示 小游戏推荐弹窗
                        gamePortal.show();
                    })
                    .catch(() => {
                        show.Modal('小游戏推荐弹窗显示失败', '发生错误');
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
