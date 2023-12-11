import fixedTemplate from '../../../libs/template/fixed';
import {
    p_scroll,
    p_button,
    p_text,
    p_circle,
    p_texture
} from '../../../libs/component/index';
import component from './renderComponent'

module.exports = function (PIXI, app, obj, titleName, buttonName, tip, config, mode) {
    let container = new PIXI.Container();

    let {
        goBack,
        title,
        underline,
        logo,
        logoName,
        desc,
    } = fixedTemplate(PIXI, {
            obj,
            title: titleName,
            api_name: '',
        }),

        scroll = p_scroll(PIXI, {
            height: obj.height
        }),

        screen = p_texture(PIXI, {
            width: obj.width,
            height: obj.height * 0.8 - (title.height + title.y + 78 * PIXI.ratio),
            y: title.height + title.y,
            x: 0
        });

        screen.onClickFn(component.onTouchEnd.bind(component));

        component.setData({
            screenTop: title.height + title.y + 50,
        });
    
        component.onReady(app, config, mode);

        desc = p_text(PIXI, {
            content: tip,
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: title.height + title.y + 100 + component.data.height,
            relative_middle: {
                containerWidth: obj.width
            }
        });

        if(buttonName != null){
            let button = p_button(PIXI, {
                width: 370 * PIXI.ratio,
                height: 80 * PIXI.ratio,
                fill: 0x07c160,
                y: title.height + title.y + 200 + component.data.height,
            });

            let buttonText =   p_text(PIXI, {
                content: buttonName,
                fontSize: 32 * PIXI.ratio,
                fill: 0x000000,
                relative_middle: {
                    containerWidth: button.width,
                    containerHeight: button.height
                }
            })
    
            button.myAddChildFn(
                buttonText
            );

            button.onClickFn(() => {
                if (config.cameraPosition == 0) {
                    config.cameraPosition = 1
                    buttonText.text = '切换为后置摄像头'
                }else{
                    config.cameraPosition = 0
                    buttonText.text = '切换为前置摄像头'
                }
                component.session.config = config
            })

            scroll.myAddChildFn(button);
        }



    goBack.callBack = () => {
        component.onUnload()
    };

    scroll.myAddChildFn(goBack, title, underline, screen, logo, logoName, desc);

    container.addChild(scroll);
    app.stage.addChild(container);

    return container;
};