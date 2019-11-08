import pixiScroll from '../../libs/pixiScroll';
module.exports = function(PIXI, app, parameterObj,methods) {
    return pixiScroll(PIXI, app, {
        ...parameterObj,
        methods
    });
};

