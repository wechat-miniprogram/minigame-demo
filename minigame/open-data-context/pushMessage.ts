const Layout = requirePlugin('Layout').default;

export function interactive(data, selfData) {
    const buttonList = Layout.getElementsByClassName('itemButton');

    buttonList.forEach((item, index) => {
        item.on('click', () => {
            if ((selfData, data[index].nickname === selfData.nickname)) return;
            wx.modifyFriendInteractiveStorage({
                key: '1',                               // 需要修改的数据的 key，目前可以为 '1' - '50'
                opNum: 1,                               // 需要修改的数值，目前只能为 1
                operation: 'add',                       // 修改类型,目前只能是add
                toUser: data[index].openid,             // 好友的 openId
                title: '送你 1 个金币，赶快打开游戏看看吧',// 2.9.0 支持
                imageUrl: 'images/miniGame.png'
            });
        });
    });
}

export function directional(data) {
    const buttonList = Layout.getElementsByClassName('itemButton');

    buttonList.forEach((item, index) => {
        item.on('click', () => {
            wx.shareMessageToFriend({
                openId: data[index].openid,
                title: '小游戏示例',
                imageUrl: 'images/miniGame.png'
            });
        });
    });
}

export function refreshDirected(fn) {
    const button = Layout.getElementsByClassName('captionRight')[0];
     
    button.on('click', () => {
        fn && fn()
    })
}