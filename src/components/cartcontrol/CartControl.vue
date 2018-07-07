<template>
    <div class="cartcontrol">
      <transition name="move-fade">
      <div class="cart-decrease" @click.stop="decreaseCart($event)" v-show="food.count>0">
          <span class="inner iconfont icon-jian"></span>
      </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div  class="cart-add  iconfont icon-jia" @click.stop="addCart($event)"></div>
    </div>
</template>
<script>
  import Vue from 'vue';
    export default {
      props:{
        food:{
          type:Object
        }
      },
        data() {
            return {

            }
        },
        created() {
          //console.log(this.food);
        },
        methods: {
          addCart(event){

            if(!event._constructed){
              return;
            }
            if(!this.food.count){
              Vue.set(this.food,'count',1)
            }else{
              this.food.count++;
            }
            this.$root.eventHub.$emit('setDom', event.target);
          },
          decreaseCart(event){
            if(!event._constructed){
              return;
            }
            if(this.food.count){
              this.food.count--;
            }
          }
        },
        computed: {},
        components: {}
    }
</script>
<style scoped lang="less">
.cartcontrol{
  font-size: 0;
  .cart-decrease{
    display: inline-block;
    padding: 6px;
    &.move-fade-enter-active, &.move-fade-leave-active{
      transition: all .3s ease;
      opacity: 1;
      transform: translate3d(0,0,0);
    }
    .inner{
      font-size: 24px;
      line-height: 24px;
      color:rgb(0,166,220);
      display: inline-block;
      transition: all .4s ease;
      transform: rotate(0);
    }
    &.move-fade-enter,&.move-fade-leave-to{
      transform: translate3d(24px,0,0);
      opacity: 0;
      .inner{
        transform: rotate(180deg);
      }
    }
  }
  .cart-count{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color:rgb(147,153,159);
  }
  .cart-add{
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color:rgb(0,166,220);
  }

}
</style>
