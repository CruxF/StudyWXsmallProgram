## 小程序尺寸单位与设计原则
在iPhone6中，假如设计稿icon图标的尺寸为32x28，那么在小程序中设置的单位则为32rpx `*` 28rpx，而不是32px `*` 28px，这是一种换算规则；假如在其他手机中，那么这种单位换算方式就不是这样了，会复杂很多。<br><br>


## 组件自适应宽度
我们在开发某些小组件的时候，往往要把默认display值为block的组件宽度设置为自适应，因为组件中的内容是动态的，那么该如何做呢？其实很简单，只要设置父元素的css为`display:inline-flex`
```css
.container {
  display: inline-flex;
  flex-direction: row;
  padding: 10rpx;
}
.container image {
  width: 32rpx;
  height: 28rpx;
}
.container text {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #bbb;
  position: relative;
  bottom: 12rpx;
  left: 8rpx;
}
```
假如我们把组件的宽度定死了，那么对组件中内容就必须要进行处理，比如9000可以显示为9k。组件宽度定死的好处就是数据发生变化时页面不会发生闪烁的情况。<br><br>



## 小程序组件开发流程(基础)
目前新版本的小程序有个很强大的功能，就是支持组件化开发，这就意味着开发人员能够节省大量的开发成本，毕竟只要开发一个组件，就能在多个模块中进行调用，那么下面就来介绍开发组件的基础步骤：
- 步骤一：新建一个Component
```
<!--components/like/index.wxml-->
<view bindtap='onLike' class='container'>
  <image src='images/like.png'></image>
  <text>{{count}}</text>
</view>
```
- 步骤二：调用该组件
```
// 在json文件中
{
  "usingComponents": {
    "v-like": "/components/like/index"
  }
}

// 在wxml文件中
<v-like />
```
那么组件的基础使用就是这么简单明了。<br><br>


## 小程序组件开发流程(进阶)
进阶的组件开发就是多了一些JS行为，下面请看定义组件的代码便能略知一二
```html
<!--components/like/index.wxml-->
<view bindtap='onLike' class='container'>
  <image src='{{like?yesSrc:noSrc}}'></image>
  <text>{{count}}</text>
</view>
```

组件样式代码
```css
/* components/like/index.wxss */

.container {
  display: inline-flex;
  flex-direction: row;
  padding: 10rpx;
}

.container image {
  width: 32rpx;
  height: 28rpx;
}

.container text {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #bbb;
  position: relative;
  bottom: 12rpx;
  left: 8rpx;
}
```

组件数据处理代码
```js
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
      let like = this.properties.like
      let count = this.properties.count

      count = like ? count - 1 : count + 1
      this.setData({
        count: count,
        like: !like
      })
    }
  }
})
```

组件配置文件
```json
{
  "component": true,
  "usingComponents": {}
}
```

以上是定义一个组件的代码，下面是调用者的代码，首先要在json文件中将组件引入进来
```js
{
  "usingComponents": {
    "v-like": "/components/like/index"
  }
}
```

接着在视图层需要传递相关参数
```html
<!--pages/classic/classic.wxml-->
<v-like like="{{classic.like_status}}" count="{{classic.fav_nums}}" />
```

下面是相关的脚本代码，该代码在封装一个HTTP请求里面有详细的介绍，往下看就对了
```js
import {ClassicModel} from '../../models/classic.js'
let classic = new ClassicModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classic: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classic.getLatest(res=>{
      this.setData({
        classic: res
      })
    })
  }
})
```
<br><br>


## 小程序组件开发流程(天秀))
以上的组件都有一个十分致命的问题：在静态效果中，这是没错的，然而在和服务器端进行数据交互的时候，我们该如何判断喜欢的是哪些内容？取消喜欢的又是哪些内容？同时我们又得将该页面的喜欢/不喜欢的值传给服务器进行保存，而不影响其他页面的相同组件。这种业务代码我们该如何书写呢？<br>

