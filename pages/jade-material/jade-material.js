const util = require('../../utils/data.js');
const app = getApp();

Page({
  data: {
    jadeColors: util.jadeColors,
    jadeMaterial: { color: null, lengthMm: 50, widthMm: 40, heightMm: 8 },
    colorMap: app.colorMap,
    activeTab: 'color',
    plateW: 100, plateH: 80,
    plateL: 50, plateWmm: 40, plateHmm: 8
  },

  onShow() {
    const g = app.globalData;
    g.selectedDesign = null;
    g.jadeCustomName = '';
    if (!g.jadeMaterial.color) g.jadeMaterial.color = util.jadeColors[0];
    if (!g.jadeMaterial.lengthMm) g.jadeMaterial.lengthMm = 50;
    if (!g.jadeMaterial.widthMm) g.jadeMaterial.widthMm = 40;
    if (!g.jadeMaterial.heightMm) g.jadeMaterial.heightMm = 8;
    this.setData({
      jadeMaterial: {
        color: g.jadeMaterial.color,
        lengthMm: g.jadeMaterial.lengthMm,
        widthMm: g.jadeMaterial.widthMm,
        heightMm: g.jadeMaterial.heightMm
      }
    });
    this._updatePlateSize();
  },

  _updatePlateSize() {
    const l = this.data.jadeMaterial.lengthMm || 50;
    const w = this.data.jadeMaterial.widthMm || 40;
    const h = this.data.jadeMaterial.heightMm || 8;
    this.setData({
      plateW: Math.round(l * 1.8),
      plateH: Math.round(w * 1.8),
      plateL: l,
      plateWmm: w,
      plateHmm: h
    });
  },

  tapTool() {
    this.setData({ activeTab: 'color' });
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    app.globalData.jadeMaterial.color = color;
    this.setData({ 'jadeMaterial.color': color });
  },

  confirmMaterial() {
    if (!app.globalData.jadeMaterial.color) {
      return wx.showToast({ title: '请选择料子底色', icon: 'none' });
    }
    wx.navigateTo({ url: '/pages/design-gallery/design-gallery' });
  }
});
