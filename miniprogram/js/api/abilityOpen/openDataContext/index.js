import view from './view';
import { ShareCanvas } from './ShareCanvas';

function showTip() {
    wx.showToast({
        title: '若分享成功，请从群里点击会话查看群排行榜',
        icon: 'none',
        duration: 2000
    });

    wx.offShow(showTip);
}

module.exports = function(PIXI, app, obj) {
    const SC = new ShareCanvas();

    let tick = () => {
        SC.rankTiker(PIXI, app);
    }
    let ticker = PIXI.ticker.shared;

    let { container, close } = view(PIXI, app, obj, (data) => {
        let { status, score } = data;
        switch (status) {
            case 'shareAppMessage':
                if ( !SC.friendRankShow ) {
                    wx.shareAppMessage({
                        title: '高手如云，看看群里你排第几',
                        query: 'showGroup=1&pathName=openDataContext',
                        imageUrl: canvas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: canvas.width,
                            height: (canvas.width * 4) / 5
                        }),
                    });

                    wx.onShow(showTip);
                }

                break;

            // 上报随机分数
            case 'setUserRecord':
                if ( !SC.friendRankShow ) {
                    score = Math.floor(Math.random() * 1000 + 1);
                    wx.setUserCloudStorage({
                        KVDataList: [
                            {   key  : 'score',
                                value: JSON.stringify({
                                    wxgame: {
                                        score  : score,
                                        update_time: parseInt(+new Date() / 1000)
                                    }
                                })
                            },
                        ],
                        success: () => {
                            wx.showToast({
                                title: `分数上报成功: ${ score }分`,
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    });
                }
                break;

            case 'showFriendRank':

                if ( !SC.friendRankShow ) {
                    SC.friendRankShow = true;
                    ticker.add(tick);

                    SC.openDataContext.postMessage({
                        event: 'showFriendRank',
                    });
                }

                break;
            case 'close':
                SC.friendRankShow = false;

                ticker.remove(tick);

                SC.rankTiker(PIXI, app);
                
                SC.openDataContext.postMessage({
                    event: 'close',
                });

                wx.triggerGC(); // 垃圾回收

                break;
        }
    });

    function detectToShowGroup(options) {
        // 初次打开发现要求渲染群排行榜
        if ( options && options.shareTicket && options.query && options.query.showGroup === '1' ) {

            SC.openDataContext.postMessage({
                event      : 'showGroupRank',
                shareTicket: options.shareTicket
            });

            container.addChild(close);

            if ( !SC.friendRankShow ) {
                SC.friendRankShow = true;
                ticker.add(tick);
            }
        }
    }

    wx.onShow(detectToShowGroup);
    detectToShowGroup(obj);

    return container;
};

