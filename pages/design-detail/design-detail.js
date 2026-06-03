const util = require('../../utils/data.js');
const app = getApp();

Page({
  data: {
    design: null,
    category: '',
    categoryEmoji: { '山水': '⛰️', '龙凤': '🐉', '花鸟': '🌸' }
  },

  onLoad(options) {
    const designId = options.id;
    const category = options.category || '山水';
    const designs = util.designData[category] || [];
    let found = null;
    for (let i = 0; i < designs.length; i++) {
      if (designs[i].id === designId) {
        found = designs[i];
        break;
      }
    }
    this.setData({
      design: found,
      category: category
    });
  },

  onSelectDesign() {
    const design = this.data.design;
    if (!design) return;
    app.globalData.selectedDesign = design;
    app.globalData.jadeCustomName = design.name;
    app.globalData.designCategory = this.data.category;
    wx.navigateBack();
  },

  onBack() {
    wx.navigateBack();
  }
});
