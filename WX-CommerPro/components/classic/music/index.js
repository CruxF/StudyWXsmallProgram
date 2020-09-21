// components/classic/music/index.js
import { classicBeh } from '../classic-beh.js'

// 引入背景音乐对象
const mMgr = wx.getBackgroundAudioManager();
Component({
  /**
   * 组件的属性列表 
   */
  // 多继承
  behaviors: [classicBeh],
  properties: {
    src: String,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    playing: false,
    pauseSrc: 'images/player@pause.png',
    playSrc: 'images/player@play.png',
  },
  // 组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function(event){
    this._recoverStatus()
    this._monitorSwitch()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPlay:function(event){
      if(!this.data.playing) {
        this.setData({
          playing: true
        })
        mMgr.title = this.properties.title
        mMgr.src = this.properties.src
      } else {
        this.setData({
          playing: false
        })
        mMgr.pause()
      }
    },
    // 判断音乐的状态
    _recoverStatus:function(){
      if(mMgr.paused){
        this.setData({
          playing: false
        })
        return false
      }
      if(mMgr.src == this.properties.src){
        this.setData({
          playing: true
        })
      }
    },
    // 使组件音乐状态与弹窗音乐开关的行为相一致
    _monitorSwitch: function(){
      mMgr.onPlay(()=>{
        this._recoverStatus()
      })
      mMgr.onPause(() => {
        this._recoverStatus()
      })
      mMgr.onStop(() => {
        this._recoverStatus()
      })
      mMgr.onEnded(() => {
        this._recoverStatus()
      })
    }
  }
})
