import Layout from './engine.js';
export function pushMessage(data, selfData) {
    const list = Layout.getElementsByClassName('listItem');

    list.forEach((item, index) => {
        item.on('click', () => {
            if ((selfData, data[index].nickname === selfData.nickname)) return;
            wx.modifyFriendInteractiveStorage({
                key: '1', // 需要修改的数据的 key，目前可以为 '1' - '50'
                opNum: 1, // 需要修改的数值，目前只能为 1
                operation: 'add', // 修改类型,目前只能是add
                toUser: data[index].openid, // 好友的 openId
                title: '送你 1 个金币，赶快打开游戏看看吧', // 2.9.0 支持
                // success() {},
                // fail() {}
            });
        });
    });
}
