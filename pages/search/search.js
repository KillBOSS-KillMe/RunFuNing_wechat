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
      url: `http://shu.beaconway.cn/Good/search`,
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
              list: goodsList
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