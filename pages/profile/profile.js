Page({
  data: { designs: [] },

  onShow() {
    const saved = wx.getStorageSync('myDesigns') || [];
    const list = saved.map(function(d) {
      return {
        id: d.id, type: d.type, name: d.name,
        previewColor: d.previewColor,
        beadCount: d.beadCount, totalPrice: d.totalPrice,
        materialColor: d.materialColor, designName: d.designName,
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('zh-CN') : ''
      };
    });
    this.setData({ designs: list });
  },

  deleteDesign(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success(res) {
        if (res.confirm) {
          let saved = wx.getStorageSync('myDesigns') || [];
          saved = saved.filter(function(d) { return d.id !== id; });
          wx.setStorageSync('myDesigns', saved);
          let pub = wx.getStorageSync('publishedDesigns') || [];
          pub = pub.filter(function(d) { return d.id !== id; });
          wx.setStorageSync('publishedDesigns', pub);
          that.onShow();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
