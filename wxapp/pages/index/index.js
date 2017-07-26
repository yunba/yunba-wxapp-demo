// pages/enter/enter.js
var app = getApp()

Page({
  data: {
    re: '^[0-9a-f]{24}$',
    cid_re: '^[0-9a-zA-Z_-]{1,128}$',
    isVaildAppkey: false,
    connected: '',
    appkey: '',
    customid: '',
    isVaildCustomid: false
  },

  onLoad: function (options) {
    const socket = app.globalData.io("wss://abj-rest-fc1.yunba.io:443/")
    app.globalData.socket = socket
    this.OnSocketEvent()
  },

  appkeyInput: function (e) {
    this.setData({
      appkey: e.detail.value
    })
    if ((e.detail.value.match(this.data.re)) == null) {
      this.setData({
        isVaildAppkey: false
      })
    } else {
      this.setData({
        isVaildAppkey: true
      })
    }
  },

  customidInput: function (e) {
    this.setData({
      customid: e.detail.value
    })
    if ((e.detail.value.match(this.data.cid_re)) == null) {
      this.setData({
        isVaildCustomid: false
      })
    } else {
      this.setData({
        isVaildCustomid: true
      })
    }
  },

  OnSocketEvent: function () {
    const self = this
    const socket = app.globalData.socket
    socket.on('connect', function () {
      self.setData({
        connected: true
      })
    })

    socket.on('connack', function (msg) {
      if (msg['success'] == true) {
        app.globalData.Online = true
        wx.navigateTo({
          url: '../yunba/yunba'
        })
      }
    })
  },

  navigator: function () {
    if (!this.data.isVaildAppkey) {
      wx.showModal({
        title: '请输入有效的 appkey',
        showCancel: false,
      })
    } else if (!this.data.isVaildCustomid) {
      wx.showModal({
        title: '请输入有效的 customid',
        content: '支持数字、字母、- 和 _',
        showCancel: false,
      })
    } else if (!this.data.connected){
      wx.showModal({
        title: '网络未连接！',
        showCancel: false,
      })
    } else {
      app.globalData.socket.emit('connect_v2', { 'appkey': this.data.appkey, 'customid': this.data.customid })
    }
  }
})
