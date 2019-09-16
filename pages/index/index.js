//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorColor:'white',
    indicatorActivecolor:'#FFB400',

    userInfoButtonShow: true,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navList: [],
    swiperList: [],
    page: 1,
    goodsArr: [],
    isShow: false,
    allGoods: [],
    imgUrl: '',
    url: "../../image/moren.png",

    iShow: true,
    // isClick:true
    // input默认是1  
    num: 0,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled'  
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
    var that = this
    wx.request({
      url: 'https://shu.beaconway.cn/banner_show',
      method: 'post',
      success: function (res) {
        let i = 0
        let bannerArray = []
        for (i in res.data.data) {
          bannerArray.push('https://shu.beaconway.cn' + res.data.data[i].img)
        }
        wx.setStorage({
          key: "banner_show",
          data: bannerArray
        })
        that.setData({
          swiperList: bannerArray
        })
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
          that.getUserInfo()
        }
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else {
    //   wx.getSetting({
    //     success: res => {
    //       if (res.authSetting['scope.userInfo']) {
    //         that.setData({
    //           userInfoButtonShow: false
    //         })
    //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称 
    //         that.getUserInfo()
    //       }
    //     }
    //   })
    // }
  },
  onShow(){
    this.onLoad()
  },
  getUserInfo: function () {
    
    var that = this
    that.setData({
      userInfoButtonShow: false
    })
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        let userInfo = res.userInfo

        app.globalData.userInfo = userInfo
        wx.login({
          success(res) {
            if (res.code) {
              wx.request({
                url: `${app.globalData.requestUrl}/wxLogin`,
                method: 'POST',
                data: {
                  code: res.code,
                  nickname: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl
                },
                success: function (res) {
                  app.globalData.userInfo = res.data.data
                  wx.request({
                    url: `${app.globalData.requestUrl}/Good/goodsClass`,
                    method: 'POST',
                    success: res => {
                      let typeList = res.data.data
                      let i = 0
                      let allGoods = []
                      for (i in typeList) {
                        allGoods.push('')
                      }
                      that.setData({
                        navList: typeList,
                        allGoods: allGoods,
                      })
                      if (typeList.length > 0) {
                        that.setData({
                          TabCur: 0
                        })
                        that.getGoods(typeList[0].id, 0)
                      }
                    }
                  })
                }
              })
            } else {
              wx.showModal({
                title: '',
                content: res.errMsg,
              })
            }
          }
        })
      }
    })
  },
  detail(e) {
    let index = e.currentTarget.dataset.index
    let node = this.data.goodsArr[index]
    console.log(node)
    let data = `longimg=${node.longimg}&id=${node.id}&img=${node.img}&price=${node.price}&spec=${node.spec}&iscar=${node.iscar}`
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
      this.getGoods(e.currentTarget.dataset.cid, index)
    }
  },
  //封装拿到商品的函数
  getGoods(id, index) {
    wx.request({
      url: `${app.globalData.requestUrl}/Good/goods`,
      method: 'POST',
      data: {
        cid: id,
        page: this.data.page,
        uid:app.globalData.userInfo.id
      },
      success: res => {
        var i = 0
        var goodsArr = res.data.data
        let allGoods = this.data.allGoods
        allGoods[index] = goodsArr
        this.setData({
          allGoods: allGoods,
          goodsArr: goodsArr,
          TabCur: index
        })
        //根据下标渲染数据
        if (goodsArr == undefined) {
          this.setData({
            goodsArr: ""
          })
        }
      }
    })
  },

  addShopcar(e) {
    if (e.currentTarget.dataset.is_car == 1) {
      wx.showModal({
        title: '',
        content: '请勿重复加入购物车',
      })
      return false
    }
    var index = e.currentTarget.dataset.index
    var list = this.data.goodsArr
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        good_id: e.currentTarget.dataset.goodsid,
        spec: e.currentTarget.dataset.spec,
        price: e.currentTarget.dataset.price,
        img: e.currentTarget.dataset.img
      },
      success: res => {
        wx.showModal({
          title: '提示',
          content: '加入购物车成功',
        })
        list[index].is_car = 1
        let allGoods = this.data.allGoods
        allGoods[this.data.TabCur] = list
        this.setData({
          goodsArr: list,
          allGoods: allGoods
        })
      }
    })
  },


  /* 点击减号 */
  bindMinus: function (e) {
    const index = e.currentTarget.dataset.index;
    // var num = this.data.num;
    let num = this.data.goodsArr[index].car_num;
    console.log(this.data.goodsArr[index])
    // 如果大于1时，才可以减  
    if (num > 0) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    const index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr
    var num = this.data.num;
    console.log(goodsArr[index]
    )
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 进入搜索页面
  goSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})
