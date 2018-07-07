<template>
   <div class="goods">
    <div class="menu-wrapper" ref="menu">
      <ul>
        <li v-for="(item,index) in goods" @click="selectMenu(index,$event)" :key="index" class="menu-item border-1px" :class="{'current':currentIndex===index}">
          <span class="text">
           <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span> {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="food">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
              <div class="icon">
                <img  width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="control-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
     <ShopCart :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></ShopCart>
    <Food :food="selectedFood" ref="fooded"></Food>
   </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import ShopCart from '../shopcart/ShopCart.vue'
  import CartControl from '../cartcontrol/CartControl.vue'
  import Food from '../food/Food'
  import {getGoods} from '../../api'
    export default {
        name: "goods",
      props:{
          seller:{
            type:Object
          }
      },
        data() {
            return {
              goods:[],
              listHeight:[],
              scrollY:0,
              selectedFood:{}
            }
        },
      created(){
         this.classMap=['decrease','discount','special','invoice','guarantee'];
         this.getGoodsData();
      },
      computed:{
          currentIndex(){
            for(let i=0;i<this.listHeight.length;i++){
              let height1=this.listHeight[i];
              let height2=this.listHeight[i+1];
              if(!height2||(this.scrollY>=height1 && this.scrollY<height2)){
                return i;
              }
            }
            return 0;
          },
        selectFoods(){
            let foods=[];
            this.goods.forEach(good=>{
              good.foods.forEach((food)=>{
                 if(food.count){
                   foods.push(food);
                   //console.log(foods);
                 }
              });
            });
            return foods;
        }

      },
        methods: {
          selectFood(food,event){
            if(!event._constructed){
              return;
            }
            this.selectedFood=food;
            //console.log(this.selectedFood);
            this.$refs.fooded.show();
            //console.log(this.$refs.fooded);
          },
        async getGoodsData(){
          let {errno,data}=await getGoods();
          if(errno===0){
             this.goods=data;
             this.$nextTick(()=>{
             this.initScroll();
             this.calculateHeight();
           })
            //console.log(this.goods);
          }
        },
          selectMenu(index,event){
          if(!event._constructed){
            return;
          }
            let foodList1=this.$refs.food.getElementsByClassName('food-list-hook');
            let el=foodList1[index];
          this.foodsScroll.scrollToElement(el,300)
          //console.log(index);
          },
          initScroll(){
            this.menuScroll=new BScroll(this.$refs.menu,{click:true});
            this.foodsScroll=new BScroll(this.$refs.food,{
            click:true,
              probeType:3
            });
            this.foodsScroll.on('scroll',(pos)=>{
              this.scrollY=Math.abs(Math.round(pos.y));
            });
          },
          calculateHeight(){
              let foodList=this.$refs.food.getElementsByClassName('food-list-hook');
              let height=0;
              this.listHeight.push(height);
              for(let i=0;i<foodList.length;i++){
                let item=foodList[i];
                height+=item.clientHeight;
                this.listHeight.push(height);
              }
          }
        },
      components:{
        ShopCart,
        CartControl,
        Food
      }
    }
</script>

<style scoped lang="less">
.goods{
  position:absolute;
  display: flex;
  width: 100%;
  top: 174px;
  bottom: 46px;
  overflow: hidden;
  .menu-wrapper{
    flex:0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item{
      display: table;
      width: 56px;
      height: 54px;
      line-height: 14px;
      padding: 0 12px;
      &.current{
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 400;
        .text{
          border: none;
        }
      }
      &:after{
        position: absolute;
        display: block;
        left: 0;
        bottom: 0;
        border-top: 1px solid rgba(7,17,27,.1);
        content: '';
        width: 100%;
      }
      .icon{
        display: inline-block;
        vertical-align: top;
        width: 14px;
        height: 14px;
        margin-right: 2px;
        background-size: 14px 14px;
        background-repeat: no-repeat;
        &.decrease{
          background-image: url('../../assets/decrease_3@2x.png');
        }
        &.discount{
          background-image: url('../../assets/discount_3@2x.png');
        }
        &.guarantee{
          background-image: url('../../assets/guarantee_3@2x.png');
        }
        &.invoice{
          background-image: url('../../assets/invoice_3@2x.png');
        }
        &.special{
          background-image: url('../../assets/special_3@2x.png');
        }
      }
      .text{
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        font-size: 12px;
      }
    }
  }
  .foods-wrapper{
    flex:1;
    .title{
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color:rgb(147,153,159);
      background: #f3f5f7;
    }
    .food-item{
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      position: relative;
      &:after{
        position: absolute;
        display: block;
        left: 0;
        bottom: 0;
        border-top: 1px solid rgba(7,17,27,.1);
        content: '';
        width: 100%;
        &:last-child{
          margin-bottom: 0;
          display: none;
        }
      }
    }
    .icon{
      flex:0 0 57px;
      margin-right: 10px;
    }
    .content{
      flex:1;
      .name{
        font-size: 14px;
        margin: 2px 0 8px 0;
        height: 14px;
        line-height: 14px;
        color:rgb(7,17,27);
      }
      .desc{
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 10px;
        color:rgb(147,153,159);
      }
      .extra{
        line-height: 10px;
        font-size: 10px;
        color:rgb(147,153,159);
        .count{
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
      .control-wrapper{
        position: absolute;
        right: 0;
        bottom: 12px;
      }
    }
  }
}
</style>
