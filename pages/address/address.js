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
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (this.data.talks_2.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!myreg.test(this.data.talks_2)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      wx.showToast({
        title: '数据提交中...',
        icon: 'loading'
      })
      wx.request({
        url: `${app.globalData.requestUrl}/address_insert`,
        method: 'POST',
        data: {
          uid: app.globalData.userInfo.id,
          consignee: this.data.talks_1,
          phone: this.data.talks_2,
          shopname: this.data.talks_3,
          address: this.data.talks_4
        },
        success: function (res) {
          wx.hideToast()
          wx.navigateBack({
            
          })
        }
      })
    }
    
  },
})