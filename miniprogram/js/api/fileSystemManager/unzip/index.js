import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'unzip':
                // 先获取全局唯一的文件管理器，接着调起unzip方法
                wx.getFileSystemManager().unzip({
                    zipFilePath: 'test.zip', // 压缩包在根路径
                    targetPath: `${wx.env.USER_DATA_PATH}/fileA`,
                    success() {
                        show.Toast('解压成功', 'success', 800);
                    }
                });
                break;
        }
    });
};
