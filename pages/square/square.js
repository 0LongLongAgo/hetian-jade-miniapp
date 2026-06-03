const api = require('../../utils/api.js');

Page({
  data: { list: [] },

  onShow() {
    const that = this;
    api.getPublishedDesigns().then(function(pub) {
      const list = pub.map(function(item) {
        item.likes = item.likes || 0;
        item.comments = item.comments || [];
        return item;
      });
      that.setData({ list: list });
    });
  },

  toggleLike(e) {
    const that = this;
    const designId = e.currentTarget.dataset.id;
    const userId = api.getUserId();
    api.toggleLike(designId, userId).then(function(result) {
      const list = that.data.list.map(function(item) {
        if (item.id === designId) {
          item.likes = result.likeCount;
        }
        return item;
      });
      that.setData({ list: list });
      wx.showToast({ title: result.liked ? '已点赞' : '已取消', icon: 'none' });
    }).catch(function(err) {
      console.error('点赞失败:', err);
    });
  },

  goDetail(e) {
    const designId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/square-detail/square-detail?id=' + designId });
  }
});
