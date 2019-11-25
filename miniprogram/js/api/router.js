const signIn = [
    {
        label: '小游戏示例',
        name: 'APIentry',
        path: 'APIentry/index',
        tabBar: 'index',
        children: [
            {
                label: '开放能力',
                name: 'abilityOpen',
                children: [
                    {
                        label: '微信登录',
                        name: 'login',
                        path: 'abilityOpen/login/index'
                    },
                    {
                        label: '获取用户信息',
                        name: 'getUserInfo',
                        path: 'abilityOpen/getUserInfo/index'
                    },
                    {
                        label: '转发',
                        name: 'onShareAppMessage',
                        path: 'abilityOpen/onShareAppMessage/index'
                    },
                    {
                        label: '主动转发',
                        name: 'shareAppMessage',
                        path: 'abilityOpen/shareAppMessage/index'
                    },
                    {
                        label: '二维码',
                        name: 'appletCode',
                        path: 'abilityOpen/appletCode/index'
                    },
                    {
                        label: 'UnionID',
                        name: 'UnionID',
                        path: 'abilityOpen/UnionID/index'
                    },
                    {
                        label: '客服服务',
                        name: 'customerService',
                        path: 'abilityOpen/customerService/index'
                    },
                    {
                        label: '实时语音',
                        name: 'VoIPChat',
                        path: 'abilityOpen/VoIPChat/index'
                    },
                    {
                        label: '游戏对局回放',
                        name: 'getGameRecorder',
                        path: 'abilityOpen/getGameRecorder/index'
                    },
                    {
                        label: '设置',
                        name: 'setting',
                        path: 'abilityOpen/setting/index'
                    }
                ]
            },
            {
                label: '界面',
                name: 'interface',
                children: [
                    {
                        label: '显示操作菜单',
                        name: 'showActionSheet',
                        path: 'interface/showActionSheet/index'
                    },
                    {
                        label: '显示模态弹窗',
                        name: 'showModal',
                        path: 'interface/showModal/index'
                    },
                    {
                        label: '显示消息提示框',
                        name: 'showToast',
                        path: 'interface/showToast/index'
                    }
                ]
            },
            {
                label: '渲染',
                name: 'rendering',
                children: [
                    {
                        label: '画布内容转换为URL',
                        name: 'toDataURL',
                        path: 'rendering/toDataURL/index'
                    },
                    {
                        label: '截图生成一个临时文件',
                        name: 'toTempFilePath',
                        path: 'rendering/toTempFilePath/index'
                    },
                    {
                        label: '渲染帧率',
                        name: 'setPreferredFramesPerSecond',
                        path: 'rendering/setPreferredFramesPerSecond/index'
                    },
                    {
                        label: '加载自定义字体文件',
                        name: 'loadFont',
                        path: 'rendering/loadFont/index'
                    },
                    {
                        label: '创建一个图片对象',
                        name: 'createImage',
                        path: 'rendering/createImage/index'
                    }
                ]
            },
            {
                label: '设备',
                name: 'facility',
                children: [
                    {
                        label: '振动',
                        name: 'vibrate',
                        path: 'facility/vibrate/index'
                    },
                    {
                        label: '剪贴板',
                        name: 'clipboardData',
                        path: 'facility/clipboardData/index'
                    },
                    {
                        label: '获取手机网络状态',
                        name: 'getNetworkType',
                        path: 'facility/getNetworkType/index'
                    },
                    {
                        label: '监听手机网络变化',
                        name: 'onNetworkStatusChange',
                        path: 'facility/onNetworkStatusChange/index'
                    },
                    {
                        label: '获取设备电量状态',
                        name: 'getBatteryInfo',
                        path: 'facility/getBatteryInfo/index'
                    },
                    {
                        label: '屏幕亮度',
                        name: 'screenBrightness',
                        path: 'facility/screenBrightness/index'
                    },
                    {
                        label: '设置保持常亮状态',
                        name: 'setKeepScreenOn',
                        path: 'facility/setKeepScreenOn/index'
                    },
                    {
                        label: '监听罗盘数据',
                        name: 'compassChange',
                        path: 'facility/compassChange/index'
                    },
                    {
                        label: '重力感应',
                        name: 'accelerometerChange',
                        path: 'facility/accelerometerChange/index'
                    },
                    {
                        label: '监听设备方向',
                        name: 'deviceMotionChange',
                        path: 'facility/deviceMotionChange/index'
                    },
                    {
                        label: '监听陀螺仪数据',
                        name: 'gyroscopeChange',
                        path: 'facility/gyroscopeChange/index'
                    },
                    {
                        label: '横竖屏切换',
                        name: 'deviceOrientationChange',
                        path: 'facility/deviceOrientationChange/index'
                    }
                ]
            },
            {
                label: '网络',
                name: 'network',
                children: [
                    {
                        label: '发送请求',
                        name: 'request',
                        path: 'network/request/index'
                    },
                    {
                        label: '下载文件',
                        name: 'downloadFile',
                        path: 'network/downloadFile/index'
                    },
                    {
                        label: '上传文件',
                        name: 'uploadFile',
                        path: 'network/uploadFile/index'
                    },
                    {
                        label: 'WebSocket',
                        name: 'WebSocket',
                        path: 'network/webSocket/index'
                    }
                ]
            },
            {
                label: '媒体',
                name: 'media',
                children: [
                    {
                        label: '视频',
                        name: 'video',
                        path: 'media/video/index'
                    },
                    {
                        label: '音频',
                        name: 'voiceFrequency',
                        path: 'media/voiceFrequency/index'
                    }
                ]
            },
            {
                label: '数据与文件系统',
                name: 'fileSystemManager',
                children: [
                    {
                        label: '创建/删除目录',
                        name: 'mk-rm-dir',
                        path: 'fileSystemManager/mk-rm-dir/index'
                    },
                    {
                        label: '判断文件/目录是否存在',
                        name: 'access',
                        path: 'fileSystemManager/access/index'
                    },
                    {
                        label: '保存临时文件到本地',
                        name: 'saveFile',
                        path: 'fileSystemManager/saveFile/index'
                    },
                    {
                        label: '操作文件',
                        name: 'operationFile',
                        path: 'fileSystemManager/operationFile/index'
                    },
                    {
                        label: '重命名文件',
                        name: 'rename',
                        path: 'fileSystemManager/rename/index'
                    },
                    {
                        label: '获取文件信息',
                        name: 'getFileInfo',
                        path: 'fileSystemManager/getFileInfo/index'
                    },
                    {
                        label: '解压文件',
                        name: 'unzip',
                        path: 'fileSystemManager/unzip/index'
                    }
                ]
            },
            {
                label: '多线程',
                name: 'worker',
                path: 'worker/index'
            }
        ]
    }
];

