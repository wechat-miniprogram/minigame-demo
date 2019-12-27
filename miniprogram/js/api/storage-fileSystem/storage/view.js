import { p_button, p_text, p_box } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '数据储存',
            api_name: 'get/set/clear/Storage'
        }),
        div,
        setStorageButton,
        getStorageButton,
        clearStorageButton;

    let storage = {
            key: 'miniGame',
            value: Math.random()
                .toString(36)
                .substr(2)
        },
        divDeploy = {
            height: 0,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: underline.height + underline.y + 81 * PIXI.ratio
        },
        div_container = new PIXI.Container(),
        div_container_child_arr = [];

    for (let i = 0, arr = Object.keys(storage), len = arr.length; i < len; i++) {
        div_container_child_arr[i] = p_box(PIXI, {
            height: 87 * PIXI.ratio,
            border: {
                width: PIXI.ratio | 0,
                color: 0xe5e5e5
            },
            y: i && div_container_child_arr[i - 1].height + div_container_child_arr[i - 1].y - (PIXI.ratio | 0)
        });

        div_container_child_arr[i].addChild(
            p_text(PIXI, {
                content: arr[i],
                fontSize: 34 * PIXI.ratio,
                x: 30 * PIXI.ratio,
                relative_middle: { containerHeight: div_container_child_arr[i].height }
            }),
            (storage[arr[i]] = p_text(PIXI, {
                content: storage[arr[i]],
                fontSize: 34 * PIXI.ratio,
                fill: 0x8f8f8f,
                relative_middle: {
                    containerWidth: div_container_child_arr[i].width,
                    containerHeight: div_container_child_arr[i].height
                }
            }))
        );
    }

    divDeploy.height =
        div_container_child_arr[div_container_child_arr.length - 1].y +
        div_container_child_arr[div_container_child_arr.length - 1].height;

    div = p_box(PIXI, divDeploy);
    div_container.addChild(...div_container_child_arr);
    div_container.mask = p_box(PIXI, {
        width: div.width - 30 * PIXI.ratio,
        height: divDeploy.height - 2 * PIXI.ratio,
        x: 30 * PIXI.ratio
    });
    div.addChild(div_container, div_container.mask);

    // 存储数据 “按钮” 开始
    setStorageButton = p_button(PIXI, {
        width: 360 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        color: 0x05c25f,
        y: div.height + div.y + 59 * PIXI.ratio
    });
    setStorageButton.myAddChildFn(
        p_text(PIXI, {
            content: `存储数据`,
            fontSize: 30 * PIXI.ratio,
            fill: 0xffffff,
            fontWeight: 'bold',
            relative_middle: { containerWidth: setStorageButton.width, containerHeight: setStorageButton.height }
        })
    );
    setStorageButton.onClickFn(() => {
        callBack({ status: 'setStorage', key: storage.key.text, value: storage.value.text });
    });
    // 存储数据 “按钮” 结束

    // 读取数据 “按钮” 开始
    getStorageButton = p_button(PIXI, {
        width: 360 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        alpha: 0,
        y: setStorageButton.height + setStorageButton.y + 20 * PIXI.ratio
    });
    getStorageButton.myAddChildFn(
        p_text(PIXI, {
            content: `读取数据`,
            fontSize: 30 * PIXI.ratio,
            fontWeight: 'bold',
            relative_middle: { containerWidth: getStorageButton.width, containerHeight: getStorageButton.height }
        })
    );
    getStorageButton.onClickFn(() => {
        callBack({ status: 'getStorage', key: storage.key.text });
    });
    // 读取数据 “按钮” 结束

    // 清理数据 “按钮” 开始
    clearStorageButton = p_button(PIXI, {
        width: 360 * PIXI.ratio,
        height: 80 * PIXI.ratio,
        alpha: 0,
        y: getStorageButton.height + getStorageButton.y + 20 * PIXI.ratio
    });
    clearStorageButton.myAddChildFn(
        p_text(PIXI, {
            content: `清理数据`,
            fontSize: 30 * PIXI.ratio,
            fontWeight: 'bold',
            relative_middle: { containerWidth: clearStorageButton.width, containerHeight: clearStorageButton.height }
        })
    );
    clearStorageButton.onClickFn(() => {
        callBack({ status: 'clearStorage' });
    });
    // 清理数据 “按钮” 结束

    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        div,
        setStorageButton,
        getStorageButton,
        clearStorageButton,
        logo,
        logoName
    );

    app.stage.addChild(container);

    return container;
};
