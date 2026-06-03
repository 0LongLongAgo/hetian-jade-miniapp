const api = require('../../utils/api.js');

Page({
  data: {
    allBeads: [],
    featuredBeads: [],
    categoryIndex: 0,
    categories: ['推荐', '羊脂白', '烟紫', '藕粉', '湖水绿', '糖玉', '青花', '墨玉', '碧玉', '黄口', '且末蓝']
  },

  onShow() {
    this.loadFeatured();
  },

  loadFeatured() {
    const that = this;
    api.getBeadCatalog().then(function(beadData) {
      const allBeads = [];
      Object.keys(beadData).forEach(function(cat) {
        const catData = beadData[cat];
        Object.keys(catData).forEach(function(cg) {
          allBeads.push.apply(allBeads, catData[cg].map(function(item) {
            return {
              id: item.id,
              name: item.name,
              size: item.size,
              price: item.price,
              priceText: item.price.toFixed(2),
              color: item.color,
              colorGroup: item.colorGroup,
              category: item.category,
              img: item.img || '',
              meaning: item.meaning || '',
              material: item.material || '',
              origin: item.origin || ''
            };
          }));
        });
      });
      that.setData({ allBeads: allBeads });
      that._applyFilter();
    });
  },

  switchCategory(e) {
    const idx = parseInt(e.currentTarget.dataset.idx, 10);
    this.setData({ categoryIndex: idx });
    this._applyFilter();
  },

  _applyFilter() {
    const idx = this.data.categoryIndex;
    const all = this.data.allBeads;
    if (idx === 0) return this.setData({ featuredBeads: all.slice(0, 20) });
    const group = this.data.categories[idx];
    const filtered = all.filter(function(b) { return b.colorGroup === group; });
    this.setData({ featuredBeads: filtered.length > 0 ? filtered.slice(0, 20) : all.slice(0, 6) });
  },

  goBracelet() {
    wx.navigateTo({ url: '/pages/bracelet/bracelet' });
  }
});
