import pixiScroll from '../../libs/pixiScroll';
import show from '../../libs/show';
module.exports = function(PIXI, app, parameterObj) {
    return pixiScroll(PIXI, app, {
        ...parameterObj,
        method: {
            abilityOpen: {
                label: '开发能力',
                children: {
                    userInfo: {
                        label: '用户信息'
                    },
                    appletCode: {
                        label: '二维码'
                    },
                    transpond: {
                        label: '转发'
                    },
                    customerService: {
                        label: '客服服务',
                        callback() {
                            // 调起客服聊天窗口
                            wx.openCustomerServiceConversation({
                                success() {
                                    console.log('调起成功');
                                },
                                fail() {
                                    console.log('调起失败');
                                }
                            });
                        }
                    },
                    getUnionID: {
                        label: 'UnionID',
                        callback() {
                            wx.showLoading({ title: '响应中...', mask: true });
                            // 这里我们调用云函数来获取UnionID
                            wx.cloud.callFunction({
                                // 需调用的云函数名
                                name: 'getUnionID',
                                success(res) {
                                    wx.hideLoading();

                                    show.Modal(
                                        `UnionID: ${
                                            res.result.unionid
                                        };  如果UnionID不存在那就证明开发者帐号下不存在同主体的公众号或移动应用，并且该用户没有授权登录过该公众号或移动应用`
                                    );

                                    console.log(res.result.unionid);
                                },
                                fail(res) {
                                    wx.hideLoading();

                                    show.Modal(`${res.errCode}`, '失败');

                                    console.log(`调起失败: ${res.errCode}`);
                                }
                            });
                        }
                    }
                }
            },
            rendering: {
                label: '渲染'
            },
            facility: {
                label: '设备'
            },
            network: {
                label: '网络',
                children: {
                    request: {
                        label: '发送请求'
                    },
                    downloadFile: {
                        label: '下载文件'
                    },
                    uploadFile: {
                        label: '上传文件'
                    },
                    WebSocket: {
                        label: 'WebSocket'
                    }
                }
            },
            media: {
                label: '媒体',
                children: {
                    video: {
                        label: '视频'
                    },
                    voiceFrequency: {
                        label: '音频'
                    }
                }
            },
            fileSystemManager: {
                label: '数据与文件系统'
            },
            worker: {
                label: '多线程'
            }
        }
    });
};
