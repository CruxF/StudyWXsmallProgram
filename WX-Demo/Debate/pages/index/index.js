// 音频API
const myaudio = wx.createInnerAudioContext();
Page({
  leftMove: 0,
  rightMove: 0,
  data: {
    itemList: [], //showAction提示文字
    title: '',
    desc: '',
    voice: 0, //声音提醒时间
    leftAnimationData: '',
    rightAnimationData: '',
    leftTime: 0,
    rightTime: 0
  },
  // 页面初始化
  onLoad: function () {
    myaudio.src = "/assets/sound/countdown.mp3"
  },
  // 页面显示
  onShow: function () {
    var configs = wx.getStorageSync('configs')
    var itemLists = []
    // 第一次出现的阶段内容
    var first = true
    for (var i in configs) {
      var config = configs[i]
      if (config.state) {
        var desc = config.desc.replace(/@/g, config.time + '秒')
        if (first) {
          this.setData({
            title: config.name,
            desc: desc,
            leftTime: config.time,
            rightTime: config.time,
            voice: config.voice
          })
          first = false
        }
        itemLists.push({
          title: config.name,
          desc: desc,
          time: config.time,
          voice: config.voice
        })
      }
    }
    this.setData({
      itemList: itemLists
    })
  },
  showAction: function () {
    var page = this
    var itemArr = []
    for (var i = 0; i < this.data.itemList.length; i++) {
      itemArr[i] = this.data.itemList[i].title
    }
    wx.showActionSheet({
      itemList: itemArr,
      success(res) {
        page.setData({
          title: page.data.itemList[res.tapIndex].title,
          desc: page.data.itemList[res.tapIndex].desc,
          voice: page.data.itemList[res.tapIndex].voice,
          leftTime: page.data.itemList[res.tapIndex].time,
          rightTime: page.data.itemList[res.tapIndex].time
        })
        page.leftStop();
        page.rightStop();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  leftStart: function () {
    this.rightStop();
    if (this.leftInterval && this.leftInterval != 0) {
      this.leftStop();
      return false;
    }
    var leftAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    leftAnimation.rotate(this.leftMove += 100).step()
    this.setData({
      leftAnimationData: leftAnimation.export()
    })
    // 定义一个定时器
    var page = this
    var leftInterval = setInterval(function () {
      if (page.data.leftTime <= 0) {
        page.leftStop();
        myaudio.pause();
        return false;
      }
      if (page.data.leftTime <= page.data.voice) {
        myaudio.play();
      }
      leftAnimation.rotate(page.leftMove += 100).step()
      page.setData({
        leftAnimationData: leftAnimation.export()
      })
      page.setData({
        leftTime: page.data.leftTime - 1
      })
    }, 1000)
    this.leftInterval = leftInterval
  },
  leftStop: function () {
    clearInterval(this.leftInterval)
    this.leftInterval = 0
    myaudio.pause();
  },
  rightStart: function () {
    this.leftStop();
    if (this.rightInterval && this.rightInterval != 0) {
      this.rightStop();
      return false;
    }
    var rightAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    rightAnimation.rotate(this.rightMove += 100).step()
    this.setData({
      rightAnimationData: rightAnimation.export()
    })
    // 定义一个定时器
    var page = this
    var rightInterval = setInterval(function () {
      if (page.data.rightTime <= 0) {
        page.rightStop();
        return false;
      }
      if (page.data.rightTime <= page.data.voice) {
        myaudio.play();
      }
      rightAnimation.rotate(page.rightMove += 100).step()
      page.setData({
        rightAnimationData: rightAnimation.export()
      })
      page.setData({
        rightTime: page.data.rightTime - 1
      })
    }, 1000)
    this.rightInterval = rightInterval
  },
  rightStop: function () {
    clearInterval(this.rightInterval)
    this.rightInterval = 0
    myaudio.pause();
  }
})