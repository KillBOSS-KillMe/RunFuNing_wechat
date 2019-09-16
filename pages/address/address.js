// pages/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    talks_1:[],
    talks_2: [],
    talks_3: [],
    talks_4: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  talks_1: function (e) {
    this.setData({
      talks_1: e.detail.value
    })
  },
  talks_2: function (e) {
    this.setData({
      talks_2: e.detail.value
    })
  },
  talks_3: function (e) {
    this.setData({
      talks_3: e.detail.value
    })
  },
  talks_4: function (e) {
    this.setData({
      talks_4: e.detail.value
    })
  },
  addAddress(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.talks_2.length == 0) {
      wx.showToast({
        title: '输入的手机号为空',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (this.data.talks_2.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.talks_2)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else {
      wx.showToast({
        title: '填写正确',
        icon: 'success',
        duration: 1500
      })
      wx.request({
        url: 'https://shu.beaconway.cn/address_insert',
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          uid: app.globalData.userInfo.id,
          consignee: this.data.talks_1,
          phone: this.data.talks_2,
          shopname: this.data.talks_3,
          address: this.data.talks_4
        },
        success: function (res) {
          wx.navigateBack({
            
          })
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})