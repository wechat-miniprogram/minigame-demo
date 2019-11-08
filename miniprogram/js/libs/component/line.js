module.exports = function(PIXI, deploy = {}) {
    let { width = 0, color = 0x000000, alpha = 1 } = deploy;
    let pointCoordinatesArr = Array.prototype.slice.call(arguments, 2);
    function Line() {
        this.lineStyle(width, color, alpha).moveTo(0, 0);
        function drawLineFn(arr) {
            this.position.set(...arr[0]);
            for (let i = 1, len = arr.length; i < len; i++) {
                this.lineTo(...arr[i]);
            }
        }
        drawLineFn.call(this, pointCoordinatesArr);

        this.redrawFn = function(css) {
            let pointCoordinatesArr = arguments;
            if (Object.prototype.toString.call(css) === '[object Object]') pointCoordinatesArr.shift();
            this.clear();
            this.lineStyle(css.width || width, css.color || color, css.alpha || alpha).moveTo(0, 0);
            drawLineFn.call(this, pointCoordinatesArr);
        };
    }
    Line.prototype = new PIXI.Graphics();
    return new Line();
};
