//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfoButtonShow: true,
    userInfo: {},
    navList: [],
    swiperList: [],
    goodsArr: [],
    allGoods: [],
    imgUrl: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    this.getBanner()
    this.getUserInfo()

  },
  onShow() {
    let userInfo = this.data.userInfo
    if (userInfo.hasOwnProperty("id")) {
      // 获取分类
      this.getGoodsClass()
    }
  },
  getBanner() {
    wx.request({
      url: `${app.globalData.requestUrl}/banner_show`,
      method: 'post',
      success: res => {
        if (res.data.code == 1) {
          this.setData({
            swiperList: res.data.data
          })
        }
      }
    })
  },
  getUserInfo: function () {
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {

    wx.getUserInfo({
      success: res => {
        let userInfo = res.userInfo
        app.globalData.userInfo = userInfo
        this.setData({
          userInfoButtonShow: false
        })
        this.setData({
          userInfo: userInfo
        })
        wx.login({
          success: datas => {
            if (datas.code) {
              wx.request({
                url: `${app.globalData.requestUrl}/wxLogin`,
                method: 'POST',
                data: {
                  code: datas.code,
                  nickname: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl
                },
                success: data => {
                  app.globalData.userInfo = data.data.data
                  this.setData({
                    userInfo: data.data.data
                  })
                  // 获取分类
                  this.getGoodsClass()
                }
              })
            }
          }
        })
      }
    })
    //     }
    //   }
    // })

  },
  getGoodsClass() {
    wx.request({
      url: `${app.globalData.requestUrl}/Good/goodsClass`,
      method: 'POST',
      success: res => {
        if (res.data.code) {
          let typeList = res.data.data
          this.setData({
            navList: typeList
          })
          if (typeList.length > 0) {
            this.getGoods(0)
          }
        }
      }
    })
  },
  detail(e) {
    let index = e.currentTarget.dataset.index
    let node = this.data.goodsArr[index]
    let data = `longimg=${node.longimg}&id=${node.id}&img=${node.img}&price=${node.price}&spec=${node.spec}&iscar=${node.car_num}`
    wx.navigateTo({
      url: `/pages/detail/detail?${data}`
    })
  },
  //选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.index,
      MainCur: e.currentTarget.dataset.index,
      VerticalNavTop: (e.currentTarget.dataset.index - 1) * 50
    })
    //点一次放一个数据
    let index = e.currentTarget.dataset.index
    let allGoods = this.data.allGoods
    if (allGoods[index]) {
      this.setData({
        goodsArr: allGoods[index],
      })
    } else {
      this.getGoods(index)
    }
  },
  //封装拿到商品的函数
  getGoods(index) {
    wx.request({
      url: `${app.globalData.requestUrl}/Good/goods`,
      method: 'POST',
      data: {
        cid: this.data.navList[index].id,
        page: 1,
        uid: this.data.userInfo.id
      },
      success: res => {
        this.setData({
          goodsArr: ""
        })
        if (res.data.code) {
          var goodsArr = res.data.data
          let allGoods = this.data.allGoods
          allGoods[index] = goodsArr
          this.setData({
            allGoods: allGoods,
            goodsArr: goodsArr,
            TabCur: index
          })
        }
      }
    })
  },

  numDown(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    if (node.car_num == 0) {
      return false
    }
    node['car_num'] = node.car_num - 1
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  numUp(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    node['car_num'] = node.car_num + 1
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  getNum(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.goodsArr
    let node = nodeAll[index]
    let num  = e.detail.value
    node['car_num'] = num
    nodeAll[index] = node
    this.setData({
      goodsArr: nodeAll
    })
    this.addShopcar(node)
  },
  // 进入搜索页面
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  addShopcar(node){
    wx.showToast({
      title: '正在更改购物车数据',
      icon: 'loading'
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        goods_id: node.id,
        num: node.car_num,
        spec: node.spec,
        price: node.price,
        img: node.img,
      },
      success: res => {
        wx.hideToast()
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '润福宁',
      desc: '润福宁食品批发中心!',
      path: '/pages/index/index'
    }
  }
})
