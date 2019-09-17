// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    navList: [{ "img": "../../image/dingdan.png", "order": "我的订单" }, { "img": "../../image/dizhi.png", "order": "收货地址" }],
    addressList: [],
    isShow: false,
    collected: true,
    isHide: false,
    iShow: true,
    orderList: [],
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      userInfo: app.globalData.userInfo,
      TabCur: 0,
    })
    if (app.globalData.address == 1) {
      this.setData({
        TabCur: 1,
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
    if (index == 1) {
      that.setData({
        isShow: true
      })
      that.getAddressList()
    } else if (index == 0) {
      that.setData({
        isShow: false
      })
      that.getOrderList()
    }
  },
  getAddressList() {
    wx.request({
      url: `${app.globalData.requestUrl}/address_info`,
      method: 'POST',
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
      url: `${app.globalData.requestUrl}/user_order`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id
      },
      success: res => {
        this.setData({
          orderList: []
        })
        if (res.data.code == 1) {
          this.setData({
            orderList: res.data.data
          })
        }
      }
    })
  },
  goContact() {
    wx.navigateTo({
      url: '../contact/contact',
    })
  },
  delAddress(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.request({
      url: `${app.globalData.requestUrl}/address_del`,
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        that.data.addressList.splice(index, 1)
        var newAddressList = that.data.addressList
        that.setData({
          addressList: newAddressList
        })
      }
    })
  },
  //确认订单
  orderConfirm(e) {
    wx.request({
      url: `${app.globalData.requestUrl}/Order/receive`,
      method: 'POST',
      data: {
        orderNum: e.currentTarget.dataset.order
      },
      success: function (res) {
      }
    })
  },
  //删除订单
  delOrder(e) {
    wx.showModal({
      title: '',
      content: '确认删除订单？',
      success: res => {
        if (res.confirm) {
          this.runDelOrder(e)
        }
      }
    })
  },
  runDelOrder(e) {
    var index = e.currentTarget.dataset.index
    var that = this
    var orderList = this.data.orderList
    wx.request({
      url: `${app.globalData.requestUrl}/Order/del_order`,
      method: 'POST',
      data: {
        orderNum: orderList[index].orderNum
      },
      success: function (res) {

        orderList.splice(index, 1)
        that.setData({
          orderList: orderList
        })
        wx.showToast({
          title: '删除订单成功',
          icon: 'success'
        });
      }
    })
  },
  //申请售后
  shouhou(e) {
    let index = e.currentTarget.dataset.index
    let orderList = this.data.orderList
    console.log(orderList, index)
    wx.request({
      url: `${app.globalData.requestUrl}/Order/service`,
      method: 'POST',
      data: {
        orderNum: orderList[index].orderNum,
        status: orderList[index].status
      },
      success: res => {
        wx.showToast({
          title: '申请成功',
          icon: 'success'
        });
      }
    })
  },
  open_tap: function (e) {
    let index = e.currentTarget.dataset.index
    let addressList = this.data.addressList
    var i = 0
    for (i in addressList) {
      if (addressList[i].is_default == 1) {
        addressList[i].is_default = 0
      } else {
        addressList[i].is_default = 1
      }
    }
    addressList[index].is_default = 1
    this.setData({
      addressList: addressList
    })
    wx.request({
      url: `${app.globalData.requestUrl}/address_default`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
      }
    })
  },
  edit(e) {
    wx.navigateTo({
      url: '../changeAddress/changeAddress?consignee=' + e.currentTarget.dataset.consignee + '&phone=' + e.currentTarget.dataset.phone + '&shopcar=' + e.currentTarget.dataset.shopcar + '&shopname=' + e.currentTarget.dataset.shopname + '&id=' + e.currentTarget.dataset.id,
    })
  },
  //跳转详情
  godetail(e) {
    let index = e.currentTarget.dataset.index
    let node = this.data.orderList[index]
    let data = `str=${node.status}&order=${node.orderNum}`
    wx.navigateTo({
      url: `/pages/order/order?${data}`,
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
    if (this.data.isShow) {
      this.getAddressList()
    } else {
      this.getOrderList()
    }

  },
})