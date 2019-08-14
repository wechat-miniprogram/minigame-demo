import './js/libs/weapp-adapter';
import * as PIXI from './js/libs/pixi';
import pmgressBar from './js/libs/pmgressBar';

wx.cloud.init({ env: 'example-69d3b' });

const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync();

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
// 可以有两种修改
app.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio;
    point.y = y * pixelRatio;
};

PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio;
    point.y = y * pixelRatio;
};

PIXI.ratio = pixelRatio / 2;

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
        'images/abilityOpen.png'
    ])
    .load(() => {
        wx.loadSubpackage({
            name: 'api',
            success() {
                let router = require('./js/api/game');
                router(PIXI, app, {
                    width: windowWidth * pixelRatio,
                    height: windowHeight * pixelRatio
                });
                loadingFn(100);
            }
        }).onProgressUpdate(res => {
            loadingFn(res.progress);
            console.log('下载进度', res.progress);
            console.log('已经下载的数据长度', res.totalBytesWritten);
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
        });
    });
