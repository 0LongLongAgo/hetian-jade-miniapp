/**
 * 珠子图片模拟服务 - 创建正方体珠子图片
 */

class MockBeadImageGenerator {
  constructor() {
    this.canvases = {};
  }

  /**
   * 根据颜色生成珠子Canvas图像
   */
  generateBeadImage(canvasId, color, size = 88) {
    return new Promise((resolve) => {
      wx.createSelectorQuery().select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0]) {
          console.error('Canvas not found:', canvasId);
          resolve(false);
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;

        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        // 画制珠子
        this._drawBead(ctx, size / 2, size / 2, size / 2 - 4, color);
        resolve(true);
      });
    });
  }

  /**
   * 画制单个珠子核心逻辑
   */
  _drawBead(ctx, cx, cy, radius, color) {
    // 清空
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, radius * 2 + 8, radius * 2 + 8);

    // 1. 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(cx, cy + radius * 0.35, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 2. 主体渐变
    const gradient = ctx.createRadialGradient(
      cx - radius * 0.4, cy - radius * 0.4, radius * 0.2,
      cx, cy, radius
    );

    const rgbColor = this._hexToRgb(color);
    const brighterColor = this._brightenColor(rgbColor, 1.4);
    const darkerColor = this._darkenColor(rgbColor, 0.6);

    gradient.addColorStop(0, `rgb(${brighterColor.r},${brighterColor.g},${brighterColor.b})`);
    gradient.addColorStop(0.5, `rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`);
    gradient.addColorStop(1, `rgb(${darkerColor.r},${darkerColor.g},${darkerColor.b})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. 边框
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 4. 高光
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.35, cy - radius * 0.35, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 5. 次屭光
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(cx + radius * 0.2, cy + radius * 0.2, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 十六进制与RGB转换
   */
  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 123, g: 91, b: 149 };
  }

  /**
   * 亮化颜色
   */
  _brightenColor(rgb, factor) {
    return {
      r: Math.min(255, Math.round(rgb.r * factor)),
      g: Math.min(255, Math.round(rgb.g * factor)),
      b: Math.min(255, Math.round(rgb.b * factor))
    };
  }

  /**
   * 暗化颜色
   */
  _darkenColor(rgb, factor) {
    return {
      r: Math.max(0, Math.round(rgb.r * factor)),
      g: Math.max(0, Math.round(rgb.g * factor)),
      b: Math.max(0, Math.round(rgb.b * factor))
    };
  }
}

module.exports = MockBeadImageGenerator;