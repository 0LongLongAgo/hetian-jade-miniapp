const api = require('../../utils/api.js');
const util = require('../../utils/data.js');
const app = getApp();

Page({
  data: {
    activeTab: 'beads',
    adminTabs: [
      { key: 'beads', label: '珠子', icon: '💎' },
      { key: 'materials', label: '料子', icon: '🪨' },
      { key: 'designs', label: '设计图', icon: '🖼️' },
      { key: 'banners', label: 'Banner', icon: '📷' },
      { key: 'pricing', label: '价格', icon: '💰' },
      { key: '3dmodels', label: '3D', icon: '📦' }
    ],
    // List views
    beadList: [],
    materialList: [],
    designList: [],
    bannerList: [],
    model3dList: [],
    // Form states
    showEditor: false,
    editorType: '',
    editorData: null,
    isNewItem: false,
    // Upload
    uploading: false,
    uploadProgress: 0,
    // Loading
    loading: false
  },

  onShow() {
    this.loadCurrentTab();
  },

  loadCurrentTab() {
    const tab = this.data.activeTab;
    if (tab === 'beads') this._loadBeads();
    else if (tab === 'materials') this._loadMaterials();
    else if (tab === 'designs') this._loadDesigns();
    else if (tab === 'banners') this._loadBanners();
    else if (tab === '3dmodels') this._load3dModels();
  },

  _loadBeads() {
    const that = this;
    this.setData({ loading: true });
    api.getBeadCatalog().then(function(catalog) {
      const list = [];
      Object.keys(catalog).forEach(function(cat) {
        Object.keys(catalog[cat]).forEach(function(cg) {
          list.push.apply(list, catalog[cat][cg]);
        });
      });
      that.setData({ beadList: list, loading: false });
    }).catch(function() {
      that.setData({ loading: false });
    });
  },

  _loadMaterials() {
    const that = this;
    this.setData({ loading: true });
    api.getPlateMaterials().then(function(materials) {
      that.setData({ materialList: materials, loading: false });
    }).catch(function() {
      that.setData({ loading: false });
    });
  },

  _loadDesigns() {
    const that = this;
    this.setData({ loading: true });
    api.getDesignCatalog().then(function(catalog) {
      const list = [];
      Object.keys(catalog).forEach(function(cat) {
        catalog[cat].forEach(function(item) {
          list.push(Object.assign({}, item, { categoryName: cat }));
        });
      });
      that.setData({ designList: list, loading: false });
    }).catch(function() {
      that.setData({ loading: false });
    });
  },

  _loadBanners() {
    const banners = wx.getStorageSync('homepageBanners') || [];
    this.setData({ bannerList: banners, loading: false });
  },

  _load3dModels() {
    const models = wx.getStorageSync('model3dList') || [];
    this.setData({ model3dList: models, loading: false });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      showEditor: false,
      editorData: null
    });
    this.loadCurrentTab();
  },

  // ---- CRUD operations ----

  createItem() {
    const tab = this.data.activeTab;
    const defaultData = this._getDefaultData(tab);
    this.setData({
      showEditor: true,
      editorType: tab,
      editorData: defaultData,
      isNewItem: true
    });
  },

  editItem(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showEditor: true,
      editorType: this.data.activeTab,
      editorData: JSON.parse(JSON.stringify(item)),
      isNewItem: false
    });
  },

  deleteItem(e) {
    const that = this;
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确认删除「' + (item.name || item.id) + '」？',
      success(res) {
        if (res.confirm) {
          that._doDelete(item);
        }
      }
    });
  },

  _doDelete(item) {
    const tab = this.data.activeTab;
    if (tab === 'banners') {
      let list = this.data.bannerList.filter(function(b) { return b.id !== item.id; });
      wx.setStorageSync('homepageBanners', list);
      this.setData({ bannerList: list });
    } else if (tab === '3dmodels') {
      let list = this.data.model3dList.filter(function(m) { return m.id !== item.id; });
      wx.setStorageSync('model3dList', list);
      this.setData({ model3dList: list });
    }
    wx.showToast({ title: '已删除', icon: 'success' });
  },

  _getDefaultData(tab) {
    const now = Date.now();
    if (tab === 'beads') return { id: 'b_' + now, name: '', size: '8mm', price: 0, color: '#7B5B95', colorGroup: '烟紫', category: '主珠', img: '', meaning: '', material: '', origin: '', stock: 0, weight: 1 };
    if (tab === 'materials') return { id: 'm_' + now, name: '', colorGroup: '烟紫', colorHex: '#7B5B95', imageUrl: '', lengthMm: 50, widthMm: 40, heightMm: 8, shape: '方形', material: '', origin: '', price: 0, stock: 0, description: '' };
    if (tab === 'designs') return { id: 'd_' + now, name: '', categoryName: '山水', img: '', meaning: '', description: '', suitableAudience: '' };
    if (tab === 'banners') return { id: 'bn_' + now, image: '', sortOrder: 0, isActive: true, link: '' };
    if (tab === '3dmodels') return { id: '3d_' + now, name: '', beadId: '', modelUrl: '', previewUrl: '' };
    if (tab === 'pricing') return { beadBasePrice: 0, materialBasePrice: 0, designFee: 0, processingFee: 0 };
    return {};
  },

  saveItem() {
    const tab = this.data.activeTab;
    const data = this.data.editorData;
    if (!data || !data.name) {
      return wx.showToast({ title: '请填写名称', icon: 'none' });
    }

    if (tab === 'banners') {
      let list = this.data.bannerList;
      if (this.data.isNewItem) {
        list.unshift(data);
      } else {
        list = list.map(function(b) { return b.id === data.id ? data : b; });
      }
      wx.setStorageSync('homepageBanners', list);
      this.setData({ bannerList: list, showEditor: false });
    } else if (tab === '3dmodels') {
      let list = this.data.model3dList;
      if (this.data.isNewItem) {
        list.unshift(data);
      } else {
        list = list.map(function(m) { return m.id === data.id ? data : m; });
      }
      wx.setStorageSync('model3dList', list);
      this.setData({ model3dList: list, showEditor: false });
    } else {
      wx.showToast({ title: '当前仅支持Banner和3D模型的本地管理\n其他项目需后端API', icon: 'none', duration: 2500 });
      return;
    }
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  cancelEditor() {
    this.setData({ showEditor: false, editorData: null });
  },

  onEditorFieldChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const editorData = this.data.editorData;
    editorData[field] = value;
    this.setData({ editorData: editorData });
  },

  // ---- Upload ----

  uploadImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempPath = res.tempFilePaths[0];
        that.setData({ uploading: true, uploadProgress: 0 });
        // Simulate upload (backend needed)
        const editorData = that.data.editorData;
        if (editorData) {
          const imgField = that.data.activeTab === 'banners' ? 'image'
            : that.data.activeTab === '3dmodels' ? 'previewUrl'
            : 'img';
          editorData[imgField] = tempPath;
          that.setData({ editorData: editorData });
        }
        that.setData({ uploading: false });
        wx.showToast({ title: '图片已选择（需后端上传）', icon: 'none' });
      }
    });
  },

  uploadModel() {
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const file = res.tempFiles[0];
        const editorData = that.data.editorData;
        if (editorData) {
          editorData.modelUrl = file.path;
          editorData.modelFileName = file.name;
          that.setData({ editorData: editorData });
        }
        wx.showToast({ title: '模型文件已选择（需后端上传）', icon: 'none' });
      }
    });
  },

  onEditorSwitchChange(e) {
    const field = e.currentTarget.dataset.field;
    const editorData = this.data.editorData;
    editorData[field] = e.detail.value;
    this.setData({ editorData: editorData });
  },

  noop() {}
});
