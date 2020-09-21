// components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    like: {
      type: Boolean,
      value: false
    },
    count: {
      type: Number,
      value: 0
    },
    readOnly: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    yesSrc: 'images/like.png',
    noSrc: 'images/like@dis.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLike(e) {
      // 是否只是可读状态
      if (this.properties.readOnly) {
        return
      }
      let like = this.properties.like
      let count = this.properties.count

      count = like ? count - 1 : count + 1
      this.setData({
        count: count,
        like: !like
      })
      // 自定义事件
      let behavior = this.properties.like?'like':'cancel'
      this.triggerEvent('like',{
        behavior: behavior
      },{})
    }
  }
})