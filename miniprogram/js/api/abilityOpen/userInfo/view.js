module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        title = new PIXI.Text('getUserInfo', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0x999999
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        userInfo = new PIXI.Graphics(),
        getUserInfo = {
            button: new PIXI.Graphics(),
            text: new PIXI.Text('获取用户信息 getUserInfo', {
                fontSize: `${30 * PIXI.ratio}px`,
                fill: 0xffffff
            })
        };

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

    userInfo
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, box.width, box.height)
        .endFill();
    let headline = new PIXI.Text('用户信息如下', {
            fontSize: `${28 * PIXI.ratio}px`,
            fill: 0x333333,
            lineHeight: 25 * PIXI.ratio,
            fontWeight: 'bold'
        }),
        userInfoText = new PIXI.Text('', {
            fontSize: `${28 * PIXI.ratio}px`,
            fill: 0x333333,
            lineHeight: 25 * PIXI.ratio
        }),
        avatar = null;

    getUserInfo.button.position.set(30 * PIXI.ratio, obj.height - 320 * PIXI.ratio);
    getUserInfo.button
        .beginFill(0x07c160)
        .drawRoundedRect(0, 0, obj.width - getUserInfo.button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
        .endFill();
    getUserInfo.button.addChild(getUserInfo.text);
    getUserInfo.text.position.set(
        (getUserInfo.button.width - getUserInfo.text.width) / 2,
        (getUserInfo.button.height - getUserInfo.text.height) / 2
    );
    getUserInfo.button.interactive = true;
    getUserInfo.button.touchend = () => {
        callBack({
            status: 'getUserInfo',
            drawFn
        });
    };

    goBack.button.touchend = () => {
        window.router.goBack();
        userInfo.visible = false;
    };

    goBack.button.addChild(goBack.arrow);
    box.addChild(userInfo);
    container.addChild(goBack.button, title, line, box, getUserInfo.button);
    let visible = (container.visible = false);
    app.stage.addChild(container);

    function drawFn(res) {
        userInfo.visible = true;
        avatar = new PIXI.Sprite(PIXI.Texture.from(res.userInfo.avatarUrl));
        avatar.width = avatar.height = 132 * PIXI.ratio;
        avatar.position.set(30 * PIXI.ratio, (userInfo.height - avatar.height) / 2);
        headline.position.set((userInfo.width - headline.width) / 2, 20 * PIXI.ratio);
        userInfoText.text = `
        \n昵称: ${res.userInfo.nickName}
        \n性别: ${{ 0: '未知', 1: '男', 2: '女' }[res.userInfo.gender]}
        \n省: ${res.userInfo.province}
        \n城市: ${res.userInfo.city}
        \n国籍: ${res.userInfo.country}`;
        userInfoText.position.set(200 * PIXI.ratio, 20 * PIXI.ratio);

        userInfo.addChild(avatar, headline, userInfoText);
    }

    function goBackInteractiveFn() {
        goBack.button.interactive = !goBack.button.interactive;
    }

    Object.defineProperty(container, 'visible', {
        get() {
            return visible;
        },
        set(value) {
            visible = value;
            if (visible) {
                callBack({
                    status: 'createUserInfoButton',
                    top: (obj.height - 420 * PIXI.ratio) / (PIXI.ratio * 2),
                    width: (obj.width - 30 * PIXI.ratio * 2) / (PIXI.ratio * 2),
                    drawFn,
                    goBackInteractiveFn
                });
                return;
            }
            callBack({
                status: 'destroyUserInfoButton'
            });
            goBackInteractiveFn();
        }
    });

    return container;
};
