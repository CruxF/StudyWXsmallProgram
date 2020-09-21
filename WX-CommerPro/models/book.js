import {
  HTTP
} from '../utils/httpp.js'

class BookModel extends HTTP {
  // 获取热门书籍
  getHotList() {
    return this.request({
      url: 'book/hot_list'
    })
  }
  // 获取喜欢书籍的数量
  getMyBookCount() {
    return this.request({
      url: 'book/favor/count'
    })
  }
  // 获取书籍的具体数据
  getDetail(bid) {
    return this.request({
      url: `book/${bid}/detail`
    })
  }
  // 获取当前书籍的点赞状态
  getLikeStatus(bid) {
    return this.request({
      url: `book/${bid}/favor`
    })
  }
  // 获取当前书籍的点评信息
  getComments(bid) {
    return this.request({
      url: `book/${bid}/short_comment`
    })
  }
  // 向书籍添加短评内容
  postComment(bid, comment) {
    return this.request({
      url: 'book/add/short_comment',
      method: 'POST',
      data: {
        book_id: bid,
        content: comment
      }
    })
  }
  // 搜索书籍
  search(start, q) {
    return this.request({
      url: 'book/search?summary=1',
      data: {
        q: q,
        start: start
      }
    })
  }
}

export {
  BookModel
}