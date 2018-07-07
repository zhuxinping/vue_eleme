<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="iconfont icon-iconfontshopcart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right"  @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-for="(ball,index) in balls" :key="index"  v-show="ball.show">
            <span class="inner inner-hook"></span>
          </div>
        </transition-group>
      </div>
      <transition name="fold-fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="content" >
            <ul>
              <li class="food" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartConrol :food="food"></CartConrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="mask">
      <div class="list-mask"@click="hideList" v-show="listShow">

      </div>
    </transition>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import CartConrol from '../cartcontrol/CartControl'
    export default {
      props:{
        selectFoods:{
          type:Array,
          default(){
            return [];
          }
        },
        deliveryPrice:{
          type:Number,
          default:0
        },
        minPrice:{
          type:Number,
          default:0
        }
      },
        data() {
            return {
              balls: [// 定义多个对象，表示页面中做多同时运动的小球
                {
                  show: false
                },
                {
                  show: false
                },
                {
                  show: false
                },
                {
                  show: false
                }
              ],
              dropBalls: [], // 下落的小球
              fold:true
            }
        },
        created() {
          // 获取按钮组件的点击的元素，用在drop方法里
          this.$root.eventHub.$on('setDom', this.drop);
        },
        methods: {
          drop(el) {
            /* console.log(el);*/// 获取到点击的那个添加按钮
            for (let i = 0; i < this.balls.length; i++) {
              let ball = this.balls[i];
              if (!ball.show) {
                ball.show = true; // 表示可以有下落动画
                ball.el = el;
                this.dropBalls.push(ball);
                return; // 跳出循环
              }
            }
          },
          toggleList() {
            if (!this.totalCount) {
              return;
            }
            this.fold = !this.fold;
          },
          empty(){
            this.selectFoods.forEach((food)=>{
              food.count=0;
            })
          },
          pay(){
            if(!this.totalPrice){
              return;
            }
            window.alert(`支付${this.totalPrice}元`)
          },
          hideList(){
            this.fold=true;
          },
          beforeEnter(el) { // 下落小球的下落之前的运动函数钩子
            //console.log(el);
            let len = this.balls.length;
            while (len--) {
              let ball = this.balls[len];
              if (ball.show) {
                let rect = ball.el.getBoundingClientRect(); // 小球盒模型
                let x = rect.left - 32; // 小球距离购物车图标的位置
                let y = -(window.innerHeight - rect.top - 22);
                el.style.display = '';
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
            }
          },
          enter(el) { // 下落小球的下落时的运动函数钩子
            el.offsetHeight; // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
            this.$nextTick(() => { // 改回运动初始状态
              el.style.webkitTransform = 'translate3d(0, 0, 0)';
              el.style.transform = 'translate3d(0,0,0)';
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = 'translate3d(0,0,0)';
              inner.style.transform = 'translate3d(0,0,0)';
            });
          },
          afterEnter(el) { // 下落小球的下落之后的运动函数钩子
            let ball = this.dropBalls.shift();
            if (ball) {
              ball.show = false;
              el.style.display = 'none';
            }
          },
        },
        computed: {
          totalPrice(){
            let total=0;
            this.selectFoods.forEach(food=>{
              total+=food.price*food.count;
            });
            return total;
          },
          totalCount(){
            let count=0;
            this.selectFoods.forEach(food=>{
              count+=food.count;
            });
            return count;
          },
          payDesc(){
            if(this.totalPrice===0){
              return `￥${this.minPrice}元`;
            }else if(this.totalPrice<this.minPrice){
              let diff=this.minPrice-this.totalPrice;
              return `还差￥${diff}元起送`;
            }else{
              return '去结算';
            }
          },
          payClass(){
            if(this.totalPrice<this.minPrice){
              return 'not-enough';
            }else{
              return 'enough';
            }
          },
          listShow() {
            if (!this.totalCount) {
              this.fold = true;
              return false;
            }
            let show = !this.fold;
            if (show) {
              this.$nextTick(() => {
                if (!this.scroll) {
                  this.scroll = new BScroll(this.$refs.content,{
                    click: true
                  });
                } else {
                  this.scroll.refresh();
                }
              });
            }
            return show;
          }
        },
        components: {CartConrol}
    }
</script>
<style scoped lang="less">
.shopcart{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  z-index: 50;
  .content{
    display: flex;
    background: #141d27;
    font-size: 0;
    vertical-align: top;
    .content-left{
      flex:1;
      .logo-wrapper{
        display: inline-block;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #141d27;
        box-sizing: border-box;
        position: relative;
        vertical-align: top;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        .logo{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;
          &.highlight{
            background: rgb(0,160,220);
          }
        }
        .icon-iconfontshopcart{
          line-height: 44px;
          font-size: 24px;
          color:#80858a;
          &.highlight{
            color:#fff;
          }
        }
      }
      .num{
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 16px;
        font-size: 9px;
        font-weight: 700;
        color:#fff;
        background: rgb(240,20,20);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
      }
      .price{
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin-top: 12px;
        box-sizing: border-box;
        padding-right: 12px;
        border-right: 1px solid rgba(255,255,255,.1);
        font-size: 16px;
        font-weight: 700;
        color:rgba(255,255,255,.4);
        &.highlight{
          color:#fff;
        }
      }
      .desc{
        display: inline-block;
        vertical-align: top;
        margin:12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
        font-weight: 700;
        color:rgba(255,255,255,.4);
      }
    }
    .content-right{
      flex:0 0 105px;
      width: 105px;
      .pay{
        height: 48px;
        line-height: 48px;
        text-align: center;
        color:rgba(255,255,255,.4);
        font-size: 12px;
        font-weight: 700;
        background: #2b333b;
        &.not-enough{
          background: #2b333b;
        }
        &.enough{
          background: #00b43c;
          color:#fff;
        }
      }
    }
  }
  .ball-container{
    .ball{
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      &.drop-enter,&.drop-enter-active{
        transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
        .inner{
          display:inline-block;
          width:16px;
          height:16px;
          border-radius:50%;
          background:rgb(0,160,220);
          transition:all 0.4s linear
        }
      }
    }
  }
  .shopcart-list{
    position: absolute;
    top: 0;
    left: 0;
    z-index:-1;
    width: 100%;
    transform: translate3d(0,-100%,0);
    &.fold-fade-enter-active,  &.fold-fade-leave-active{
      transition: all .5s ease;
    }
    &.fold-fade-enter, &.fold-fade-leave-to{
      transform: translate3d(0,0,0);
    }
    .list-header{
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7,17,27,.1);
      .title{
        float: left;
        font-size: 14px;
        color:rgb(7,17,27);
      }
      .empty{
        float: right;
        font-size: 12px;
        color:rgb(0,160,220);
      }
    }
    .list-content{
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;
      .food{
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(7,17,27,.1);
        .name{
          line-height: 24px;
          font-size: 14px;
          color:rgb(7,17,27);
        }
        .price{
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          color:rgb(240,20,20);
          font-weight: 700;
        }
        .cartcontrol-wrapper{
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter:blur(10px);
    background: rgba(7,17,27,.6);
    &.mask-enter-active,  &.mask-leave-active{
      transition: all .5s ease;
    }
    &.mask-enter, &.mask-leave-to{
      background: rgba(7,17,27,.0);
    }
  }
</style>
