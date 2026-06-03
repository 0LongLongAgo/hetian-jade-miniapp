const util = require('../../utils/data.js');
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    designCategories: util.designCategories,
    designCategory: '山水',
    designs: [],
    selectedDesign: null,
    jadeMaterial: { color: null, lengthMm: 50, widthMm: 40, heightMm: 8 },
    colorMap: app.colorMap,
    generating: false,
    progressText: ''
  },

  onShow() {
    const g = app.globalData;
    this.setData({
      designCategory: g.designCategory,
      selectedDesign: g.selectedDesign,
      jadeMaterial: { color: g.jadeMaterial.color, lengthMm: g.jadeMaterial.lengthMm, widthMm: g.jadeMaterial.widthMm, heightMm: g.jadeMaterial.heightMm },
      generating: false,
      progressText: ''
    });
    this.renderDesigns();
  },

  renderDesigns() {
    const cat = this.data.designCategory;
    this.setData({ designs: util.designData[cat] || [] });
  },

  switchCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    app.globalData.designCategory = cat;
    this.setData({ designCategory: cat });
    this.renderDesigns();
  },

  selectDesign(e) {
    const design = e.currentTarget.dataset.design;
    const cat = this.data.designCategory;
    wx.navigateTo({
      url: '/pages/design-detail/design-detail?id=' + design.id + '&category=' + cat
    });
  },

  startGenerate() {
    const that = this;
    const g = app.globalData;
    if (!g.selectedDesign || !g.jadeMaterial.color) {
      return wx.showToast({ title: '请先选择料子和设计图', icon: 'none' });
    }

    that.setData({ generating: true, progressText: '0% 正在连接 AI 引擎...' });

    api.generateJadeImage({
      materialId: g.jadeMaterial.materialId || '',
      designId: g.selectedDesign.id,
      materialColor: g.jadeMaterial.color,
      lengthMm: g.jadeMaterial.lengthMm || 50,
      widthMm: g.jadeMaterial.widthMm || 40,
      heightMm: g.jadeMaterial.heightMm || 8
    }, function(progress, text) {
      that.setData({ progressText: text || (progress + '%') });
      wx.showLoading({ title: text || (progress + '%'), mask: true });
    }).then(function(result) {
      wx.hideLoading();
      that.setData({ generating: false, progressText: '' });
      if (result.imageUrl) {
        app.globalData.jadeResultImageUrl = result.imageUrl;
      }
      wx.navigateTo({ url: '/pages/jade-result/jade-result' });
    }).catch(function(err) {
      wx.hideLoading();
      that.setData({ generating: false, progressText: '' });
      console.error('AI 生成失败:', err);
      wx.showToast({ title: '生成失败，请重试', icon: 'none' });
    });
  }
});
