// components/tag/index.js
Component({
  // 启用插槽
  options: {
    multipleSlots: true,
  },
  // 接收外部样式类名
  externalClasses: ['tag-class'],
  // 组件的属性列表
  properties: {
    text: String
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
    onTap(event) {
      this.triggerEvent('tapping', {
        text: this.properties.text
      })
    }
  }
})
