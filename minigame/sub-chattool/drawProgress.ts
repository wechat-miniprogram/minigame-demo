/**
 * 绘制环形进度条
 * 用于分享任务进度截图
 *
 * @param current - 当前完成次数
 * @param total - 目标总次数
 * @param pixelRatio - 设备像素比
 * @param options - 样式配置
 * @returns 离屏 Canvas 对象（可用于截图或 PIXI 纹理）
 */
export function drawProgress(current: number, total: number, pixelRatio: number,
  options: {
    width?: number;
    height?: number;
    radius?: number;
    lineWidth?: number;
    fontSize?: number;
    borderRadius?: number;
    activeColor?: string;
    inactiveColor?: string;
    fontColor?: string;
    fontWeight?: string | number;
  } = {}) {

  const {
    width: rawWidth = 166,
    height: rawHeight = 166,
    radius: rawRadius = 55,
    lineWidth: rawLineWidth = 9,
    fontSize: rawFontSize = 22,
    borderRadius: rawBorderRadius = 0,
    activeColor = '#07C160',
    inactiveColor = '#D9D9D9',
    fontColor = '#000000',
    fontWeight = '500',
  } = options;

  const width = rawWidth * pixelRatio;
  const height = rawHeight * pixelRatio;
  const radius = rawRadius * pixelRatio;
  const lineWidth = rawLineWidth * pixelRatio;
  const fontSize = rawFontSize * pixelRatio;
  const borderRadius = rawBorderRadius * pixelRatio;

  const canvas = wx.createCanvas();
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 圆角矩形路径
  function createRoundedRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // 白色背景
  createRoundedRect(0, 0, width, height, borderRadius);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.clip();

  // 圆环位置（整体向上偏移 5%）
  const centerX = width / 2;
  const centerY = height / 2 - height * 0.05;
  const progress = Math.min(current / total, 1);

  // 背景圆环
  ctx.beginPath();
  ctx.strokeStyle = inactiveColor;
  ctx.lineWidth = lineWidth;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // 进度圆环
  if (progress > 0) {
    ctx.beginPath();
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = lineWidth;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * progress);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
  }

  // 进度文字
  ctx.fillStyle = fontColor;
  ctx.font = `${fontWeight} ${fontSize}px PingFang SC`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`进度${current}/${total}`, centerX, centerY);

  // 底部说明
  ctx.fillStyle = '#999999';
  ctx.font = `normal ${fontSize * 0.6}px PingFang SC`;
  ctx.fillText('支持自定义，此图仅为示例', centerX, height - height * 0.1);

  return canvas;
}
