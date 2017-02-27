//index.js
//获取应用实例

var app = getApp()
Page({
  data: {
    message: '',
    opts: '',
    index: 0,
    Online: '',
    Sub_unsub: ["Subscribe", "Unsubscribe"],
    button_disabled: false,
    focus: false,
    yunba_api: ['set_alias', 'get_alias', 'get_alias_list', 'get_topic_list', 'get_state'],
    publish_select: [
      { name: 'alias', value: 'alias' },
      { name: 'topic', value: 'topic', checked: 'true' }
    ],
    publish2List: [
      {
        id: 'view',
        name: 'Publish2 Options',
        open: false,
        pages: ['qos', 'sound', 'badge', 'alert']
      }
    ],
    topic: '',
    payload: '',
    scrollTop: 50,
    isVaildTopic: '',
    isVaildPubTopic: '',
    isVaildAlias: '',
    re: '^[0-9a-zA-Z_/+#]{1,128}$',
    pub_alias_re: '^[0-9a-zA-Z_]{1,128}$',
    qos_re: '^[012]{0,1}$',
    maxLength: 128,
    publish2_enabled: false,
    publishingTo: 'topic',
    apiAlias: '',
    isVaildQos: ''
  },

  onLoad: function () {
    this.setData({
      Online: app.globalData.Online
    })
    this.OnSocketEvent()
  },

  actionSheetTap: function () {
    const self = this
    wx.showActionSheet({
      itemList: ['publish', 'publish2'],
      success: function (e) {
        if (e.tapIndex == 0) {
          self.setData({
            publish2_enabled: false
          })
        } else if (e.tapIndex == 1) {
          self.setData({
            publish2_enabled: true
          })
        }
      }
    })
  },

  radioChange: function (e) {
    this.setData({
      publishingTo: e.detail.value
    })
  },

  topicInputEvent: function (e) {
    this.setData({
      topic: e.detail.value
    })
    if ((e.detail.value.match(this.data.re)) == null) {
      this.setData({
        isVaildTopic: false
      })
    } else {
      this.setData({
        isVaildTopic: true
      })
    }
    if ((e.detail.value.match(this.data.pub_alias_re)) == null) {
      this.setData({
        isVaildPubTopic: false
      })
    } else {
      this.setData({
        isVaildPubTopic: true
      })
    }
  },

  payloadInputEvent: function (e) {
    this.setData({
      payload: e.detail.value
    })
  },

  qos: function (e) {
    this.setData({
      'opts.qos': e.detail.value
    })
    if ((e.detail.value.match(this.data.qos_re)) == null) {
      this.setData({
        isVaildQos: false
      })
    } else {
      this.setData({
        isVaildQos: true
      })
    }
  },

  sound: function (e) {
    this.setData({
      'opts.apn_json.aps.sound': e.detail.value
    })
  },

  badge: function (e) {
    this.setData({
      'opts.apn_json.aps.badge': e.detail.value
    })
  },

  alert: function (e) {
    this.setData({
      'opts.apn_json.aps.alert': e.detail.value
    })
  },

  OnSocketEvent: function () {
    const self = this
    const socket = app.globalData.socket
    socket.on('message', function (msg) {
      self.setData({
        message: self.data.message + 'topic:' + msg['topic'] + '; message: ' + msg['msg'] + '\n'
      })
    })

    socket.on('suback', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '订阅成功！',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('unsuback', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '取消订阅成功！',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('set_alias_ack', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '设置别名成功！',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('puback', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '发送成功！',
          icon: 'success',
          duration: 1000
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('alias', function (msg) {
      if (msg['alias'].length != 0) {
        wx.showToast({
          title: '获取别名成功！',
          icon: 'success',
          duration: 1000
        })
        self.setData({
          message: self.data.message + 'alias:' + msg['alias'] + '\n'
        })
      } else {
        wx.showModal({
          title: '还没有设置别名！',
          showCancel: false,
        })
      }
    })

    socket.on('get_alias_list_ack', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '获取别名列表成功！',
          icon: 'success',
          duration: 1000
        })
        self.setData({
          message: self.data.message + 'alias: {' + msg['data'].alias + '}; 总数: ' + msg['data'].occupancy + '\n'
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('get_topic_list_ack', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '获取topic列表成功！',
          icon: 'success',
          duration: 1000
        })
        self.setData({
          message: self.data.message + 'topics: {' + msg['data'].topics + '}\n'
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })

    socket.on('get_state_ack', function (msg) {
      if (msg['success'] == true) {
        wx.showToast({
          title: '获取状态成功！',
          icon: 'success',
          duration: 1000
        })
        msg['data']=='online' ? 
        self.setData({
          message: self.data.message + '在线' + '\n'
        }) : 
        self.setData({
          message: self.data.message + '离线' + '\n'
        })
      } else {
        wx.showModal({
          title: '出错了！',
          content: msg['error_msg'],
          showCancel: false,
        })
      }
    })
  },

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.publish2List;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      publish2List: list
    });
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  apiPayload: function (e) {
    this.setData({
      apiAlias: e.detail.value
    })
    if ((e.detail.value.match(this.data.pub_alias_re)) == null) {
      this.setData({
        isVaildAlias: false
      })
    } else {
      this.setData({
        isVaildAlias: true
      })
    }
  },

  Publish: function () {
    const self = this
    if (self.data.isVaildPubTopic) {
      if (self.data.publish2_enabled == false) {
        if (self.data.publishingTo == 'topic') {
          app.globalData.socket.emit('publish', { "topic": self.data.topic, "msg": self.data.payload })
        } else if (self.data.publishingTo == 'alias') {
          app.globalData.socket.emit('publish_to_alias', { "alias": self.data.topic, "msg": self.data.payload })
        }
      } else if (self.data.isVaildQos == false) {
      wx.showModal({
        title: 'qos 不合法',
        content: '输入 0，1 或 2',
        showCancel: false,
      })
      } else {
        if (self.data.publishingTo == 'topic') {
          app.globalData.socket.emit('publish2', { "topic": self.data.topic, "msg": self.data.payload, "opts": self.data.opts })
        } else if (self.data.publishingTo == 'alias') {
          app.globalData.socket.emit('publish2_to_alias', { "alias": self.data.topic, "msg": self.data.payload, "opts": self.data.opts })
        }
      }
    }
    else {
      wx.showModal({
        title: 'topic 不合法',
        content: '不支持给正斜杠和 # 发送消息',
        showCancel: false,
      })
    }
  },

  Subscribe: function () {
    const self = this
    if (self.data.isVaildTopic) {
      app.globalData.socket.emit('subscribe', { "topic": self.data.topic })
    }
    else {
      wx.showModal({
        title: 'topic 不合法',
        content: '云巴的 频道名称 支持英文、数字、正斜杠（频道分级符）和下划线，长度不超过 128 个字符',
        showCancel: false,
      })
    }
  },

  Unsubscribe: function () {
    const self = this
    if (self.data.isVaildTopic) {
      app.globalData.socket.emit('unsubscribe', { "topic": self.data.topic })
    }
    else {
      wx.showModal({
        title: 'topic 不合法',
        content: '云巴的 频道名称 支持英文、数字、正斜杠（频道分级符）和下划线，长度不超过 128 个字符',
        showCancel: false,
      })
    }
  },

  set_alias: function () {
    const self = this
    if (self.data.isVaildAlias) {
      app.globalData.socket.emit('set_alias', { "alias": self.data.apiAlias })
    } else {
      wx.showModal({
        title: 'Alias 不合法',
        content: '云巴的别名支持英文、数字和下划线，长度不超过 128 个字符',
        showCancel: false,
      })
    }
  },

  get_alias: function () {
    app.globalData.socket.emit('get_alias', {})
  },

  get_alias_list: function () {
    const self = this
    if (self.data.isVaildAlias) {
      app.globalData.socket.emit('get_alias_list', { "topic": self.data.apiAlias })
    } else {
      wx.showModal({
        title: 'topic 不合法',
        content: '通配符（#，/ 和 *）只可以在订阅的时候用',
        showCancel: false,
      })
    }
  },

  get_topic_list: function () {
    const self = this
    if (self.data.isVaildAlias) {
      app.globalData.socket.emit('get_topic_list', { "alias": self.data.apiAlias })
    } else {
      wx.showModal({
        title: 'Alias 不合法',
        content: '云巴的别名支持英文、数字和下划线，长度不超过 128 个字符',
        showCancel: false,
      })
    }
  },

  get_state: function () {
    const self = this
    if (self.data.isVaildAlias) {
      app.globalData.socket.emit('get_state', { "alias": self.data.apiAlias })
    } else {
      wx.showModal({
        title: 'Alias 不合法',
        content: '云巴的别名支持英文、数字和下划线，长度不超过 128 个字符',
        showCancel: false,
      })
    }
  }
})
