module.exports = function(PIXI, deploy = {}) {
    let {
        width = canvas.width,
        parentWidth = canvas.width,
        height = 0,
        colorFrom = 0xffffff,
        colorTo = 0,
        stepsCount = 100,
        x = (parentWidth - width) / 2,
        y = 0,
        radius = 0
    } = deploy;

    function LinearGradientBox() {
        var prepareRGBChannelColor = function(channelColor) {
            var colorText = channelColor.toString(16);
            if (colorText.length < 2) {
                while (colorText.length < 2) {
                    colorText = '0' + colorText;
                }
            }

            return colorText;
        };

        // Getting RGB channels from a number color
        // param color is a number
        // return an RGB channels object {red: number, green: number, blue: number}
        var getRGBChannels = function(color) {
            var colorText = color.toString(16);
            if (colorText.length < 6) {
                while (colorText.length < 6) {
                    colorText = '0' + colorText;
                }
            }

            var result = {
                red: parseInt(colorText.slice(0, 2), 16),
                green: parseInt(colorText.slice(2, 4), 16),
                blue: parseInt(colorText.slice(4, 6), 16)
            };
            return result;
        };

        // Preparaiton of a color data object
        // param color is a number [0-255]
        // param alpha is a number [0-1]
        // return the color data object {color: number, alpha: number, channels: {red: number, green: number, blue: number}}
        var prepareColorData = function(color, alpha) {
            return {
                color: color,
                alpha: alpha,
                channels: getRGBChannels(color)
            };
        };

        // Getting the color of a gradient for a very specific gradient coef
        // param from is a color data object
        // param to is a color data object
        // return value is of the same type
        var getColorOfGradient = function(from, to, coef) {
            if (!from.alpha && from.alpha !== 0) {
                from.alpha = 1;
            }
            if (!from.alpha && from.alpha !== 0) {
                to.alpha = 1;
            }

            var colorRed = Math.floor(from.channels.red + coef * (to.channels.red - from.channels.red));
            colorRed = Math.min(colorRed, 255);
            var colorGreen = Math.floor(from.channels.green + coef * (to.channels.green - from.channels.green));
            colorGreen = Math.min(colorGreen, 255);
            var colorBlue = Math.floor(from.channels.blue + coef * (to.channels.blue - from.channels.blue));
            colorBlue = Math.min(colorBlue, 255);

            var rgb = prepareRGBChannelColor(colorRed) + prepareRGBChannelColor(colorGreen) + prepareRGBChannelColor(colorBlue);

            return {
                color: parseInt(rgb, 16),
                alpha: from.alpha + coef * (to.alpha - from.alpha)
            };
        };

        // Drawing the gradient

        var gradient = new PIXI.Graphics();

        var rect = {
            width,
            height,
            radius
        };

        var colorFromData = prepareColorData(colorFrom, 1);
        var colorToData = prepareColorData(colorTo, 1);

        var stepCoef;
        var stepColor;

        var stepHeight = rect.height / stepsCount;
        for (var stepIndex = 0; stepIndex < stepsCount; stepIndex++) {
            stepCoef = stepIndex / stepsCount;
            stepColor = getColorOfGradient(colorFromData, colorToData, stepCoef);

            gradient.beginFill(stepColor.color, stepColor.alpha);
            gradient.drawRect(0, rect.height * stepCoef, rect.width, stepHeight);
        }

        // Applying a mask with round corners to the gradient
        var roundMask = new PIXI.Graphics();
        roundMask.beginFill(0);
        roundMask[radius ? 'drawRoundedRect' : 'drawRect'](0, 0, rect.width, rect.height, rect.radius);

        gradient.mask = roundMask;

        this.addChild(gradient, roundMask);
        this.position.set(x, y);
    }
    LinearGradientBox.prototype = new PIXI.Container();
    return new LinearGradientBox();
};
