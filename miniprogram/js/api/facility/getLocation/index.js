import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'getLocation':
                wx.getLocation({
                    success: drawFn // 获取成功后直接调用drawFn函数修改UI
                });
                break;
        }
    });
};

//  getLocation 需要在game.json 中声明 permission 字段
//  "permission": {
//     "scope.userLocation": {
//         "desc": "你的位置信息将用于小程序位置接口的效果展示"
//     }
// }
