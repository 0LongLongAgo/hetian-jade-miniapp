const util = require('../../utils/data.js');
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
    beadViews: []
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
    this._updateBeadViews();
  },

  _updateBeadViews() {
    const beads = this.data.beads;
    if (beads.length === 0) {
      this.setData({ beadViews: [] });
      return;
    }

    const cx = 130, cy = 120, radius = 85;
    const braceletMM = this.data.braceletSizeNum * 10;
    let totalMM = 0;
    beads.forEach(function(b) { totalMM += parseFloat(b.size) || 8; });

    const gapMM = beads.length > 1 ? Math.max(0.5, (braceletMM - totalMM) / (beads.length - 1)) : 0;
    const totalSpanMM = totalMM + gapMM * (beads.length - 1);
    const arcStart = -Math.PI * 0.75;
    const arcEnd = Math.PI * 0.75;
    const arcSpan = arcEnd - arcStart;
    const radPerMM = arcSpan / Math.max(braceletMM, totalSpanMM);

    let angle = arcStart;
    const views = [];
    for (let i = 0; i < beads.length; i++) {
      const mm = parseFloat(beads[i].size) || 8;
      const beadRad = mm * radPerMM;
      const midAngle = angle + beadRad / 2;
      const pxR = Math.min(18, 7 + mm * 0.85);
      const x = cx + Math.cos(midAngle) * radius - pxR;
      const y = cy + Math.sin(midAngle) * radius - pxR;
      views.push({
        uid: beads[i].uid,
        color: beads[i].color,
        size: beads[i].size,
        label: beads[i].customName || beads[i].name,
        x: Math.round(x),
        y: Math.round(y),
        r: Math.round(pxR)
      });
      angle += beadRad + gapMM * radPerMM;
    }
    this.setData({ beadViews: views });
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
    this._updateBeadViews();
    wx.showToast({ title: '已添加「' + bead.customName + '」', icon: 'success' });
  },

  onNameCancel() {
    this.setData({ showNameModal: false, pendingBead: null });
  },

  _updateInfo() {
    const beads = this.data.beads;
    let len = 0, wgt = 0, price = 0;
    beads.forEach(function(b) { len += parseFloat(b.size)||0; wgt += b.weight||1; price += b.price||0; });
    this.setData({
      totalLengthNum: len / 10,
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
          that._updateBeadViews();
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
    this._updateBeadViews();
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
          that.setData({ beads: [], beadViews: [], totalLengthNum: 0, totalWeight: '0.00', totalPrice: '0.00' });
        }
      }
    });
  },

  toggleBg() {
    this.setData({ bgIndex: this.data.bgIndex + 1 });
  },

  finishDesign() {
    if (app.publishDesign('bracelet')) wx.showToast({ title: '完成！', icon: 'success' });
    else wx.showToast({ title: '请先添加珠子', icon: 'none' });
  },

  searchBeads() { wx.showToast({ title: '搜索开发中', icon: 'none' }); }
});
