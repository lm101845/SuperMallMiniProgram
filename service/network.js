import {baseURL}from './config.js'

export default function(options){
  // 加了一个default，别人就可以给我们的这个导出的函数自己起名字的
 return new Promise((resolve,reject)=>{
  wx.request({
    url:baseURL + options.url,
    method:options.method || 'get',
    data:options.data || {},
    success:resolve,
    fail:reject
  })
 })
} 