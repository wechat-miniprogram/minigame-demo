module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('Web Socket', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        button = new PIXI.Graphics(),
        text = new PIXI.Text('点我发送', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0xffffff
        });
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

    box.lineStyle(1 * PIXI.ratio, 0x999999)
        .beginFill(0xffffff)
        .drawRect(0, 0, obj.width, obj.width / 4)
        .endFill();
    box.position.set(0, line.y + line.height + 100 * PIXI.ratio);
    function boxView(func) {
        let text = new PIXI.Text('Socket状态', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x000000
        });
        text.position.set(30 * PIXI.ratio, (box.height - 2 * text.height) / 4);
        box.addChild(text);

        let switchButton = new PIXI.Graphics();
        switchButton
            .beginFill(0xcccccc)
            .drawRoundedRect(0, 0, 120 * PIXI.ratio, box.height / 3, box.height / 3)
            .endFill();
        box.addChild(switchButton);
        switchButton.position.set(
            box.width - switchButton.width - 30 * PIXI.ratio,
            (box.height - 2 * switchButton.height) / 4
        );
        let circle = new PIXI.Graphics();
        circle
            .beginFill(0xffffff)
            .drawCircle(box.height / 6, box.height / 6, box.height / 6 - 3 * PIXI.ratio)
            .endFill();
        switchButton.addChild(circle);

        let line = new PIXI.Graphics();
        line.beginFill(0x999999)
            .drawRect(30 * PIXI.ratio, (box.height - PIXI.ratio) / 2, box.width - 60 * PIXI.ratio, PIXI.ratio)
            .endFill();
        box.addChild(line);

        text = new PIXI.Text('消息', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x000000
        });
        text.position.set(30 * PIXI.ratio, (3 * box.height) / 4 - text.height / 2);
        box.addChild(text);
        text = new PIXI.Text('Hello,小游戏!', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x888888
        });
        text.position.set(obj.width - 200 * PIXI.ratio, (3 * box.height) / 4 - text.height / 2);
        box.addChild(text);
        text = line = null;

        switchButton.interactive = true;
        switchButton.touchend = () => {
            if (!switchButton.switchOn && container.visible) {
                switchButton.beginFill(0x07c160);
                circle.x = switchButton.width - box.height / 3;
                callBack('connection', error => {
                    if (error) {
                        switchButton
                            .beginFill(0xcccccc)
                            .drawRoundedRect(0, 0, 120 * PIXI.ratio, box.height / 3, box.height / 3)
                            .endFill();
                        return;
                    }
                    switchButton.switchOn = true;
                    func(switchButton.switchOn);
                });
            } else {
                callBack('disconnect', () => {
                    switchButton.switchOn = false;
                    func(switchButton.switchOn);
                });
                switchButton.beginFill(0xcccccc);
                circle.x = 0;
            }
            switchButton.drawRoundedRect(0, 0, 120 * PIXI.ratio, box.height / 3, box.height / 3).endFill();
        };
        boxView.switchButton = switchButton;
    }
    boxView(switchOn => {
        button.interactive = switchOn;
        if (switchOn) {
            button
                .beginFill(0x07c160)
                .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
                .endFill();
        } else {
            button
                .beginFill(0xdddddd)
                .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
                .endFill();
        }
    });
    button.position.set(30 * PIXI.ratio, box.y + box.height + 300 * PIXI.ratio);
    button
        .beginFill(0xdddddd, 1)
        .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
        .endFill();

    button.addChild(text);
    text.position.set((button.width - text.width) / 2, (button.height - text.height) / 2);

    button.touchstart = e => {
        button.recordY = e.data.global.y;
    };
    button.touchend = e => {
        if (Math.abs(button.recordY - e.data.global.y) < 5) {
            callBack('sendData');
        }
    };
    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.goBack();
        boxView.switchButton.touchend();
    };

    goBack.button.addChild(goBack.arrow);
    container.addChild(goBack.button, title, line, box, button);
    container.visible = false;
    app.stage.addChild(container);

    return container;
};
