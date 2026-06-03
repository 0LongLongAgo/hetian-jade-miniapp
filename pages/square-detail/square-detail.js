const api = require('../../utils/api.js');

Page({
  data: {
    design: null,
    designId: '',
    comments: [],
    commentText: '',
    showCommentInput: false
  },

  onLoad(options) {
    const designId = options.id || '';
    this.setData({ designId: designId });
    this.loadDesign();
  },

  onShow() {
    this.loadDesign();
  },

  loadDesign() {
    const that = this;
    api.getDesignDetail(this.data.designId).then(function(design) {
      if (!design) {
        wx.showToast({ title: '设计不存在', icon: 'none' });
        return;
      }
      design.likes = design.likes || 0;
      design.comments = design.comments || [];
      that.setData({
        design: design,
        comments: design.comments || []
      });
    }).catch(function(err) {
      console.error('加载设计详情失败:', err);
    });
  },

  toggleLike() {
    const that = this;
    const design = this.data.design;
    if (!design) return;
    const userId = api.getUserId();
    api.toggleLike(design.id, userId).then(function(result) {
      that.setData({ 'design.likes': result.likeCount });
      wx.showToast({ title: result.liked ? '已点赞' : '已取消', icon: 'none' });
    }).catch(function(err) {
      console.error('点赞失败:', err);
    });
  },

  showComment() {
    this.setData({ showCommentInput: true, commentText: '' });
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  submitComment() {
    const that = this;
    const text = this.data.commentText.trim();
    if (!text) return wx.showToast({ title: '请输入评论内容', icon: 'none' });
    if (text.length > 500) return wx.showToast({ title: '评论不能超过500字', icon: 'none' });

    const design = this.data.design;
    if (!design) return;
    const userId = api.getUserId();
    api.postComment(design.id, userId, '玉友', '', text).then(function(comment) {
      const comments = that.data.comments.concat([comment]);
      that.setData({
        'design.comments': comments,
        comments: comments,
        showCommentInput: false,
        commentText: ''
      });
      wx.showToast({ title: '评论成功', icon: 'success' });
    }).catch(function(err) {
      console.error('评论失败:', err);
      wx.showToast({ title: '评论失败，请重试', icon: 'none' });
    });
  },

  cancelComment() {
    this.setData({ showCommentInput: false, commentText: '' });
  },

  goBack() {
    wx.navigateBack();
  },

  noop() {}
});
