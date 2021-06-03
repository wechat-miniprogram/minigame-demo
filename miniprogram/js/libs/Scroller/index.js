module.exports = class Scroller {
    constructor(callBack) {
        this.tickerStop = true;
        this.callBack = callBack;

        this.rangeMovement = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        };
        this.coordinatePoint = [0, 0];
    }

    doTouchStart(x, y) {
        this.tickerStop = true;
        this.positions = [];
        this.recordPoint(x, y);
    }

    doTouchMove(x, y, timeStamp) {
        this.rangeMovement.left -= x - this.coordinatePoint[0];
        this.rangeMovement.top -= y - this.coordinatePoint[1];

        this.limitBoundary(this.callBack);

        this.positions.push(this.rangeMovement.left, this.rangeMovement.top, timeStamp);

        if (this.positions.length > 60) this.positions.splice(0, 30);

        this.recordPoint(x, y);
    }

    doTouchEnd(timeStamp) {
        if (!this.positions.length) return;
        let scrollLeft, scrollTop, deltaT;
        for (let i = this.positions.length - 1; i > 0 && this.positions[i] > timeStamp - 100; i -= 3) {
            scrollLeft = this.positions[i - 2];
            scrollTop = this.positions[i - 1];
            deltaT = timeStamp - this.positions[i];
        }

        this.speedX = ((scrollLeft - this.rangeMovement.left) / deltaT) * (1000 / 60);
        this.speedY = ((scrollTop - this.rangeMovement.top) / deltaT) * (1000 / 60);

        if (Math.abs(this.speedX) > 1 || Math.abs(this.speedY) > 1) this.accelerateMotion();
    }

    recordPoint(x, y) {
        this.coordinatePoint[0] = x;
        this.coordinatePoint[1] = y;
    }

    limitBoundary(callBack) {
        if (this.rangeMovement.left < 0) this.rangeMovement.left = 0;
        if (this.rangeMovement.top < 0) this.rangeMovement.top = 0;

        if (this.rangeMovement.left > this.rangeMovement.right) this.rangeMovement.left = this.rangeMovement.right;
        if (this.rangeMovement.top > this.rangeMovement.bottom) this.rangeMovement.top = this.rangeMovement.bottom;

        callBack && callBack(this.rangeMovement.left, this.rangeMovement.top);
    }

    accelerateMotion() {
        let scrollLeft,
            scrollTop,
            delta = () => {
                if (Math.abs(this.speedX) >= 0.1 || Math.abs(this.speedY) >= 0.1) {
                    scrollLeft = this.rangeMovement.left;
                    scrollTop = this.rangeMovement.top;
                    this.rangeMovement.left -= this.speedX;
                    this.rangeMovement.top -= this.speedY;
                    this.limitBoundary(this.callBack);
                    if (scrollLeft === this.rangeMovement.left && scrollTop === this.rangeMovement.top) return (this.tickerStop = true);
                    this.speedX *= 0.95;
                    this.speedY *= 0.95;
                    return;
                }
                this.tickerStop = true;
            };

        this.tickerStart(delta);
    }

    contentSize(exposedAreaWidth, exposedAreaHeight, width, height) {
        this.rangeMovement.right = Math.max(width - exposedAreaWidth, 0);
        this.rangeMovement.bottom = Math.max(height - exposedAreaHeight, 0);
        let offsetX = this.rangeMovement.left,
            offsetY = this.rangeMovement.top,
            offsetLeft = void 0,
            offsetTop = void 0,
            duration = 20;
        this.limitBoundary();

        if (offsetX - this.rangeMovement.left) offsetLeft = this.easeOut.bind(null, 0, offsetX - this.rangeMovement.left, duration);

        if (offsetY - this.rangeMovement.top) offsetTop = this.easeOut.bind(null, 0, offsetY - this.rangeMovement.top, duration);

        if (!(offsetX - this.rangeMovement.left) && !(offsetY - this.rangeMovement.top)) return;

        !offsetLeft && (offsetLeft = () => this.rangeMovement.left);
        !offsetTop && (offsetTop = () => this.rangeMovement.top);

        let initialTime = 0,
            delta;

        delta = (t) => {
            !initialTime && (initialTime = t);

            if (duration <= ((t - initialTime) / 1000) * 60) {
                this.tickerStop = true;
                this.callBack(this.rangeMovement.left, this.rangeMovement.top);
                return;
            }
            this.callBack(offsetTop(), offsetY - offsetTop(((t - initialTime) / 1000) * 60));
        };

        this.tickerStart(delta);
    }

    easeOut(b, c, d, t) {
        //  b: beginning value（初始值）
        //  c: change in value（变化量）
        //  d: duration（持续时间）
        //  t: current time（当前时间）
        return -c * (t /= d) * (t - 2) + b;
    }

    tickerStart(callBack) {
        this.tickerStop = false;
        let frameCycle = (callBack) => {
            let rafId = requestAnimationFrame((timestamp) => {
                callBack(timestamp);
                frameCycle(callBack);
            });
            this.tickerStop && cancelAnimationFrame(rafId);
        };
        frameCycle(callBack);
    }
};
