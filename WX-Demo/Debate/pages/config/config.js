// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    configs: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var configs = wx.getStorageSync('configs')
    this.setData({ configs: configs})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 开关选择状态
  switchChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 开关状态，e代表的是switch对象
    config.state = e.detail.value
    this.setData({
      configs: configs
    })
    wx.setStorageSync("configs", configs)
  },
  // 时间滑块状态
  sliderChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 滑块值，e代表的是slider对象
    config.time = e.detail.value
    this.setData({
      configs: configs
    })
    wx.setStorageSync("configs", configs)
  },
  // 单选按钮状态
  radioChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 选中值，e代表的是radio对象
    config.voice = e.detail.value
    this.setData({
      configs: configs
    })
    wx.setStorageSync("configs", configs)
  },
})