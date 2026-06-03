Component({
  properties: {
    visible: { type: Boolean, value: false },
    beadInfo: { type: String, value: '' }
  },
  data: { name: '' },
  observers: {
    'visible': function(val) {
      if (val) this.setData({ name: '' });
    }
  },
  methods: {
    onInput(e) { this.setData({ name: e.detail.value }); },
    onConfirm() {
      const name = this.data.name.trim();
      if (!name) return wx.showToast({ title: '请输入珠子名称', icon: 'none' });
      this.triggerEvent('confirm', { name: name });
    },
    onCancel() { this.triggerEvent('cancel'); },
    noop() {}
  }
});
