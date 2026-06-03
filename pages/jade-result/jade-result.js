const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    jadeMaterial: { color: null, lengthMm: 50, widthMm: 40, heightMm: 8, shape: '方形' },
    selectedDesign: null,
    jadeCustomName: '',
    jadeResultImageUrl: '',
    bgColor: '#F6F2F9',
    thickness: '约8mm',
    showModal: false,
    tempName: ''
  },

  onShow() {
    const g = app.globalData;
    const bgColor = app.colorMap[g.jadeMaterial.color] || '#F6F2F9';
    const h = g.jadeMaterial.heightMm || 8;
    const thickness = '约' + h + 'mm';
    this.setData({
      jadeMaterial: { color: g.jadeMaterial.color, lengthMm: g.jadeMaterial.lengthMm || 50, widthMm: g.jadeMaterial.widthMm || 40, heightMm: h, shape: g.jadeMaterial.shape || '方形' },
      selectedDesign: g.selectedDesign,
      jadeCustomName: g.jadeCustomName,
      jadeResultImageUrl: g.jadeResultImageUrl || '',
      bgColor: bgColor,
      thickness: thickness
    });
  },

  renameJade() {
    this.setData({
      showModal: true,
      tempName: this.data.jadeCustomName || (this.data.selectedDesign && this.data.selectedDesign.name) || ''
    });
  },

  onInput(e) {
    this.setData({ tempName: e.detail.value });
  },

  confirmRename() {
    const name = this.data.tempName.trim();
    if (!name) return wx.showToast({ title: '请输入名称', icon: 'none' });
    app.globalData.jadeCustomName = name;
    this.setData({ jadeCustomName: name, showModal: false });
    wx.showToast({ title: '已重命名', icon: 'success' });
  },

  cancelRename() {
    this.setData({ showModal: false });
  },

  doSave() {
    if (app.saveDesign('jade')) {
      wx.showToast({ title: '已保存到我的', icon: 'success' });
    } else {
      wx.showToast({ title: '请先生成效果图', icon: 'none' });
    }
  },

  doPublish() {
    const that = this;
    const snapshot = app._snapshot('jade');
    if (!snapshot) {
      return wx.showToast({ title: '请先生成效果图', icon: 'none' });
    }
    // 使用 api.publishDesign 写入 publishedDesigns，再本地保存到 myDesigns
    api.publishDesign(snapshot).then(function() {
      api.saveDesignLocal(snapshot);
      wx.showToast({ title: '已发表到设计广场', icon: 'success' });
    }).catch(function(err) {
      console.error('发表失败:', err);
      // 回退：全部走本地存储
      api.publishDesign(snapshot);
      api.saveDesignLocal(snapshot);
      wx.showToast({ title: '已发表到设计广场', icon: 'success' });
    });
  }
});
