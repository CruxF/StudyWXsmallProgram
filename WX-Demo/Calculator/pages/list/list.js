Page({
  data:{
    logs:[]
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad:function(options){
    // 获得本地存储的数据
    var logs = wx.getStorageSync('callogs');
    this.setData({logs:logs});
  }
})