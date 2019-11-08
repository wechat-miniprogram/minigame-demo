module.exports = function(PIXI, deploy = {}) {
    let {
        width,
        height = width,
        src,
        mask,
        is_PIXI_loader,
        x = 0,
        y = 0,
        relative_middle = {
            containerWidth: null,
            containerHeight: null
        }
    } = deploy;

    function Img() {
        let kind = new PIXI.Sprite(is_PIXI_loader ? PIXI.loader.resources[src].texture : PIXI.Texture.from(src));
        width && (kind.width = width);
        height && (kind.height = height);

        this.turnImg = function(data) {
            !kind.texture.frame && kind.texture.destroy(true);
            kind.texture = data.is_PIXI_loader ? PIXI.loader.resources[data.src].texture : PIXI.Texture.from(data.src);
        };

        this.setPositionFn = function(deploy = {}) {
            let { x: new_x, y: new_y, relative_middle: new_relative_middle } = deploy,
                { containerWidth, containerHeight } = new_relative_middle || relative_middle;
            this.position.set(
                containerWidth ? (containerWidth - this.width) / 2 : new_x || x,
                containerHeight ? (containerHeight - this.height) / 2 : new_y || y
            );
        };

        this.onClickFn = function(callBack) {
            this.interactive = true;
            this.touchstart = e => {
                e.currentTarget.touchend = e => {
                    e.target.touchend = null;
                    if (Math.abs(e.recordY - e.data.global.y) < 5) {
                        callBack(e);
                    }
                };
                e.recordY = e.data.global.y;
            };
        }.bind(kind);

        this.setAnchor = function(...arr) {
            this.anchor.set(...arr);
        }.bind(kind);

        this.setRotation = function(angle) {
            this.rotation = angle;
        }.bind(kind);

        this.hideFn = function() {
            this.visible = false;
        };

        this.showFn = function() {
            this.visible = true;
        };

        if (mask) {
            let shape = new PIXI.Graphics();
            switch (mask) {
                case 'circle':
                    shape
                        .beginFill(0xffffff)
                        .drawCircle(
                            kind.width / 2,
                            kind.height / 2,
                            kind.width > kind.height ? kind.height / 2 : kind.width / 2
                        )
                        .endFill();
                    break;
            }
            this.mask = shape;
            this.addChild(shape);
        }
        this.addChild(kind);
        this.setPositionFn();
    }
    Img.prototype = new PIXI.Container();
    return new Img();
};
