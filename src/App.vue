<template>
  <div id="app">
    <MHeader :seller="seller"></MHeader>
    <div class="tab border-1px">
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/ratings">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <keep-alive>
      <router-view :seller="seller" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view  :seller="seller" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  //axios.defaults.baseURL='http://localhost:4000/api'
  import MHeader from './components/header/MHeader'
  import './common/css/base.less'
  import {urlParse} from './common/js/util'
  //import {getSeller} from "./api"
  export default {
  name: 'App',
  data(){
    return{
      seller:{
        id:(()=>{
          let queryParam=urlParse();
          return queryParam.id;
        })()
      }
    }
  },
    created(){
     this.getSellerData();
    },
    methods:{
      getSellerData(){
      axios.get(`/seller?id=${this.seller.id}`).then(res=>{
       let {errno,data}=res.data;
        if(errno===0){
         this.selller=data;
        // this.seller=Object.assign({},this.seller,data)
         this.seller={...this.seller,...data};
         console.log(this.seller.id);
        }
      });
    }
    },
  components:{MHeader}
}
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .tab{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
   // border-bottom: 1px solid rgba(7,17,27,.1);
    position: relative;
    .tab-item{
      text-align: center;
      flex: 1;
    }
    a{
      display: block;
      font-size: 14px;
      color:rgb(77,85,93);
    }
    a.router-link-active{
      color:#f90;
    }
  }
}
.tab:after{
  position: absolute;
  display: block;
  left: 0;
  bottom: 0;
  border-top: 1px solid rgba(7,17,27,.1);
  content: '';
  width: 100%;
}
</style>
