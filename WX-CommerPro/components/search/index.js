// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword.js'
import {
  BookModel
} from '../../models/book.js'
import {
  paginationBev
} from '../behaviors/pagination.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more: {
      type: String,
      // 当父组件传入的数据发生变化时，该方法才会触发
      observer: 'loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    q: '',
    loading: false, // 动画与锁
    loadingCenter: false // 动画的位置
  },

  // 在组件实例进入页面节点树时执行
  attached() {
    // 获取历史搜索结果
    this.setData({
      historyWords: keywordModel.getHistory()
    })
    // 获取热门搜索结果
    keywordModel.getHot().then(res => {
      this.setData({
        hotWords: res.hot
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 加载更多书籍数据
    loadMore() {
      if (!this.data.q) {
        return false
      }
      // 锁是否为true
      if (this.isLocked()) {
        return false
      }
      // 是否存在更多数据
      if (this.hasMore()) {
        this.locked()
        bookModel.search(this.getCurrentStart(), this.data.q).then(res => {
          this.setMoreData(res.books)
          this.unLocked()
        },()=>{
          // 避免因为网络请求问题产生死锁
          this.unLocked()
        })
      }
    },
    // 取消搜索事件
    onCancel(event) {
      this.initialize()
      this.triggerEvent('cancel', {}, {})
    },
    // 清空搜索框内容
    onDelete(event) {
      this.initialize()
      this._closeResult()
    },
    // 搜索框触发事件
    onConfirm(event) {
      this._showResult()
      this._showLoadingCenter()
      const q = event.detail.value || event.detail.text
      // 绑定数据到搜索输入框
      this.setData({
        q
      })
      bookModel.search(0, q).then(res => {
        this.setMoreData(res.books)
        this.setTotal(res.total)
        keywordModel.addToHistory(q)
        this._hideLoadingCenter()
      })
    },
    // 动画在中间显示
    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },
    // 隐藏中间动画
    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    },
    // 显示搜索结果
    _showResult() {
      this.setData({
        searching: true
      })
    },
    // 关闭结果页
    _closeResult() {
      this.setData({
        searching: false,
        q: ''
      })
    }
  }
})