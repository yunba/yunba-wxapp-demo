//app.js
import io from './lib/wxsocket.io/index'

App({
  onLaunch: function () {
    this.globalData.io = io
  },

  globalData:{
  }
})