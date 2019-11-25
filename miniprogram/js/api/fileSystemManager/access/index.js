import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, index, path } = data;
        switch (status) {
            case 'access':
                path = [`${wx.env.USER_DATA_PATH}/fileA`, `${wx.env.USER_DATA_PATH}/fileA/test.txt`][index];
                // 先获取全局唯一的文件管理器，接着调起access方法
                wx.getFileSystemManager().access({
                    path,
                    success: () => {
                        wx.showModal({
                            content: path + ' 目录存在',
                            showCancel: false,
                            confirmColor: '#02BB00'
                        });
                    },
                    fail: res => {
                        if(res.errMsg){
                            let err = res.errMsg.split(',');
                            err[0] = '文件/目录不存在'
                            show.Modal(err.join(','));
                        }
                    }
                });
                break;
        }
    });
};
