// import { p_button, p_text} from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: 'banner 广告',
            api_name: 'createBannerAd'
        });
       



    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        logo,
        logoName
    );

    app.stage.addChild(container);

    return container;
};
