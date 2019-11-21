import view from './view';
import show from '../../libs/show';
module.exports = function(PIXI, app, obj) {
    const worker = wx.createWorker('workers/index.js');

    return view(PIXI, app, obj, res => {
        let num, fabonacci;
        switch (res.status) {
            case 'noWorker':
                fabonacci = n => {
                    return n < 2 ? n : fabonacci(n - 1) + fabonacci(n - 2);
                };

                num = fabonacci(res.fabonacciIndex);

                show.Modal(`${num}`, '计算结果');

                break;
            case 'Worker':
                worker.postMessage({
                    msg: res.fabonacciIndex
                });

                worker.onMessage(obj => {
                    show.Modal(`${obj.msg}`, '计算结果');
                });
                break;
        }
    });
};
