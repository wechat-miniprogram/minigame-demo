import layout, { Layout } from './libs/engine';
import { UserData, Box } from './type';

type Element = InstanceType<Layout['Element']>;
type IStyle = Element['style'];

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
        <text class="interactButton" data-id="${user.openid}" value="赠送"></text>
      </view>
    `;
  });
  template += `</scrollview>`;
  const style: Record<string, IStyle> = {
    container: {
      left: box.x,
      top: box.y,
      width: box.width,
      height: box.height,
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
      fontSize: 16 * pixelRatio,
      marginLeft: 8 * pixelRatio,
      width: 60 * pixelRatio,
      marginTop: 4 * pixelRatio,
    },
    interactButton: {
      position: 'absolute',
      right: 8 * pixelRatio,
      backgroundColor: '#07c160',
      width: 60 * pixelRatio,
      height: 30 * pixelRatio,
      lineHeight: 30 * pixelRatio,
      fontSize: 14 * pixelRatio,
      marginLeft: (box.width - 300) * pixelRatio,
      borderRadius: 12,
      color: 'white',
      textAlign: 'center',
      ':active': {
        backgroundColor: '#05944a',
      },
    },
  };

  const sharedCanvas = wx.getSharedCanvas();
  const ctx = sharedCanvas.getContext('2d');
  layout.init(template, style);
  layout.updateViewPort({
    x: 0,
    y: 0,
    width: box.width / pixelRatio,
    height: box.height / pixelRatio,
  });
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
