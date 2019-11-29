import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'writeFile':
                // 先获取全局唯一的文件管理器，接着调起writeFile方法
                wx.getFileSystemManager().writeFile({
                    filePath: `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
                    data: 'hello, world', // 写入的内容
                    success() {
                        show.Toast('写入成功', 'success', 800);

                        drawFn(); // 更新UI
                    },
                    fail(res) {
                        if (!res.errMsg) return;

                        if (res.errMsg.includes('fail no such file or directory')) {
                            res.errMsg = `上级目录 ${JSON.stringify(
                                `${wx.env.USER_DATA_PATH}/fileA`
                            )} 不存在，请去创建目录`;

                            show.Modal(res.errMsg, '发生错误');
                        }
                    }
                });
                break;

            case 'readFile':
                // 先获取全局唯一的文件管理器，接着调起readFile方法
                wx.getFileSystemManager().readFile({
                    filePath: `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
                    encoding: 'utf-8',
                    success(res) {
                        show.Modal(`获取成功返回到内容是 “${res.data}”`, '读取成功');
                    }
                });
                break;

            case 'appendFile':
                // 先获取全局唯一的文件管理器，接着调起appendFile方法
                wx.getFileSystemManager().appendFile({
                    filePath: `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
                    data: ' The Testing API', // 新追加的内容
                    success() {
                        show.Toast('追加成功', 'success', 800);
                    }
                });
                break;

            case 'copyFile':
                // 先获取全局唯一的文件管理器，接着调起copyFile方法
                wx.getFileSystemManager().copyFile({
                    srcPath: `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,  
                    destPath: `${wx.env.USER_DATA_PATH}/fileA/hello - copy.txt`, // 复制并重新命名文件路径
                    success() {
                        show.Toast('复制成功', 'success', 800);
                    }
                });
                break;

            case 'unlink':
                // 先获取全局唯一的文件管理器，接着调起unlink方法
                wx.getFileSystemManager().unlink({
                    filePath: `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
                    success() {
                        show.Toast('删除成功', 'success', 800);

                        drawFn(); // 更新UI
                    }
                });
                break;
        }
    });
};
