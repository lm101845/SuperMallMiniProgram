import request from './network.js'


export function getMultiData(){
  return request({
    // url:baseURL + '/home/multidata'
    // baseURL直接在network里写了，这里就不用传了
    url:'/home/multidata'
  })
}

export function getGoodsData(type,page){
  // 这里就要传入一些参数了
  // 要告诉服务器要请求什么样的一些数据类型和页码
  return request({
    url:'/home/data',
    data:{
      type,
      page
    }
  })
}