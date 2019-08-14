import pixiScroll from '../../libs/pixiScroll';
import show from '../../libs/show';
module.exports = function facility(PIXI, app, obj) {
    let DOCfunc;
    return pixiScroll(PIXI, app, {
        ...obj,
        method: {
            vibrateLong: {
                label: '振动',
                callback() {
                    wx.vibrateLong({
                        success() {
                            show.Toast('振动成功', 'success', 500);
                        },
                        fail() {
                            show.Toast('振动失败', 'success', 500);
                        }
                    });
                }
            },
            getBatteryInfo: {
                label: '电量',
                callback() {
                    wx.getBatteryInfo({
                        success(res) {
                            show.Modal(`当前电量${res.level} | 手机正在${res.isCharging ? '充' : '耗'}电`);
                        },
                        fail() {
                            show.Toast('获取失败', 'success', 500);
                        }
                    });
                }
            },
            setClipboardData: {
                label: '设置系统剪贴板的内容',
                callback() {
                    let num = Math.random();
                    show.Modal(`我们设置一个随机数作为剪贴板的内容，当前的随机数是: ${num}`, () => {
                        wx.setClipboardData({
                            data: `${num}`,
                            success() {
                                show.Toast('设置成功', 'success', 500);
                            },
                            fail() {
                                show.Toast('设置失败', 'success', 500);
                            }
                        });
                    });
                }
            },
            getClipboardData: {
                label: '获取系统剪贴板的内容',
                callback() {
                    wx.getClipboardData({
                        success(res) {
                            show.Modal(`当前剪切板的随机数是：${+res.data}`);
                        },
                        fail() {
                            show.Toast('获取失败', 'success', 500);
                        }
                    });
                }
            },
            onNetworkStatusChange: {
                label: '监听网络状态变化事件',
                callback() {
                    wx.onNetworkStatusChange(res => {
                        console.log(res.isConnected);
                        console.log(res.networkType);
                        show.Toast(
                            `当前是：${
                                {
                                    wifi: 'wifi网络',
                                    '2g': '2g网络',
                                    '3g': '3g网络',
                                    '4g': '4g网络',
                                    unknown: '不常见的未知网络',
                                    none: '无网络'
                                }[res.networkType]
                            }`
                        );
                    });
                    show.Modal('请去切换网络状态进行测试', '监听成功');
                }
            },
            getNetworkType: {
                label: '获取网络类型',
                callback() {
                    wx.getNetworkType({
                        success(res) {
                            show.Toast(
                                `当前是：${
                                    {
                                        wifi: 'wifi网络',
                                        '2g': '2g网络',
                                        '3g': '3g网络',
                                        '4g': '4g网络',
                                        unknown: '不常见的未知网络',
                                        none: '无网络'
                                    }[res.networkType]
                                }`
                            );
                        },
                        fail() {
                            show.Toast('获取失败', 'success', 500);
                        }
                    });
                }
            },
            setScreenBrightness: {
                label: '设置屏幕亮度',
                callback() {
                    let num = Math.random();
                    show.Modal(`我们设置一个随机数作为屏幕亮度值，当前的随机数是: ${num}`, () => {
                        wx.setScreenBrightness({
                            value: num,
                            success() {
                                show.Toast('设置成功', 'success', 500);
                            },
                            fail() {
                                show.Toast('设置失败', 'success', 500);
                            }
                        });
                    });
                }
            },
            setKeepScreenOn: {
                label: '设置是否保持常亮状,仅在当前小程序生效',
                callback: (function() {
                    let keepScreenOn = true;
                    return () => {
                        show.Modal(`${keepScreenOn ? '保持' : '取消'}常亮状`, () => {
                            wx.setKeepScreenOn({
                                keepScreenOn,
                                success() {
                                    keepScreenOn = !keepScreenOn;
                                    show.Toast('设置成功', 'success', 500);
                                },
                                fail() {
                                    show.Toast('设置失败', 'success', 500);
                                }
                            });
                        });
                    };
                })()
            },
            getScreenBrightness: {
                label: '获取屏幕亮度',
                callback() {
                    wx.getScreenBrightness({
                        success(res) {
                            //若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
                            show.Modal(`当前屏幕亮度值：${res.value}`);
                        },
                        fail() {
                            show.Toast('获取失败', 'success', 500);
                        }
                    });
                }
            },
            onDeviceOrientationChange: {
                label: '监听横竖屏切换事件',
                callback() {
                    wx.onDeviceOrientationChange(
                        DOCfunc ||
                            (DOCfunc = res => {
                                show.Modal(
                                    `当前是：${
                                        {
                                            portrait: '竖屏',
                                            landscape: '横屏正方向，以 HOME 键在屏幕右侧为正方向',
                                            landscapeReverse: '横屏反方向，以 HOME 键在屏幕左侧为反方向'
                                        }[res.value]
                                    }`
                                );
                            })
                    );
                    show.Toast('监听成功', 'success', 500);
                }
            },
            offDeviceOrientationChange: {
                label: '取消监听横竖屏切换事件',
                callback() {
                    wx.offDeviceOrientationChange(DOCfunc);
                    show.Toast('已取消监听', 'success', 500);
                    DOCfunc = null;
                }
            },
            startAccelerometer: {
                label: '开始监听加速度数据',
                callback() {
                    wx.startAccelerometer({
                        success() {
                            show.Toast('监听成功', 'success', 500);
                        },
                        fail() {
                            show.Toast('监听失败', 'success', 500);
                        }
                    });
                }
            },
            stopAccelerometer: {
                label: '停止监听加速度数据',
                callback() {
                    wx.stopAccelerometer({
                        success() {
                            show.Toast('已停止监听', 'success', 500);
                        },
                        fail() {
                            show.Toast('停止监听失败', 'success', 500);
                        }
                    });
                }
            },

            onAccelerometerChange: {
                label: '监听加速度数据事件',
                callback(e) {
                    let children = e.target.children;
                    show.Modal('已经成功调起监听加速度数据事件，那么请留意触发了此动态窗口的按钮内容变化', '注意');
                    wx.onAccelerometerChange(res => {
                        children[0].text = `监听加速度数据事件 [ Y轴: ${res.y} ] `;
                    });
                }
            },
            startCompass: {
                label: '开始监听罗盘数据',
                callback() {
                    wx.startCompass({
                        success() {
                            show.Toast('监听成功', 'success', 500);
                        },
                        fail() {
                            show.Toast('监听失败', 'success', 500);
                        }
                    });
                }
            },
            stopCompass: {
                label: '停止监听罗盘数据',
                callback() {
                    wx.stopCompass({
                        success() {
                            show.Toast('已停止监听', 'success', 500);
                        },
                        fail() {
                            show.Toast('停止监听失败', 'success', 500);
                        }
                    });
                }
            },
            onCompassChange: {
                label: '监听罗盘数据变化事件',
                callback(e) {
                    let children = e.target.children;
                    show.Modal('已经成功调起监听罗盘数据变化事件，那么请留意触发了此动态窗口的按钮内容变化', '注意');
                    wx.onCompassChange(res => {
                        children[0].text = `监听罗盘数据变化事件 面对的方向度数是: ${res.direction}`;
                    });
                }
            },
            startDeviceMotionListening: {
                label: '开始监听设备方向的变化',
                callback() {
                    wx.startDeviceMotionListening({
                        success() {
                            show.Toast('监听成功', 'success', 500);
                        },
                        fail() {
                            show.Toast('监听失败', 'success', 500);
                        }
                    });
                }
            },
            stopDeviceMotionListening: {
                label: '停止监听设备方向的变化',
                callback() {
                    wx.stopDeviceMotionListening({
                        success() {
                            show.Toast('已停止监听', 'success', 500);
                        },
                        fail() {
                            show.Toast('停止监听失败', 'success', 500);
                        }
                    });
                }
            },
            onDeviceMotionChange: {
                label: '监听设备方向变化事件',
                callback(e) {
                    let children = e.target.children;
                    show.Modal('已经成功调起监听设备方向变化事件，那么请留意触发了此动态窗口的按钮内容变化', '注意');
                    wx.onDeviceMotionChange(res => {
                        children[0].text = `监听设备方向变化事件 beta: ${res.beta} gamma: ${res.gamma}`;
                    });
                }
            },
            startGyroscope: {
                label: '开始监听陀螺仪数据',
                callback() {
                    wx.startDeviceMotionListening({
                        interval: 'game',
                        success() {
                            show.Toast('监听成功', 'success', 500);
                        },
                        fail() {
                            show.Toast('监听失败', 'success', 500);
                        }
                    });
                }
            },
            stopGyroscope: {
                label: '停止监听陀螺仪数据',
                callback() {
                    wx.stopDeviceMotionListening({
                        success() {
                            show.Toast('已停止监听', 'success', 500);
                        },
                        fail() {
                            show.Toast('停止监听失败', 'success', 500);
                        }
                    });
                }
            },
            onGyroscopeChange: {
                label: '监听陀螺仪数据变化事件',
                callback(e) {
                    let children = e.target.children;
                    show.Modal('已经成功调起监听陀螺仪数据变化事件，那么请留意触发了此动态窗口的按钮内容变化', '注意');
                    wx.onGyroscopeChange(res => {
                        console.log(res);
                        children[0].text = `监听陀螺仪数据变化事件 x: ${res.x} y: ${res.y} z: ${res.z}`;
                    });
                }
            }
        }
    });
};
