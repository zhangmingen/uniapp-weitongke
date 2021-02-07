<template>
  <view class="wrapper" @tap.stop="navToDetail(info)">
    <view class="wrap-box">
      <view class="square-wrap">
        <view class="square-box">
          <image :src="info.thumb" mode="aspectFill" lazy-load></image>
        </view>
      </view>
      <view class="content">
        <view class="text-df text-bold text-cut-2">{{info.name}}</view>
        <view class="fu-cred flex align-center margin-top-sm">
          <text class="text-lg text-price text-bold margin-right-sm">{{info.shop_price}}</text>
        </view>
        <view class="flex justify-between align-center text-sm text-999 margin-top-sm">
          <text class="text-price text-through">{{info.market_price}}</text>
          <text class="">月销量{{info.sales_sum}}件</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object
      },
    },
    methods: {
      navToDetail(item) {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/goods_detail',
          params: {
            sku_id: item.sku_id || 0,
            goods_id: item.id,
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    height: 570rpx;
    overflow: hidden;
    margin-top: 20rpx;
    .wrap-box {
      background-color: #FFFFFF;
      border-radius: 24rpx;
      .square-wrap{
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        box-sizing: border-box;
        position: relative;
        .square-box{
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #EEEEEE;
          image{
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .content {
      padding: 20rpx;
    }
  }
</style>
