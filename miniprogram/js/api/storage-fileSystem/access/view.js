import { p_button, p_text, p_line, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '判断文件/目录是否存在',
            api_name: 'access'
        }),
        tipText = p_text(PIXI, {
            content: '点击查询目录是否存在',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: underline.height + underline.y + 295 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        div;

    let pathArr = [`${wx.env.USER_DATA_PATH}/fileA`, `${wx.env.USER_DATA_PATH}/fileA/test.txt`],
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 98 * PIXI.ratio
        },
        div_child_arr = [];

    for (let i = 0, len = pathArr.length; i < len; i++) {
        i &&
            div_child_arr.push(
                p_line(
                    PIXI,
                    {
                        width: PIXI.ratio | 0,
                        color: 0xe5e5e5
                    },
                    [30 * PIXI.ratio, i * div_child_arr[0].height],
                    [obj.width, 0]
                )
            );

        let num = div_child_arr.length;
        div_child_arr[num] = p_button(PIXI, {
            width: obj.width,
            height: 88 * PIXI.ratio,
            color: 0xffffff,
            radius: 0,
            y: num && div_child_arr[num - 1].height + div_child_arr[num - 1].y
        });

        div_child_arr[num].myAddChildFn(
            p_text(PIXI, {
                content: pathArr[i],
                fontSize: 34 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: {
                    containerWidth: div_child_arr[num].width,
                    containerHeight: div_child_arr[num].height
                }
            })
        );
        div_child_arr[num].onClickFn(() => {
            callBack({
                status: 'access',
                index: i
            });
        });
    }

    divDeploy.height = div_child_arr[div_child_arr.length - 1].y + div_child_arr[div_child_arr.length - 1].height;

    div = p_box(PIXI, divDeploy);
    div.addChild(...div_child_arr);

    container.addChild(goBack, title, api_name, underline, div, tipText, logo, logoName);
    app.stage.addChild(container);

    return container;
};
