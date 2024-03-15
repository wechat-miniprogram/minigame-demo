import {
  ctx,
  canvasWidth,
  canvasHeight,
  sceneRect,
  fontSize,
} from "./info";
import { scene } from "./scene";
import { buttons } from "./button";

let labelString = "";

const lineHeight = canvasHeight * 0.1

function loop() {
  if (!ctx) {
    return;
  }

  const currentScene = scene.currentScene;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = currentScene.background;
  ctx.fillRect(
    sceneRect.left,
    sceneRect.top,
    sceneRect.width,
    sceneRect.height
  );

  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(currentScene.title, canvasWidth * 0.5, canvasHeight * 0.5 - lineHeight * 2);

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  buttons.forEach((button) => {
    ctx.fillRect(button.x, button.y, button.width, button.height);
  });
  ctx.fillStyle = "#fff";
  buttons.forEach((button) => {
    ctx.fillText(
      button.text,
      button.x + button.width / 2,
      button.y + button.height / 2
    );
  });

  const labelLines = labelString.split('\n');
  for (let i = 0; i < labelLines.length; i++) {
    ctx.fillText(labelLines[i], canvasWidth * 0.5, canvasHeight * 0.5 + lineHeight * i);
  }

  requestAnimationFrame(loop);
}

loop();

const renderLable = (text) => {
  labelString = text;
}

export { renderLable }