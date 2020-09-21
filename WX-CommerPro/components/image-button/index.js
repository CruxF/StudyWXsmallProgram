// components/image-button/index.js
Component({
  /**
   * 组件的属性列表
   */
  // 开启插槽
  options: {
    multipleSlots: true 
  },
  properties: {
    openType: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event){
      // 自定义事件
      this.triggerEvent('getuserinfo', event.detail, {})
    }
  }
})
