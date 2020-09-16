import view from './view';
import { ShareCanvas } from '../openDataContext/ShareCanvas';
// module.exports = function (PIXI, app, obj) {
//     return view(PIXI, app, obj, (res) => {
//         let { status } = res;
//         switch (status) {
//             case 'startHandoff':
//                 wx.startHandoff({
//                     path: 'just a test',
//                     success(res) {
//                         console.log('success', res);
//                     },
//                     fail(res) {
//                         console.log('fail', res);
//                     },
//                 });
//                 break;
//         }
//     });
// };

module.exports = function(PIXI, app, obj) {
    const SC = new ShareCanvas();

    let tick = () => {
        SC.rankTiker(PIXI, app);
    };
    let ticker = PIXI.ticker.shared;

    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'startHandoff':
                // 初始化
                if (!SC.friendRankShow) {
                    SC.friendRankShow = true;
                    ticker.add(tick);

                    SC.openDataContext.postMessage({
                        event: 'startHandoff'
                    });
                }
                break;
            case 'close':
                SC.friendRankShow = false;

                ticker.remove(tick);

                SC.rankTiker(PIXI, app);

                SC.openDataContext.postMessage({
                    event: 'close'
                });

                wx.triggerGC(); // 垃圾回收
                break;
        }
    });
};