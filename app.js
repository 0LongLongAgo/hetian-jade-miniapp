const api = require('./utils/api.js');

App({
  globalData: {
    // 手链
    braceletSize: '16',
    beads: [],
    beadCategory: '烟紫',  // 烟紫主题优先
    // 珠子后端数据缓存
    beadImageMap: {},
    beadMeaningMap: {},
    beadSizesMap: {},
    // 玉牌
    jadeMaterial: { color: null, lengthMm: 50, widthMm: 40, heightMm: 8, shape: '方形' },
    selectedDesign: null,
    designCategory: '山水',
    jadeCustomName: '',
    jadeResultImageUrl: '',
    // 首页配置（后端管理）
    adminSettings: {
      homeBannerImageUrl: '',
      homeBannerLink: '',
      themeColor: '烟紫',
      logoIconType: 'crystal'
    },
    // 设计广场
    likesMap: {},
    commentsMap: {}
  },

  colorMap: {
    '羊脂白': '#F0ECE8', '烟紫': '#7B5B95', '藕粉': '#E8C4C4',
    '湖水绿': '#6B8F71', '糖玉': '#D4B896', '青花': '#7B8A9A',
    '墨玉': '#2D2D2D', '碧玉': '#4A7A3A', '黄口': '#D4A04A', '且末蓝': '#6B8FA3'
  },

  jadeThicknessMap: {
    '40x30': '约6mm', '50x40': '约8mm',
    '60x40': '约8mm', '70x50': '约10mm'
  },

  saveDesign(type) {
    const s = this._snapshot(type);
    if (!s) return false;
    api.saveDesignLocal(s);
    return true;
  },

  publishDesign(type) {
    const s = this._snapshot(type);
    if (!s) return false;
    api.publishDesign(s);
    api.saveDesignLocal(s);
    return true;
  },

  _snapshot(type) {
    const g = this.globalData, now = Date.now();
    if (type === 'bracelet') {
      if (g.beads.length === 0) return null;
      return {
        type: 'bracelet', id: 'br_' + now,
        name: g.beads.map(b => b.customName).join('·') || '手链设计',
        size: g.braceletSize,
        beads: g.beads.map((b, idx) => ({
          uid: 'b_' + idx + '_' + now,
          name: b.name, customName: b.customName, size: b.size,
          price: b.price, color: b.color,
          imageUrl: b.img || '', meaning: b.meaning || ''
        })),
        totalPrice: g.beads.reduce((s, b) => s + b.price, 0).toFixed(2),
        beadCount: g.beads.length,
        createdAt: new Date(now).toISOString(),
        previewColor: g.beads[0].color,
        likes: 0,
        comments: []
      };
    } else if (type === 'jade') {
      if (!g.selectedDesign || !g.jadeMaterial.color) return null;
      const l = g.jadeMaterial.lengthMm || 50;
      const w = g.jadeMaterial.widthMm || 40;
      const h = g.jadeMaterial.heightMm || 8;
      return {
        type: 'jade', id: 'jd_' + now,
        name: g.jadeCustomName || g.selectedDesign.name || '玉牌设计',
        materialColor: g.jadeMaterial.color,
        materialSize: l + 'x' + w + 'x' + h,
        designName: g.selectedDesign.name,
        designId: g.selectedDesign.id,
        designImg: g.selectedDesign.img,
        designMeaning: g.selectedDesign.meaning,
        designDescription: g.selectedDesign.description || '',
        designSuitableAudience: g.selectedDesign.suitableAudience || '',
        resultImageUrl: g.jadeResultImageUrl || '',
        lengthMm: l,
        widthMm: w,
        heightMm: h,
        shape: g.jadeMaterial.shape || '方形',
        createdAt: new Date(now).toISOString(),
        previewColor: this.colorMap[g.jadeMaterial.color] || '#7B5B95',
        thickness: '约' + h + 'mm',
        likes: 0,
        comments: []
      };
    }
    return null;
  }
});
