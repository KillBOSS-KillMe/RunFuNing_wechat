// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    navList:[{"img":"../../image/dingdan.png","order":"我的订单"},{"img":"../../image/dizhi.png","order":"收货地址"}],
    addressList:[],
    isShow:false,
    collected:true,
    isHide: false,
    iShow: true,
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      TabCur: 0,
    })
    if (app.globalData.address==1){  
      this.setData({

        TabCur:1,
        isShow: true
      })
      app.globalData.address = ""
      this.getAddressList()
    }
  },
  tabSelect(e) {
    var that = this
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var index = e.currentTarget.dataset.id
    if(index==1){
      that.setData({
        isShow:true
      })
      that.getAddressList()
    }else if(index == 0){
      that.setData({
        isShow: false
      })
      that.getOrderList()
    }
  },
  getAddressList() {
    wx.request({
      url: 'https://shu.beaconway.cn/address_info',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        uid: app.globalData.userInfo.id
      },
      success: res => {
        let i = 0
        let addressList = res.data.data
        for (i in addressList) {
          addressList[i]["isSelect"] = false
        }
        this.setData({
          addressList: addressList
        })
      }
    })
  },
  getOrderList() {
    wx.request({
      url: 'https://shu.beaconway.cn/user_order',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id
      },
      success: res => {
        this.setData({
          orderList: res.data.data
        })
      }
    })
  },
  goContact(){
    wx.navigateTo({
      url: '../contact/contact',
    })
  },
  delAddress(e){
    var that=this
    var index = e.currentTarget.dataset.index
    wx.request({
      url: 'https://shu.beaconway.cn/address_del',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: e.currentTarget.dataset.id
      },
      success:function(res){
        that.data.addressList.splice(index,1)
        var newAddressList = that.data.addressList
        that.setData({
          addressList: newAddressList
        })
      }
    })
  },
  //确认订单
  orderConfirm(e){
    wx.request({
      url: 'https://shu.beaconway.cn/Order/receive',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        orderNum:e.currentTarget.dataset.order
      },
      success:function(res){
      }
    })
  },
  //删除订单
  delOrder(e){
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
        orderNum: e.currentTarget.dataset.order
      },
      success: function (res) {
        
        orderList.splice(index,1)
        that.setData({
          orderList:orderList
        })
        wx.showModal({
          title: '',
          content: '删除订单成功',
        })
      }
    })
  },
  //申请售后
  shouhou(e){
    wx.request({
      url: 'https://shu.beaconway.cn/Order/service',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        orderNum: e.currentTarget.dataset.order,
        status:e.currentTarget.dataset.status
      },
      success:function(res){
      }
    })
  },
  open_tap: function (e) {
    let index = e.currentTarget.dataset.index
    let addressList = this.data.addressList
    var i = 0
    for (i in addressList) {
      if (addressList[i].is_default==1) {
        addressList[i].is_default = 0
      }else{
        addressList[i].is_default = 1
      }
    }
    addressList[index].is_default = 1
    this.setData({
      addressList: addressList
    })
    wx.request({
      url: 'https://shu.beaconway.cn/address_default',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id,
        id: e.currentTarget.dataset.id
      },
      success:function(res){
      }
    })
  },
  edit(e){
    wx.navigateTo({
      url: '../changeAddress/changeAddress?consignee=' + e.currentTarget.dataset.consignee + '&phone=' + e.currentTarget.dataset.phone + '&shopcar=' + e.currentTarget.dataset.shopcar + '&shopname=' + e.currentTarget.dataset.shopname + '&id=' + e.currentTarget.dataset.id,
    })
  },
  //跳转详情
  godetail(e){
    wx.navigateTo({
      url: `../order/order?str=${e.currentTarget.dataset.status}&order=${e.currentTarget.dataset.code}`,
    })
  },
  //新建地址
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.isShow) {
      this.getOrderList()
    } else {
      this.getAddressList()
    }
    
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