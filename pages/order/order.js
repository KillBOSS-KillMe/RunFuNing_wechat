// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    orderNum:[],
    confirm:true,
    str: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      str: options.str
    })
    var that = this
    wx.request({
      url: `${app.globalData.requestUrl}/Order/order_details`,
      method: 'POST',
      data:{
        orderNum:options.order
      },
      success:function(res){
          that.setData({
            orderList: res.data.data,
            orderNum: options.order,
            str:options.str
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
          delta:1
        })
        that.setData({
          confirm:false
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
          detla:1
        })
        that.setData({
          orderList: orderList
        })
      }
    })
  },
})