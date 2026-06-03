const app = getApp();

Page({
  data: {
    beadCount: 0,
    braceletSize: '16',
    totalPrice: '0.00',
    sceneReady: false
  },

  onLoad() {
    const g = app.globalData;
    const beads = g.beads || [];
    const total = beads.reduce(function(s, b) { return s + b.price; }, 0).toFixed(2);
    this.setData({
      beadCount: beads.length,
      braceletSize: g.braceletSize,
      totalPrice: total
    });

    const that = this;
    setTimeout(function() {
      that._initGLScene();
    }, 500);
  },

  _initGLScene() {
    const that = this;
    const query = wx.createSelectorQuery();
    query.select('#glCanvas')
      .node()
      .exec(function(res) {
        if (!res || !res[0]) return;
        const canvas = res[0].node;
        const gl = canvas.getContext('webgl');
        if (!gl) {
          console.log('WebGL 不可用');
          that.setData({ sceneReady: false });
          return;
        }
        that._gl = gl;
        that._canvas = canvas;
        that._render3DScene();
        that.setData({ sceneReady: true });
      });
  },

  _render3DScene() {
    const gl = this._gl;
    if (!gl) return;
    gl.clearColor(0.1, 0.08, 0.18, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    console.log('3D WebGL 场景已初始化 — 珠子模型加载待后续实现');
  },

  onTouchStart(e) {
    this._touchX = e.touches[0].clientX;
    this._touchY = e.touches[0].clientY;
  },

  onTouchMove(e) {
    if (!this._gl) return;
    e.touches[0].clientX - this._touchX;
    e.touches[0].clientY - this._touchY;
    this._touchX = e.touches[0].clientX;
    this._touchY = e.touches[0].clientY;
  },

  onTouchEnd() {},

  goBack() {
    wx.navigateBack();
  }
});
