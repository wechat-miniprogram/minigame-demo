import view from './view';
let friendRankShow  = false;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas    = openDataContext.canvas;
let info            = wx.getSystemInfoSync();
const GAME_WIDTH    = info.windowWidth * info.pixelRatio;
const GAME_HEIGHT   = info.windowHeight * info.pixelRatio;

let sharedWidth  = 960;
let sharedHeight = 1410;

function initShareCanvas() {
    // 中间挖了个坑用填充排行榜
    sharedCanvas.width  = sharedWidth;
    sharedCanvas.height = sharedHeight;

    // 屏幕适配
    let temp = sharedHeight / sharedWidth;
    sharedWidth  = GAME_WIDTH * 0.85;
    sharedHeight = temp * sharedWidth;

    updateSubViewPort(sharedWidth, sharedHeight);
}

function updateSubViewPort(width, height) {
    // 计算排行榜占据的物理尺寸
    const realWidth  = width / GAME_WIDTH * info.windowWidth;
    const realHeight = height / GAME_HEIGHT * info.windowHeight;

    openDataContext.postMessage({
        event: 'updateViewPort',
        box       : {
            width  : realWidth,
            height : realHeight,
            x      : ( info.windowWidth - realWidth ) / 2,
            y      : ( info.windowHeight - realHeight ) / 2,
        }
    });
}

function renderFriendRank(PIXI, app) {
    let texture = PIXI.Texture.fromCanvas(sharedCanvas);
    texture.update();
    let shared = new PIXI.Sprite(texture);
    shared.name = 'shared';

    shared.width = sharedWidth;
    shared.height = sharedHeight;

    shared.x = GAME_WIDTH / 2 - shared.width / 2;
    shared.y = GAME_HEIGHT / 2 - shared.height / 2;

    app.stage.addChild(shared);
}

function rankTiker(PIXI, app) {
     // 每一帧都先清除子域
    let sub = app.stage.getChildByName('shared');
    sub && app.stage.removeChild(sub);

    // 如果需要展示好友排行榜，将最新的子域绘制出来
    if ( friendRankShow ) {
        renderFriendRank(PIXI, app);
    }
}

function showTip() {
    wx.showToast({
        title: '若分享成功，请从群里点击会话查看群排行榜',
        icon: 'none',
        duration: 2000
    });

    wx.offShow(showTip);
}

initShareCanvas();

module.exports = function(PIXI, app, obj) {
    let tick = () => {
        rankTiker(PIXI, app);
    }
    let ticker = PIXI.ticker.shared;

    let { container, close } = view(PIXI, app, obj, (data) => {
        let { status } = data;
        switch (status) {
            case 'shareAppMessage':
                if ( !friendRankShow ) {
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
                if ( !friendRankShow ) {
                    let score = Math.floor(Math.random() * 1000 + 1);
                    wx.setUserCloudStorage({
                        KVDataList: [
                            {   key  : 'rankScore',
                                value: JSON.stringify({
                                    wxgame: {
                                        rankScore  : score,
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
                if ( !friendRankShow ) {
                    friendRankShow = true;
                    ticker.add(tick);

                    openDataContext.postMessage({
                        event: 'showFriendRank',
                    });
                }


                break;
            case 'close':
                friendRankShow = false;
                let sub = app.stage.getChildByName('shared');
                if ( sub ) {
                    app.stage.removeChild(sub);
                }
                ticker.remove(tick);
                openDataContext.postMessage({
                    event: 'close',
                });
                break;
        }
    });

    function detectToShowGroup(options) {
        // 初次打开发现要求渲染群排行榜
        if ( options && options.shareTicket && options.query && options.query.showGroup === '1' ) {
            openDataContext.postMessage({
                event      : 'showGroupRank',
                shareTicket: options.shareTicket
            });

            container.addChild(close);

            if ( !friendRankShow ) {
                friendRankShow = true;
                ticker.add(tick);
            }
        }
    }

    wx.onShow(detectToShowGroup);
    detectToShowGroup(obj);

    return container;
};

