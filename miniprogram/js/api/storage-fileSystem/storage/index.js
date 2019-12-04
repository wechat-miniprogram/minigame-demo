import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, key, value } = data;
        switch (status) {
            case 'setStorage':
                wx.setStorage({
                    key,
                    data: value,
                    success() {
                        show.Modal(`数据存储成功`);
                    }
                });
                break;
                
            case 'getStorage':
                wx.getStorage({
                    key,
                    success(res) {
                        show.Modal(`data: ${res.data}`, '读取数据成功');
                    },
                    fail() {
                        show.Modal('找不到 key 对应的数据', '读取数据失败');
                    }
                });
                break;

            case 'clearStorage':
                wx.clearStorage({
                    success() {
                        show.Modal('清除数据成功');
                    }
                });
                break;
        }
    });
};
