import * as errMsgObj from '../../errMsg/index';
let fs = wx.getFileSystemManager();
module.exports = {
    fs,
    access(obj) {
        fs.access({
            path: `${obj.path}`,
            success: () => {
                obj.callback && obj.callback('已确认本地文件或目录存在');
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'access');
                        break;
                    }
                }
            }
        });
    },
    mkdir(obj) {
        fs.mkdir({
            dirPath: `${obj.path}`,
            recursive: true,
            success: () => {
                obj.callback && obj.callback('您已添加成功');
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'mkdir');
                        break;
                    }
                }
            }
        });
    },
    rmdir(obj) {
        fs.rmdir({
            dirPath: `${obj.path}`,
            recursive: true,
            success: () => {
                obj.callback && obj.callback('您已删除成功');
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'rmdir');
                        break;
                    }
                }
            }
        });
    },
    saveFile(obj) {
        let parameterObj = {
            tempFilePath: obj.tempFilePath,
            filePath: `${obj.path}`, //如果是一个无效的路径就会保存为缓存文件
            recursive: true,
            success: () => {
                obj.callback && obj.callback('您已保存成功');
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'saveFile');
                        break;
                    }
                }
            }
        };
        obj.tapIndex === 2 && delete parameterObj.filePath;
        fs.saveFile(parameterObj);
    },
    writeFile(obj) {
        fs.writeFile({
            filePath: `${obj.path}`,
            data: 'hello, world ',
            success: () => {
                obj.callback &&
                    obj.callback(
                        '您已写入成功，并且我们为您自动写入 hello, world 的字符串，你可以调用查看文件接口进行查看我们为您写入的内容'
                    );
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'writeFile');
                        break;
                    }
                }
            }
        });
    },
    unlink(obj) {
        fs.unlink({
            filePath: `${obj.path}`,
            success: () => {
                obj.callback && obj.callback(`成功删除文件`);
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        var tipsList = ['拷贝', '重命名', '写入'];
                        errMsgObj[errMsglist[i]](obj, 'unlink', tipsList[obj.tapIndex - 1]);
                        break;
                    }
                }
            }
        });
    },
    appendFile(obj) {
        fs.appendFile({
            filePath: `${obj.path}`,
            data: 'The Testing API',
            success: () => {
                obj.callback &&
                    obj.callback(
                        `您已追加成功，并且我们为您自动追加 The Testing API 的字符串，你可以调用查看文件接口进行查看我们为您追加的内容`
                    );
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        var tipsList = ['拷贝', '重命名', '写入'];
                        errMsgObj[errMsglist[i]](obj, 'appendFile', tipsList[obj.tapIndex - 1]);
                        break;
                    }
                }
            }
        });
    },
    readFile(obj) {
        fs.readFile({
            filePath: `${obj.path}`,
            encoding: 'utf-8',
            success: res => {
                obj.callback && obj.callback(`文件内容：${res.data}`);
            },
            fail: res => {
                if (!obj.callback) return;
                if (res.errMsg.includes('txt')) return obj.callback(`错误：文件不存在请去添加、复制或者重命名文件`);
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'readFile');
                        break;
                    }
                }
            }
        });
    },
    copyFile(obj) {
        fs.copyFile({
            srcPath: `${obj.path}`,
            destPath: `${wx.env.USER_DATA_PATH}/fileA/fileB/content.txt`,
            success: () => {
                obj.callback && obj.callback(`成功拷贝到文件路径 ${wx.env.USER_DATA_PATH}/fileA/fileB/content.txt`);
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'copyFile');
                        break;
                    }
                }
            }
        });
    },
    getFileInfo(obj) {
        fs.getFileInfo({
            filePath: obj.tempFilePath,
            success: res => {
                obj.callback && obj.callback(`这个文件的size：${res.size}`);
            }
        });
    },
    getSavedFileList(obj) {
        fs.getSavedFileList({
            success: res => {
                if (!obj.callback) return;
                delete res.errMsg;
                res.fileList.length
                    ? obj.callback(`获取成功返回的内容是${JSON.stringify(res)}`)
                    : obj.callback(`内容为空请去添加本地缓存文件`);
            }
        });
    },
    removeSavedFile(obj) {
        fs.getSavedFileList({
            success: res => {
                if (!obj.callback) return;
                if (!res.fileList.length) return obj.callback(`错误：你还没有本地缓存文件请去添加`);
                fs.removeSavedFile({
                    filePath: res.fileList[0].filePath,
                    success: () => {
                        obj.callback(`删除成功`);
                    }
                });
            }
        });
    },
    readdir(obj) {
        fs.readdir({
            dirPath: obj.path,
            success: res => {
                if (!obj.callback) return;
                delete res.errMsg;
                obj.callback(`获取成功返回的内容是${JSON.stringify(res)}`);
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'readdir');
                        break;
                    }
                }
            }
        });
    },
    rename(obj) {
        fs.rename({
            oldPath: `${obj.path}`,
            newPath: `${wx.env.USER_DATA_PATH}/fileA/fileB/afterRename.txt`,
            success: () => {
                obj.callback &&
                    obj.callback(
                        `成功重命名到文件路径 ${
                            wx.env.USER_DATA_PATH
                        }/fileA/fileB/afterRename.txt 且原路径的文件已经被删除`
                    );
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'rename');
                        break;
                    }
                }
            }
        });
    },
    unzip(obj) {
        fs.unzip({
            zipFilePath: 'test.zip',
            targetPath: obj.path,
            success: () => {
                obj.callback(`解压成功而解压出两张png的图片，可以调用 readdir API 进行查看`);
            },
            fail: res => {
                if (!obj.callback) return;
                for (var i = 0, errMsglist = Object.keys(errMsgObj); i < errMsglist.length; i++) {
                    if (res.errMsg.includes(errMsglist[i])) {
                        errMsgObj[errMsglist[i]](obj, 'unzip');
                        break;
                    }
                }
            }
        });
    },
    stat(obj) {
        fs.stat({
            path: `${wx.env.USER_DATA_PATH}`,
            success: res => {
                delete res.errMsg;
                obj.callback(`获取成功返回的stats内容是${JSON.stringify(res.stats)}`);
            }
        });
    }
};
