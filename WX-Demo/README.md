### 1.Calculator => [实现一个简易计算器](https://github.com/CruxF/WXsmallProgram/tree/master/Calculator?1543978668813)
这是一个使用小程序实现的简单计算器，来源于小木学堂。开发过程很简单，主要就是根据官网配置好开发环境，接着创建一个项目，将这里的[源码](https://github.com/CruxF/WXsmallProgram/tree/master/Calculator?1543915837338)copy进去即可检验效果，在该项目中涉及到了如下基础知识

- 基础组件之[视图容器](https://developers.weixin.qq.com/miniprogram/dev/component/)
- 框架之[响应的数据绑定](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)
- 框架之[路由](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)
- 框架之[列表渲染](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/list.html)
- 框架之[触发事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)
- API之[数据缓存](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setStorageSync.html)

在开发的过程中遇到了以下两个问题
- 1、如何在wxss文件中调用本地图片资源？[答案](https://github.com/CruxF/WXsmallProgram/issues/1)
- 2、wx.setstoragesync和wx.setstorage的区别是什么？[答案](https://github.com/CruxF/WXsmallProgram/issues/2)<br><br>


### 2.Weather => [实现天气预报应用](https://github.com/CruxF/WXsmallProgram/tree/master/Weather?1543978644626)
挺容易的一个项目，主要是调用第三方API，也就是结合百度地图，对此陌生的童鞋可以[先来这里](http://lbsyun.baidu.com/index.php?title=wxjsapi/guide/key)补充下知识，相信将开发指南好好动手敲一遍的童鞋都能看懂以下代码
```js
//引入 bmap-wx.js
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];

Page({
  data: {
    city: "",
    today: {},
    future: {}
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {  
    this.loadCity();
  },
  loadCity: function (latitude, longitude) {
    var page = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '你的ak码'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      // 城市
      wxMarkerData = data.wxMarkerData;      
      var index = wxMarkerData[0].desc.indexOf('市')
      var city = wxMarkerData[0].desc.slice(0, index+1)
      page.setData({ city: city });
      page.loadWeather()
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  loadWeather: function () {
    var page = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '你的ak码'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      // 当天
      var weatherData = data.currentWeather[0];
      // 当天-未来三天
      var futureWeather = data.originalData.results[0].weather_data;
      var future = []
      for (var i = 0; i < futureWeather.length;i++){
        future.push({
          date: futureWeather[i].date.slice(0, 2),
          temperature: futureWeather[i].temperature.slice(0, 2) +'℃',
          weather: futureWeather[i].weather,
          wind: futureWeather[i].wind
        })
      }
      page.setData({ today: weatherData, future: future })
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    }); 
  }
})
```

接下来比较重要的一个点就是微信小程序[框架之模板](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/template.html)，可能看文档会觉得模模糊糊，那么看下面的代码相信你能清晰很多
```html
// 调用模板文件
<import src="../template/itemtpl" />
<view class="future">
  <block wx:for="{{future}}" wx:key="index">
    <template is="future-item" data="{{item}}" />
  </block>
</view>

// 模板文件
<template name="future-item">
  <view class="future-item">
    <view>{{item.date}} </view>
    <view> {{item.weather}} </view>
    <view>{{item.wind}}</view>
    <view> {{item.temperature}} </view>
  </view>
</template>
```
<br><br>


### 3.Movie => [实现电影APP应用](https://github.com/CruxF/WXsmallProgram/tree/master/Movie?1544067088144)
项目的开始，是实现全局的tabBar导航，其中涉及到的新知识是小程序框架之[全局配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)，下面请看相关代码
```js
{
  "pages": [
    "pages/movie/movie",
    "pages/index/index"
  ],
  "tabBar": {
    "color": "#ddd",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#2B2B2B",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "pages/assets/img/dy-1.png",
        "selectedIconPath": "pages/assets/img/dy.png",
        "text": "影院热映"
      },
      {
        "pagePath": "pages/movie/movie",
        "iconPath": "pages/assets/img/tj-1.png",
        "selectedIconPath": "pages/assets/img/tj.png",
        "text": "电影推荐"
      },
      {
        "pagePath": "pages/movie/movie",
        "iconPath": "pages/assets/img/search-1.png",
        "selectedIconPath": "pages/assets/img/search.png",
        "text": "查询电影"
      }
    ]
  },
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#2B2B2B",
    "navigationBarTitleText": "小木学堂电影APP",
    "navigationBarTextStyle": "white"
  }
}
```

接着涉及的新知识点不过是小程序里面的基础内容，比如
- 组件之[swiper](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)，也就是轮播图组件
- API之[wx.showLoading](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showLoading.html?search-key=loading)，也就是页面数据加载时出现的动画

有两点比较重要的是模板的使用，之前有说到；另外一点就是wxss样式代码相互之间能够引用，这就能够让我少写十分多重复的代码，以及我们能够封装一个公共的方法，然后在多个地方进行调用，这些都能够在源码中看到，具体点的就不提了。由于豆瓣接口现在已经无法调用了，因此电影详情以及电影搜索这两个功能无法实现，豆瓣客服如下说：
```text
你好， 

豆瓣Api持续维护中，Apikey暂不对个人开放申请。电影/图书资料信息等基础数据信息，暂不做任何形式的Api输出合作。 

感谢对豆瓣的关注。
```

更多小程序使用技巧请看下篇分享<br><br>


### 4.FirstWxPro => [入门微信小程序](https://www.imooc.com/learn/974)

这是一门十分简单的小程序入门指南视频（应该说小程序本来就很简单），根据老师的提供的源码和素材，将其做了部分的结构和样式更改，有兴趣的可以下载该项目，运行查看结果。<br>

起步过于简单，在这不说明，请直接到[官方网站](https://developers.weixin.qq.com/miniprogram/dev/)开启自己的小程序之旅，下面整理一些自己认为重要的知识点。<br>

### 全局配置文件
app.json文件用来对微信小程序进行全局配置，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等，具体的请[点击这里](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)<br>

### swiper组件的使用
[这个组件](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html?search-key=swiper)是比较常用的，说它比较重要，不仅仅是因为它的常用性，也因为它的栗子有十分好的借鉴性。<br>

结构代码<br>
```html
<swiper indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" indicator-dots="true">
  <block wx:for="{{imgUrls}}" wx:key="">
    <swiper-item>
      <image src="{{item}}" class="slide-image" width="355" height="150"/>
    </swiper-item>
  </block>
</swiper>
```

脚本代码<br>
```js
Page({
  data: {
    imgUrls: [
      '/images/home1.jpg',
      '/images/home2.jpg',
      '/images/home3.jpg',
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    proList: null,
  }
})
```
说这个组件的使用具有借鉴性是因为将属性和属性值完全分离了来进行管理，在一定程度上来说，这是十分好的一种方式，结构代码和脚本代码分离便于管理和维护。<br>

### 调用数据的三种方式
在小程序中，一共有三种调用数据的方式，其中一种是调用后台数据，另外两种是调用本地数据，现在我们先来看一看最简单的本地数据调用方式：
```js
// 定义本地脚本数据
Page({
  data: {
    imgUrls: [
      '/images/home1.jpg',
      '/images/home2.jpg',
      '/images/home3.jpg',
    ]
  }
})

//调用本地数据
<block wx:for="{{imgUrls}}" wx:key="">
  <swiper-item>
    <image src="{{item}}" class="slide-image" width="355" height="150"/>
  </swiper-item>
</block>
```
第二种调用本地数据稍微复杂一些，它和Vue程序中调用json数据的方式完全不同，在小程序不能直接调用json文件中的数据，只能将数据保存在一个脚本文件中，然后将其exports出来，最后在需要调用数据的文件中导入，具体请看以下代码：
```js
// 步骤一：分离数据，将数据定义在顶层的data目录下
var joinList_data = [
  {
    "proName": "关于NBA",
    "proDesc": "NBA（National Basketball Association）是美国职业篮球联赛的简称",
    "id": "001"
  }
]
module.exports = {
  joinList: joinList_data
}

// 步骤二：在需要调用数据的脚本文件中引入
var joinListData = require("../../data/joinList.js");

// 步骤三：在周期函数中赋值
Page({
  data: {
    joinList: null
  },
  // 生命周期函数--监听页面加载
  onLoad: function () {
    this.setData({
      joinList: joinListData.joinList
    })
  }
})

// 步骤四：在结构代码中遍历数据
<view class='block' wx:for="{{joinList}}" wx:key="">
  <view class='block-title'>{{item.proName}}</view>
  <text class='block-desc'>{{item.proDesc}}</text>
</view>
```
第三种数据调用方式最重要，因为那是必须会的，这种方式是从后台请求回来数据进行使用，具体方式请看以下代码：
```js
Page({
  data: {
    proList: null,
  },
  onLoad: function () {
    this.getProList();
  }
  // API请求方法
  getProList: function(){
    var self = this;
    wx.request({
      url: 'http://guozhaoxi.top/wx/data.json',
      method: 'GET',
      success: function(res){
        self.setData({
          proList: res.data,
        })
      },
      fail: function(){
        console.log('调用数据失败');
      }
    })
  }
})

// 使用请求回来的数据
<view class='pro-item' wx:for="{{proList}}" wx:key=""></view>
```

### 组件之间的三种传值方式
一说到组件传值，相信有经验的开发人员都知道它的重要性，下面简单的来看看三种传值方式的代码。<br>

第一种：全局传值<br>
```js
// 步骤一：在全局脚本文件中定义数据
App({
  globalData: {
    userInfo: null,
    userName: '全局变量传值',
  }
})

// 步骤二：获取应用实例，不然无法调用全局变量
const app = getApp()

// 步骤三：调用全局变量
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(app.globalData.userName);
  },
})
```

第二种：url传值
```js
// 步骤一：使用关键字bindtap绑定一个点击事件方法，data-index是传入一个值
<image class="btn-detail" src='/images/btn_detail.png' bindtap='toDetail' data-index='{{index}}'></image>

// 步骤二：在脚本文件中定义这个方法（方法并不是定义在一个methods集合中的）
Page({
  data: {},
  onLoad: function () {},
  toDetail: function(e){
    // index代表的遍历对象的下标
    var index = e.currentTarget.dataset.index;
    var proList = this.data.proList;
    var title = proList[index].proName;
    wx.navigateTo({
      url: '/pages/detail/detail?title='+title,
    })
  }
})

// 步骤三：在detail组件的脚本文件中接收title这个传入过来的值
Page({
  data: {},
  onLoad: function (options) {
    console.log(options.title);
  },
})
```

第三种：setStorageSync传值
```js
// 步骤一：使用关键字bindtap绑定一个点击事件方法，data-index是传入一个值
<image class="btn-detail" src='/images/btn_detail.png' bindtap='toDetail' data-index='{{index}}'></image>

// 步骤二：在脚本文件中定义这个方法（方法并不是定义在一个methods集合中的）
Page({
  data: {},
  onLoad: function () {},
  toDetail: function(e){
    var index = e.currentTarget.dataset.index;
    var proList = this.data.proList;
    var title = proList[index].proName;
    wx.setStorageSync('titleName', title);
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  }
})

// 步骤三：在detail组件的脚本文件中使用wx.getStorageSync接收titleName这个传入过来的值
Page({
  data: {},
  onLoad: function (options) {
    var titlen = wx.getStorageSync('titleName');
    console.log(titlen);
  },
})
```

#### 组件传值的应用场景
关于组件传值的应用，老师在视频中并没有给出，自己瞎琢磨出一个栗子，记住：**在真正开发中，千万别这么用。** 这个栗子的作用是让我们对组件的传值有一个大概的应用场景，下面请看代码实现：
```js
// 数据接收方
Page({
  data: {
    iskebi: false,
    iszhan: false,
    isqiao: false,
    isgeli: false
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    var titlee = wx.getStorageSync('titleName');
    console.log(titlee);
    if (titlee == '科比·布莱恩特') {
      this.setData({iskebi: true});
    } else if (titlee == '勒布朗·詹姆斯'){
      this.setData({ iszhan: true });
    } else if (titlee == '迈克尔·乔丹') {
      this.setData({ isqiao: true });
    } else{
      this.setData({ isgeli: true });
    }
  }
})

// 数据显示层
<view wx:if="{{iskebi}}">
  我是科比的球迷
</view>
<view wx:if="{{iszhan}}">
  我是詹姆斯的球迷
</view>
<view wx:if="{{isqiao}}">
  我是乔丹的球迷
</view>
<view wx:if="{{isgeli}}">
  我是格里芬的球迷
</view>
```


### 基础库兼容
这个东西其实也不是太重要，知道有个玩意，以及如何去判断和解决就行，下面看代码：
```js
Page({
  data: {},
  onLoad: function () {},
  // copy事件
  copy: function(){
    // 检测版本是否具备wx.setClipboardData这个API
    if (wx.setClipboardData){
      wx.setClipboardData({
        // 复制的内容，可以设置为动态的数据
        data: '232323232',
        success: function (res) {
          // 模态框
          wx.showModal({
            title: '复制成功',
            content: '内容已经复制成功！',
          })
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您的微信版本太低，请升级',
      })
    }
  }
})
```

### 尾声
以上就是我所做的一些总结，源码都在[这里](https://github.com/CruxF/WXsmallProgram/tree/master/FirstWxPro?1544067560085)，有疑问的可以加我慕课账号（Zz皓）私信聊。<br><br>


### 5.Debate => [辩论赛计时APP](https://github.com/CruxF/WXsmallProgram/tree/master/Debate?1544177927550)
项目的开始是之前有提到的tabBar知识，新知识就是在某个Page模块中，在wxss里面page元素代表的是整个界面内容区域，常用此来定义区域背景颜色
```css
page {
  background-color: #369;
}
```
<br>

项目走到设置页面这一块，就出现了以下新的知识点
- 框架之[页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)，也就是能够把全局的json配置中某些部分替代掉。
- 组件之[switch](https://developers.weixin.qq.com/miniprogram/dev/component/switch.html)，也就是on/off的开关
- 组件之[slider](https://developers.weixin.qq.com/miniprogram/dev/component/slider.html)，也就是拖动条
- 组件之[radio](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html)，也就是单选按钮<br>


有意思的一个亮点，就是往一个对象中添加属性，下面请看代码
```html
<!--pages/config/config.wxml-->
<view class='config'>
  <!-- 立论阶段 -->
  <view class='section-title'>
    立论阶段
    <switch id='config1' class='pull-right' checked='checked' bindchange='switchChange'></switch>
  </view>
  <view class='hr'></view>
  <view>
    <text class='text'>时间限制(秒)</text>
    <slider id='config1' show-value min='10' max='200' block-size="12" bindchange='sliderChange'></slider>
  </view>
  <view>
    <text class='text'>声音提醒</text>
    <radio-group id='config1' class="voice" bindchange="radioChange">
      <label>
        <radio value='15' checked='checked'>提前15秒</radio>
      </label>
      <label>
        <radio value='10'>提前10秒</radio>
      </label>
      <label>
        <radio value='5'>提前5秒</radio>
      </label>
    </radio-group>
  </view>

  <!-- 驳立论阶段 -->
  <view class='section-title'>
    驳立论阶段
    <switch id='config2' class='pull-right' checked='checked' bindchange='switchChange'></switch>
  </view>
  <view class='hr'></view>
  <view>
    <text class='text'>时间限制(秒)</text>
    <slider id='config2' show-value min='10' max='200' block-size="12" bindchange='sliderChange'></slider>
  </view>
  <view>
    <text class='text'>声音提醒</text>
    <radio-group id='config2' class="voice" bindchange="radioChange">
      <label>
        <radio value='15' checked='checked'>提前15秒</radio>
      </label>
      <label>
        <radio value='10'>提前10秒</radio>
      </label>
      <label>
        <radio value='5'>提前5秒</radio>
      </label>
    </radio-group>
  </view>

  <!-- 质辩环节 -->
  <view class='section-title'>
    质辩环节
    <switch id='config3' class='pull-right' checked='checked' bindchange='switchChange'></switch>
  </view>
  <view class='hr'></view>
  <view>
    <text class='text'>时间限制(秒)</text>
    <slider id='config3' show-value min='10' max='200' block-size="12" bindchange='sliderChange'></slider>
  </view>
  <view>
    <text class='text'>声音提醒</text>
    <radio-group id='config3' class="voice" bindchange="radioChange">
      <label>
        <radio value='15' checked='checked'>提前15秒</radio>
      </label>
      <label>
        <radio value='10'>提前10秒</radio>
      </label>
      <label>
        <radio value='5'>提前5秒</radio>
      </label>
    </radio-group>
  </view>

  <!-- 自由辩论 -->
  <view class='section-title'>
    自由辩论
    <switch id='config4' class='pull-right' checked='checked' bindchange='switchChange'></switch>
  </view>
  <view class='hr'></view>
  <view>
    <text class='text'>时间限制(秒)</text>
    <slider id='config4' show-value min='10' max='200' block-size="12" bindchange='sliderChange'></slider>
  </view>
  <view>
    <text class='text'>声音提醒</text>
    <radio-group id='config4' class="voice" bindchange="radioChange">
      <label>
        <radio value='15' checked='checked'>提前15秒</radio>
      </label>
      <label>
        <radio value='10'>提前10秒</radio>
      </label>
      <label>
        <radio value='5'>提前5秒</radio>
      </label>
    </radio-group>
  </view>

  <!-- 总结陈词 -->
  <view class='section-title'>
    总结陈词
    <switch id='config5' class='pull-right' checked='checked' bindchange='switchChange'></switch>
  </view>
  <view class='hr'></view>
  <view>
    <text class='text'>时间限制(秒)</text>
    <slider id='config5' show-value min='10' max='200' block-size="12" bindchange='sliderChange'></slider>
  </view>
  <view>
    <text class='text'>声音提醒</text>
    <radio-group id='config5' class="voice" bindchange="radioChange">
      <label>
        <radio value='15' checked='checked'>提前15秒</radio>
      </label>
      <label>
        <radio value='10'>提前10秒</radio>
      </label>
      <label>
        <radio value='5'>提前5秒</radio>
      </label>
    </radio-group>
  </view>
</view>
```
具体的js代码
```js
// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    configs: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 开关选择状态
  switchChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 开关状态，e代表的是switch对象
    config.state = e.detail.value
    this.setData({
      configs: configs
    })
  },
  // 时间滑块状态
  sliderChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 滑块值，e代表的是slider对象
    config.time = e.detail.value
    this.setData({
      configs: configs
    })
  },
  // 单选按钮状态
  radioChange: function(e) {
    var id = e.target.id;
    var configs = this.data.configs
    var config = configs[id];
    if (!config) {
      config = new Object();
      configs[id] = config
    }
    // 选中值，e代表的是radio对象
    config.voice = e.detail.value
    this.setData({
      configs: configs
    })
  },
})
```

当我们需要一个点击出现底部选择框的时候(如下图)，那么可以来这里进行查看：API之[交互wx.showActionSheet](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showActionSheet.html)
![](https://github.com/CruxF/WXsmallProgram/blob/master/Debate/assets/img/showActionSheet.jpg)<br>

项目中设计很多关于逻辑上的问题，不知道怎么去形容，还是直接看[源码吧](https://github.com/CruxF/WXsmallProgram/tree/master/Debate?1544177927550)，其中包含了动画的实现以及音频的实现。<br><br>


### 6.WXshop => [小程序实现购物车功能](https://github.com/CruxF/WXsmallProgram/tree/master/WXshop?1545741297991)
购物车的功能，基本上在每一个需要支付的小程序中都会涉及到，最近自己也恰好根据自己的想法以及参考网上的代码实现了一个小demo，效果请看下图<br>
![](https://github.com/CruxF/WXsmallProgram/blob/master/WXshop/images/proimage.jpg?raw=true)<br><br>

由于WXML和WXSS代码过于简单，而且也是有些抠脚，在此不做讲解，下面直接看具体的功能代码，首先看data中的初始数据
```js
data: {
  isAllSelect: false,
  totalMoney: 0,
  carts: [{
    imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545749696672&di=31a25f2946bb876476efc397929f1d60&imgtype=0&src=http%3A%2F%2Fo4.xiaohongshu.com%2Fdiscovery%2Fw640%2F462ba43540b307990a8b4a2664b9ef20_640_640_92.jpg',
    title: "[马应龙]红霉素软膏",
    desc: '10g(1%)',
    price: 200,
    isSelect: false,
    count: {
      quantity: 2,
      min: 1,
      max: 20
    }
  }, {
    imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545749696672&di=d59a2ae0dad0151c93d252d6478d8007&imgtype=0&src=http%3A%2F%2Fpic.baike.soso.com%2Fp%2F20140120%2F20140120153321-150550151.jpg',
    title: "[云南]白药牙膏",
    desc: '10g(1%)',
    price: 200,
    isSelect: true,
    count: {
      quantity: 5,
      min: 1,
      max: 20
    }
  }]
}
```
以上代码定义了是否全选的变量（isAllSelect）、商品总金额变量（totalMoney）以及商品列表（carts）。下面我们再来看看选中单个商品时触发的事件
```js
switchSelect: function(e) {
  const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
  let carts = this.data.carts; // 获取购物车列表
  let selectNum = 0; //统计选中商品
  const isSelect = carts[index].isSelect; // 获取当前商品的选中状态
  carts[index].isSelect = !isSelect; // 改变状态
  for (let i = 0; i < carts.length; i++) {
    if (carts[i].isSelect) {
      selectNum++
    }
  }
  if (selectNum == carts.length) {
    this.setData({
      isAllSelect: true
    })
  } else {
    this.setData({
      isAllSelect: false
    })
  }
  this.setData({
    carts: carts
  })
  // 计算总金额方法
  this.getTotalPrice()
}
```
以上代码的逻辑是这样的：从视图层接收到index值，通过该值将对应的carts数组对象中的isSelect属性取反，实现选中和未选中状态的切换。通过定义selectNum来计算选中商品的品种，如果选中所有的品种，那么全选按钮就处于激活状态；如果没有选中所有的品种，则全选按钮处于未激活状态，最后重新调用计算总额的方法。<br>

下面是计算总额的方法，很简单，首先判断该商品是否被选中，然后商品的数量与价格互乘即可
```js
getTotalPrice() {
  let carts = this.data.carts; // 获取购物车列表
  let total = 0;
  for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
    if (carts[i].isSelect) { // 判断选中才会计算价格
      total += carts[i].count.quantity * carts[i].price; // 所有价格加起来
    }
  }
  this.setData({ // 最后赋值到data中渲染到页面
    carts: carts,
    totalMoney: total.toFixed(2)
  });
}
```

当然，商品的数量是动态的，我们通过一个方法接收视图层传递过来的index值以此来判断carts数组的下标；接收视图层传递过来的id值来判断是执行增加产品还是减少产品动作，此时对商品的减少动作得设置一个临界值，商品数量怎么说也不能为负值是吧，最后再重新计算商品总金额
```js
quantityChange(e) {
  const index = e.currentTarget.dataset.index;
  let carts = this.data.carts;
  let quantity = carts[index].count.quantity;
  if (e.target.id == 'sub') {
    if (quantity == 0) return
    quantity -= 1
  } else if (e.target.id == 'add') {
    quantity += 1
  }
  carts[index].count.quantity = quantity
  this.setData({
    carts: carts
  })
  this.getTotalPrice()
}
```

最后一个方法是全选，思路也是挺简单的，给当前全选状态值取反，然后将该全选状态值赋给carts数组中所有对象里的isSelect值，以此达到一个联动的效果
```js
selectAll(e) {
  let isAllSelect = this.data.isAllSelect; // 是否全选状态
  isAllSelect = !isAllSelect;
  let carts = this.data.carts;
  for (let i = 0; i < carts.length; i++) {
    carts[i].isSelect = isAllSelect; // 改变所有商品状态
  }
  this.setData({
    isAllSelect: isAllSelect,
    carts: carts
  });
  this.getTotalPrice(); // 重新获取总价
}
```

以上便是所有核心代码的一些思路分析。<br><br>


### 7.WXassess => [小程序实现星星评价功能](https://github.com/CruxF/WXsmallProgram/tree/master/WXassess?1545997291588)
这个功能在日常的开发也是比较常见，结合项目需要以及网上的一些代码实现了一个评价小demo，效果请看下图
![](https://github.com/CruxF/WXsmallProgram/blob/master/WXassess/images/showPro.jpg?raw=true)<br>

功能实现的思路：使用wx:for遍历循环N个区域，通过判断背景图数组中flag值来动态设置N个区域中背景图为哪一个
```html
<view class='star-wrap'>
  <view 
    class='star-item' 
    wx:for="{{stars}}" 
    wx:key="" 
    style='background:url("{{item.flag==1?item.lightImg:item.blackImg}}") no-repeat top;background-size:100%;' 
    data-index="{{index}}" 
    bindtap='starClick'
  >
  </view>
</view>
```

我们先来看看data中的数据，starDesc为初始评价文字，stars为背景图数组对象，assessLists为快捷评价文字
```js
data: {
  starDesc: '非常满意，无可挑剔',
  stars: [{
    lightImg: '/images/star_light.png',
    blackImg: '/images/star_black.png',
    flag: 1,
    message: '非常不满意，各方面都很差'
  }, {
    lightImg: '/images/star_light.png',
    blackImg: '/images/star_black.png',
    flag: 1,
    message: '不满意，比较差'
  }, {
    lightImg: '/images/star_light.png',
    blackImg: '/images/star_black.png',
    flag: 1,
    message: '一般，还要改善'
  }, {
    lightImg: '/images/star_light.png',
    blackImg: '/images/star_black.png',
    flag: 1,
    message: '比较满意，仍要改善'
  }, {
    lightImg: '/images/star_light.png',
    blackImg: '/images/star_black.png',
    flag: 1,
    message: '非常满意，无可挑剔'
  }],
  assessLists: ['意见很有帮助', '态度非常好', '非常敬业', '非常专业认真', '回复很及时', '耐心细致']
}
```

接下来是点击星星事件，思路是这样的：首先把所有区域的背景图设置为非点亮状态，然后再设置相对应数组下标区域以及数组下标前区域的背景图为点亮状态。
```js
starClick: function(e) {
  var that = this;
  for (var i = 0; i < that.data.stars.length; i++) {
    var allItem = 'stars[' + i + '].flag';
    that.setData({
      [allItem]: 2
    })
  }
  var index = e.currentTarget.dataset.index;
  for (var i = 0; i <= index; i++) {
    var item = 'stars[' + i + '].flag';
    that.setData({
      [item]: 1
    })
  }
  // 评价星星文字说明
  this.setData({
    starDesc: this.data.stars[index].message
  })
}
```

以上思路有点绕，这是其中一种方法，相信你们能想到更好的方法，欢迎前来交流交流。
