var subjectUtil = require('../../utils/subjectUtil.js');
var movieListData = require('../../data/movieList.js')
Page({
  data: {
    imgUrls: [
      '/pages/assets/img/001.jpg',
      '/pages/assets/img/002.jpg',
      '/pages/assets/img/003.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    movies: [],
    hidden: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadMovie();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  detail: function (e) {
    getApp().detail(e);
  },
  loadMovie: function () {
    var page = this;
    var subjects = movieListData.subjects;
    subjectUtil.processSubjects(subjects);
    page.setData({ movies: subjects, hidden: true });
    // 已经没有权限获得豆瓣电影数据，只能先在浏览器中输入以下网址，然后将返回的数据保存在本地进行调用
    // wx.request({
    //   url: 'https://api.douban.com/v2/movie/in_theaters',
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function (res) {
    //     var subjects = res.data.subjects;
    //     subjectUtil.processSubjects(subjects);
    //     page.setData({ movies: subjects, hidden: true });
    //   }
    // })
  }
})