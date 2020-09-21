import {
  HTTP
} from '../utils/http.js'
class ClassicModel extends HTTP {
  getLatest(sCallback) {
    this.request({
      url: 'classic/latest',
      success: (res) => {
        sCallback(res)
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        wx.setStorageSync(key, res)
      }
    })
  }
  // 获取下一期的期刊
  getClassic(index, nextOrPrevious, sCallback) {
    // 保存key
    let key = nextOrPrevious == 'next' ? this._getKey(index + 1) : this._getKey(index - 1)
    // 获取缓存的数据
    let classic = wx.getStorageSync(key)
    // 假如本地不存在该数据
    if (!classic) {
      this.request({
        url: 'classic/' + index + '/' + nextOrPrevious,
        success: (res) => {
          // 将数据保存在本地
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
  }
  // 当前期刊是否最新一期
  isFirst(index) {
    return index == 1 ? true : false
  }
  // 当前期刊是否最后一期
  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }
  // 缓存当前的期刊号
  _setLatestIndex(index) {
    wx.setStorageSync('latest', index)
  }
  // 读取当前的期刊号
  _getLatestIndex() {
    let index = wx.getStorageSync('latest')
    return index
  }
  // 设置缓存数据的key
  _getKey(index) {
    let key = 'classic-' + index
    return key
  }
  // 获取喜欢的书籍、音乐、电影或者句子
  getMyFavor(success) {
    const params = {
      url: 'classic/favor',
      success: success
    }
    this.request(params)
  }
}

export {
  ClassicModel
}