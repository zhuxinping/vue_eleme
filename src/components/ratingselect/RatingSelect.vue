<template>
    <div class="ratingselect">
        <div class="rating-type">
          <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click="select(0,$event)"  class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
          <span @click="select(1,$event)"  class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
      <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
        <span class="iconfont icon-gouxuan"></span>
        <span class="text">只看有内容的评价</span>
      </div>
    </div>
</template>
<script>
  const POSITIVE=0;
  const NEGATIVE=1;
  const ALL=2;
    export default {
      props:{
        ratings:{
          type:Array,
          default(){
            return [];
          }
        },
        selectType:{
          type:Number,
          default:ALL
        },
        onlyContent:{
          type:Boolean,
          default:false
        },
        desc:{
          type: Object,
          default(){
            return{
              all:'全部',
              positive:'满意',
              negative:'不满意'
            }
          }
        }
      },
        data() {
            return {
              selectTypeResult:ALL,
              onlyContentResult:false
            }
        },
        created() {
        },
      watch:{
        selectType(curVal,oldVal){
          //console.log(oldVal,curVal);
          this.selectTypeResult=curVal;
        },
        onlyContent(oldVal,curVal){
          //console.log(oldVal,curVal);
          this.onlyContentResult=curVal;
        }
      },
        methods: {
         select(type,event){
           if(!event._constructed){
             return;
           }
           this.selectTypeResult=type;
           this.$root.eventHub.$emit('ratingtype.select', type);
         },
          toggleContent(event){
            if(!event._constructed){
              return;
            }
            this.onlyContentResult=!this.onlyContentResult;
            this.$root.eventHub.$emit('content.toggleContent', this.onlyContentResult);
          }
        },
        computed: {
          positives(){
            return this.ratings.filter((rating)=>{
              return rating.rateType===POSITIVE;
            })
          },
          negatives(){
            return this.ratings.filter((rating)=>{
              return rating.rateType===NEGATIVE;
            })
          }
        },
        components: {}
    }
</script>
<style scoped lang="less">
.ratingselect{
  .rating-type{
    padding: 18px 0;
    margin: 0 18px;
    border-bottom: 1px solid rgba(7,17,27,.1);
    font-size: 0;
    .block{
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      border-radius: 1px;
      line-height: 16px;
      font-size: 12px;
      color:rgb(77,85,93);
      &.active{
        color:#fff;
      }
      .count{
        margin-left: 2px;
        font-size: 8px;
      }
      &.positive{
       background: rgba(0,160,220,.2);
        &.active{
          background: rgb(0,160,220);
        }
      }
      &.negative{
        background: rgba(77,85,93,.2);
        &.active{
          background: rgb(77,85,93);
        }
      }
    }
  }
  .switch{
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7,17,27,.1);
    color:rgb(147,153,159);
    font-size: 0;
    &.on{
      .icon-gouxuan{
       color:#00c850;
      }
    }
    .icon-gouxuan{
      font-size: 24px;
      margin-right: 4px;
      vertical-align: top;
    }
    .text{
      font-size: 12px;
    }
  }
}
</style>
