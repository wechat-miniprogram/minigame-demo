// @ts-nocheck
/**
 * Tween的极简实现
 */
const easingLibrary = {
    /**
     * @param {number} t Current time in millseconds
     * @param {number} b Start value
     * @param {number} c Distance traveled relative to the start value
     * @param {number} d Duration in milliseconds
    */
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },

    circOut: function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    }
}

function round (num) {
    return Math.round(num * 100) / 100;
}

class Base {
    constructor(start, distance, duration, animationType) {
        this.start     = start;
        this.distance  = distance;
        this.duration  = duration;
        this.easeFunc  = easingLibrary[animationType] || easingLibrary.linear;
        this.startTime = Date.now();
    }

    tick() {
        return round(this.easeFunc(Date.now() - this.startTime, this.start, this.distance, this.duration));
    }

    // 当前的tween是否完成
    expired() {
        return this.startTime + this.duration < Date.now();
    }
}

let jobs = [];
export default class Tween {

    static to(target, obj, duration, animationType) {
        for ( let key in obj ) {
            let start    = target[key];

            if ( start !== undefined && obj[key] !== undefined ) {
                jobs.push({
                    tween : new Base(start, obj[key] - start, duration, animationType),
                    target: target,
                    key,
                });
            }
        }
    }

    static update() {
        for ( let i = 0; i < jobs.length;i++ ) {
            let job = jobs[i];

            job.target[job.key] = job.tween.tick();

            if ( job.tween.expired() ) {
                jobs.splice(i, 1);
            }
        }
    }
}

