Page({

  /**
   * 页面的初始数据
   */
  data: {
    starDesc: '非常满意，无可挑剔',
    stars: [{
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '非常不满意，各方面都很差'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '不满意，比较差'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '一般，还要改善'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '比较满意，仍要改善'
    }, {
      lightImg: '/images/star_light.png',
      blackImg: '/images/star_black.png',
      flag: 1,
      message: '非常满意，无可挑剔'
    }],
    assessLists: ['意见很有帮助', '态度非常好', '非常敬业', '非常专业认真', '回复很及时', '耐心细致']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 选择评价星星
  starClick: function (e) {
    var that = this;
    for (var i = 0; i < that.data.stars.length; i++) {
      var allItem = 'stars[' + i + '].flag';
      that.setData({
        [allItem]: 2
      })
    }
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      var item = 'stars[' + i + '].flag';
      that.setData({
        [item]: 1
      })
    }
    this.setData({
      starDesc: this.data.stars[index].message
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})