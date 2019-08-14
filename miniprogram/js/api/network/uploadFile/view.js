module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('将本地资源上传到服务器 uploadFile', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999,
            align: 'center'
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        boxDiv = new PIXI.Container(),
        boxDivDetails = {
            horizontal: new PIXI.Graphics(),
            vertical: new PIXI.Graphics(),
            text: new PIXI.Text('选择图片', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x999999,
                align: 'center'
            })
        },
        sprite = null;
    goBack.button.position.set(0, 52 * Math.ceil(PIXI.ratio));
    goBack.button
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio)
        .endFill();
    goBack.arrow
        .lineStyle(5 * PIXI.ratio, 0x333333)
        .moveTo(50 * PIXI.ratio, 20 * PIXI.ratio)
        .lineTo(30 * PIXI.ratio, 40 * PIXI.ratio)
        .lineTo(50 * PIXI.ratio, 60 * PIXI.ratio);

    title.position.set((obj.width - title.width) / 2, 180 * PIXI.ratio);

    line.beginFill(0x999999)
        .drawRect(0, 0, title.width, 1 * PIXI.ratio)
        .endFill();
    line.position.set((obj.width - title.width) / 2, title.y + title.height + 10 * PIXI.ratio);

    box.position.set(0, line.y + line.height + 150 * PIXI.ratio);
    box.lineStyle(1 * PIXI.ratio, 0x999999)
        .beginFill(0xffffff)
        .drawRect(0, 0, obj.width, obj.width / 2)
        .endFill();

    boxDivDetails.horizontal
        .beginFill(0xcccccc)
        .drawRect((obj.width - obj.width / 8) / 2, (box.height - 5 * PIXI.ratio) / 2, obj.width / 8, 5 * PIXI.ratio)
        .endFill();
    boxDivDetails.vertical
        .beginFill(0xcccccc)
        .drawRect((obj.width - 5 * PIXI.ratio) / 2, (box.height - obj.width / 8) / 2, 5 * PIXI.ratio, obj.width / 8)
        .endFill();
    boxDivDetails.text.position.set((obj.width - boxDivDetails.text.width) / 2, box.height - obj.width / 6);
    boxDiv.y = -20 * PIXI.ratio;

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line);
    boxDiv.addChild(boxDivDetails.horizontal, boxDivDetails.vertical, boxDivDetails.text);
    box.addChild(boxDiv);
    container.addChild(box);
    container.visible = false;
    app.stage.addChild(container);

    box.interactive = true;
    box.touchstart = e => {
        box.recordY = e.data.global.y;
    };
    box.touchend = e => {
        if (Math.abs(box.recordY - e.data.global.y) < 5) {
            box.interactive = false;
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album'],
                success(res) {
                    console.log('chooseImage success, temp path is', res.tempFilePaths[0]);
                    const imageSrc = res.tempFilePaths[0];
                    callBack(imageSrc, bool => {
                        if (bool) {
                            PIXI.loader.add(imageSrc).load(() => {
                                let width = void 0,
                                    height = void 0;
                                sprite = new PIXI.Sprite(PIXI.loader.resources[imageSrc].texture);
                                if (sprite.width > sprite.height) {
                                    width = box.width;
                                    height = (width * sprite.height) / sprite.width;
                                    if (box.height / height < 1) {
                                        width = (box.height * width) / height;
                                        height = box.height;
                                    }
                                } else {
                                    width = (box.height * sprite.width) / sprite.height;
                                    height = box.height;
                                }
                                sprite.width = width;
                                sprite.height = height;
                                boxDiv.visible = false;
                                sprite.position.set((box.width - sprite.width) / 2, (box.height - sprite.height) / 2);
                                box.addChild(sprite);
                            });
                            return;
                        }
                        box.interactive = true;
                    });
                },
                fail({ errMsg }) {
                    box.interactive = true;
                    console.log('chooseImage fail, err is', errMsg);
                }
            });
        }
    };

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
        if (sprite) {
            box.removeChild(sprite);
            sprite.destroy(true);
            sprite = null;
            box.interactive = true;
            boxDiv.visible = true;
        }
    };

    return container;
};
