import Vue from 'vue'
import Router from 'vue-router'
/*import Ratings from '../components/ratings/Ratings'
import Goods from '../components/goods/Goods'
import Seller from '../components/seller/Seller'*/
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/goods',
      name: 'goods',
      component: ()=>import('../components/goods/Goods'),
      meta: { keepAlive: true }
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ()=>import('../components/ratings/Ratings'),
      meta: { keepAlive: true }
    },
    {
      path: '/seller',
      name: 'seller',
      component: ()=>import('../components/seller/Seller'),
      meta: { keepAlive: true }
    },
    {
      path:'*',redirect:'/goods'
    }
  ]
})
