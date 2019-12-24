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
    imgUrl: '',
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgUrl = app.globalData.imgUrl
    options.img = imgUrl + options.img
    options.longimg = imgUrl + options.longimg
    this.setData({
      options: options,
      imgUrl: app.globalData.imgUrl
    })
    // options.img,
    // options.price,
    // options.spec,
    // options.img,
    // options.id,
    // options.iscar
  },
  goshopcar(){
    wx.switchTab({
      url: '../shopcar/shopcar',
    })
  },
  addShopcar(){
    wx.showToast({
      title: '正在更改购物车数据',
      icon: 'loading'
    });
    let options = this.data.options
    if (options.iscar == 0) {
      options['iscar'] = 1
    }
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        goods_id: options.id,
        num: options.iscar,
        spec: options.spec,
        price: options.price,
        img: options.img,
      },
      success: res => {
        wx.hideToast()
        if (res.data.code == 1) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      }
    })
  },
  // 控制图大小
  autoImage(e) {
    // 获取图片的狂傲
    var imgW = e.detail.width
    var imgH = e.detail.height
    // 计算图片比例
    var imgScale = imgW / imgH
    // 声明自适应宽高变量
    var autoW = ''
    var autoH = ''
    // 获取屏幕宽度，并将图片设置为屏幕等宽
    wx.getSystemInfo({
      success: res => {
        autoW = res.windowWidth
        autoH = autoW / imgScale
        this.setData({
          autoW: autoW,
          autoH: autoH
        })
      }
    })
  }
})