// pages/detail/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picture:[],
    goodsname:[],
    goodsprice:[],
    spec:[],
    longimg:[],
    totalprice:0.00,
    id:[],
    iscar:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.total
    this.setData({
      picture:options.img,
      goodsprice:options.price,
      goodsname:options.spec,
      longimg:options.img,
      totalprice: app.globalData.total,
      id:options.id,
      iscar:options.iscar
    })
  },
  //返回上一级
  goback(){
    wx.navigateBack({
      delta: 1
    })
  },
  goshopcar(){
    wx.switchTab({
      url: '../shopcar/shopcar',
    })
  },
  addShop(e) {
    wx.request({
      url: 'https://shu.beaconway.cn/Car/inCar',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        good_id: this.data.id,
        spec: this.data.goodsname,
        price: this.data.goodsprice,
        img: this.data.picture
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '加入购物车成功',
        })
      }
    })
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