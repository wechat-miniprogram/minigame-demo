import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, paperFile, drawFn } = data;
        switch (status) {
            case 'getSavedFileList':
                // 先获取全局唯一的文件管理器，接着调起getSavedFileList方法
                wx.getFileSystemManager().getSavedFileList({
                    success(res) {
                        if (!(res.fileList || []).length) return show.Modal('本地缓存文件列表为空');

                        show.Toast('获取成功', 'success', 800);

                        drawFn(res.fileList); // 更新UI
                    }
                });
                break;

            case 'removeSavedFile':
                // 先获取全局唯一的文件管理器，接着调起removeSavedFile方法

                paperFile = paperFile.map(item => {
                    return new Promise(res => {
                        wx.getFileSystemManager().removeSavedFile({
                            filePath: item.filePath,
                            success() {
                                res();
                            }
                        });
                    });
                });

                Promise.all(paperFile).then(() => {
                    show.Toast('已清空', 'success', 800);
                    
                    drawFn(); // 更新UI
                });
                break;
        }
    });
};
