import view from './view';
import { ShareCanvas } from '../openDataContext/ShareCanvas';

const SC = new ShareCanvas();

module.exports = function(PIXI, app, obj) {
    let tick = () => {
        SC.rankTiker(PIXI, app);
    };
    let ticker = PIXI.ticker.shared;

    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'relationalChaininteractiveData':
                // 初始化
                if (!SC.friendRankShow) {
                    SC.friendRankShow = true;
                    ticker.add(tick);

                    SC.openDataContext.postMessage({
                        event: 'relationalChaininteractiveData'
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
                break;
        }
    });
};
