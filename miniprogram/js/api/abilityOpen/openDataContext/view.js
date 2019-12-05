import { p_button, p_text, p_line, p_img, p_goBackBtn } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
import share from '../../../libs/share';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '开放数据域',
            api_name: '排行榜'
        }),
        report = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: underline.height + underline.y + 123 * PIXI.ratio
        }),
        button = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: report.height + report.y + 123 * PIXI.ratio
        }),
        gButton = p_button(PIXI, {
            width: 300 * PIXI.ratio,
            y: button.height + button.y + 123 * PIXI.ratio
        });

    report.myAddChildFn(
        p_text(PIXI, {
            content: `上报随机分数`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    button.myAddChildFn(
        p_text(PIXI, {
            content: `查看好友排行`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );
    gButton.myAddChildFn(
        p_text(PIXI, {
            content: `查看群排行`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: gButton.width, containerHeight: gButton.height }
        })
    );

    let close = p_button(PIXI, {
        width: 300 * PIXI.ratio,
        y: (obj.height - 200 * PIXI.ratio) | 0
    });

    close.myAddChildFn(
        p_text(PIXI, {
            content: `关闭排行`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: button.width, containerHeight: button.height }
        })
    );

    close.onClickFn(() => {
        container.removeChild(close);
        callBack({
            status: 'close'
        });
    });

    button.onClickFn(() => {
        container.addChild(close);
        callBack({
            status: 'showFriendRank'
        });
    });

    gButton.onClickFn(() => {
        callBack({
            status: 'shareAppMessage'
        });
    });

    report.onClickFn(() => {
        callBack({
            status: 'setUserRecord'
        });
    });

    goBack.callBack = () => {
        callBack({ status: 'close' });
        share();
    };

    container.addChild(goBack, title, api_name, underline, report, button, gButton, logo, logoName);

    app.stage.addChild(container);

    return { container, close };
};
