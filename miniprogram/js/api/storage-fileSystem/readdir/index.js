import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, dirPath, drawFn } = data;
        switch (status) {
            case 'readdir':
                dirPath = `${wx.env.USER_DATA_PATH}/fileA`;

                // 先获取全局唯一的文件管理器，接着调起readdir方法
                wx.getFileSystemManager().readdir({
                    dirPath,
                    success(res) {
                        if (!(res.files || []).length) return show.Modal('目录内容为空');

                        show.Toast('查看成功', 'success', 800);

                        drawFn(dirPath); // 更新UI
                    },
                    fail(res) {
                        if (!res.errMsg) return;

                        if (
                            res.errMsg.includes('no such file or directory') ||
                            res.errMsg.includes('fail not a directory')
                        ) {
                            res.errMsg = `目录 ${JSON.stringify(dirPath)} 不存在，请去创建`;

                            show.Modal(res.errMsg, '发生错误');
                        }
                    }
                });
                break;
        }
    });
};
