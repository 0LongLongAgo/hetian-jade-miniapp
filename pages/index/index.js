Page({
  goBracelet() {
    wx.navigateTo({ url: '/pages/bracelet/bracelet' });
  },
  goJade() {
    wx.navigateTo({ url: '/pages/jade-material/jade-material' });
  },
  goBrowse() {
    wx.switchTab({ url: '/pages/browse/browse' });
  },
  goSquare() {
    wx.switchTab({ url: '/pages/square/square' });
  },
  tapService() {
    wx.showToast({ title: '客服功能开发中', icon: 'none' });
  }
});
