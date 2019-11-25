import { p_button, p_text, p_line, p_box, p_img, p_goBackBtn } from '../../../libs/component/index';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: 'operationFile',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'write/read/append/File&unlink',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: title.height + title.y + 78 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(obj.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ),
        pathBox = p_box(PIXI, {
            height: 88 * PIXI.ratio,
            border: { width: PIXI.ratio, color: 0xe5e5e5 },
            y: underline.height + underline.y + 61 * PIXI.ratio
        }),
        tipText = p_text(PIXI, {
            content:
                '提示：如果文件不存在，就会先创建文件，再进行\n写入，这里我们创建的文件名是 hello.txt，而写入\n内容是 “hello, world” ',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            align: 'center',
            lineHeight: 45 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 24 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        writeFileButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: pathBox.height + pathBox.y + 259 * PIXI.ratio
        }),
        readFileButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: writeFileButton.y + writeFileButton.height + 25 * PIXI.ratio
        }),
        appendFileButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: readFileButton.height + readFileButton.y + 21 * PIXI.ratio
        }),
        unlinkButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: appendFileButton.height + appendFileButton.y + 21 * PIXI.ratio
        }),
        logo = p_img(PIXI, {
            width: 36 * PIXI.ratio,
            height: 36 * PIXI.ratio,
            x: 294 * PIXI.ratio,
            y: obj.height - 66 * PIXI.ratio,
            src: 'images/logo.png'
        }),
        logoName = p_text(PIXI, {
            content: '小游戏示例',
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: (obj.height - 62 * PIXI.ratio) | 0,
            relative_middle: { point: 404 * PIXI.ratio }
        });

    let path;
    pathBox.addChild(
        p_text(PIXI, {
            content: `路径`,
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: pathBox.height }
        }),
        (path = p_text(PIXI, {
            content: pathTextFn(),
            fontSize: 34 * PIXI.ratio,
            relative_middle: { containerWidth: pathBox.width, containerHeight: pathBox.height }
        }))
    );

    // 写文件 “按钮” 开始
    writeFileButton.myAddChildFn(
        p_text(PIXI, {
            content: '写文件',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: writeFileButton.width, containerHeight: writeFileButton.height }
        })
    );
    writeFileButton.onClickFn(() => {
        callBack({
            status: 'writeFile',
            drawFn() {
                path.turnText(pathTextFn('/hello.txt'));
                isVisibleFn([readFileButton, appendFileButton, unlinkButton], 'showFn');
            }
        });
    });
    // 写文件 “按钮” 结束

    // 读取文件内容 “按钮” 开始
    readFileButton.myAddChildFn(
        p_text(PIXI, {
            content: '读取文件内容',
            fontSize: 36 * PIXI.ratio,
            fill: 0x53535f,
            relative_middle: { containerWidth: readFileButton.width, containerHeight: readFileButton.height }
        })
    );
    readFileButton.onClickFn(() => {
        callBack({
            status: 'readFile',
            drawFn() {}
        });
    });
    // 读取文件内容 “按钮” 结束

    // 追加文件内容 “按钮” 开始
    appendFileButton.myAddChildFn(
        p_text(PIXI, {
            content: '追加文件内容',
            fontSize: 36 * PIXI.ratio,
            fill: 0x53535f,
            relative_middle: { containerWidth: appendFileButton.width, containerHeight: appendFileButton.height }
        })
    );
    appendFileButton.onClickFn(() => {
        callBack({
            status: 'appendFile',
            drawFn() {}
        });
    });
    // 追加文件内容 “按钮” 结束

    // 删除文件 “按钮” 开始
    unlinkButton.myAddChildFn(
        p_text(PIXI, {
            content: '删除文件',
            fontSize: 36 * PIXI.ratio,
            fill: 0x53535f,
            relative_middle: { containerWidth: unlinkButton.width, containerHeight: unlinkButton.height }
        })
    );
    unlinkButton.onClickFn(() => {
        callBack({
            status: 'unlink',
            drawFn() {
                path.turnText(pathTextFn());
                isVisibleFn([readFileButton, appendFileButton, unlinkButton], 'hideFn');
            }
        });
    });

    // 删除文件 “按钮” 结束

    function isVisibleFn(arr, method) {
        for (let i = 0, len = arr.length; i < len; i++) {
            arr[i][method]();
        }
    }

    function pathTextFn(str) {
        return `${wx.env.USER_DATA_PATH}/fileA${str || ''}`;
    }

    isVisibleFn([readFileButton, appendFileButton, unlinkButton], 'hideFn');

    wx.getFileSystemManager().access({
        path: pathTextFn('/hello.txt'),
        success() {
            path.turnText(pathTextFn('/hello.txt'));
            isVisibleFn([readFileButton, appendFileButton, unlinkButton], 'showFn');
        }
    });

    container.addChild(
        goBack,
        title,
        api_name,
        underline,
        pathBox,
        tipText,
        writeFileButton,
        readFileButton,
        appendFileButton,
        unlinkButton,
        logo,
        logoName
    );
    app.stage.addChild(container);

    return container;
};
