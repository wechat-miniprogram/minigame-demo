import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '视频',
            api_name: 'video'
        });

    // 创建视频 开始
    callBack({
        status: 'createVideo',
        data: {
            x: (75 * obj.width) / (375 * 2 * obj.pixelRatio),
            y: (underline.y + underline.height + 83 * PIXI.ratio) / obj.pixelRatio,
            width: (300 * obj.width) / (375 * obj.pixelRatio),
            height: (225 * obj.width) / (375 * obj.pixelRatio)
        }
    });
    // 创建视频 结束

    goBack.callBack = callBack.bind(null, { status: 'destroy' });
    container.addChild(goBack, title, api_name, underline, logo, logoName);

    app.stage.addChild(container);

    return container;
};
