/**
 * Canvas 2D 手串渲染引擎 - 真实绘制珠子、绳子、阴影、高光
 * 支持旋转、导出、触摸交互
 */

class BraceletRenderer {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.ctx = null;
    this.canvas = null;
    this.dpr = wx.getSystemInfoSync().pixelRatio || 2;
    this.rotationAngle = 0;
    this.animationId = null;
  }

  /**
   * 初始化 Canvas
   */
  async init(width, height) {
    return new Promise((resolve) => {
      wx.createSelectorQuery().select(`#${this.canvasId}`).fields({ node: true, size: true }).exec((res) => {
        if (!res || !res[0]) {
          console.error('Canvas not found');
          resolve(false);
          return;
        }
        
        this.canvas = res[0].node;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        
        console.log(`Canvas initialized: ${width}x${height} (dpr: ${this.dpr})`);
        resolve(true);
      });
    });
  }

  /**
   * 清空画布
   */
  clear(bgColor = '#F6F2F9') {
    if (!this.ctx) return;
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
  }

  /**
   * 绘制手串框架（圆形轮廓 + 绳子）
   */
  drawBraceletFrame(cx, cy, radius, stringColor = 'rgba(255,255,255,0.6)', stringWidth = 2) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    // 绳子（外圈弧线）
    ctx.strokeStyle = stringColor;
    ctx.lineWidth = stringWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();
    
    // 虚线轮廓（辅助）
    ctx.strokeStyle = 'rgba(196,176,214,0.3)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * 绘制单个珠子（带阴影、高光、纹理、旋转效果）
   */
  drawBead(cx, cy, radius, color, beadLabel = '', rotationAngle = 0) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);
    ctx.translate(-cx, -cy);
    
    // 1. 底层阴影
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy + radius * 0.3, radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. 主体 - 径向渐变（模拟球面效果）
    const gradient = ctx.createRadialGradient(
      cx - radius * 0.35, cy - radius * 0.35, radius * 0.2,
      cx, cy, radius
    );
    
    // 根据颜色生成渐变
    const rgbColor = this.hexToRgb(color);
    const brighterColor = this.brightenColor(rgbColor, 1.3);
    const darkerColor = this.darkenColor(rgbColor, 0.7);
    
    gradient.addColorStop(0, `rgb(${brighterColor.r},${brighterColor.g},${brighterColor.b})`);
    gradient.addColorStop(0.5, `rgb(${rgbColor.r},${rgbColor.g},${rgbColor.b})`);
    gradient.addColorStop(1, `rgb(${darkerColor.r},${darkerColor.g},${darkerColor.b})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. 边框（增加立体感）
    ctx.strokeStyle = `rgba(255,255,255,0.4)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 4. 高光点
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.4, cy - radius * 0.4, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // 5. 珠子标签（如果有）
    if (beadLabel) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.font = `bold ${Math.max(10, radius * 0.8)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(beadLabel, cx, cy);
    }
    
    ctx.restore();
  }

  /**
   * 绘制多个珠子排列成手串
   */
  drawBeads(beads, braceletRadius, centerX, centerY, rotationAngle = 0) {
    if (!this.ctx || !beads || beads.length === 0) return;
    
    const arcStart = -Math.PI * 0.75;
    const arcEnd = Math.PI * 0.75;
    const arcSpan = arcEnd - arcStart;
    const braceletMM = beads.reduce((sum, b) => sum + parseFloat(b.size || 8), 0);
    
    // 计算珠子间距
    const gapMM = beads.length > 1 ? Math.max(0.5, (braceletRadius * 10 - braceletMM) / (beads.length - 1)) : 0;
    const totalSpanMM = braceletMM + gapMM * (beads.length - 1);
    const radPerMM = arcSpan / Math.max(braceletRadius * 10, totalSpanMM);
    
    let angle = arcStart + rotationAngle;
    
    // 按顺序绘制珠子
    beads.forEach((bead, index) => {
      const beadSizeMM = parseFloat(bead.size || 8);
      const beadSizePx = Math.min(25, 7 + beadSizeMM * 0.85);
      const beadRad = beadSizeMM * radPerMM;
      const midAngle = angle + beadRad / 2;
      
      // 计算珠子位置
      const x = centerX + Math.cos(midAngle) * braceletRadius;
      const y = centerY + Math.sin(midAngle) * braceletRadius;
      
      // 绘制珠子
      this.drawBead(
        x, y, beadSizePx,
        bead.color || '#7B5B95',
        bead.size,
        rotationAngle
      );
      
      angle += beadRad + gapMM * radPerMM;
    });
  }

  /**
   * 绘制完整手串
   */
  render(beads, bgColor = '#F6F2F9', rotationAngle = 0) {
    this.clear(bgColor);
    
    const centerX = (this.canvas.width / this.dpr) / 2;
    const centerY = (this.canvas.height / this.dpr) / 2.5;
    const braceletRadius = 85;
    
    // 绘制背景框架
    this.drawBraceletFrame(centerX, centerY, braceletRadius);
    
    // 绘制珠子
    if (beads && beads.length > 0) {
      this.drawBeads(beads, braceletRadius, centerX, centerY, rotationAngle);
    } else {
      // 空状态提示
      const ctx = this.ctx;
      ctx.fillStyle = 'rgba(160,140,180,0.3)';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📿', centerX, centerY);
    }
  }

  /**
   * 启动旋转动画
   */
  startRotation(beads, bgColor, duration = 2000, callback = null) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const angle = progress * Math.PI * 2;
      
      this.render(beads, bgColor, angle);
      
      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * 停止旋转动画
   */
  stopRotation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 导出为图片
   */
  async exportImage() {
    return new Promise((resolve) => {
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          console.error('Export failed:', err);
          resolve(null);
        }
      });
    });
  }

  /**
   * 工具函数：十六进制颜色转 RGB
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 123, g: 91, b: 149 };
  }

  /**
   * 工具函数：亮化颜色
   */
  brightenColor(rgb, factor) {
    return {
      r: Math.min(255, Math.round(rgb.r * factor)),
      g: Math.min(255, Math.round(rgb.g * factor)),
      b: Math.min(255, Math.round(rgb.b * factor))
    };
  }

  /**
   * 工具函数：暗化颜色
   */
  darkenColor(rgb, factor) {
    return {
      r: Math.max(0, Math.round(rgb.r * factor)),
      g: Math.max(0, Math.round(rgb.g * factor)),
      b: Math.max(0, Math.round(rgb.b * factor))
    };
  }
}

module.exports = BraceletRenderer;