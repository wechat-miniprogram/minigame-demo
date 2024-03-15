const canvas = wx.createCanvas();
const info = wx.getSystemInfoSync();

const { pixelRatio, screenWidth, screenHeight } = info;
const canvasWidth = screenWidth * pixelRatio;
const canvasHeight = screenHeight * pixelRatio;
const sceneRect = {
  left: canvasWidth * 0.1,
  top: canvasHeight * 0.1,
  width: canvasWidth * 0.8,
  height: canvasHeight * 0.75,
  right: canvasWidth * 0.9,
  bottom: canvasHeight * 0.85,
};
const fontSize = Math.min(canvasWidth, canvasHeight) / 20;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const ctx = canvas.getContext("2d");

export { ctx, fontSize, sceneRect, screenWidth, screenHeight, canvasWidth, canvasHeight, pixelRatio }