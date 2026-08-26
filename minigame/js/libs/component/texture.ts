module.exports = function (PIXI, deploy = {}) {
    let {
        width,
        height = width,
        mask,
        x = 0,
        y = 0,
        texture,
        relative_middle = {
            containerWidth: null,
            containerHeight: null,
        },
    } = deploy;

    function Texture() {
        let kind = new PIXI.Sprite(texture);
        width && (kind.width = width);
        height && (kind.height = height);

       this.setTexture = function (texture) {
          kind.texture = texture;
          width && (kind.width = width);
          height && (kind.height = height);
      };


        this.setPositionFn = function (deploy = {}) {
            let { x: new_x, y: new_y, relative_middle: new_relative_middle } = deploy,
                { containerWidth, containerHeight } = new_relative_middle || relative_middle;
            this.position.set(
                containerWidth ? (containerWidth - this.width) / 2 : new_x || x,
                containerHeight ? (containerHeight - this.height) / 2 : new_y || y
            );
        };

        this.onClickFn = function (callBack) {
            this.interactive = true;
            this.touchstart = (e) => {
                e.currentTarget.touchend = (e) => {
                    e.target.touchend = null;
                    if (Math.abs(e.recordY - e.data.global.y) < 5) {
                        callBack(e);
                    }
                };
                e.recordY = e.data.global.y;
                e.recordX = e.data.global.x;
            };
        }.bind(kind);

        this.setAnchor = function (...arr) {
            this.anchor.set(...arr);
        }.bind(kind);

        this.setRotation = function (angle) {
            this.rotation = angle;
        }.bind(kind);

        this.hideFn = function () {
            this.visible = false;
        };

        this.showFn = function () {
            this.visible = true;
        };

        if (mask) {
            let shape = new PIXI.Graphics();
            switch (mask) {
                case 'circle':
                    shape
                        .beginFill(0xffffff)
                        .drawCircle(kind.width / 2, kind.height / 2, kind.width > kind.height ? kind.height / 2 : kind.width / 2)
                        .endFill();
                    break;
            }
            this.mask = shape;
            this.addChild(shape);
        }
        this.addChild(kind);
        this.setPositionFn();
    }
    Texture.prototype = new PIXI.Container();
    return new Texture();
};
