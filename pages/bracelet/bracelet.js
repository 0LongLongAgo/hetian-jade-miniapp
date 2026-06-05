const util = require('../../utils/data.js');
const BraceletRenderer = require('./bracelet-canvas.js');
const MockBeadImageGenerator = require('./mock-bead-image.js');
const app = getApp();

Page({
  data: {
    beadCategories: util.beadCategories,
    colorGroups: util.colorGroups,
    beadCategory: '主珠',
    currentColorGroup: '烟紫',
    filteredMaterials: [],
    beads: [],
    braceletSize: '16',
    braceletSizeNum: 16,
    totalLengthNum: 0,
    totalWeight: '0.00',
    totalPrice: '0.00',
    showNameModal: false,
    pendingBead: null,
    pendingBeadInfo: '',
    activeTool: '',
    bgIndex: 0,
    canvasReady: false,
    isRotating: false,
    touchStartX: 0,
    touchStartTime: 0,
    selectedBeadPreview: null,
    showBeadPreview: false
  },

  onShow() {
    const g = app.globalData;
    const sizeNum = parseFloat(g.braceletSize) || 16;
    this.setData({
      braceletSize: g.braceletSize,
      braceletSizeNum: sizeNum,
      beads: g.beads || [],
      beadCategory: g.beadCategory || '主珠'
    });
    this._filterMaterials();
    this._updateInfo();
    this._initCanvas();
  },

  onReady() {
    this._initCanvas();
    this.beadImageGenerator = new MockBeadImageGenerator();
  },

  onUnload() {
    if (this.renderer) {
      this.renderer.stopRotation();
    }
  },

  /**
   * 初始化 Canvas 并绘制手串
   */
  async _initCanvas() {
    if (!this.renderer) {
      this.renderer = new BraceletRenderer('braceletCanvas');
    }

    const success = await this.renderer.init(300, 300);
    if (success) {
      this.setData({ canvasReady: true });
      this._renderBracelet();
    }
  },

  /**
   * 渲染手串到 Canvas
   */
  _renderBracelet() {
    if (!this.renderer || !this.data.canvasReady) return;
    
    const bgColor = this._getBgColor();
    this.renderer.render(this.data.beads, bgColor, 0);
  },

  /**
   * 获取背景颜色
   */
  _getBgColor() {
    const bgColors = ['#F6F2F9', '#FFFFFF', '#F5F0EB'];
    return bgColors[this.data.bgIndex % 3];
  },

  /**
   * 触摸开始 - 记录位置用于旋转检测
   */
  onCanvasTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX,
      touchStartTime: Date.now()
    });
  },

  /**
   * 触摸结束 - 执行旋转动画
   */
  onCanvasTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - this.data.touchStartX;
    const deltaTime = Date.now() - this.data.touchStartTime;
    
    // 快速滑动才触发旋转
    if (Math.abs(deltaX) > 50 && deltaTime < 500) {
      this._startRotation();
    }
  },

  /**
   * 启动旋转动画
   */
  _startRotation() {
    if (this.data.isRotating || !this.renderer) return;
    
    this.setData({ isRotating: true });
    const bgColor = this._getBgColor();
    
    this.renderer.startRotation(this.data.beads, bgColor, 2000, () => {
      this.setData({ isRotating: false });
      this._renderBracelet();
    });
  },

  /**
   * 点击旋转按钮
   */
  onRotateClick() {
    this._startRotation();
  },

  /**
   * 导出手串为图片
   */
  async onExport() {
    if (!this.renderer) {
      wx.showToast({ title: '请先添加珠子', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在生成...' });
    
    try {
      const filePath = await this.renderer.exportImage();
      wx.hideLoading();
      
      if (filePath) {
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: () => {
            wx.showToast({ title: '已保存到相册', icon: 'success' });
          },
          fail: () => {
            wx.showModal({
              title: '提示',
              content: '需要相册权限，请在设置中开启',
              showCancel: false
            });
          }
        });
      } else {
        wx.showToast({ title: '导出失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('Export error:', err);
      wx.showToast({ title: '导出失败', icon: 'none' });
    }
  },

  _filterMaterials() {
    const cat = this.data.beadCategory;
    const cg = this.data.currentColorGroup;
    const catData = util.beadData[cat] || {};
    let items = catData[cg] || [];
    if (items.length === 0) {
      const keys = Object.keys(catData);
      if (keys.length > 0) items = catData[keys[0]] || [];
    }
    const list = items.map(function(item) {
      return {
        id: item.id, name: item.name, size: item.size,
        price: item.price, priceText: item.price.toFixed(2),
        weight: item.weight, color: item.color,
        colorGroup: item.colorGroup, category: item.category,
        img: item.img || '', meaning: item.meaning || ''
      };
    });
    this.setData({ filteredMaterials: list });
  },

  switchBeadCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    app.globalData.beadCategory = cat;
    this.setData({ beadCategory: cat });
    this._filterMaterials();
  },

  switchColorGroup(e) {
    this.setData({ currentColorGroup: e.currentTarget.dataset.key });
    this._filterMaterials();
  },

  /**
   * 点击珠子一简介 - 暗示预览
   */
  onBeadQuickPreview(e) {
    const bead = e.currentTarget.dataset.bead;
    this.setData({
      selectedBeadPreview: bead,
      showBeadPreview: true
    });
    
    // 等待DOM渲柒完成后绘制珠子图片
    setTimeout(() => {
      if (this.beadImageGenerator) {
        const canvasId = `previewBeadCanvas_${bead.id}`;
        this.beadImageGenerator.generateBeadImage(canvasId, bead.color, 120);
      }
    }, 100);
  },

  /**
   * 关闭珠子预览
   */
  closeBeadPreview() {
    this.setData({
      showBeadPreview: false,
      selectedBeadPreview: null
    });
  },

  onBeadClick(e) {
    const bead = e.currentTarget.dataset.bead;
    this.setData({
      showNameModal: true, pendingBead: bead,
      pendingBeadInfo: bead.name + ' · ' + bead.size + ' · ¥' + bead.priceText
    });
  },

  onNameConfirm(e) {
    const b = this.data.pendingBead;
    if (!b) return;
    const bead = {
      id: b.id, name: b.name, size: b.size, price: b.price,
      weight: b.weight || 1, color: b.color,
      img: b.img || '', meaning: b.meaning || '',
      uid: Date.now() + Math.random(),
      customName: e.detail.name
    };
    const beads = this.data.beads.concat([bead]);
    app.globalData.beads = beads;
    this.setData({ beads: beads, showNameModal: false, pendingBead: null });
    this._updateInfo();
    this._renderBracelet();
    wx.showToast({ title: '已添加「' + bead.customName + '」', icon: 'success' });
  },

  onNameCancel() {
    this.setData({ showNameModal: false, pendingBead: null });
  },

  _updateInfo() {
    const beads = this.data.beads;
    let len = 0, wgt = 0, price = 0;
    beads.forEach(function(b) { 
      len += parseFloat(b.size) || 0; 
      wgt += b.weight || 1; 
      price += b.price || 0; 
    });
    this.setData({
      totalLengthNum: (len / 10).toFixed(1),
      totalWeight: wgt.toFixed(2),
      totalPrice: price.toFixed(2)
    });
  },

  tapTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ activeTool: this.data.activeTool === tool ? '' : tool });
    const that = this;
    if (tool === 'size') {
      wx.showActionSheet({
        itemList: ['13cm','14cm','15cm','16cm','17cm','18cm','19cm','20cm','21cm'],
        success(res) {
          const s = (res.tapIndex + 13).toString();
          app.globalData.braceletSize = s;
          that.setData({ braceletSize: s, braceletSizeNum: parseInt(s) });
          that._renderBracelet();
        }
      });
    }
  },

  undoBead() {
    if (this.data.beads.length === 0) return;
    const beads = this.data.beads.slice(0, -1);
    app.globalData.beads = beads;
    this.setData({ beads: beads });
    this._updateInfo();
    this._renderBracelet();
  },

  confirmDesign() {
    if (app.saveDesign('bracelet')) wx.showToast({ title: '已保存', icon: 'success' });
    else wx.showToast({ title: '请先添加珠子', icon: 'none' });
  },

  clearBeads() {
    const that = this;
    wx.showModal({
      title: '确认清空', content: '所有珠子将被清除',
      success(r) {
        if (r.confirm) {
          app.globalData.beads = [];
          that.setData({ beads: [], totalLengthNum: 0, totalWeight: '0.00', totalPrice: '0.00' });
          that._renderBracelet();
        }
      }
    });
  },

  toggleBg() {
    this.setData({ bgIndex: this.data.bgIndex + 1 });
    this._renderBracelet();
  },

  finishDesign() {
    if (app.publishDesign('bracelet')) wx.showToast({ title: '完成！', icon: 'success' });
    else wx.showToast({ title: '请先添加珠子', icon: 'none' });
  },

  searchBeads() { 
    wx.showToast({ title: '搜索开发中', icon: 'none' }); 
  }
});
