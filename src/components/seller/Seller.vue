<template>
   <div class="seller" ref="seller">
     <div class="seller-content">
       <div class="overview">
         <h1 class="title">{{seller.name}}</h1>
         <div class="desc">
           <Star :size="36" :score="seller.score"></Star>
           <span class="text">{{(seller.ratingCount)}}</span>
           <span class="text">月售{{seller.sellCount}}单</span>
         </div>
         <ul class="remark">
           <li class="block">
             <h2>起送价</h2>
             <div class="content">
               <span class="stress">{{seller.minPrice}}</span>元
             </div>
           </li>
           <li class="block">
             <h2>商家配送</h2>
             <div class="content">
               <span class="stress">{{seller.deliveryPrice}}</span>元
             </div>
           </li>
           <li class="block">
             <h2>平均配送时间</h2>
             <div class="content">
               <span class="stress">{{seller.deliveryTime}}</span>分钟
             </div>
           </li>
         </ul>
         <div class="favorite" @click="favoriteToggle">
           <span class="iconfont icon-collectselected" :class="{'active':favorite}"></span>
           <span class="text">{{favoriteText}}</span>
         </div>
       </div>
       <Split></Split>
       <div class="bulletin">
         <h1 class="title">公告与活动</h1>
         <div class="content-wrapper">
           <p class="content">{{seller.bulletin}}</p>
         </div>
         <ul v-if="seller.supports" class="supports">
           <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
             <span class="icon" :class="classMap[seller.supports[index].type]"></span>
             <span class="text">{{seller.supports[index].description}}</span>
           </li>
         </ul>
       </div>
       <Split></Split>
       <div class="pics">
         <h1 class="title">商家实景</h1>
         <div class="pic-wrapper" ref="picwrapper">
           <ul class="pic-list" ref="list">
             <li class="pic-item" v-for="(pic,index) in seller.pics">
               <img :src="pic" width="120" height="90" alt="">
             </li>
           </ul>
         </div>
       </div>
       <Split></Split>
       <div class="info">
         <h1 class="title">商家信息</h1>
         <ul>
           <li class="info-item" v-for="(info,index) in seller.infos">{{info}}</li>
         </ul>
       </div>
     </div>
   </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Star from '../star/Star.vue'
  import Split from '../split/Split.vue'
  import {saveToLocal,loadFromLocal} from '../../common/js/store'
    export default {
        name: "seller",
      props:{
          seller:{
            type:Object
          }
      },
        data() {
            return {
              favorite:(()=>{
                return loadFromLocal(this.seller.id,'favorite',false)
              })()
            }
        },
      created(){
        this.classMap=['decrease','discount','special','invoice','guarantee'];
      },
      computed:{
        favoriteText(){
          return this.favorite?'已收藏':'收藏';
        }
      },
      mounted(){
        this.initScroll();
        if(this.seller.pics){
          let picWidth=120;
          let margin=6;
          let width=(picWidth+margin)*this.seller.pics.length-margin;
          this.$refs.list.style.width=width+'px';
          this.$nextTick(()=>{
            this.picScroll=new BScroll(this.$refs.picwrapper,{
              scrollX:true,
              eventPassthrough:'vertical'
            });
          })
        }
      },
      watch:{
        seller(){
          this.initScroll();
        }
      },
        methods: {
          favoriteToggle(event){
            if(!event._constructed){
              return;
            }
            this.favorite=!this.favorite;
            saveToLocal(this.seller.id,'favorite',this.favorite);

          },
          initScroll() {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.seller, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          },
        },
      components:{
        Star,
        Split
      }
    }
</script>

<style scoped lang="less">
.seller{
  position:absolute;
  width: 100%;
  top: 174px;
  bottom: 0;
  overflow: hidden;
  .overview{
    padding: 18px;
    position: relative;
    .title{
      margin-bottom: 8px;
      color:rgb(7,17,27);
      font-size: 14px;
      line-height: 14px;
    }
    .desc{
      padding-bottom: 18px;
      font-size: 0;
      border-bottom: 1px solid rgba(7,17,27,.1);
      font-size: 0;
      .star{
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }
      .text{
        margin-right: 12px;
        display: inline-block;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color:rgb(77,85,93);
      }
    }
    .remark{
        display: flex;
      padding-top: 18px;
     .block{
       flex:1;
       text-align: center;
       border-right:1px solid rgba(7,17,27,.1);
       &:last-child{
         border: none;
       }
       h2{
         line-height: 10px;
         margin-bottom: 4px;
         font-size: 10px;
         color:rgb(147,153,159);
       }
       .content{
         line-height: 24px;
         font-size: 10px;
         color:rgb(7,17,27);
         .stress{
           font-size: 24px;
         }
       }
     }
    }
    .favorite{
      width: 50px;
      position: absolute;
      right: 18px;
      top: 18px;
      text-align: center;
      .icon-collectselected{
        display: block;
        color:#d4d6d9;
        line-height: 24px;
        font-size: 24px;
        margin-bottom: 4px;
        &.active{
          color:rgb(240,20,20);
        }
        .text{
          line-height: 24px;
          font-size: 10px;
          color:rgb(7,17,27);
        }
      }
    }
  }
  .bulletin{
    padding: 18px 18px 0 18px;
    .title{
      margin-bottom: 8px;
      color:rgb(7,17,27);
      font-size: 14px;
      line-height: 14px;
    }
    .content-wrapper{
      border-bottom:1px solid rgba(7,17,27,.1);
      padding: 0 12px 16px 12px;
      .content{
        line-height: 24px;
        font-size:14px ;
        color:rgb(240,20,20);
      }
    }
    .supports{
      .support-item{
        padding: 16px 12px;
        font-size: 0;
        border-bottom:1px solid rgba(7,17,27,.1);
      }
      .icon{
        display: inline-block;
        vertical-align: top;
        width: 16px;
        height: 16px;
        margin-right: 6px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        &.decrease{
          background-image: url('../../assets/decrease_4@2x.png');
        }
        &.discount{
          background-image: url('../../assets/discount_4@2x.png');
        }
        &.guarantee{
          background-image: url('../../assets/guarantee_4@2x.png');
        }
        &.invoice{
          background-image: url('../../assets/invoice_4@2x.png');
        }
        &.special{
          background-image: url('../../assets/special_4@2x.png');
        }
      }
      .text{
        line-height: 16px;
        font-size: 12px;
        color:rgb(7,17,27);
      }
    }
  }
  .pics{
    padding: 18px;
    .title{
      margin-bottom: 12px;
      left: 14px;
      color:rgb(7,17,27);
      font-size: 14px;
    }
    .pic-wrapper{
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      .pic-list{
        font-size: 0;
        .pic-item{
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;
          &:last-child{
            margin: 0;
          }
        }
      }
    }
  }
  .info{
    padding: 18px 18px 0 18px;
    color:rgb(7,17,27);
    .title{
      padding-bottom: 12px;
      line-height: 14px;
      font-size: 14px;
      border-bottom: 1px solid rgba(7,17,27,.1);
    }
    .info-item{
      padding: 16px 12px;
      line-height: 16px;
      border-bottom: 1px solid rgba(7,17,27,.1);
      font-size: 12px;
      &:last-child{
        border: none;
      }
    }
  }
}
</style>
