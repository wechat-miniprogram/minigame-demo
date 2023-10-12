import view from '../common/view'

module.exports = function (PIXI, app, obj, callBack) {
    let container = view(PIXI, app, obj, '水平面AR', null, '提示：触碰屏幕任意点, \n可在对应位置生成示例的机器小人, 其中光标标记指示的是水平面', {
        track: {
            plane: {
                mode: 3
            },
        },
        version: 'v1',
    }, 'planeAR')
    return container;
};