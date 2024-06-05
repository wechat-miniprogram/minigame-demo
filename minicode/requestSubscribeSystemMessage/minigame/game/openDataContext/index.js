import { getInteractUI } from './friend_interactive';
wx.onMessage((res) => {
    if (res.command === 'renderFriend') {
        setData(100);
        getDataAndDraw(false, res.box);
    }
    //  else {
    //   setData(res.score);
    //   getDataAndDraw(true, res.box);
    // }
});
function setData(score) {
    wx.setUserCloudStorage({
        KVDataList: [
            {
                key: 'score',
                value: JSON.stringify(score),
            },
        ],
        success: (res) => {
            console.log('setData => ', res);
        },
        fail: (res) => {
            console.log('setData => ', res);
        },
    });
}
function getDataAndDraw(flag, box) {
    wx.getFriendCloudStorage({
        keyList: ['score'],
        success: (res) => {
            console.log('getData => ', res);
            if (!flag) {
                getInteractUI(res.data, box);
            }
        },
        fail: (res) => {
            console.log('getData => ', res);
        },
    });
}
