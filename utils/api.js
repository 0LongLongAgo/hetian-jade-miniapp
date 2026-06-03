// ================================================================
// 独作 · 和田玉DIY — 中央 API 层
// 所有后端请求统一通过此模块发起。
// 后端就绪前使用 wx.Storage 本地回退。
// ================================================================

const API_BASE = ''; // TODO: 部署后填入云函数或服务器 base URL

// ==================== 内部工具 ====================

function request(method, path, data) {
  return new Promise(function(resolve, reject) {
    if (!API_BASE) {
      reject(new Error('API_BASE not configured'));
      return;
    }
    wx.request({
      url: API_BASE + path,
      method: method,
      data: data,
      header: { 'Content-Type': 'application/json' },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error('HTTP ' + res.statusCode + ': ' + (res.data && res.data.message || '')));
        }
      },
      fail: function(err) { reject(err); }
    });
  });
}

function get(path, params) { return request('GET', path, params); }
function post(path, data) { return request('POST', path, data); }

/**
 * 获取或创建持久化 userId
 */
function getUserId() {
  let userId = wx.getStorageSync('userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    wx.setStorageSync('userId', userId);
  }
  return userId;
}

// ==================== 珠子目录 ====================

function getBeadCatalog() {
  const data = require('./data.js');
  return Promise.resolve(data.beadData);
}

function getBeadById(beadId) {
  return getBeadCatalog().then(function(catalog) {
    const categories = Object.keys(catalog);
    for (let i = 0; i < categories.length; i++) {
      const cat = catalog[categories[i]];
      const colorKeys = Object.keys(cat);
      for (let j = 0; j < colorKeys.length; j++) {
        const items = cat[colorKeys[j]];
        for (let k = 0; k < items.length; k++) {
          if (items[k].id === beadId) return items[k];
        }
      }
    }
    return null;
  });
}

// ==================== 设计图目录 ====================

function getDesignCatalog() {
  const data = require('./data.js');
  return Promise.resolve(data.designData);
}

// ==================== 玉牌料子 ====================

function getPlateMaterials() {
  // Returns materials grouped by color only — sizes are per-item admin properties
  const data = require('./data.js');
  const colors = data.jadeColors;
  const app = getApp();
  const list = [];
  colors.forEach(function(color) {
    list.push({
      id: 'mat_' + color,
      name: color + '牌料',
      colorGroup: color,
      colorHex: (app && app.colorMap[color]) || '#7B5B95',
      imageUrl: '',
      lengthMm: 0,   // admin sets this
      widthMm: 0,    // admin sets this
      heightMm: 0,   // admin sets this
      shape: '方形',
      material: '和田玉青海料',
      origin: '青海',
      price: 0,
      stock: 0,
      isActive: true
    });
  });
  return Promise.resolve(list);
}

/**
 * 从本地设计数据中查找单个设计图详情
 */
function getDesignFromCatalog(designId, category) {
  const data = require('./data.js');
  const designs = data.designData[category] || [];
  for (let i = 0; i < designs.length; i++) {
    if (designs[i].id === designId) return Promise.resolve(designs[i]);
  }
  return Promise.resolve(null);
}

// ==================== AI 生成 ====================

function generateJadeImage(params, onProgress) {
  return new Promise(function(resolve, reject) {
    if (!API_BASE) {
      let progress = 0;
      const timer = setInterval(function() {
        progress += Math.floor(Math.random() * 12) + 4;
        if (progress > 100) progress = 100;
        let text = progress + '%';
        if (progress < 35) text += ' 正在分析料子底色...';
        else if (progress < 65) text += ' 正在融合设计图...';
        else if (progress < 95) text += ' 正在生成效果图...';
        else text += ' 即将完成...';
        if (onProgress) onProgress(progress, text);
        if (progress >= 100) {
          clearInterval(timer);
          resolve({ imageUrl: '', status: 'simulated' });
        }
      }, 150);
      return;
    }
    post('/api/generate-jade', params).then(function(res) {
      resolve(res);
    }).catch(function(err) {
      reject(err);
    });
  });
}

