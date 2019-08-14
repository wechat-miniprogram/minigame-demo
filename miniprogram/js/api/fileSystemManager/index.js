import pixiScroll from '../../libs/pixiScroll';
import * as meFs from './apiList';
import * as show from '../../libs/show';
module.exports = function fileSystemManager(PIXI, app, obj) {
    return pixiScroll(PIXI, app, {
        ...obj,
        method: {
            access: {
                label: '查看本地文件/目录是否存在',
                callback: () => {
                    let pathArr = [
                        '我们列举了以下三个文件目录供开发者选择查看是否存在',
                        `${wx.env.USER_DATA_PATH}/fileA`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择我们所列举的目录');
                        meFs.access({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            mkdir: {
                label: '创建目录本地用户文件目录',
                callback: () => {
                    let pathArr = [
                        '我们列举了以下三个文件目录供开发者选择创建',
                        `${wx.env.USER_DATA_PATH}/fileA`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择我们所列举的目录');
                        meFs.mkdir({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            rmdir: {
                label: '删除本地用户文件目录',
                callback: () => {
                    let pathArr = [
                        '我们列举了以下三个文件目录供开发者选择删除',
                        `${wx.env.USER_DATA_PATH}/fileA`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择我们所列举的目录');
                        meFs.rmdir({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            saveFile: {
                label: '保存临时文件到本地',
                callback: () => {
                    let pathArr = [
                        '请选择下面仅有一个本地文件路径来保存，文件来源请看源码',
                        `${wx.env.USER_DATA_PATH}/fileA/video.mp4`,
                        `这里是直接保存为缓存文件`
                    ];
                    show.ActionSheet(pathArr, res => {
                        let tapIndex = res.tapIndex;
                        if (!tapIndex) return show.Toast('请你选择唯一的路径进行保存或者保存为缓存文件');
                        wx.showLoading({
                            title: '生成临时文件中',
                            mask: true
                        });
                        wx.downloadFile({
                            url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190813/advideo.MP4',
                            success(res) {
                                wx.hideLoading();
                                meFs.saveFile({
                                    tempFilePath: res.tempFilePath,
                                    path: pathArr[tapIndex],
                                    tapIndex,
                                    callback(res) {
                                        show.Modal(res);
                                    }
                                });
                            },
                            fail: () => {
                                wx.hideLoading();
                            }
                        });
                    });
                }
            },
            writeFile: {
                label: '写入或创建本地用户文件',
                callback: () => {
                    let pathArr = [
                        '请选择下面仅有的一个本地文件路径进行写入',
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择唯一的路径进行写入');
                        meFs.writeFile({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            unlink: {
                label: '删除本地用户文件',
                callback: () => {
                    let pathArr = [
                        '请选择下面任意一项的文件路径来进行删除',
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/content.txt`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/afterRename.txt`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择其中一项来进行删除');
                        meFs.unlink({
                            tapIndex: res.tapIndex,
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            appendFile: {
                label: '本地用户文件结尾追加内容',
                callback: () => {
                    let pathArr = [
                        '请选择下面任意一项的文件路径对文件进行追加内容',
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/content.txt`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/afterRename.txt`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return wx.show.Toast('请你选择其中一项来进行追加内容');
                        meFs.appendFile({
                            tapIndex: res.tapIndex,
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            readFile: {
                label: '读取本地用户文件内容',
                callback: () => {
                    let pathArr = [
                        '请选择下面任意一项的文件路径进行查看其内容',
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/content.txt`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB/afterRename.txt`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return wx.show.Toast('请你选择其中一项进行查看其内容');
                        meFs.readFile({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            copyFile: {
                label: '复制本地用户文件',
                callback: () => {
                    let pathArr = [
                        '请选择下面仅有的一个本地文件路径进行复制',
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return wx.show.Toast('请你选择唯一的路径进行写入');
                        meFs.copyFile({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            getFileInfo: {
                label: '获取本地临时文件或缓存文件信息',
                callback: () => {
                    show.Modal('我们会调用downloadFile下载一个视频从而获得一个临时路径，即本地临时文件', () => {
                        wx.showLoading({
                            title: '生成临时文件中',
                            mask: true
                        });
                        wx.downloadFile({
                            url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190813/advideo.MP4',
                            success(res) {
                                wx.hideLoading();
                                meFs.getFileInfo({
                                    tempFilePath: res.tempFilePath,
                                    callback(res) {
                                        show.Modal(res);
                                    }
                                });
                            },
                            fail: () => {
                                wx.hideLoading();
                            }
                        });
                    });
                }
            },
            getSavedFileList: {
                label: '获取已保存的本地缓存文件列表',
                callback: () => {
                    meFs.getSavedFileList({
                        callback(res) {
                            show.Modal(res);
                        }
                    });
                }
            },
            removeSavedFile: {
                label: '删除该小程序下已保存的本地缓存文件',
                callback: () => {
                    meFs.removeSavedFile({
                        callback(res) {
                            show.Modal(res);
                        }
                    });
                }
            },
            readdir: {
                label: '读取本地用户文件目录内列表',
                callback: () => {
                    let pathArr = [
                        '我们列举了以下三个文件目录供开发者选择读取',
                        `${wx.env.USER_DATA_PATH}/fileA`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择我们所列举的目录');
                        meFs.readdir({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            rename: {
                label: '重命名文件。可以把文件从oldPath移动到newPath',
                callback: () => {
                    let pathArr = [
                        '请选择下面仅有的一个本地文件路径进行复制',
                        `${wx.env.USER_DATA_PATH}/otherfile/test/hello.txt`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return wx.show.Toast('请你选择唯一的路径进行写入');
                        meFs.rename({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            unzip: {
                label: '解压本地用户文件',
                callback: () => {
                    let pathArr = [
                        '我们列举了以下三个文件目录供开发者选择存放解压后的文件',
                        `${wx.env.USER_DATA_PATH}/fileA`,
                        `${wx.env.USER_DATA_PATH}/fileA/fileB`,
                        `${wx.env.USER_DATA_PATH}/otherfile/test`
                    ];
                    show.ActionSheet(pathArr, res => {
                        if (!res.tapIndex) return show.Toast('请你选择我们所列举的目录');
                        meFs.unzip({
                            path: pathArr[res.tapIndex],
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            },
            stat: {
                label: '获取本地缓存或用户文件 Stats 对象',
                callback: () => {
                    show.Modal(`我们只提供根路径 ${wx.env.USER_DATA_PATH} 来进行测试`, () => {
                        meFs.stat({
                            callback(res) {
                                show.Modal(res);
                            }
                        });
                    });
                }
            }
        }
    });
};
