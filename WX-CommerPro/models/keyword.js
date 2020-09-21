import { HTTP } from '../utils/httpp.js'

class KeywordModel extends HTTP {
  key = 'q'
  maxLength = 10
  // 获取历史搜索结果集合
  getHistory() {
    const words = wx.getStorageSync(this.key)
    // 假如没有任何搜索结果
    if (!words) {
      return []
    }
    return words
  }
  // 获取热门搜索
  getHot() {
    return this.request({
      url: '/book/hot_keyword'
    })
  }
  // 添加历史搜索集合
  addToHistory(keyword) {
    let words = this.getHistory()
    // 查询该搜索结果是否被添加过
    const has = words.includes(keyword)
    if (!has) {
      // 控制搜索历史的展示条数
      const length = words.length
      if (length >= this.maxLength) {
        words.pop()
      }
      words.unshift(keyword)
      wx.setStorageSync(this.key, words)
    }
  }
}

export { KeywordModel }