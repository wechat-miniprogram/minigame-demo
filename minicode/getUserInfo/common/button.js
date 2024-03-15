import { ctx, sceneRect, pixelRatio, fontSize } from "./info";

const padding = 10 * pixelRatio;
const startX = sceneRect.left + padding;
const startY = sceneRect.top + padding;
let currentX = startX;
let currentY = startY;

const buttons = [];

/**
 * 创建一个按钮
 * @param {object} data {text: 显示的文字，event: 点击事件}
 */
function addButton(data) {
  if (!data.text) {
    return;
  }
  if (ctx.font !== `${fontSize}px Arial`) {
    ctx.font = `${fontSize}px Arial`;
  }
  const textRect = ctx.measureText(data.text);
  const renderWidth = textRect.width + padding * 2;
  const renderHeight = fontSize + padding * 2;
  let renderX = data.left;
  let renderY = data.top;
  if (data.right) {
    renderX = data.right - renderWidth;
  }
  if (data.bottom) {
    renderX = data.bottom - renderHeight;
  }

  // 如果没有传入坐标，则自动布局
  if (!renderX && !renderY) {
    renderX = currentX;
    renderY = currentY;
    if (renderX + renderWidth > sceneRect.right - padding) {
      currentX = startX;
      currentY += renderHeight + padding * 2;
      renderX = currentX;
      renderY = currentY;
    }
    currentX += renderWidth + padding * 2;
  }
  buttons.push({
    x: renderX || 0,
    y: renderY || 0,
    width: renderWidth,
    height: renderHeight,
    text: data.text,
    event: data.event,
  });
}

function inButtonArea(x, y, target) {
  return (
    x >= target.x &&
    x <= target.x + target.width &&
    y >= target.y &&
    y <= target.y + target.height
  );
}

wx.onTouchEnd((result) => {
  const changedTouches = result.changedTouches || [];

  if (changedTouches && changedTouches.length) {
    changedTouches.forEach((touch) => {
      const x = touch.clientX * pixelRatio;
      const y = touch.clientY * pixelRatio;

      buttons.forEach((button) => {
        if (inButtonArea(x, y, button)) {
          button.event();
        }
      });
    });
  }
});

export { buttons, addButton };
