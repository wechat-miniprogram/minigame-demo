import Scroller from './Scroller/index';
function pixiScroll(PIXI, app, property) {
    function ScrollContainer() {
        this.po = new PIXI.Container();
        this.scrollContainer = new PIXI.Container();
        this.items = [];

        this.mask = new PIXI.Graphics();
        this.mask
            .beginFill(0xffffff)
            .drawRect(0, 135 * (property.height / 1334), property.width, property.height)
            .endFill();
        this.scrollContainer.mask = this.mask;
        this.po.addChild(this.scrollContainer, this.mask);

        this.scroller = new Scroller(
            (...args) => {
                this.scrollContainer.position.y = -args[1];
            },
            {
                scrollingX: false,
                scrollingY: true,
                bouncing: false
            }
        );

        this.itemHeight = 0;

        this.po.touchstart = e => {
            e.stopPropagation();
            let data = e.data;
            this.scroller.doTouchStart(
                [
                    {
                        pageX: data.global.x,
                        pageY: data.global.y
                    }
                ],
                data.originalEvent.timeStamp
            );
        };

        this.po.touchmove = e => {
            e.stopPropagation();
            let data = e.data;
            this.scroller.doTouchMove(
                [
                    {
                        pageX: data.global.x,
                        pageY: data.global.y
                    }
                ],
                data.originalEvent.timeStamp
            );
        };

        this.po.touchend = e => {
            e.stopPropagation();
            let data = e.data;
            this.scroller.doTouchEnd(data.originalEvent.timeStamp);
        };

        this.po.interactive = true;
    }

    function ListItem(value, apiName) {
        this.po = new PIXI.Container();
        this.bg = new PIXI.Graphics();
        this.po.addChild(this.bg);
        this.width = property.width - 60 * PIXI.ratio;
        this.drawHeight = 120 * PIXI.ratio;
        this.cornerRadius = 2 * PIXI.ratio;

        if ((value.children || []).length) {
            this.child = new ChildListItem(this, value.children);
            this.child.po.y = this.drawHeight - this.cornerRadius;
            this.childHeight = this.child.po.height - this.cornerRadius;
            this.po.addChild(this.child.po);
        }

        this.bg
            .beginFill(0xffffff)
            .drawRoundedRect(0, 0, this.width, this.drawHeight, this.cornerRadius)
            .endFill();
        this.po.x = 30 * PIXI.ratio;

        if (property.isTabBar) {
            let sprite = new PIXI.Sprite(PIXI.loader.resources[`images/${apiName}.png`].texture);
            this.bg.addChild(sprite);
            sprite.width = sprite.height = sprite.width * 0.32 * PIXI.ratio;
            sprite.position.set(this.width - sprite.width - 32 * PIXI.ratio, (this.drawHeight - sprite.height) / 2);
            text.call(this, 32, 44);
        }

        this.drawHeight += 20 * PIXI.ratio;

        this.bg.interactive = true;
        this.bg.apiName = apiName;
        this.bg.touchstart = e => {
            e.target.recordY = e.data.global.y;
        };
        this.bg.touchend = e => {
            if (Math.abs(e.target.recordY - e.data.global.y) < 5) {
                if (this.child) {
                    this.child.po.visible = !this.child.po.visible;
                    e.target.children[0].alpha = this.child.po.visible ? 0.2 : 1;
                    e.target.children[1].alpha = e.target.children[0].alpha;
                    this.childHeight = -this.childHeight;
                    for (let i = sc.items.indexOf(this) + 1, len = sc.items.length; i < len; i++) {
                        sc.items[i].po.y = sc.items[i].po.y - this.childHeight;
                    }
                    let lastOne = sc.items.length - 1,
                        heigth = Math.max(-sc.items[lastOne].childHeight || 0, 0);

                    heigth += sc.items[lastOne].po.y + sc.items[lastOne].drawHeight;

                    if (sc.itemHeight === heigth) sc.itemHeight = heigth - this.childHeight;
                    else sc.itemHeight = heigth;

                    sc.scroller.setDimensions(property.width, property.height, property.width, sc.itemHeight);
                    return;
                }
                let methods = property.methods,
                    callback = methods[methods.indexOf(value)].callback;
                if (callback) return callback(e);
                window.router.navigateTo(e.target.apiName);
            }
        };

        function text(fontSize, y) {
            let text = new PIXI.Text(value.label, {
                fontSize: `${fontSize * PIXI.ratio}px`
            });

            text.position.set(32 * PIXI.ratio, y * PIXI.ratio);

            this.bg.addChild(text);
        }
    }

    function ChildListItem(parent, itemList) {
        let po = new PIXI.Graphics(),
            line,
            text,
            icon;
        for (let i = 0, item, len = itemList.length; i < len; i++) {
            item = new PIXI.Graphics();
            item.beginFill(0xffffff)
                .drawRect(0, 0, parent.width, 96 * PIXI.ratio)
                .endFill();
            if (i) {
                line = new PIXI.Graphics()
                    .lineStyle(PIXI.ratio | 0, 0xd8d8d8)
                    .moveTo(30 * PIXI.ratio, 0)
                    .lineTo(parent.width - 30 * PIXI.ratio, 0);
                item.addChild(line);
            }

            text = new PIXI.Text(itemList[i].label, {
                fontSize: `${32 * PIXI.ratio}px`
            });
            text.position.set(30 * PIXI.ratio, (item.height - text.height) / 2);

            icon = new PIXI.Sprite(PIXI.loader.resources['images/right.png'].texture);
            icon.width = icon.height = 48 * PIXI.ratio;
            icon.position.set(item.width - icon.width - 32 * PIXI.ratio, (item.height - icon.height) / 2);

            item.y = i * item.height + parent.cornerRadius;

            item.interactive = true;
            item.touchstart = e => {
                if (!e.switchColorFn) e.switchColorFn = switchColorFn;
                e.currentTarget.touchmove = e => {
                    if (Math.abs(e.recordY - e.data.global.y) > 4) {
                        e.currentTarget.touchmove = e.currentTarget.touchend = null;
                        e.switchColorFn.call(item, 0xffffff);
                    }
                };
                e.currentTarget.touchend = e => {
                    e.target.touchmove = e.target.touchend = null;
                    if (Math.abs(e.recordY - e.data.global.y) < 5) {
                        let callback = itemList[i].callback;
                        callback ? callback(e) : window.router.navigateTo(itemList[i].name);
                        e.switchColorFn.call(item, 0xffffff);
                    }
                };
                e.recordY = e.data.global.y;
                e.switchColorFn.call(item, 0xededed);
            };
            item.addChild(text, icon);
            po.addChild(item);
            this.totalHeight = item.y + item.height;
        }

        function switchColorFn(color) {
            this.clear();
            this.beginFill(color)
                .drawRect(0, 0, parent.width, 96 * PIXI.ratio)
                .endFill();
        }

        po.beginFill(0xffffff)
            .drawRoundedRect(0, 0, parent.width, this.totalHeight, parent.cornerRadius)
            .endFill();

        po.visible = false;
        this.po = po;
    }

    function Headline() {
        let div = new PIXI.Container(),
            sprite = new PIXI.Sprite(PIXI.loader.resources['images/APIicon.png'].texture);
        sprite.width = sprite.height = 96 * PIXI.ratio;
        sprite.position.set((property.width - sprite.width) / 2, 200 * (property.height / 1334));
        div.addChild(sprite);

        let text = new PIXI.Text('以下将演示小游戏接口能力，具体属性参数\n\n复制github开源代码链接', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x757575,
                lineHeight: 38 * PIXI.ratio,
                align: 'center'
            }),
            middleText = new PIXI.Text('详见PC端的小游戏开发文档，可', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x757575
            }),
            copyText = new PIXI.Text('点击此处', {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x247be3
            });
        text.position.set((property.width - text.width) / 2, sprite.y + sprite.height + 56 * PIXI.ratio);
        middleText.position.set((property.width - (middleText.width + copyText.width)) / 2, sprite.y + sprite.height + 94 * PIXI.ratio);
        copyText.position.set(middleText.x + middleText.width, middleText.y);

        copyText.interactive = true;
        copyText.on('pointerup', () => {
            wx.setClipboardData({
                data: 'https://github.com/wechat-miniprogram/minigame-demo'
            });
        });

        div.addChild(text, middleText, copyText);
        this.drawHeight = text.y + text.height + 90 * PIXI.ratio;
        this.po = div;
        sc.scrollContainer.addChild(this.po);
    }

    function PlaceholderDiv() {
        let div = new PIXI.Graphics();
        div.beginFill(0xffffff, 0)
            .drawRect(0, 0, 0, 135 * (property.height / 1334))
            .endFill();
        this.drawHeight = div.height;
        this.po = div;
        sc.scrollContainer.addChild(this.po);
    }
    function GoBack() {
        this.button = new PIXI.Graphics();
        this.arrow = new PIXI.Graphics();
        this.button.position.set(0, 52 * Math.ceil(PIXI.ratio));
        this.button
            .beginFill(0xffffff, 0)
            .drawRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio)
            .endFill();
        this.arrow
            .lineStyle(5 * PIXI.ratio, 0x333333)
            .moveTo(50 * PIXI.ratio, 20 * PIXI.ratio)
            .lineTo(30 * PIXI.ratio, 40 * PIXI.ratio)
            .lineTo(50 * PIXI.ratio, 60 * PIXI.ratio);
        this.button.interactive = true;
        this.button.touchend = () => {
            window.router.navigateBack();
        };

        this.button.addChild(this.arrow);
    }
    function Title() {
        this.box = new PIXI.Graphics();
        this.box
            .beginFill(0, 0)
            .drawRect(0, 0, property.width, 135 * (property.height / 1334))
            .endFill();
        this.text = new PIXI.Text('小游戏示例', {
            fontSize: `${36 * PIXI.ratio}px`,
            fill: 0x353535
        });
        this.text.position.set((property.width - this.text.width) / 2, 52 * Math.ceil(PIXI.ratio) + 15 * PIXI.ratio);
        this.box.addChild(this.text);
    }

    var sc = new ScrollContainer();
    sc.items.push(property.isTabBar ? new Headline() : new PlaceholderDiv());
    sc.itemHeight += sc.items[0].drawHeight;

    function drawItemsFn(methods) {
        for (var i = 0, len = methods.length; i < len; i++) {
            var li = new ListItem(methods[i], methods[i].name);
            sc.scrollContainer.addChild(li.po);
            li.po.y = sc.items[i].po.y + sc.items[i].drawHeight;
            sc.itemHeight += li.drawHeight;
            sc.items.push(li);
        }
    }

    drawItemsFn(property.methods);

    property.isTabBar ? sc.po.addChild(new Title().box) : sc.po.addChild(new GoBack().button);

    sc.scroller.setDimensions(property.width, property.height, property.width, sc.itemHeight);

    app.stage.addChild(sc.po);
    return sc.po;
}

module.exports = pixiScroll;
