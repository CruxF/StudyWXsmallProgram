const paginationBev = Behavior({
  data: {
    dataArray: [], // 分页数据
    total: null, // 数据的总量
    noneResult: false, // 没有搜索结果
    loading: false // 锁值与动画状态
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
      if (total == 0) {
        this.setData({
          noneResult: true
        })
      }
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
      this.setData({
        dataArray: [],
        noneResult: false,
        loading: false
      })
      this.data.total = null
    },
    // 判断是否存在锁
    isLocked() {
      return this.data.loading ? true : false
    },
    // 加锁
    locked() {
      this.setData({
        loading: true
      })
    },
    // 解锁
    unLocked() {
      this.setData({
        loading: false
      })
    }
  }
})

export {
  paginationBev
}