function router(PIXI, app, parameter) {
    let treePage = {};
    function regroup(circularArr) {
        circularArr = circularArr.slice(0);
        while (circularArr.length) {
            let page = circularArr.shift();
            parameter = { ...parameter, name: page.name, isTabBar: !!page.tabBar };
            page.path &&
                (treePage[page.name] = {
                    label: page.label,
                    path: page.path,
                    parameter
                });
            (page.children || []).length && circularArr.unshift(...page.children.slice(0));
        }
    }
    regroup(signIn);

    for (let i = 0, len = signIn.length; i < len; i++) {
        let name = signIn[i].name;
        treePage[name].page = require(treePage[name].path)(PIXI, app, treePage[name].parameter, signIn[i].children);
        treePage[name].init = true;
    }

    window.router = new (function() {
        this.treeView = ['APIentry'];
        this.navigateTo = function(newPage, query) {
            let lastOne = this.treeView.length - 1,
                name = this.treeView[lastOne];
            if (name === newPage) return;

            this.treeView.push(newPage);
            treePage[newPage].reload && treePage[newPage].reload();

            if (!treePage[newPage].init) {
                treePage[newPage].page = require(treePage[newPage].path)(PIXI, app, {
                    ...treePage[newPage].parameter,
                    ...query
                });
                treePage[newPage].init = true;
            }

            treePage[name].page.visible = false;
            treePage[newPage].page.visible = true;
        };
        this.navigateBack = function() {
            if (this.treeView.length < 2) return;
            treePage[this.treeView.pop()].page.visible = false;
            treePage[this.getNowPageName()].page.visible = true;
        };
        this.delPage = function() {
            if (this.treeView.length < 2) return;
            let name = this.treeView.pop();
            treePage[name].page.visible = false;
            app.stage.removeChild(treePage[name].page).destroy(true);
            treePage[name].page = null;
            treePage[name].init = false;
            treePage[this.getNowPageName()].page.visible = true;
        };
        this.getNowPageName = function() {
            return this.treeView[this.treeView.length - 1];
        };
        this.getNowPageLabel = function() {
            return treePage[this.treeView[this.treeView.length - 1]].label;
        };
        this.getNowPage = function(callBack) {
            callBack(treePage[this.treeView[this.treeView.length - 1]]);
        };
    })();
    window.router.navigateTo('rename');
}
module.exports = router;
