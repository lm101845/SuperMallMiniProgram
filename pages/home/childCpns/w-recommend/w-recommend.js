// pages/home/childCpns/w-recommend/w-recommend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recommends:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isLoad:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleImageLoad(){
      if(!this.data.isLoad){
        console.log('图片加载完成'); 
        this.triggerEvent('imageload')
        this.data.isLoad = true
        // 函数会回调4次，但是这里只会回调一次了
        // 因为这里不需要界面刷新，所以不需要用serData
      }
    }
  }
})
