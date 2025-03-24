/**
 * 绘制环形进度条
 * @param current 当前进度
 * @param total 总进度
 * @param options 配置选项
 * @returns 离屏Canvas对象
 */
export function drawProgress(current: number, total: number, pixelRatio: number,
  options: {
    width?: number;       // 画布宽度
    height?: number;      // 画布高度
    radius?: number;      // 圆环半径
    lineWidth?: number;   // 圆环线宽
    activeColor?: string; // 已完成颜色
    inactiveColor?: string; // 未完成颜色
    fontSize?: number;    // 字体大小
    fontColor?: string;   // 字体颜色
    fontWeight?: string | number; // 字体粗细
    borderRadius?: number; // 画布圆角半径
  } = {}) {
  // 默认配置
  const {
    width = 166 * pixelRatio,
    height = 166 * pixelRatio,
    radius = 55 * pixelRatio,
    lineWidth = 9 * pixelRatio,
    activeColor = '#07C160',
    inactiveColor = '#D9D9D9',
    fontSize = 22 * pixelRatio,
    fontColor = '#000000',
    fontWeight = '500', // 可以是 'normal', 'bold', '500' 等
    borderRadius = 12 * pixelRatio  // 默认圆角大小
  } = options;

  // 创建离屏canvas
  const canvas = wx.createCanvas();
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 创建圆角矩形路径
  function createRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  // 绘制圆角矩形背景
  createRoundedRect(0, 0, width, height, borderRadius);
  ctx.fillStyle = '#FFFFFF';  // 白色背景
  ctx.fill();

  // 应用圆角裁剪
  ctx.clip();

  // 计算中心点
  const centerX = width / 2;
  const centerY = height / 2;

  // 计算进度
  const progress = Math.min(current / total, 1);

  // 绘制背景圆环
  ctx.beginPath();
  ctx.strokeStyle = inactiveColor;
  ctx.lineWidth = lineWidth;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  // 绘制进度圆环
  if (progress > 0) {
    ctx.beginPath();
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = lineWidth;
    // 从12点钟方向开始绘制，所以需要减去90度（π/2）
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * progress);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
  }

  // 绘制文字
  ctx.fillStyle = fontColor;
  ctx.font = `${fontWeight} ${fontSize}px PingFang SC`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = `进度${current}/${total}`;
  ctx.fillText(text, centerX, centerY);

  return canvas;
}

// 使用示例：
/*
const progressCanvas = drawProgress(1, 5, {
    width: 300,
    height: 300,
    radius: 100,
    lineWidth: 16,
    activeColor: '#07C160',
    inactiveColor: '#E5E5E5',
    fontSize: 40,
    fontColor: '#000000',
    fontWeight: 'bold',  // 设置字体粗细
    borderRadius: 16  // 设置画布圆角
});

// 将离屏Canvas绘制到目标Canvas上
targetCtx.drawImage(progressCanvas, x, y);
*/ 