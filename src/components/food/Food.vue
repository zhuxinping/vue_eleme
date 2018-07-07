<template>
    <transition name="slide-right">
      <div v-show="shoowFlag" class="food" ref="food">
          <div class="food-content">
            <div class="image-header">
              <img :src="food.image" alt="">
              <div class="back" @click="hideMask">
                <i class="iconfont icon-BackArrow"></i>
              </div>
            </div>
            <div class="content">
              <h1 class="title">{{food.name}}</h1>
              <div class="detail">
                <span class="sell-count">月售{{food.sellCount}}</span>
                <span class="rating">好评率{{food.rating}}</span>
              </div>
              <div class="price">
                <span class="now">￥{{food.price}}</span>
                <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <CartControl :food="food"></CartControl>
              </div>
             <transition name="fade">
               <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count||food.count===0">加入购物车</div>
             </transition>
            </div>
            <Split v-show="food.info"></Split>
            <div class="info" v-show="food.info">
              <h1 class="title">商品信息</h1>
              <p class="text">{{food.info}}</p>
            </div>
            <Split></Split>
            <div class="rating">
              <h1 class="title">商品评价</h1>
              <RatingSelect :ratings="food.ratings" :desc="desc" :selectType="selectType" :onlyContent="onlyContent"></RatingSelect>
              <div class="rating-wrapper">
                <ul v-show="food.ratings &&food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" class="rating-item">
                  <div class="user">
                    <span class="name">{{rating.name}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                  </div>
                  <div class="time">{{formatDated(rating.rateTime)}}</div>
                  <p class="text">
                    <span class="iconfont" :class="{'icon-chaping':rating.rateType===1,'icon-zan':rating.rateType===0}"></span>
                    {{rating.text}}
                  </p>
                </li>
                </ul>
                <div class="no-rating" v-show="!food.ratings ||!food.ratings.length">暂无评价</div>
              </div>
            </div>
          </div>
      </div>
    </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import CartControl from '../cartcontrol/CartControl.vue'
  import Split from '../split/Split.vue'
  import RatingSelect from '../ratingselect/RatingSelect.vue'
  import {formatDate} from "../../common/js/date";
  const ALL=2;
    export default {
        name: "food",
      props:{
          food:{
            type:Object
          }
      },
        data() {
            return {
              shoowFlag:false,
              selectType:ALL,
              onlyContent:true,
              desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐糟'
              }
            }
        },
      created(){
        this.$root.eventHub.$on('ratingtype.select', this.selectChange);
        this.$root.eventHub.$on('content.toggleContent', this.toggleChange);
      },
      computed: {

      },
        methods: {
          formatDated(time){
            let date=new Date(time);
            return formatDate(date,'yyy-MM-dd hh:mm');
          },
          selectChange(type){
            //console.log(type);
            this.selectType=type;
            this.$nextTick(() => {
              this.scroll.refresh();
            });
          },
          toggleChange(onlyContent){
            //console.log(onlyContent);
            this.onlyContent=onlyContent;
            this.$nextTick(() => {
              this.scroll.refresh();
            });
          },
          show(){
            this.shoowFlag=true;
            this.selectType=ALL;
            this.onlyContent=true;
            this.$nextTick(()=>{
              if(!this.scroll){
                this.scroll=new BScroll(this.$refs.food,{
                  click:true
                });
              }else{
                this.scroll.refresh();
              }
            });
          },
          hideMask(){
            this.shoowFlag=false;
          },
          addFirst(event){
            if(!event._constructed){
              return;
            }
            this.$root.eventHub.$emit('setDom', event.target);
            //第一次设置count
            Vue.set(this.food,'count',1);
          },
          needShow(type,text){
            if(this.onlyContent && !text){
              return false;
            }
            if(this.selectType===ALL){
              return true;
            }else{
              return type===this.selectType;
            }
          }
        },
      components:{
        CartControl,
        Split,
        RatingSelect
      }
    }
</script>

<style scoped lang="less">
.food{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  z-index: 30;
  background: #fff;
  transform: translate3d(0,0,0);
  &.slide-right-enter-active, &.slide-right-leave-active{
    transition: all .5s ease;
  }
  &.slide-right-enter, &.slide-right-leave-to{
    transform: translate3d(100%,0,0);
  }
  .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    img{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .back{
      position: absolute;
      top: 10px;
      left: 0;
    }
    .icon-BackArrow{
      display: block;
      padding: 10px;
      font-size: 20px;
      color:#fff;
    }
  }
  .content{
    padding: 18px;
    position: relative;
    .title{
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color:rgb(7,17,27);
    }
    .detail{
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;
      .sell-count,.rating{
        font-size: 10px;
        color:rgb(147,153,159);
      }
      .sell-count{
        margin-right: 12px;
      }
    }
    .price{
      font-weight: 700;
      line-height: 24px;
      .now{
        margin-right: 8px;
        font-size: 14px;
        color:rgb(240,20,20);
      }
      .old{
        text-decoration: line-through;
        font-size: 10px;
        color:rgb(147,153,159);
      }
    }
  }
  .cartcontrol-wrapper{
    position: absolute;
    right: 12px;
    bottom: 12px;
  }
  .buy{
    position: absolute;
    right: 18px;
    bottom: 18px;
    z-index: 10;
    height: 24px;
    line-height: 24px;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 10px;
    color:#fff;
    border-radius: 12px;
    background: rgb(0,160,220);
    opacity: 1;
    &.fade-enter-active, &.fade-leave-active{
      transition: all .5s ease;
    }
    &.fade-enter, &.fade-leave-to{
      opacity: 0;
    }
  }
  .info{
    padding: 18px;
    .title{
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color:rgb(77,85,93);
    }
    .text{
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color:rgb(77,85,93);
    }
  }
  .rating{
    padding-top: 18px;
    .title{
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color:rgb(77,85,93);
    }
    .rating-wrapper{
      padding: 0 18px;
      .rating-item{
        position: relative;
        padding: 16px 0;
        border-bottom: 1px solid rgba(7,17,27,.1);
        .user{
          position: absolute;
          right: 0;
          line-height: 12px;
          top: 16px;
          font-size: 0;
          .name{
            display: inline-block;
            vertical-align: top;
            margin-right: 6px;
            font-size: 10px;
            color:rgb(147,153,159);
            .avatar{
              border-radius: 50%;
            }
          }
        }
        .time{
          line-height: 12px;
          font-size: 10px;
          margin-bottom: 6px;
          color:rgb(147,153,159);
        }
        .text{
          line-height: 16px;
          font-size: 12px;
          color:rgb(7,17,27);
          .icon-chaping ,.icon-zan{
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }
          .icon-zan{
            color:rgb(0,160,220);
          }
          .icon-chaping{
            color: rgb(147, 153, 159)
          }
        }
      }
      .no-rating{
        padding: 16px 0;
        font-size: 12px;
        color:rgb(147,153,159);
      }
    }
  }
}
</style>
