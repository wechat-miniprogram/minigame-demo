import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, (status, func) => {
        switch (status) {
            case 'connection':
                wx.showLoading({
                    title: '连接中...',
                    mask: true
                });
                wx.onSocketOpen(() => {
                    wx.hideLoading();
                    console.log('WebSocket 已连接');
                    show.Toast('Socket已连接', 'success', 1000);
                    func(); // 更新 UI
                });

                wx.onSocketClose(() => {
                    console.log('WebSocket 已断开');
                });

                wx.onSocketError(error => {
                    wx.hideLoading();
                    show.Modal(JSON.stringify(error), '发生错误');
                    console.error('socket error:', error);
                });

                // 监听服务器推送消息
                wx.onSocketMessage(message => {
                    show.Toast('收到服务器响应', 'success', 1000);
                    console.log('socket message:', message);
                });

                // 打开信道
                wx.connectSocket({
                    url: 'wss://echo.websocket.org'
                });
                break;
            case 'disconnect':
                wx.closeSocket({
                    success() {
                        show.Toast('Socket已断开', 'success', 1000);
                        func && func(); // 更新 UI
                    }
                });
                break;
            case 'sendMessage':
                wx.sendSocketMessage({
                    data: 'Hello, MiniGame!'
                });
                break;
        }
    });
};
