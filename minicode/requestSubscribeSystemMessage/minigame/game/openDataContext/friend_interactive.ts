import layout, { IStyle } from './libs/engine';
import { UserData, Box } from './type';
// 设置游戏画布尺寸
const info = wx.getSystemInfoSync();
const { pixelRatio } = info;

export function getInteractUI(data: Array<UserData>, box: Box) {
  // 在开始时清空之前的layout数据，方便重新绘制
  layout.clear();
  let template = `<scrollview scrollY="true" class="container">`;
  data.forEach((user) => {
    template += `
      <view class="content">
        <image src="${user.avatarUrl}" class="img"></image>
        <text class="name" value="${user.nickname}"></text>
        <view class="interactFooter">
          <text class="interactButton" value="赠送" data-id="${user.openid}"></text> 
        </view>
      </view>
    `;
  });
  template += `</scrollview>`;
  const style = {
    container: {
      width: box.width * pixelRatio,
      height: box.height * pixelRatio,
      backgroundColor: '#F8F8FF',
    },
    content: {
      height: 35 * pixelRatio,
      flexDirection: 'row',
      marginTop: 5 * pixelRatio,
    },
    img: {
      width: 30 * pixelRatio,
      height: 30 * pixelRatio,
      marginLeft: 20 * pixelRatio,
    },
    name: {
      color: 'black',
      fontSize: 20 * pixelRatio,
      marginLeft: 100 * pixelRatio,
      width: 60 * pixelRatio,
      marginTop: 5 * pixelRatio,
      textAlign: 'center',
    },
    interactFooter: {
      backgroundColor: '#07c160',
      width: 70 * pixelRatio,
      height: 30 * pixelRatio,
      marginLeft: (box.width - 300) * pixelRatio,
      borderRadius: 15,
    },
    interactButton: {
      marginLeft: 20 * pixelRatio,
      color: 'white',
      verticalAlign: 'bottom',
      lineHeight: 14 * pixelRatio,
      textAlign: 'center',
      marginTop: 8 * pixelRatio,
      fontSize: 14 * pixelRatio,
    },
  } as Record<string, IStyle>;

  const sharedCanvas = wx.getSharedCanvas();
  const ctx = sharedCanvas.getContext('2d');
  layout.init(template, style);
  layout.updateViewPort(box);
  layout.layout(ctx);
  bindEvent();
}

function bindEvent() {
  const buttons = layout.getElementsByClassName('interactButton');
  buttons.forEach((button) => {
    button!.on('click', () => {
      wx.modifyFriendInteractiveStorage({
        key: '1',
        opNum: 1,
        operation: 'add',
        toUser: button!.dataset.id,
        title: '好友交互测试-送你 10 个金币，赶快打开游戏看看吧',
        success: (res) => {
          console.log('分享成功', res);
        },
        fail: (res) => {
          console.log('分享失败', res);
        },
      });
    });
  });
}
