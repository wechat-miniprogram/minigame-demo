import layout from '../libs/engine';
import richText from '../libs/richtext';
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
      <text class="text tips"></text>
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
        fontSize: 18 * pixelRatio,
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
};
layout.use(richText);
layout.init(template, style);
layout.updateViewPort({
    x: 0,
    y: 0,
    width: screenWidth,
    height: screenHeight,
});
layout.layout(ctx);
const footerButtonLeft = layout.getElementsByClassName('footer_button_left')[0];
const footerButtonRight = layout.getElementsByClassName('footer_button_right')[0];
const sceneTitle = layout.getElementsByClassName('title')[0];
const sceneExplanation = layout.getElementsByClassName('explanation')[0];
const sceneButtons = layout.getElementById('scene_buttons');
const sceneButton = layout.getElementsByClassName('scene_button')[0];
const sceneTips = layout.getElementsByClassName('tips')[0];
footerButtonLeft.on('click', () => {
    scene.preScene();
});
footerButtonRight.on('click', () => {
    scene.nextScene();
});
const sceneChanged = () => {
    sceneTitle.value = scene.currentScene.title;
    sceneExplanation.text = scene.currentScene.explanation || '';
    sceneButtons?.children.forEach((it) => {
        sceneButtons.removeChild(it);
    });
    scene.currentScene.buttons?.forEach((config) => {
        const button = layout.cloneNode(sceneButton);
        button.value = config.name;
        button.on('click', config.callback);
        sceneButtons?.appendChild(button);
    });
};
scene.on('sceneChanged', sceneChanged);
const changeTips = (value) => {
    sceneTips.value = value;
};
export { screenWidth, screenHeight, changeTips };