// ==================== 设计广场 ====================

function getPublishedDesigns() {
  if (API_BASE) return get('/api/designs');
  const list = wx.getStorageSync('publishedDesigns') || [];
  return Promise.resolve(list);
}

function getDesignDetail(designId) {
  if (API_BASE) return get('/api/designs/' + designId);
  const list = wx.getStorageSync('publishedDesigns') || [];
  let found = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === designId) { found = list[i]; break; }
  }
  return Promise.resolve(found);
}

/**
 * 点赞/取消点赞 — 使用 per-user key 隔离不同用户
 * @returns {Promise<{liked: boolean, likeCount: number}>}
 */
function toggleLike(designId, userId) {
  if (API_BASE) return post('/api/designs/' + designId + '/like', { userId: userId });
  return getDesignDetail(designId).then(function(design) {
    if (!design) throw new Error('Design not found');
    design.likes = design.likes || 0;
    const likedKey = 'liked_' + userId + '_' + designId;
    const already = wx.getStorageSync(likedKey);
    if (already) {
      design.likes = Math.max(0, design.likes - 1);
      wx.setStorageSync(likedKey, false);
    } else {
      design.likes = (design.likes || 0) + 1;
      wx.setStorageSync(likedKey, true);
    }
    const list = wx.getStorageSync('publishedDesigns') || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === designId) { list[i] = design; break; }
    }
    wx.setStorageSync('publishedDesigns', list);
    return { liked: !already, likeCount: design.likes };
  });
}

function postComment(designId, userId, userName, avatarUrl, text) {
  const comment = {
    id: 'cmt_' + Date.now(),
    designId: designId,
    userId: userId,
    userName: userName || '玉友',
    avatarUrl: avatarUrl || '',
    text: text,
    createdAt: new Date().toISOString(),
    isDeleted: false
  };
  if (API_BASE) return post('/api/designs/' + designId + '/comments', comment);
  return getDesignDetail(designId).then(function(design) {
    if (!design) throw new Error('Design not found');
    design.comments = design.comments || [];
    design.comments.push(comment);
    const list = wx.getStorageSync('publishedDesigns') || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === designId) { list[i] = design; break; }
    }
    wx.setStorageSync('publishedDesigns', list);
    return comment;
  });
}

function getComments(designId) {
  if (API_BASE) return get('/api/designs/' + designId + '/comments');
  return getDesignDetail(designId).then(function(design) {
    return (design && design.comments) || [];
  });
}

// ==================== 用户设计 ====================

function publishDesign(designData) {
  if (API_BASE) return post('/api/designs/publish', designData);
  const pub = wx.getStorageSync('publishedDesigns') || [];
  pub.unshift(designData);
  wx.setStorageSync('publishedDesigns', pub);
  return Promise.resolve({ success: true });
}

/**
 * 保存设计到「我的设计」（不发布到广场）
 */
function saveDesignLocal(designData) {
  const saved = wx.getStorageSync('myDesigns') || [];
  saved.unshift(designData);
  wx.setStorageSync('myDesigns', saved);
  return Promise.resolve({ success: true });
}

// ==================== 导出 ====================

module.exports = {
  getUserId: getUserId,
  getBeadCatalog: getBeadCatalog,
  getBeadById: getBeadById,
  getDesignCatalog: getDesignCatalog,
  getDesignFromCatalog: getDesignFromCatalog,
  getPlateMaterials: getPlateMaterials,
  generateJadeImage: generateJadeImage,
  getPublishedDesigns: getPublishedDesigns,
  getDesignDetail: getDesignDetail,
  toggleLike: toggleLike,
  postComment: postComment,
  getComments: getComments,
  publishDesign: publishDesign,
  saveDesignLocal: saveDesignLocal
};
