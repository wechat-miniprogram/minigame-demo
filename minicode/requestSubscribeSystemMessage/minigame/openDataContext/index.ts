import { getInteractUI } from './interact';
import { Box } from './type';

wx.onMessage((res) => {
  if (res.command === 'renderFriend') {
    setData(100);
    getDataAndDraw(false, res.box);
  } else {
    setData(res.score);
    getDataAndDraw(true, res.box);
  }
});

function setData(score: number) {
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

function getDataAndDraw(flag: boolean, box: Box) {
  wx.getFriendCloudStorage({
    keyList: ['score'],
    success: (res) => {
      console.log('getData => ', res);
      if (!flag) {
        getInteractUI(res.data, box);
      } else {
      }
    },
    fail: (res) => {
      console.log('getData => ', res);
    },
  });
}
