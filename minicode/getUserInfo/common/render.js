import layout from "../libs/engine";
import { scene } from "./scene";
// 设置游戏画布尺寸
const info = wx.getSystemInfoSync();
const { pixelRatio, screenWidth, screenHeight } = info;
const GAME_WIDTH = screenWidth * pixelRatio;
const GAME_HEIGHT = screenHeight * pixelRatio;
// 初始化游戏画布
const canvas = wx.createCanvas();
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext("2d");
let template = `
  <view id="container">
    ${scene.scenes.map((it) => `<view class="scene">
          <text class="title" value="${it.title}"></text>
          <text class="label" value=""></text>
        </view>`)}
    <text class="button button_left" value="上一场景"></text>
    <text class="button button_right" value="下一场景"></text>
  </view>
`;
let style = {
    container: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#000000",
        flexDirection: "row",
    },
    scene: {
        width: GAME_WIDTH * 0.8,
        height: GAME_HEIGHT * 0.7,
        margin: GAME_WIDTH * 0.1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        opacity: 0.2,
    },
    title: {
        color: "#ffffff",
        height: 120,
        lineHeight: 120,
        textAlign: "center",
        fontSize: 50,
    },
    label: {
        color: "#ffffff",
        height: 120,
        lineHeight: 120,
        textAlign: "center",
        fontSize: 50,
    },
    button: {
        position: "absolute",
        backgroundColor: "#f00",
        color: "#ffffff",
        top: GAME_HEIGHT * 0.8,
        borderRadius: 10,
        width: 400,
        height: 120,
        lineHeight: 120,
        fontSize: 50,
        textAlign: "center",
        ':active': {
            transform: 'scale(1.05, 1.05)',
        }
    },
    button_left: {
        left: GAME_WIDTH * 0.1,
    },
    button_right: {
        right: GAME_WIDTH * 0.1,
    }
};
layout.init(template, style);
layout.updateViewPort({
    x: 0,
    y: 0,
    width: screenWidth,
    height: screenHeight,
});
layout.layout(ctx);
const button_left = layout.getElementsByClassName("button_left")[0];
const button_right = layout.getElementsByClassName("button_right")[0];
if (button_left) {
    button_left.on("click", () => {
        scene.preScene();
    });
}
if (button_right) {
    button_right.on("click", () => {
        scene.nextScene();
    });
}
const renderLable = (value) => {
    const label = layout.getElementsByClassName('label')[0];
    if (label) {
        label.value = value;
    }
};
export { screenWidth, screenHeight, renderLable };
