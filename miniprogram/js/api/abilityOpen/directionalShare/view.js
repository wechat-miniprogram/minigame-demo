import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '定向分享',
            underline: false
        });

    goBack.callBack = () => {
        callBack({ status: 'close' });
    };

    callBack({ status: 'directionalShare' });

    container.addChild(goBack, title, logo, logoName);

    app.stage.addChild(container);

    return container;
};