为了解决上面的问题，就涉及到了组件粒度的问题，意思就是我们需要将组件公共的业务逻辑和独立的业务逻辑给区分开来，确保组件的通用性，下面我们来看组件代码
```html
<!--components/like/index.wxml-->
<view bindtap='onLike' class='container'>
  <image src='{{like?yesSrc:noSrc}}'></image>
  <text>{{count}}</text>
</view>

// json配置文件
{
  "component": true,
  "usingComponents": {}
}

/* components/like/index.wxss */
.container {
  display: inline-flex;
  flex-direction: row;
  padding: 10rpx;
  width: 90rpx;
}
.container image {
  width: 32rpx;
  height: 28rpx;
}
.container text {
  font-size: 24rpx;
  line-height: 24rpx;
  color: #bbb;
  position: relative;
  bottom: 12rpx;
  left: 8rpx;
}
```

下面是最为核心的组件代码，涉及到了一个新知识——自定义事件：在组件中当触发onLike事件时，那么就会把like这个自定义事件传递出去，并且带上behavior参数
```js
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
```

谈完了组件的代码，下面我们来看看调用组件视图层的代码，首先是结构和json配置代码
```html
<!--pages/classic/classic.wxml-->
<v-like bind:like="onLike" like="{{classic.like_status}}" count="{{classic.fav_nums}}" />

// json配置文件
{
  "usingComponents": {
    "v-like": "/components/like/index"
  }
}
```

下面是调用组件的业务代码，其中核心的与服务器做交互的被拆分出来了，至于如何拆分的请看下面的“封装一个HTTP请求”系列
```js
import { ClassicModel } from '../../models/classic.js'
import { LikeModel } from '../../models/like.js'
let classicModel = new ClassicModel()
let likeModel = new LikeModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classic: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classicModel.getLatest(res=>{
      console.log(res)
      this.setData({
        classic: res
      })
    })
  },
  // 喜欢或者不喜欢
  onLike: function(e) {
    let behavior = e.detail.behavior
    likeModel.like(behavior, this.data.classic.id,this.data.classic.type)
  }
})
```

