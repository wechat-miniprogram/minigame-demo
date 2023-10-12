
import view from '../common/view'

module.exports = function (PIXI, app, obj, callBack) {
  let container = view(PIXI, app, obj, 'VisionKit基础', null, '提示：触碰屏幕任意点, \n可在对应位置生成示例的机器小人', 
    {
        track: {
            plane: {
                mode: 3
            },
        },
        version: 'v1',
    })
  return container;
};