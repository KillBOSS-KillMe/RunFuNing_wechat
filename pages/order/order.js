// pages/order/order.js
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
      str: ''
    })
    this.setData({
      str: options.str
    })
    var that = this
    wx.request({
      url: 'https://shu.beaconway.cn/Order/order_details',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
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
      url: 'https://shu.beaconway.cn/Order/receive',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
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
      url: 'https://shu.beaconway.cn/Order/del_order',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
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
  /**
   * 
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