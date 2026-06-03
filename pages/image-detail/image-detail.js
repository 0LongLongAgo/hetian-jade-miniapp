const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    type: '',
    itemId: '',
    item: null,
    meaning: '',
    images: [],
    loading: true,
    error: false,
    errorMsg: ''
  },

  onLoad(options) {
    const type = options.type || 'bead';
    const id = options.id || '';
    this.setData({ type: type, itemId: id });
    this.loadItem();
  },

  loadItem() {
    const that = this;
    this.setData({ loading: true, error: false });

    const type = this.data.type;
    const id = this.data.itemId;

    const loadByType = function() {
      if (type === 'bead') {
        return api.getBeadById(id).then(function(bead) {
          if (!bead) throw new Error('珠子不存在');
          return {
            name: bead.name,
            image: bead.img || '',
            meaning: bead.meaning || '暂无寓意说明',
            color: bead.colorGroup || bead.color,
            colorHex: (app && app.colorMap[bead.colorGroup]) || bead.color || '#7B5B95',
            material: bead.material || '和田玉',
            size: bead.size || '-',
            origin: bead.origin || '-',
            price: bead.price ? '¥' + bead.price.toFixed(2) : '-',
            category: bead.category || '主珠',
            description: bead.description || ''
          };
        });
      } else if (type === 'designImage') {
        return api.getDesignCatalog().then(function(catalog) {
          const cats = Object.keys(catalog);
          for (let i = 0; i < cats.length; i++) {
            const items = catalog[cats[i]];
            for (let j = 0; j < items.length; j++) {
              if (items[j].id === id) {
                return {
                  name: items[j].name,
                  image: items[j].img || '',
                  meaning: items[j].meaning || '暂无寓意说明',
                  colorHex: '#7B5B95',
                  category: cats[i],
                  description: items[j].description || '',
                  suitableAudience: items[j].suitableAudience || ''
                };
              }
            }
          }
          throw new Error('设计图不存在');
        });
      } else if (type === 'material') {
        return api.getPlateMaterials().then(function(materials) {
          for (let i = 0; i < materials.length; i++) {
            if (materials[i].id === id) {
              const m = materials[i];
              return {
                name: m.name,
                image: m.imageUrl || '',
                meaning: '',
                color: m.colorGroup,
                colorHex: m.colorHex || '#7B5B95',
                material: m.material || '和田玉',
                size: m.lengthMm + '×' + m.widthMm + '×' + m.heightMm + 'mm',
                shape: m.shape || '方形',
                origin: m.origin || '-',
                price: m.price ? '¥' + m.price.toFixed(2) : '-',
                description: m.description || '',
                stock: m.stock || 0
              };
            }
          }
          throw new Error('料子不存在');
        });
      }
      return Promise.reject(new Error('未知类型'));
    };

    loadByType().then(function(item) {
      that.setData({
        item: item,
        meaning: item.meaning || '',
        images: item.image ? [item.image] : [],
        loading: false,
        error: false
      });
    }).catch(function(err) {
      console.error('加载图片详情失败:', err);
      that.setData({
        loading: false,
        error: true,
        errorMsg: err.message || '加载失败'
      });
    });
  },

  onImageTap() {
    const images = this.data.images;
    if (images.length > 0) {
      wx.previewImage({
        current: images[0],
        urls: images
      });
    }
  },

  onStartDesign() {
    const type = this.data.type;
    const item = this.data.item;
    if (!item) return;

    if (type === 'bead') {
      app.globalData.beadCategory = item.category || '主珠';
      wx.navigateTo({ url: '/pages/bracelet/bracelet' });
    } else if (type === 'designImage') {
      if (item.id) {
        app.globalData.selectedDesign = {
          id: this.data.itemId,
          name: item.name,
          img: item.image,
          meaning: item.meaning,
          category: item.category
        };
        app.globalData.designCategory = item.category;
      }
      wx.navigateTo({ url: '/pages/design-gallery/design-gallery' });
    } else if (type === 'material') {
      if (item.color) {
        app.globalData.jadeMaterial.color = item.color;
      }
      wx.navigateTo({ url: '/pages/jade-material/jade-material' });
    }
  },

  onRetry() {
    this.loadItem();
  },

  onBack() {
    wx.navigateBack();
  }
});
