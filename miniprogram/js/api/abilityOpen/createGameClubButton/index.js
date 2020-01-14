import view from './view';
module.exports = function(PIXI, app, obj) {
    let button;
    return view(PIXI, app, obj, data => {
        let { status, style } = data;
        switch (status) {
            case 'createGameClubButton':
                // 创建游戏圈按钮,游戏圈按钮被点击后会跳转到小游戏的游戏圈
                button = wx.createGameClubButton({
                    icon: 'green',
                    style: {
                        left: style.x,
                        top: style.y,
                        width: 40,
                        height: 40
                    }
                });

                break;
            case 'destroy':
                // 销毁游戏圈按钮
                button.destroy();

                break;
        }
    });
};
