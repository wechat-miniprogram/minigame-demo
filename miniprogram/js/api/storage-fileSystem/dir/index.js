import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, drawFn } = data;
        switch (status) {
            case 'mkdir':
                // 先获取全局唯一的文件管理器，接着调起mkdir方法
                wx.getFileSystemManager().mkdir({
                    dirPath: `${wx.env.USER_DATA_PATH}/fileA`,
                    recursive: true,
                    success() {
                        drawFn(); // 更新UI

                        show.Toast('创建成功', 'success', 800);
                    }
                });

                break;
            case 'rmdir':
                // 先获取全局唯一的文件管理器，接着调起rmdir方法
                wx.getFileSystemManager().rmdir({
                    dirPath: `${wx.env.USER_DATA_PATH}/fileA`,
                    recursive: true,
                    success() {
                        drawFn(); // 更新UI
                        
                        show.Toast('删除成功', 'success', 800);
                    }
                });

                break;
        }
    });
};
