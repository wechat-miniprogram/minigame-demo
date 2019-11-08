import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status } = data;
        switch (status) {
            case 'openCustomerServiceConversation':
                // 调起客服聊天窗口
                wx.openCustomerServiceConversation({
                    success() {
                        console.log('调起成功');
                    },
                    fail() {
                        console.log('调起失败');
                    }
                });

                break;
        }
    });
};
