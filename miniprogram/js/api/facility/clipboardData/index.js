import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, value, drawFn } = data;
        switch (status) {
            case 'setClipboardData':
                // 设置系统剪贴板的内容，即复制内容
                wx.setClipboardData({
                    data: value,
                    success() {
                        drawFn(); //绘制UI
                    }
                });
                break;
            case 'getClipboardData':
                // 获取系统剪贴板的内容，即粘贴内容
                wx.getClipboardData({
                    success(res) {
                        console.log(res.data);

                        drawFn(res.data); //绘制UI
                        
                        show.Toast('粘贴成功', 'success', 500);
                    }
                });
                break;
        }
    });
};
