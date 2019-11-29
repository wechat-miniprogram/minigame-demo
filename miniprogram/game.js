import './js/libs/weapp-adapter';
import * as PIXI from './js/libs/pixi.min';
import pmgressBar from './js/libs/pmgressBar';
import share from './js/libs/share';

wx.cloud.init({ env: 'example-69d3b' });

wx.updateShareMenu({
    withShareTicket: true,
});

const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();

// 初始化canvas
let app = new PIXI.Application({
    width: windowWidth * pixelRatio,
    height: windowHeight * pixelRatio,
    view: canvas,
    backgroundColor: 0xf6f6f6,
    preserveDrawingBuffer: true,
    antialias: true,
    resolution: 1
});

// 因为在微信小游戏里canvas肯定是全屏的，所以映射起来就很简单暴力

PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio;
    point.y = y * pixelRatio;
};

PIXI.ratio = (windowWidth * pixelRatio) / 750;

let loadingFn = pmgressBar(PIXI, app, {
    width: windowWidth * pixelRatio,
    height: windowHeight * pixelRatio
});

PIXI.loader
    .add([
        'images/APIicon.png',
        'images/fileSystemManager.png',
        'images/rendering.png',
        'images/network.png',
        'images/media.png',
        'images/play.png',
        'images/pause.png',
        'images/stop.png',
        'images/worker.png',
        'images/star.png',
        'images/customerService.png',
        'images/facility.png',
        'images/right.png',
        'images/abilityOpen.png',
        'images/interface.png'
    ])
    .load(() => {
        wx.loadSubpackage({
            name: 'api',
            success() {
                let router = require('./js/api/game'),
                    query = wx.getLaunchOptionsSync().query;

                router(PIXI, app, {
                    width: windowWidth * pixelRatio,
                    height: windowHeight * pixelRatio,
                    pixelRatio
                });

                share(); //全局分享

                let res = wx.getLaunchOptionsSync();
                if (Object.keys(query).length && query.pathName) {
                    window.router.navigateTo(query.pathName, query, res);
                }

                wx.onShow(res => {
                    let query = Object.assign(window.query || {}, res.query),
                        noNavigateToRequired = !['VoIPChat'].includes(query.pathName);

                    if (Object.keys(query).length && query.pathName) {
                        noNavigateToRequired &&
                            query.pathName === window.router.getNowPageName() &&
                            window.router.navigateBack();

                        !window.query && !no_navigateTo_required && window.router.navigateTo(query.pathName, query, res);

                        no_navigateTo_required && window.router.navigateTo(query.pathName, query, res);
                    }

                    no_navigateTo_required && (window.query = null);
                });

                loadingFn(100);
            }
        }).onProgressUpdate(res => {
            loadingFn(res.progress);
        });
    });
