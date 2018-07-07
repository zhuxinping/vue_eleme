import axios from 'axios';
//增加默认的请求路径
axios.defaults.baseURL='http://localhost:3000/api';
//拦截器
axios.interceptors.response.use((res)=>{
  return res.data;//在这里统一拦截把结果处理成res.data
});
//获取数据返回的是一个pomise对象
export let getGoods=()=>{
  return axios.get('/goods');
};
export let getSeller=()=>{
  return axios.get('/seller');
};
export let getRatings=()=>{
  return axios.get('/ratings');
};

