// pages/home/home.js
// import request from '../../service/network.js'

import {
  getMultiData,
  getGoodsData
} from '../../service/home.js'

const TOP_DISTANCE = 1000
const types = ['pop', 'new', 'sell']
Page({
  data: {
    banners: [],
    recommends: [],
    titles: ['流行', '新款', '精选'],
    goods: {
      'pop': {
        page: 0,
        list: []
      },
      'new': {
        page: 0,
        list: []
      },
      'sell': {
        page: 0,
        list: []
      },
    },
    // 再弄一个变量来记录当前的类型
    // 默认情况下为pop
    currentType: 'pop',
    showBackTop:false,
    isTabFixed:false,
    tabScrollTop:0
  },
  onLoad: function (options) {
    // 1.请求轮播图以及推荐数据
    this._getMultidata()
    // 2.请求商品数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  // onShow：页面显示出来的时候回调的函数
  // 而页面显示是否意味着所有的图片都加载完成呢？不是的
  // 因为图片的加载是异步的
  // 所以我们最好等图片加载完的时候再去获取它的高度
  onShow(){
    // 但是在onShow里面获取顶部的距离是不对的
    // 你可以用一个定时器，等一会
  //  setTimeout(()=>{
  //   wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect=>{
  //     // 这个函数默认是不会回调的，你需要去执行一下exec才行
  //     console.log(rect);
  //   }).exec()
  //  },1000)
  },
  // ----------------------网络请求函数----------------------------
  _getMultidata() {
    // 把之前的代码抽到一个函数里面，这样的话就不会太乱了
    // 在js里面以_开头的函数我们把它约定为私有函数
    getMultiData().then(res => {
      // console.log(res);
      // 取出轮播图和推荐的数据
      const banners = res.data.data.banner.list
      // 这个banners拿到的是一个数组
      const recommends = res.data.data.recommend.list
      // 这个recommend拿到的也是一个数组

      // console.log(banners);
      // console.log(recommends);

      // 将banners和recommends放到data中
      this.setData({
        // banners:banners,
        // recommends:recommends
        banners,
        recommends
        // 这个是es6的增强写法
      })
    })
  },
  _getGoodsData(type) {
    // 1.先获取页码
    const page = this.data.goods[type].page + 1

    // 2.发送网络请求(之前先获取页码)
    getGoodsData(type, page).then(res => {
      // 我们可以获取当前页码，然后将页码加1，就是我们请求的页码了
      console.log(res);
      // 2.1 取出数据
      const list = res.data.data.list

      // 2.2将我们的数据设置到对应type的list中
      // this.data.goods[type].list.push(list)
      // 千万不能这样做，这样做是在空数组里面新增数组，就变成2维数组了
      // 一种比较笨的方法是遍历
      // 还有一种可以使用ES6的...语法
      const oldList = this.data.goods[type].list
      oldList.push(...list)

      // this.data.goods[type].list.push(...list)
      // 2.3将数据设置到data中的goods中
      const typeKey = `goods.${type}.list`
      const pageKey = `goods.${type}.page`
      this.setData({
        // 我们现在想替换的不是整个goods，而是只是想替换goods里面的list
        [typeKey]: oldList,
        // 这个必须要有中括号
        [pageKey]: page
      })
    })

    // getGoodsData('new',1).then(res=>{
    //   console.log(res);
    // })

    // getGoodsData('sell',1).then(res=>{
    //   console.log(res);
    // })
    // 这些函数的格式是一样的，所以这样写的话会冗余
    // 所以你干脆不要写死，
  },
  // ----------------------事件监听函数----------------------------
  handleTabClick(event) {
    // console.log(event);
    // 取出index
    const index = event.detail.index
    console.log(index);

    // 设置currentType
    // 写法1：不太好，太繁琐
    // switch (index) {
    //   case 0:
    //     this.setData({
    //       currentType: 'pop'
    //     })
    //     break;
    //   case 1:
    //     this.setData({
    //       currentType: 'new'
    //     })
    //     break;

    //   case 2:
    //     this.setData({
    //       currentType: 'sell'
    //     })
    //     break;
    // }

    // 方法2：我们在前面先定义一个types的数组
    this.setData({
      currentType: types[index]
    })
  },
  handleImageLoad(){
    console.log('图片加载完成了啦啦啦来了');
  //  setTimeout(()=>{
    // 这里就没有必要搞定时器了，直接执行就可以了
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect=>{
      // 这个函数默认是不会回调的，你需要去执行一下exec才行
      // console.log(rect);
      this.data.tabScrollTop = rect.top
    }).exec()
  //  },1000)
  },
  // 上拉加载更多
  onReachBottom() {
    // console.log('页面滚动到了底部');
    // 上拉加载更多->请求新的数据
    this._getGoodsData(this.data.currentType)
  },
  onPageScroll(options){
    // console.log(options);
    // 1.取出scrollTop
    const scrollTop = options.scrollTop

    // 根据scrollTop，当它超过一定位置的时候，显示true，反之显示false
    // 2.修改showBackTop属性
    // 官方提醒：不要在滚动的函数中频繁的调用this.setData
    // 因为调用this.setData界面有可能发生刷新，而且里面要进行diff算法的
    // 我们先进行一个判断，再进行调用，会稍微提高一点性能的
    const flag  = scrollTop >= TOP_DISTANCE 
    if(flag != this.data.showBackTop){
      this.setData({
        showBackTop:scrollTop >= TOP_DISTANCE 
      })
    }
    // 3.修改isTabFixed属性
    const flag2 = scrollTop >= this.data.tabScrollTop
    if(flag2 != this.data.isTabFixed){
      // if判断让它不那么频繁更新
      this.setData({
        isTabFixed:flag2
      })
    }
  }
})