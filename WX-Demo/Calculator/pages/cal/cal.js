Page({
  // 数据集合，能够与wxml页面进行绑定
  data: {
    id1: "back",
    id2: "clear",
    id3: "negative",
    id4: "+",
    id5: "9",
    id6: "8",
    id7: "7",
    id8: "-",
    id9: "6",
    id10: "5",
    id11: "4",
    id12: "×",
    id13: "3",
    id14: "2",
    id15: "1",
    id16: "÷",
    id17: "0",
    id18: ".",
    id19: "history",
    id20: "=",
    screenData: "0", // 默认输出框结果
    lastIsOperator: false, // 最后一个输入字段是否为操作符
    arr: [], // 计算结果
    logs: [] // 历史列表
  },
  // 查看历史地址跳转
  history: function () {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  clickButton: function (event) {
    var id = event.target.id; // 得到当前元素的id值
    if (id == this.data.id1) { // 退格
      var data = this.data.screenData; // 得到当前输出框值
      if (data == 0) {
        return;
      }
      data = data.substring(0, data.length - 1); // substring() 方法用于提取字符串中介于两个指定下标之间的字符。
      // 退格临界值判断
      if (data == "" || data == "-") {
        data = 0;
      }
      // 为输出框赋值
      this.setData({ screenData: data });
      // 删除并返回数组最后一个元素
      this.data.arr.pop();
    } else if (id == this.data.id2) { // 清屏操作符
      this.setData({ screenData: "0" });
      this.data.arr.length = 0;
    } else if (id == this.data.id3) { // 正负号切换+/-
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }
      var firstWord = data.substring(0, 1);
      if (firstWord == "-") {
        data = data.substring(1, data.length);
        this.data.arr.shift();
      } else {
        data = "-" + data;
        this.data.arr.unshift("-");
      }
      this.setData({ screenData: data });
    } else if (id == this.data.id20) { // =操作符
      var data = this.data.screenData;
      if (data == 0) {
        return;
      }
      var lastWord = data.substring(data.length - 1, data.length);
      if (isNaN(lastWord)) {
        return;
      }
      var num = "";
      var lastOperator;
      var arr = this.data.arr;
      var optarr = [];
      for (var i in arr) {
        if (isNaN(arr[i]) == false || arr[i] == this.data.id18 || arr[i] == this.data.id3) {
          num += arr[i];
        } else {
          lastOperator = arr[i];
          optarr.push(num);
          optarr.push(arr[i]);
          num = "";
        }
      }
      optarr.push(Number(num));
      var result = Number(optarr[0]) * 1.0;
      for (var i = 1; i < optarr.length; i++) {
        if (isNaN(optarr[i])) {
          if (optarr[1] == this.data.id4) {
            result += Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id8) {
            result -= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id12) {
            result *= Number(optarr[i + 1]);
          } else if (optarr[1] == this.data.id16) {
            result /= Number(optarr[i + 1]);
          }
        }
      }
      this.data.logs.push(data + "=" + result);
      // 将所有操作结果集合(this.data.logs)保存在本地
      wx.setStorageSync('callogs', this.data.logs);
      this.data.arr.length = 0;
      this.data.arr.push(result);
      this.setData({ screenData: result + "" });
    } else {
      // 避免输入相连操作符
      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16) {
        if (this.data.lastIsOperator == true || this.data.screenData == 0) {
          return;
        }
      }
      var sd = this.data.screenData;
      var data;
      if (sd == 0) {
        data = id;
      } else {
        data = sd + id;
      }
      this.setData({ screenData: data });
      this.data.arr.push(id);
      if (id == this.data.id4 || id == this.data.id8 || id == this.data.id12 || id == this.data.id16) {
        this.setData({ lastIsOperator: true });
      } else {
        this.setData({ lastIsOperator: false });
      }
    }
  }
})