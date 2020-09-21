//app.js
App({
  detail: function (e) {
    // 全局能够调用的方法
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.id
    })
  }
})