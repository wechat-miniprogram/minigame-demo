import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'getFileInfo':
                // 先获取全局唯一的文件管理器，接着调起getFileInfo方法
                wx.getFileSystemManager().getFileInfo({
                    filePath: 'images/weapp.jpg', // 压缩包在根路径
                    success(res) {
                        show.Modal(`这个文件的size：${res.size}B`, '获取成功');
                    }
                });
                break;
        }
    });
};
