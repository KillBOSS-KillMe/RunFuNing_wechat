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
  },
  runSearch() {
    let searchName = this.data.searchName
    if (searchName == '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'loading'
      });
      return false
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Good/search`,
      method: 'POST',
      data: {
        info: searchName
      },
      success: res => {
        wx.hideToast()
        if (res.data.code == 1) {
          var goodsList = res.data.data;
          if (goodsList.length > 0) {
            for (let i = 0; i < goodsList.length; i++) {
              goodsList[i]['num'] = 0
            }
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
  }
})