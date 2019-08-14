module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('渲染', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        trilateral = new PIXI.Graphics(),
        FPStext = new PIXI.Text('当前帧率: 60fps', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x333333
        }),
        stylizedFont = new PIXI.Text('', {
            fontSize: `${80 * PIXI.ratio}px`,
            fill: 0x333333
        }),
        information = new PIXI.Text('', {
            fontSize: `${26 * PIXI.ratio}px`,
            fill: 0x333333
        }),
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

    box.position.set(0, line.y + line.height + 50 * PIXI.ratio);
    box.lineStyle(PIXI.ratio, 0x999999)
        .beginFill(0xffffff)
        .drawRect(0, 0, obj.width, obj.width / 2)
        .endFill();

    //计算三角形的中心点坐标
    let circumscribedRadius =
        (((Math.sqrt(3) * box.width) / 6) * ((Math.sqrt(3) * box.width) / 6) * ((Math.sqrt(3) * box.width) / 6)) /
        (4 * (box.width / 4) * (Math.sqrt(3) * (box.width / 12)));

    //绘制三角形
    trilateral
        .beginFill(0x07c160)
        .drawPolygon([
            -(Math.sqrt(3) * (box.width / 12)),
            box.width / 4 - circumscribedRadius,
            Math.sqrt(3) * (box.width / 12),
            box.width / 4 - circumscribedRadius,
            0,
            -circumscribedRadius
        ])
        .endFill();
    trilateral.position.set(box.width / 6, box.width / 6);
    FPStext.position.set((box.width / 3 - FPStext.width) / 2, trilateral.x + circumscribedRadius);

    let button, siteY;
    function drawButtonFn(text, y) {
        button = new PIXI.Graphics();
        text = new PIXI.Text(text, {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0xffffff
        });
        button.position.set(30 * PIXI.ratio, y);
        button
            .beginFill(0x07c160)
            .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
            .endFill();
        button.addChild(text);
        text.position.set((button.width - text.width) / 2, (button.height - text.height) / 2);
        button.interactive = true;
        siteY = button.height + button.y;
        container.addChild(button);
    }
    //toDataURL start
    drawButtonFn('toDataURL 把绘制内容转成base64', box.y + box.height + 50 * PIXI.ratio);
    button.touchend = () => {
        callBack('toDataURL');
    };
    //toDataURL end

    //toTempFilePath start
    drawButtonFn('toTempFilePath 截图生成一个临时文件', siteY + 20 * PIXI.ratio);
    button.touchend = () => {
        callBack('toTempFilePath');
    };
    //toTempFilePath end

    //setPreferredFramesPerSecond start
    drawButtonFn('setPreferredFramesPerSecond 调节帧率', siteY + 20 * PIXI.ratio);
    button.touchend = () => {
        fpsSwitch.fps = FPStext.text.includes(60) ? 10 : 60;
        callBack('setPreferredFramesPerSecond', fpsSwitch);
        function fpsSwitch() {
            FPStext.text = `当前帧率: ${fpsSwitch.fps}fps`;
        }
    };
    //setPreferredFramesPerSecond end

    //loadFont start
    drawButtonFn('loadFont 加载自定义字体文件', siteY + 20 * PIXI.ratio);
    button.touchend = () => {
        callBack('loadFont', fontFamily => {
            if (sprite) {
                box.removeChild(sprite);
                sprite.destroy(true);
                sprite = null;
            }
            stylizedFont.style = {
                fontFamily: fontFamily || '',
                fontSize: `${80 * PIXI.ratio}px`
            };
            stylizedFont.text = 'Hello WeChat';
            stylizedFont.position.set(
                ((4 * box.width) / 3 - stylizedFont.width) / 2,
                (box.height - stylizedFont.height) / 2
            );
            information.visible = false;
            stylizedFont.visible = true;
        });
    };
    //loadFont end

    //createImage start
    drawButtonFn('createImage 创建一个图片对象', siteY + 20 * PIXI.ratio);
    button.touchend = () => {
        callBack('createImage', fn => {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album'],
                success(res) {
                    console.log('chooseImage success, temp path is', res.tempFilePaths[0]);
                    const imageSrc = res.tempFilePaths[0];
                    fn(imageSrc, Img => {
                        if (sprite) {
                            box.removeChild(sprite);
                            sprite.destroy(true);
                            sprite = null;
                        }
                        PIXI.loader.add(imageSrc).load(() => {
                            let width = void 0,
                                height = void 0;
                            sprite = new PIXI.Sprite(PIXI.loader.resources[imageSrc].texture);
                            if (sprite.width > sprite.height) {
                                width = (2 * box.width) / 3;
                                height = (width * sprite.height) / sprite.width;
                                if ((box.height - 50 * PIXI.ratio) / height < 1) {
                                    width = ((box.height - 50 * PIXI.ratio) * width) / height;
                                    height = box.height - 50 * PIXI.ratio;
                                }
                            } else {
                                width = ((box.height - 50 * PIXI.ratio) * sprite.width) / sprite.height;
                                height = box.height - 50 * PIXI.ratio;
                            }
                            sprite.width = width;
                            sprite.height = height;
                            sprite.position.set(
                                ((4 * box.width) / 3 - sprite.width) / 2,
                                (box.height - 50 * PIXI.ratio - sprite.height) / 2
                            );
                            information.text = `width: ${Img.width}px , height: ${Img.height}px`;
                            information.position.set(
                                ((4 * box.width) / 3 - information.width) / 2,
                                (box.height + sprite.height + sprite.y - information.height) / 2
                            );
                            information.visible = true;
                            stylizedFont.visible = false;
                            box.addChild(sprite);
                        });
                    });
                },
                fail({ errMsg }) {
                    console.log('chooseImage fail, err is', errMsg);
                }
            });
        });
    };
    //createImage end

    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
    };

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line);
    box.addChild(FPStext, trilateral, stylizedFont, information);
    container.addChild(box);
    let visible = (container.visible = false);
    app.stage.addChild(container);

    wx.setPreferredFramesPerSecond(60);

    let movement = null,
        angleFn = (function() {
            let angle = 0;
            return function() {
                angle === 360 && (angle = 5);
                angle += 5;
                trilateral.rotation = (angle * Math.PI) / 180;
                movement = requestAnimationFrame(angleFn);
            };
        })();

    Object.defineProperty(container, 'visible', {
        get() {
            return visible;
        },
        set(value) {
            visible = value;
            if (visible) {
                movement = requestAnimationFrame(angleFn);
            } else {
                cancelAnimationFrame(movement);
            }
        }
    });

    return container;
};
