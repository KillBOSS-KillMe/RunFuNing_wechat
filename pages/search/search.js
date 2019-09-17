// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchName: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl
    })
  },
  detail(e) {
    let index = e.currentTarget.dataset.index
    let node = this.data.goodsArr[index]
    let data = `longimg=${node.longimg}&id=${node.id}&img=${node.img}&price=${node.price}&spec=${node.spec}&iscar=${node.iscar}`
    wx.navigateTo({
      url: `/pages/detail/detail?${data}`
    })
  },
  getSearchNum(e) {
    this.setData({
      searchName: e.detail.value
    })
    this.runSearch()
  },
  runSearch() {
    let searchName = this.data.searchName
    if (searchName == '') {
      // wx.showToast({
      //   title: '请输入搜索内容',
      //   icon: 'loading'
      // });
      return false
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Good/search`,
      method: 'POST',
      data: {
        uid: this.data.userInfo.id,
        info: searchName
      },
      success: res => {
        wx.hideToast()
        if (res.data.code == 1) {
          var goodsList = res.data.data;
          if (goodsList.length > 0) {
            this.setData({
              goodsArr: goodsList
            })
          } else {
            wx.showToast({
              title: '未搜索到商品',
              icon: 'none',
              duration: 2000
            });
          }
        } else {
          wx.showToast({
            title: '未搜索到商品',
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  
  numDown(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    if (node.car_num == 0) {
      return false
    }
    node['car_num'] = node.car_num - 1
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  numUp(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    node['car_num'] = node.car_num + 1
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  getNum(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    let num  = e.detail.value
    node['car_num'] = num
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  // 进入搜索页面
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  addShopcar(node){
    wx.showToast({
      title: '正在更改购物车数据',
      icon: 'loading'
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        goods_id: node.id,
        num: node.car_num,
        spec: node.spec,
        price: node.price,
        img: node.img,
      },
      success: res => {
        wx.hideToast()
      }
    })
  }
})