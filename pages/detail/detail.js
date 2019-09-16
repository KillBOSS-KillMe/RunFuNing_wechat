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
    iscar:'',
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      totalprice: app.globalData.total,
      imgUrl: app.globalData.imgUrl
    })
    // options.img,
    // options.price,
    // options.spec,
    // options.img,
    // options.id,
    // options.iscar
  },
  //返回上一级
  // goback(){
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },
  goshopcar(){
    wx.switchTab({
      url: '../shopcar/shopcar',
    })
  },
  addShop(e) {
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        good_id: this.data.options.id,
        spec: this.data.options.spec,
        price: this.data.options.price,
        img: this.data.options.img
      },
      success: res => {
        wx.showModal({
          title: '提示',
          content: '加入购物车成功',
        })
      }
    })
  },
})