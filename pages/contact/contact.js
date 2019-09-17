// pages/contact/contact.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: `${app.globalData.requestUrl}/about`,
      method: 'POST',
      success: res => {
        this.setData({
          information: res.data.data
        })
      }
    })
  },
  //地图
  map: function () {
    let information = this.data.information
    wx.openLocation({
      latitude: parseFloat(information.latitude),
      longitude: parseFloat(information.longitude),
      name: '润福宁食品批发中心',
      address: information.address,
      scale: 28
    })
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })
  },
  //调起电话
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.information.phone
    })
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
  },
})