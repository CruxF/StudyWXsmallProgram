// pages/book/book.js
import {
  BookModel
} from '../../models/book.js'
import {
  random
} from '../../utils/common.js'
const bookModel = new BookModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching: false,
    more: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取热门书籍
    bookModel.getHotList().then(res => {
      this.setData({
        books: res
      })
    })
  },
  // 显示搜索组件
  onSearching(event) {
    this.setData({
      searching: true
    })
  },
  // 隐藏搜索组件
  onCancel(event) {
    this.setData({
      searching: false
    })
  },
  // 滚动触底触发事件
  onReachBottom() {
    this.setData({
      more: random(16)
    })
  }
})