接着是核心的与服务器做交互代码
```js
import {
  HTTP
} from '../utils/http.js'
class LikeModel extends HTTP {
  like(behavior, artID, category) {
    let url = behavior == 'like' ? 'like' : 'like/cancel'
    this.request({
      url: url,
      method: 'POST',
      data: {
        art_id: artID,
        type: category
      }
    })
  }
}
export {
  LikeModel
}
```
关于封装好的公共http请求处理方法可以往下看“封装一个HTTP请求”系列，参数的传递可以来看[接口文档](https://bl.7yue.pro/dev/index.html)


## const相关知识
只要不改变const变量的内存地址，那么就不会报错。意思就是：当const单纯定义一个变量时，那么该变量就不能变动，否则会报错；当const定义一个对象变量时，那么能够改变变量内属性的值。


## 封装一个HTTP请求(基础)
### 前言
像我这样的菜鸟在开发项目的时候，往往不懂得如何去封装一些公共方法使开发更加便捷与优雅，导致慢慢的对代码失去些热情，还好及时意识到 **“要想学得更快和更多，首先得学会付出——花钱”**。趁年轻，好好花钱投资自己的头脑，这永远也不亏！

### 开发步骤
首先我们需要创建一个工具库函数，用来存放可能会改变的变量，比如域名以及appkey什么的
```js
// 文件地址和文件名：config.js
const config = {
  api_base_url: 'http://bl.***.pro/v1/',
  appkey: ''
}
export {
  config
}
```

接下来这个是重头戏，使用一个类，封装了公共的HTTP请求方法，并且定义了公共的错误处理函数。在HTTP请求方法中，当访问成功的时候会利用回调函数把数据返回到特定的Page对象中
```js
// 文件名和地址：utils/http.js
import {
  config
} from '../config.js'
// 错误提示
const tips = {
  1: '抱歉，出现了一个未知错误',
  1005: 'appkey无效，请前往www.***.pro申请',
  3000: '期刊不存在'
}

class HTTP {
  // 网络请求函数
  request(params) {
    if (!params.method) {
      params.method = 'GET'
    }
    wx.request({
      url: config.api_base_url + params.url,
      method: params.method,
      data: params.data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      success: (res) => {
        let code = res.statusCode.toString()
        // 判断状态码是否以2开头
        if (code.startsWith('2')) {
          // 判断调用方是否有回调函数
          params.success && params.success(res.data)
        } else {
          let error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      fail: (err) => {
        this._show_error(1)
      }
    })
  }

  // 错误处理函数
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    wx.showToast({
      title: tips[error_code],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}
```

最后我们再来调用这个公共的HTTP请求方法
```js
// 文件名和地址：pages/classic/classic.js
import {HTTP} from '../../utils/http.js'
let http = new HTTP()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.request({
      url:'classic/latest',
      success:(res)=>{
        console.log(res)
      }
    })
  }
})
```
通过以上对一个HTTP请求方法的封装，我们在编写代码就能省非常多的力气，并且使代码更加容易维护和高大上。


## 更加优雅的HTTP请求封装
以上对HTTP请求的封装可以说是很优雅了，现在还能把将其变得更优雅，那就是把业务代码拆分出来，下面看代码
```js
// 文件名和地址：models/classic.js
import {
  HTTP
} from '../utils/http.js'

// 类ClassicModel继承了类HTTP，因此自动有request方法
class ClassicModel extends HTTP {
  getLatest(sCallback) {
    this.request({
      url: 'classic/latest',
      success: (res) => {
        sCallback(res)
      }
    })
  }
}

export {
  ClassicModel
}
```
最后在视图层对应的js文件中只要如此调用即可，这种开发方式能够大大的提高工作效率
```js
// 文件名和地址：pages/classic/classic.js
import {ClassicModel} from '../../models/classic.js'
let classic = new ClassicModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    classic.getLatest(res=>{
      console.log(res)
    })
  }
})
```


## 使用Promise实现HTTP请求的方法封装
上面提到的封装HTTP请求方法返回数据时都使用了回调函数，其实当我们将这种运用在其他项目(比如Vue)中，那么就会出现问题，并且上面回调函数式的封装方法相对于promise式来说维护性和阅读性要低上一筹。好了，废话不多说，下面直接看代码
```js
import {
  config
} from '../config.js'

const tips = {
  1: '抱歉，出现了一个错误',
  1005: 'appkey无效，请前往www.7yue.pro申请',
  3000: '期刊不存在'
}
// # 解构
class HTTP {
  request({url, data = {}, method = 'GET'}) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }
  _request(url, resolve, reject, data = {}, method = 'GET') {
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'appkey': config.appkey
      },
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          reject()
          const error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      fail: (err) => {
        reject()
        this._show_error(1)
      }
    })
  }
  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }
    const tip = tips[error_code]
    wx.showToast({
      title: tip ? tip : tips[1],
      icon: 'none',
      duration: 2000
    })
  }
}

export {
  HTTP
}
```

封装好HTTP请求方法后，那么我们就在业务代码中进行调用
```js
import {
  HTTP
} from '../utils/httpp.js'

class BookModel extends HTTP {
  getHotList() {
    return this.request({
      url: 'book/hot_list'
    })
  }
  getMyBookCount() {
    return this.request({
      url: '/book/favor/count'
    })
  }
}

export {
  BookModel
}
```

最后我们在视图层代码中取到返回的数据即可
```js
// pages/book/book.js
import {
  BookModel
} from '../../models/book.js'
const bookModel = new BookModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    bookModel.getHotList().then(res => {
      this.setData({
        books: res
      })
    })
  }
})
```

## 自定义组件中observer函数的应用
在开发自定义组件时，我们有时候需要对从服务器返回来的数据进行二次处理，那么该如何做呢？请看下面的代码
```js
// components/epsoide/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      observer:function(newVal,oldVal,changedPath){
        let val = newVal<10?'0'+newVal:newVal
        // 永远不要在observer中修改自身属性值，否则会出现无限递归调用
        // 因为这样的话newVal和oldVal的值会永远都在变化，从而导致内存溢出
        this.setData({
          _index:val
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: { 
    year:0,
    month: '',
    _index:''
  },
  attached:function(){

  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
```


## 组件的Behavior行为
在组件中，其实也经常存在许多相同的对象、方法以及变量。假如每写一个组件，就要重新定义，那岂不是麻烦的一批，因此Behavior这个对象就出现了。它的作用就是实现组件内的代码复用，俗称继承。下面我们来定义一个公共的behavior组件
```js
const classicBeh = Behavior({
  properties: {
    img: String,
    content: String
  },
  attached: function() {

  },
  data: {

  },
  methods: {

  }
})

export {
  classicBeh
}
```

接着我们在组件中这么来使用即可
```js
// components/classic/movie/index.js
import { classicBeh } from '../classic-beh.js'

Component({
  /**
   * 组件的属性列表 
   */
  // 多继承
  behaviors: [classicBeh],
  properties: {
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

  }
})

```


## 缓存对于改善用户体验的作用
在前端开发中，我们往往会为了程序性能和用户体验而降低对服务器重复数据的请求。在该项目中，缓存的实现方式是首先自定义一个保存key的方法
```js
// 设置缓存数据的key
_getKey(index) {
  let key = 'classic-' + index
  return key
}
```

然后再请求数据的时候调用该方法，并将请求回来的数据保存在本地，那么下次发起请求的时候，假如在本地找到该数据，那么就调用本地的数据，而不是仍然去请求服务器，这种技术大大节约了服务器的成本，并且提高了用户体验。
```js
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
```

以上就是一些简单的分析，但是我们需要留意的是，在页面某个部分的内容或者状态需要时不时请求服务器的数据千万不能一起加入到缓存中，而是应该把该部分数据给抽离出来使用，更具体的请看该项目的实战视频。


## 如何让自定义组件支持hidden
由于部分组件是经常需要根据条件切换显示的，此时就涉及到了一个问题：到底是使用wx:if还是hidden？官方文档中有了很好的说明：wx：if 有更高的切换消耗，而hidden有更高的初始渲染消耗。<br>

显然，需要频繁执行显示或隐藏的组件使用hidden；不频繁执行或显示的组件那么就使用wx:if。然而，此时又有问题来了，单纯使用hidden在组件中并没有效果，因为组件将其当做一个属性来处理了
```html
<!--pages/classic/classic.wxml-->
<view class='container'>
  <view class='header'>
    <v-epsoide class="epsoide" index="{{classic.index}}" />
    <v-like class="like" bind:like="onLike" like="{{likeStatus}}" count="{{likeCount}}" />
  </view>
  <v-movie hidden="{{true}}" img="{{classic.image}}" content="{{classic.content}}" />
  <v-navi bind:left="onNext" bind:right="onPrevious" title="{{classic.title}}" first="{{first}}" latest="{{latest}}" class="navi" />
</view>
```

如果要让hidden在组件中有效的话，那么我们就需要在源头上新增一个属性
```html
<!--components/classic/movie/index.wxml-->
<view hidden="{{hidden}}" class='classic-container'>
  <image class='classic-img' src='{{img}}'></image>
  <image class='tag' src='images/movie@tag.png'></image>
  <text class='content'>{{content}}</text>
</view>
```
js文件
```js
// components/classic/movie/index.js
import { classicBeh } from '../classic-beh.js'
Component({
  /**
   * 组件的属性列表 
   */
  // 多继承
  behaviors: [classicBeh],
  properties: {
    hidden: Boolean
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

  }
})

```

延伸一个知识点：在使用hidden的组件中无法触发detached这个生命周期函数，然而使用wx:if的组件能够触发。


## 组件复用共同样式
有时候我们开发的组件样式是一毛一样的，那么我们就能够在components文件夹中创建公共的wxss文件
```css
.classic-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.classic-img {
  width: 750rpx;
  height: 500rpx;
}

.tag {
  position: relative;
  right: 310rpx;
  bottom: 58rpx;
  width: 46rpx;
  height: 142rpx;
}

.content {
  font-size: 36rpx;
  max-width: 550rpx;
}
```

然后我们就能够在多个组件中进行复用
```css
/* components/classic/movie/index.wxss */
@import "../common.wxss";


/* components/classic/essay/index.wxss */
@import "../common.wxss";
```


## airbnb编码规范
这是很重要的一个编码开发规范，在日常的开发中我们应该学习并遵守这种规范，学习请[前往这里](https://github.com/yuche/javascript)<br>



## 回调函数、Promise与async和await


## Promise的本质与用法
基础用法：进行中、已成功、已失败
```js
const promise = new Promise((resolve,reject)=>{
  wx.getSystemInfo({
    success:(res)=>{
      resolve(res)
    },
    fail:(error)=>{
      reject(res)
    }
  })
})
promise.then((res)=>{
  console.log(res)
},(error)=>{
  console.log(error)
})
```

错误用法：我们往往会习惯性把promise当做回调函数来使用，就像是下面的代码
```js
const hotList = bookModel.getHotList()
hotList.then(res=>{
  console.log(res)
  bookModel.getMyBookCount().then(res=>{
    console.log(res)
    bookModel.getMyBookCount().then(res=>{
      console.log(res)
    })
  })
})
```

正确的用法：
```js
bookModel.getHotList().then(res=>{
  console.log(res)
  return bookModel.getMyBookCount()
}).then(res=>{
  console.log(res)
  return bookModel.getMyBookCount()
}).then(res=>{
  console.log(res)
})
```


## wx:key的使用规则
首先我们来看看什么是wx:key，官方的解释是这样的：
> 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 <input/> 中的输入内容，<switch/> 的选中状态），需要使用 wx:key 来指定列表中项目的唯一的标识符。<br>

以上的意思总结下来有以下两点
- 如果不加 wx:key, 在 setData 之后，如果 array 内的数据如果发生改变，会重新创建前端的渲染对象
- 加上 wx:key，重新渲染时，只是将对应的对象重新排序。未发生变化的对象，不会重新创建

在使用的时候也有两种方式
- wx:key="字符串"：这个”字符串”代表在 for 循环的 array 中 item 的某个“属性”，该“属性” 的值需要是列表中唯一的字符串或数字，且不能动态改变。用于被遍历的组件需要多个属性的时候。
```js
data: {
  input_data: [
    { id: 1, unique: "unique1" },
    { id: 2, unique: "unique2" },
    { id: 3, unique: "unique3" },
    { id: 4, unique: "unique4" },
  ]
}

<input value="id:{{item.id}}"   wx:for="{{input_data}}"  wx:key="unique"  />
```

- wx:key="*this"：保留关键字”*this”代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字，用于组件仅需要一个属性，且属性值唯一。
```js
data: {
  numberArray: [1, 2, 3, 4],
  stringArray:['aaa','ccc','fff','good']
}

<input value="id:{{ item }}"   wx:for="{{numberArray}}"  wx:key="*this"  />
<input value="id:{{ item }}"   wx:for="{{stringArray}}"  wx:key="*this"  />
```


## 三种小程序编译模式
- 普通编译：当代码保存的时候，页面自动刷新，并且渲染页面为app.json文件定义的第一个页面地址
- 添加编译模式：这是一种自定义编译模式，意思就是设置当代码保存时，渲染的页面为哪一个，并且还能传参数，下面是一个模板
```
模式名称：book-detail
启动页面：pages/book-detail/book-detail
启动参数：bid=1120
进入场景：
```
- 通过二维码编译：


## 组件设计思想：slot插槽的使用
插槽的出现大大增强了组件的灵活性，因为它是从外部决定该组件是否具有某个元素节点。在组件内部定义了一个插槽，如果外部并没有传相关的元素进来的话，那么该插槽就不会被调用。换句话就是插槽是为外部传递过来的元素提供一个存放空间，它的使用步骤如下
- 在组件的js文件中启用插槽功能
```js
// 启用插槽
options: {
  multipleSlots: true,
},
// 组件的属性列表
properties: {
  text: String
},
```
- 在组件中定义该插槽
```html
<view class="container">
  <slot name="before"></slot>
  <text >{{text}}</text>
  <slot name="after"></slot>
</view>
```
- 调用该组件时传递相关数据，插槽启用，否则插槽不启用。有个点需要注意：就是插槽的样式是需要在外部定义的。
```html
<v-tag text="{{item.content}}">
  <text class="num" slot="after">{{'+'+item.nums}}</text>
</v-tag>
```


## 自定义组件样式探讨(hack方式)
在微信小程序中，一般分为两种组件：自定义组件和内置组件(view text image)。通常我们无法在外部简单的修改组件的样式，因为我们默认的想法是组件的结构应该是如下的
```html
<view class="container">
  <slot name="before"></slot>
  <text >{{text}}</text>
  <slot name="after"></slot>
</view>
```
而未想过组件的结构也可以是这样的
```html
<slot name="before"></slot>
<text >{{text}}</text>
<slot name="after"></slot>
```

因此这样就导致了如下修改组件样式失败(备注：v-tag是一个自定义组件)
```css
.comment-container > v-tag:nth-child(1) {
  background-color: #fffbdd;
}
.comment-container > v-tag:nth-child(2) {
    background-color: #eefbff;
}
```

那么该如何霸道的在外部修改自定义组件的样式呢？很简单，进一步确定要修改的自定义组件中的结构元素，比如：
```css
.comment-container > v-tag:nth-child(1) > view {
  background-color: #fffbdd;
}
.comment-container > v-tag:nth-child(2) > view {
  background-color: #eefbff;
}
```


## 自定义组件样式探讨(外部样式)
使用hack方式在改写组件内部样式其实是违反了组件封装性的原则，下面我们可以使用向插槽那样的方式，将外部的样式代码传入进来，下面看看开发步骤
- 在组件的js文件中定义一个接收类名
```js
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
```
- 在组件中添加这个类名
```html
<view class="container tag-class">
  <slot name="before"></slot>
  <text >{{text}}</text>
  <slot name="after"></slot>
</view>
```
- 在外部文件中定义一个类的样式
```css
.ex-tag {
  background-color: #fffbdd;
}
```
- 将外部文件中的样式代码传入到组件中
```html
<v-tag text="{{item.content}}" tag-class="ex-tag">
  <text class="num" slot="after">{{'+'+item.nums}}</text>
</v-tag>
```

备注：在如今的版本的微信小程序，以上代码是不能达到如期效果的，原因就是组件中类名靠后的样式代码并不会覆盖靠前的类名的样式，要解决这个目前，目前只有增加权重这个方法，或者在组件中新增一个view包裹层
```css
.ex-tag {
  background-color: #fffbdd !important;
}
```



## 微信小程序多条件的判断书写
```html
<view :class="{{index==0?'ex-tag1':'' || index==1?'ex-tag2':''}}"></view>
```


## wxs的概念和应用
概念：WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。wxs的出现使得在WXML的文件中能够调用函数去处理数据，下面来看简单的开发流程
- 首先定义一个wxs文件
```js
var format = function(text) {
  return '432324'
}

module.exports = {
  format:format
}
```
- 然后我们在WXML文件中进行调用
```html
<wxs src="../../utils/filter.wxs" module="util" />
<view class='container'>
  <view class="sub-container">
    <text class="headline">内容简介</text>
    <text class="content">{{util.format(book.summary)}}</text>
  </view>
</view>
```


## 在wxml中编写wxs代码
我们除了能够在外部定义一个wxs文件，同时也能够在wxml中定义。其实这就像是JavaScript在html文件中的使用方式一样，下面直接看代码
```html
<wxs src="../../util/filter.wxs" module="util" />
<view class="posting-container" wx:if="{{posting}}">
  <text class="headline">内容简介</text>
  <text class="content" decode="{{true}}">{{util.format(book.summary)}}</text>
  <view class="comment-container">
    <block wx:for="{{util.limit(comments, 3)}}" wx:key="content">
      <v-tag bind:tapping="onPost" tag-class="{{tool.highlight(index)}}" text="{{item.content}}">
        <text class="num" slot="after">{{'+'+item.nums}}</text>
      </v-tag>
    </block>
  </view>
  <input bindconfirm="onPost" class="post" placeholder='短评最多12个字'></input>
</view>

<wxs module="tool">
  var highlight = function(index) {
    if (index == 0) {
      return 'ex-tag1'
    }
    if (index == 1) {
      return 'ex-tag2'
    }
    return ''
  }
  module.exports = {
    highlight: highlight
  }
</wxs>
```


## 并行请求和串行请求
有时候我们会在同一个页面同时请求N个接口，一般情况下惯性使用串行的请求，如下代码
```js
onLoad: function(options) {
  const bid = options.bid
  const detail = bookModel.getDetail(bid)
  const comments = bookModel.getComments(bid)
  const likeStatus = bookModel.getLikeStatus(bid)
  // 具体书籍数据
  detail.then(res => {
    this.setData({
      book: res
    })
  })
  // 具体本书籍评论
  comments.then(res => {
    this.setData({
      comments: res.comments
    })
  })
  // 具体书籍点赞状态和数量
  likeStatus.then(res => {
    this.setData({
      likeStatus: res.like_status,
      likeCount: res.fav_nums
    })
  })
}
```

这种串行的请求有些不足地方，比如我们在加载这些数据之前会有一个加载条，等全部数据加载完毕后，那么这个加载条才会消失。这时候问题就来了：我们如何判断什么时候隐藏加载条？不能因为加载了一部分数据就把加载条隐藏掉，不能在最后执行隐藏加载条的行为，因为请求是异步的。该如何来解决这个问题呢？此时Promise.all登场了<br>

Promise.all能够一次性请求N个接口，只有当所有数据返回之后才执行then方法，这一过程是并行的（意思就是获取数据的时间取最长的值），并且返回来的这些数据是按照顺序出现的，因此，我们就能够对以上代码做一次修改
```js
onLoad: function(options) {
  // 出现加载条
  wx.showLoading()
  const bid = options.bid
  const detail = bookModel.getDetail(bid)
  const comments = bookModel.getComments(bid)
  const likeStatus = bookModel.getLikeStatus(bid)
  Promise.all([detail, comments, likeStatus]).then(res => {
    this.setData({
      book: res[0],
      comments: res[1].comments,
      likeStatus: res[2].like_status,
      likeCount: res[2].fav_nums
    })
    // 关闭加载条
    wx.hideLoading()
  })
}
```


## 父组件向子组件发布一个事件
有这么一个业务场景：在视图层中，调用了一个下拉能加载更多的数据的组件，那么我们可能会想到在组件内定义该滚动触底事件（onReachBottom），然而此时问题来了，该事件只能在视图层中被触发，该怎么办呢？很简单，让组件监听到调用组件的视图层的onReachBottom事件被触发就好了。下面请看视图层的源码
```js
// 视图层WXML
<v-search more="{{more}}" bind:cancel="onCancel" wx:if="{{searching}}" />

// 视图层JS文件
import {
  BookModel
} from '../../models/book.js'
import {
  random
} from '../../utils/common.js'
const bookModel = new BookModel()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching: false,
    more: '' // 该值必须是随机的、不同的，否则组件内的observer函数无法持续被触发
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取热门书籍
    bookModel.getHotList().then(res => {
      this.setData({
        books: res
      })
    })
  },
  // 滚动触底触发事件
  onReachBottom() {
    this.setData({
      more: random(16)
    })
  }
})
```

最后是组件的源码
```js
// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword.js'
import {
  BookModel
} from '../../models/book.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()
Component({
  /**
   * 组件的属性列表
   */
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
    dataArray: [],
    searching: false,
    q: ''
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
      console.log(123)
    }
  }
})
```
 

## 使用锁的概念解决重复加载数据问题
锁在该项目的意思就是：当前一个请求没有执行完毕的时候，下一个请求无法触发，做到了一次只发送一个请求，避免了发送重复请求的bug。“锁”这个词听上去好像很高大上，其实就是纸老虎，下面直接看源码
```js
// components/search/index.js
import {
  KeywordModel
} from '../../models/keyword.js'
import {
  BookModel
} from '../../models/book.js'
const keywordModel = new KeywordModel()
const bookModel = new BookModel()
Component({
  /**
   * 组件的属性列表
   */
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
    dataArray: [],
    searching: false,
    q: '',
    loading: false
  },

  // 在组件实例进入页面节点树时执行
  attached() {
    // 获取历史搜索结果
    this.setData({
      historyWords: keywordModel.getHistory()
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 加载更多书籍数据
    loadMore() {
      console.log(123)
      if(!this.data.q) {
        return false
      }
      // 锁是否为true
      if (this.data.loading) { 
        return false
      }
      const length = this.data.dataArray.length
      // 加锁
      this.data.loading = true
      bookModel.search(length, this.data.q).then(res=>{
        // 旧书籍数据+新书籍数据
        const tempArray = this.data.dataArray.concat(res.books)
        this.setData({
          dataArray: tempArray
        })
        // 解锁
        this.data.loading = false
      })
    }
  }
})
```


## 组件行为逻辑抽象
在复用性很强的功能上，我们可以将通用的业务代码给抽离出来。比如上面的搜索功能的分页业务代码，我们能够将其的数据和方法封装起来进行调用，下面我们看开发步骤：
- 创建公共的behaviors
```js
const paginationBev = Behavior({
  data: {
    dataArray: [], // 分页数据
    total: 0 // 数据的总量
  },
  methods: {
    // 分页数据(不断加载)
    setMoreData(dataArray) {
      const tempArray = this.data.dataArray.concat(dataArray)
      this.setData({
        dataArray: tempArray
      })
    },
    // 得到当前分页数据集合的长度
    getCurrentStart() {
      return this.data.dataArray.length
    },
    // 设置分页总数量
    setTotal(total) {
      this.data.total = total
    },
    // 是否含有更多的数据需要加载
    hasMore() {
      if (this.data.dataArray.length >= this.data.total) {
        return false
      } else {
        return true
      }
    },
    // 清空分页数据集合
    initialize() {
      this.data.dataArray = []
      this.data.total = 0
    }
  }
})

export {
  paginationBev
}
```

- 调用封装好的业务代码
```js
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
    loading: false
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
      if (this.data.loading) {
        return false
      }
      // 是否存在更多数据
      if (this.hasMore()) {
        bookModel.search(this.getCurrentStart(), this.data.q).then(res => {
          this.setMoreData(res.books)
          this.data.loading = false
        })
      }
    },
    // 取消搜索事件
    onCancel(event) {
      this.triggerEvent('cancel', {}, {})
    },
    // 搜索框触发事件
    onConfirm(event) {
      this.setData({
        searching: true
      })
      this.initialize()
      const q = event.detail.value || event.detail.text
      // 绑定数据到搜索输入框
      this.setData({
        q
      })
      bookModel.search(0, q).then(res => {
        this.setMoreData(res.books)
        this.setTotal(res.total)
        keywordModel.addToHistory(q)
      })
    },
    // 清空搜索框内容
    onDelete(event) {
      this.initialize()
      this.setData({
        searching: false,
        q: ''
      })
    }
  }
})
```


## 自定义button实现获取用户信息
在新版的微信小程序开发中，我们无法直接调用wx.getUserInfo()来获取用户信息。使用该接口将不再出现授权弹窗，需要使用<button open-type="getUserInfo"></button> 引导用户主动进行授权操作。然而使用这个的话，那么授权的按钮就限定死在buttn这个组件中，而无法将该事件绑定在image或者其他组件上，为了解决这个问题，我们需要重新自定义一个button组件，下面请看开发步骤：
