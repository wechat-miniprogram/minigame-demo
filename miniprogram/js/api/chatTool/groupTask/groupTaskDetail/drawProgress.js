/**
 * 绘制环形进度条
 * @param current 当前进度
 * @param total 总进度
 * @param pixelRatio 像素比
 * @param options 配置选项
 * @returns 离屏Canvas对象
 */
export function drawProgress(current, total, pixelRatio, options = {}) {
    // 默认配置，确保所有尺寸都乘以 pixelRatio
    const { width: rawWidth = 166, height: rawHeight = 166, radius: rawRadius = 55, lineWidth: rawLineWidth = 9, fontSize: rawFontSize = 22, borderRadius: rawBorderRadius = 0, // 圆角会有显示问题，暂时弃用
    activeColor = '#07C160', inactiveColor = '#D9D9D9', fontColor = '#000000', fontWeight = '500' } = options;
    // 所有尺寸都乘以 pixelRatio
    const width = rawWidth * pixelRatio;
    const height = rawHeight * pixelRatio;
    const radius = rawRadius * pixelRatio;
    const lineWidth = rawLineWidth * pixelRatio;
    const fontSize = rawFontSize * pixelRatio;
    const borderRadius = rawBorderRadius * pixelRatio;
    // 创建离屏canvas
    const canvas = wx.createCanvas();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // 创建圆角矩形路径
    function createRoundedRect(x, y, width, height, radius) {
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
    ctx.fillStyle = '#FFFFFF'; // 白色背景
    ctx.fill();
    // 应用圆角裁剪
    ctx.clip();
    // 计算中心点，Y轴向上偏移
    const centerX = width / 2;
    const centerY = height / 2 - height * 0.05; // 整体向上偏移5%
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
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * progress);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.stroke();
    }
    // 绘制进度文字
    ctx.fillStyle = fontColor;
    ctx.font = `${fontWeight} ${fontSize}px PingFang SC`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = `进度${current}/${total}`;
    ctx.fillText(text, centerX, centerY);
    // 绘制底部说明文字
    ctx.fillStyle = '#999999'; // 使用灰色
    ctx.font = `normal ${fontSize * 0.6}px PingFang SC`; // 字号设置为进度文字的60%
    const bottomText = '支持自定义，此图仅为示例';
    ctx.fillText(bottomText, centerX, height - height * 0.1); // 位于底部上方10%处
    return canvas;
}
