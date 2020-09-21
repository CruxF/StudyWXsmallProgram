import {
  ClassicModel
} from '../../models/classic.js'
import {
  LikeModel
} from '../../models/like.js'
let classicModel = new ClassicModel()
let likeModel = new LikeModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classic: null,
    latest: true,
    first: false,
    likeCount: 0,
    likeStatus: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {    
    classicModel.getLatest(res => {     
      this.setData({
        classic: res,
        likeCount: res.fav_nums,
        likeStatus: res.like_status
      })
    })
  },
  // 喜欢或者不喜欢
  onLike: function(e) {
    let behavior = e.detail.behavior
    likeModel.like(behavior, this.data.classic.id, this.data.classic.type)
  },
  // 下一期刊
  onNext: function(event) {
    this._updateClassic('next')
  },
  // 上一期刊
  onPrevious: function(event) {
    this._updateClassic('previous')
  },
  // 上一期刊和下一期刊的公共函数
  _updateClassic: function(nextOrPrevious) {
    let index = this.data.classic.index
    classicModel.getClassic(index, nextOrPrevious, (res) => {
      this._getLikeStatus(res.id, res.type)
      this.setData({
        classic: res,
        latest: classicModel.isLatest(res.index),
        first: classicModel.isFirst(res.index)
      })
    })
  },
  // 获取点赞数量和点赞状态
  _getLikeStatus: function(artID,category) {
    likeModel.getClassicLikeStatus(artID,category,(res)=>{
      this.setData({
        likeCount: res.fav_nums,
        likeStatus: res.like_status
      })
    })
  }
})