import view from './view';
import { errMsgGlobal } from '../../../errMsg/index';
import show from '../../../libs/show';
import createRenderer from './render';

module.exports = function (PIXI, app, obj) {
    let videoDecoder, frameData, currentTime, isPaused;
    let videoSprite;
    let baseTexture;
    let texture;
    let renderer;
    let canvas;

    // 初始化视频解码器
    const initVideoDecoder = (data = {}) => {
        if (wx.getSystemInfoSync().platform === 'devtools') {
            show.Modal('开发者工具不支持，需要使用预览在真机进行调试', '提示');
            return;
        }

        try {
            const defaultConfig = {
                source: 'https://baikebcs.bdimg.com/baike-other/big-buck-bunny.mp4',
                width: 1280,
                height: 720
            };

            const finalConfig = { ...defaultConfig, ...data };
            console.log('开始初始化视频解码器', finalConfig);

            // 创建视频解码器
            try {
                videoDecoder = wx.createVideoDecoder({
                    type: "wemedia"
                });
                console.log('视频解码器创建成功');
            } catch (e) {
                console.error('视频解码器创建失败:', e);
                throw e;
            }

            // 创建渲染相关对象
            try {
                canvas = wx.createCanvas();
                canvas.width = 1280;  // 设置一个合适的初始宽度
                canvas.height = 720;  // 16:9 比例

                if (!!GameGlobal.isIOSHighPerformanceModePlus) {
                    // 高性能+模式使用WebGL渲染器
                    renderer = createRenderer(canvas);
                    // 创建PIXI纹理，但使用WebGL渲染
                    baseTexture = new PIXI.BaseTexture(canvas);
                    texture = new PIXI.Texture(baseTexture);
                } else {
                    // 普通模式使用PIXI
                    baseTexture = new PIXI.BaseTexture(canvas);
                    texture = new PIXI.Texture(baseTexture);
                }

                videoSprite = new PIXI.Sprite(texture);
                console.log('渲染对象创建成功');
            } catch (e) {
                console.error('渲染对象创建失败:', e);
                throw e;
            }

            // 设置精灵位置和大小
            try {
                const headerHeight = 150;
                const availableHeight = obj.height - headerHeight;

                const targetRatio = 16 / 9;
                let displayWidth, displayHeight;

                displayWidth = obj.width * 0.9;
                displayHeight = displayWidth / targetRatio;

                if (displayHeight > availableHeight * 0.8) {
                    displayHeight = availableHeight * 0.8;
                    displayWidth = displayHeight * targetRatio;
                }

                const xPos = (obj.width - displayWidth) / 2;
                const yPos = headerHeight + (availableHeight - displayHeight) / 2;

                videoSprite.width = displayWidth;
                videoSprite.height = displayHeight;
                videoSprite.x = xPos;
                videoSprite.y = yPos;

                console.log('Sprite位置和大小设置成功:', {
                    width: displayWidth,
                    height: displayHeight,
                    x: xPos,
                    y: yPos
                });
            } catch (e) {
                console.error('精灵属性设置失败:', e);
                throw e;
            }

            // 添加到舞台
            try {
                app.stage.addChild(videoSprite);
                console.log('Sprite添加到舞台成功');
            } catch (e) {
                console.error('添加到舞台失败:', e);
                throw e;
            }

            // 设置错误处理
            videoDecoder.onError && videoDecoder.onError(res => {
                console.error('视频解码器错误:', res);
                for (let i = 0, errMsglist = Object.keys(errMsgGlobal); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgGlobal[errMsglist[i]]({
                            callback(res) {
                                show.Modal(res, '发生错误');
                            }
                        });
                        break;
                    }
                }
            });

            // 监听解码器事件
            videoDecoder.on("start", () => {
                console.log('解码开始');
                show.Toast('开始解码', 'success', 1000);
            });

            videoDecoder.on("stop", () => {
                console.log('解码停止');
                show.Toast('停止解码', 'success', 1000);
            });

            videoDecoder.on("ended", () => {
                console.log('播放完成');
                show.Toast('播放完成', 'success', 1000);
            });

            videoDecoder.on('frame', (res) => {
                try {
                    closeFrame();
                    frameData = res;
                    currentTime = res.pts / 1000;

                    if (frameData) {
                        const { width, height, data } = frameData;

                        if (!!GameGlobal.isIOSHighPerformanceModePlus && renderer) {
                            // 高性能+模式：使用WebGL渲染器
                            if (canvas.width !== width || canvas.height !== height) {
                                canvas.width = width;
                                canvas.height = height;
                            }
                            renderer(data, width, height);
                            // 通知PIXI纹理更新
                            baseTexture.update();
                        } else {
                            // 普通模式：使用2D Canvas
                            const ctx = canvas.getContext('2d');

                            if (canvas.width !== width || canvas.height !== height) {
                                canvas.width = width;
                                canvas.height = height;
                            }

                            const imageData = ctx.createImageData(width, height);
                            imageData.data.set(new Uint8ClampedArray(data));
                            ctx.putImageData(imageData, 0, 0);
                            baseTexture.update();
                        }
                    }
                } catch (e) {
                    console.error('帧处理失败:', e);
                }
            });

            // 配置播放选项
            const startOption = {
                source: finalConfig.source,
                mode: 1,
            }

            if (!!GameGlobal.isIOSHighPerformanceModePlus) {
                startOption.videoDataType = 2;
            }

            console.log('开始播放视频，配置:', startOption);

            // 开始播放
            videoDecoder.start(startOption).catch(error => {
                console.error('视频解码器启动失败:', error);
                show.Modal('视频解码器启动失败', '错误');
            });

            // 监听小游戏前后台切换
            wx.onHide(() => {
                if (videoDecoder) {
                    videoDecoder.wait(true);
                    isPaused = true;
                }
            });

            wx.onShow(() => {
                if (videoDecoder && isPaused) {
                    videoDecoder.wait(false);
                    isPaused = false;
                }
            });

        } catch (e) {
            console.error('初始化失败，详细错误:', e);
            console.error('错误堆栈:', e.stack);
            show.Modal(`初始化失败: ${e.message}`, '错误');
            throw e;
        }
    };

    // 销毁渲染过的数据
    const closeFrame = () => {
        if (frameData) {
            frameData.close?.();
        }
        frameData = null;
    };

    return view(PIXI, app, obj, res => {
        const { status, data = {} } = res;
        switch (status) {
            case 'createVideoDecoder':
                try {
                    console.log('收到创建视频解码器请求:', data);
                    initVideoDecoder(data);
                } catch (e) {
                    console.error('视频解码器创建失败:', e);
                }
                break;
            case 'destroy':
                console.log('开始清理资源');
                if (videoDecoder) {
                    videoDecoder.stop();
                    videoDecoder = null;
                }
                closeFrame();
                if (videoSprite) {
                    app.stage.removeChild(videoSprite);
                    if (texture) {
                        texture.destroy(true);
                    }
                    if (baseTexture) {
                        baseTexture.destroy();
                    }
                    videoSprite.destroy();
                    videoSprite = null;
                    texture = null;
                    baseTexture = null;
                    renderer = null;
                }
                console.log('资源清理完成');
                break;
        }
    });
};