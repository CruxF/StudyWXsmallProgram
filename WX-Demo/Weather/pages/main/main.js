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
      // 当天天气
      var weatherData = data.currentWeather[0];
      // 当天-未来三天天气
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