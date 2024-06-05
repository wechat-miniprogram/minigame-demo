import layout, { Text, IStyle } from '../libs/engine';
import richText, { RichText } from '../libs/richtext';
import { scene } from './scene';
import { getSafeArea } from './utils';

// 设置游戏画布尺寸
const info = wx.getSystemInfoSync();
const menuRect = wx.getMenuButtonBoundingClientRect();
const { pixelRatio, screenWidth, screenHeight } = info;
const GAME_WIDTH = screenWidth * pixelRatio;
const GAME_HEIGHT = screenHeight * pixelRatio;
const padding = 10 * pixelRatio;
const headerHeight = menuRect.bottom * pixelRatio + padding;
const safeArea = getSafeArea(info);
const footerPaddingBottom = (screenHeight - safeArea.bottom) * pixelRatio;
const footerInnerHeight = 50 * pixelRatio;
const footerHeight = footerInnerHeight + footerPaddingBottom;

// 初始化游戏画布
const canvas = wx.createCanvas();
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext('2d');

const template = `
  <view id="container">
    <view class="header">
      <text class="text title"></text>
    </view>
    <view class="scene">
      <richtext class="text explanation"></richtext>
      <view id="scene_buttons">
        <text class="button scene_button"></text>
      </view>
      <richtext class="text tips"></richtext>
    </view>
    <view class="footer">
      <text class="button footer_button footer_button_left" value="上一场景"></text>
      <text class="button footer_button footer_button_right" value="下一场景"></text>
    </view>
  </view>
`;

const style = {
  container: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#ededed',
  },
  header: {
    width: GAME_WIDTH,
    height: headerHeight,
    backgroundColor: '#ededed',
  },
  text: {
    color: '#000',
    opacity: 0.9,
    fontSize: 16 * pixelRatio,
  },
  title: {
    marginTop: menuRect.top * pixelRatio,
    height: menuRect.height * pixelRatio,
    lineHeight: menuRect.height * pixelRatio,
    width: GAME_WIDTH,
    textAlign: 'center',
    fontSize: 20 * pixelRatio,
  },
  scene: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT - headerHeight - footerHeight,
    backgroundColor: '#fff',
    padding: 20 * pixelRatio,
  },
  footer: {
    width: GAME_WIDTH,
    height: footerHeight,
    backgroundColor: '#ededed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8 * pixelRatio,
  },
  explanation: {
    width: GAME_WIDTH - 40 * pixelRatio,
    fontSize: 16 * pixelRatio,
    lineHeight: 20 * pixelRatio,
  },
  tips: {
    width: GAME_WIDTH - 40 * pixelRatio,
    fontSize: 14 * pixelRatio,
    lineHeight: 20 * pixelRatio,
    marginTop: 20 * pixelRatio,
    opacity: 0.6,
  },
  button: {
    width: 120 * pixelRatio,
    backgroundColor: '#07c160',
    color: '#ffffff',
    fontSize: 16 * pixelRatio,
    textAlign: 'center',
    ':active': {
      backgroundColor: '#05944a',
    },
  },
  scene_buttons: {
    marginTop: 16 * pixelRatio,
  },
  scene_button: {
    height: 30 * pixelRatio,
    lineHeight: 30 * pixelRatio,
    borderRadius: 4 * pixelRatio,
    marginBottom: 8 * pixelRatio,
  },
  footer_button: {
    height: footerInnerHeight - 16 * pixelRatio,
    lineHeight: footerInnerHeight - 16 * pixelRatio,
    borderRadius: 4 * pixelRatio,
  },
} as Record<string, IStyle>;

layout.use(richText);
layout.init(template, style);

layout.updateViewPort({
  x: 0,
  y: 0,
  width: screenWidth,
  height: screenHeight,
});

layout.layout(ctx);

const footerButtonLeft = layout.getElementsByClassName(
  'footer_button_left',
)[0] as Text;
const footerButtonRight = layout.getElementsByClassName(
  'footer_button_right',
)[0] as Text;
const sceneTitle = layout.getElementsByClassName('title')[0] as Text;
const sceneExplanation = layout.getElementsByClassName(
  'explanation',
)[0] as unknown as RichText;
const sceneButtons = layout.getElementById('scene_buttons');
const sceneButton = layout.getElementsByClassName('scene_button')[0] as Text;
const sceneTips = layout.getElementsByClassName(
  'tips',
)[0] as unknown as RichText;

footerButtonLeft.on('click', () => {
  scene.preScene();
});
footerButtonRight.on('click', () => {
  scene.nextScene();
});

const canRenderBox = {
  x: 0,
  y: 0,
  width: GAME_WIDTH,
  height: GAME_HEIGHT - footerHeight - 20 * pixelRatio,
};

const updateCanRenderBox = () => {
  const lastNode = (sceneTips as any).layoutBox;
  canRenderBox.y = lastNode.originalAbsoluteY + lastNode.height;
  canRenderBox.height = GAME_HEIGHT - footerHeight - 20 * pixelRatio - canRenderBox.y;
};

const sceneChanged = () => {
  sceneTitle.value = scene.currentScene.title;
  sceneExplanation.text = scene.currentScene.explanation || '';
  const len = sceneButtons?.children.length || 0;
  for (let i = len - 1; i >= 0; i--) {
    sceneButtons?.removeChild(sceneButtons?.children[i]);
  }
  scene.currentScene.buttons?.forEach((config) => {
    const button = layout.cloneNode(sceneButton);
    button.value = config.name;
    button.on('click', config.callback);
    sceneButtons?.appendChild(button);
  });
  layout.ticker.next(() => {
    updateCanRenderBox();
    scene.currentScene.exposed?.();
  });
};
scene.on('sceneChanged', sceneChanged);

const changeTips = (value?: string[] | string) => {
  if (!value) {
    sceneTips.text = '';
  } else {
    if (typeof value === 'string') {
      value = [value];
    }
    sceneTips.text = value.map((it) => `<p>${it}</p>`).join('');
  }
  layout.ticker.next(() => {
    updateCanRenderBox();
  });
};

const startTicker = (callback: () => void) => {
  layout.ticker.add(callback);
};

const stopTicker = (callback: () => void) => {
  layout.ticker.remove(callback);
};

wx.onShow(() => {
  layout.repaint();
});

export {
  screenWidth,
  screenHeight,
  changeTips,
  canvas,
  pixelRatio,
  startTicker,
  stopTicker,
  canRenderBox,
};
