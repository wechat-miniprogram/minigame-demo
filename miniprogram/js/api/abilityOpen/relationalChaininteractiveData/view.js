import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '关系链互动数据',
            underline: false
        });

    goBack.callBack = () => {
        callBack({ status: 'close' });
    };

    callBack({ status: 'relationalChaininteractiveData' });

    container.addChild(goBack, title, logo, logoName);

    app.stage.addChild(container);

    return container;
};
