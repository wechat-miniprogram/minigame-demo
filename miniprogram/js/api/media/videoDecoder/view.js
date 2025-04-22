import fixedTemplate from '../../../libs/template/fixed';

// 主视图组件（保持原有的默认导出）
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '视频解码器',
            api_name: 'videoDecoder'
        });

    // 创建视频 开始
    callBack({
        status: 'createVideoDecoder',
    });
    // 创建视频 结束

    goBack.callBack = callBack.bind(null, { status: 'destroy' });
    container.addChild(goBack, title, api_name, underline, logo, logoName);

    app.stage.addChild(container);

    return container;
};