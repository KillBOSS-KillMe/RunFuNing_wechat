// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    orderNum: [],
    confirm: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1下单 -- 代发货
    // 2收货 -- 
    // 3已经收货
    // 4售后
    this.setData({
      options: options,
      imgUrl: app.globalData.imgUrl
    })
    var that = this
    wx.request({
      url: `${app.globalData.requestUrl}/Order/order_details`,
      method: 'POST',
      data: {
        orderNum: options.order
      },
      success: function (res) {
        console.log(res)
        that.setData({
          orderList: res.data.data,
          orderNum: options.order,
          str: options.str
        })
      }
    })
  },
  goback() {
    wx.navigateBack({
      delta: 1
    })
  },
  //确认订单
  confirmOrder() {
    var that = this
    wx.request({
      url: `${app.globalData.requestUrl}/Order/receive`,
      method: 'POST',
      data: {
        orderNum: this.data.orderNum
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '确认订单成功',
        })
        wx.navigateBack({
          delta: 1
        })
        that.setData({
          confirm: false
        })
      }
    })
  },
  //删除订单
  delOrder(e) {
    var index = e.currentTarget.dataset.index
    var that = this
    var orderList = this.data.orderList
    wx.request({
      url: `${app.globalData.requestUrl}/Order/del_order`,
      method: 'POST',
      data: {
        orderNum: this.data.orderNum
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '删除订单成功',
        })
        wx.navigateBack({
          detla: 1
        })
        that.setData({
          orderList: orderList
        })
      }
    })
  },
  shouhou() {
    let options = this.data.options
    let str = 1
    if (options.str == 3) {
      str = 1
    } else {
      str = 2
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Order/service`,
      method: 'POST',
      data: {
        orderNum: options.order,
        status: str
      },
      success: res => {
        if (res.data.code == 1) {
          if (options.str == 3) {
            options['str'] = 4
          } else {
            options['str'] = 3
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'success'
          });
          this.setData({
            options: options
          })
        }
        
      }
    })
  },
})