// pages/changeAddress/changeAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consignee:[],
    phone:[],
    shopcar:[],
    shopname:[],
    id:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var consignee = options.consignee,
        phone = options.phone,
        shopcar = options.shopcar,
        shopname = options.shopname,
        id=options.id
    this.setData({
      consignee: consignee,
      phone: phone,
      shopcar: shopcar,
      shopname: shopname,
      id:id
    })
  },
  //修改地址
  changeAddress(){
    wx.request({
      url: 'https://shu.beaconway.cn/address_edit',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        id: this.data.id,
        consignee: this.data.consignee,
        phone:this.data.phone,
        shopname:this.data.shopname,
        address:this.data.shopcar
      },
      success:function(res){
        wx.showModal({
          title: '提示',
          content: '修改成功',
        })
        wx.navigateBack({
          delta:1
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  talks_1(e){
    this.setData({
      consignee: e.detail.value,
    })
  },
  talks_2(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  talks_3(e) {
    this.setData({
      shopname: e.detail.value,
    })
  },
  talks_4(e) {
    this.setData({
      shopcar: e.detail.value,
    })
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