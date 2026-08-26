const show = require('../../../libs/show');

let onStatusCallback: ((connected: boolean) => void) | null = null;
let onMessageCallback: ((data: string) => void) | null = null;

export function setOnStatus(cb: (connected: boolean) => void) {
  onStatusCallback = cb;
}

export function setOnMessage(cb: (data: string) => void) {
  onMessageCallback = cb;
}

/** 连接 WebSocket */
export function connectSocket() {
  wx.showLoading({ title: '连接中...', mask: true });

  wx.onSocketOpen(() => {
    wx.hideLoading();
    show.Toast('Socket已连接', 'success', 1000);
    onStatusCallback?.(true);
  });

  wx.onSocketClose(() => {
    onStatusCallback?.(false);
  });

  wx.onSocketError((error: any) => {
    wx.hideLoading();
    show.Modal(JSON.stringify(error), '发生错误');
    console.error('socket error:', error);
  });

  wx.onSocketMessage((message: any) => {
    show.Toast('收到服务器响应', 'success', 1000);
    console.log('socket message:', message);
    onMessageCallback?.(String(message.data ?? ''));
  });

  wx.connectSocket({
    url: 'wss://echo.websocket.org',
  });
}

/** 断开 WebSocket */
export function closeSocket() {
  wx.closeSocket({
    success() {
      show.Toast('Socket已断开', 'success', 1000);
      onStatusCallback?.(false);
    },
  });
}

/** 发送消息 */
export function sendMessage() {
  wx.sendSocketMessage({
    data: 'Hello, MiniGame!',
  });
}

/** 页面卸载时关闭连接 */
export function onUnload() {
  wx.closeSocket();
}
