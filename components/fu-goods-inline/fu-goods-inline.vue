<template>
  <view class="wrapper" @tap.stop="navToDetail(info)">
    <view class="block-246 margin-right-sm">
      <image :src="info.thumb" mode="aspectFill" lazy-load></image>
    </view>
    <view class="content">
      <view class="text-df text-bold text-333 text-cut-2">{{info.name}}</view>
      <view class="text-sm text-cut">{{info.keywords}}</view>
      <view class="flex justify-between align-center">
        <view class="fu-cred">
          <text class="text-price text-bold"></text>
          <text class="text-bold text-xl">{{info.shop_price}}</text>
          <text class="text-through text-price text-999 margin-left-sm">{{info.market_price}}</text>
        </view>
        <view>
          <text class="text-sm text-999">月销量{{info.sales_sum}}件</text>
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 20rpx;
    border-radius: 24rpx;
    overflow: hidden;
    background-color: #FFFFFF;
    margin-top: 20rpx;
    display: flex;

    .block-246 {
      width: 246rpx;
      height: 246rpx;
      border-radius: 6rpx;
      background-color: #EEEEEE;
      image {
        width: 100%;
        height: 100%;
        border-radius: 6rpx;
      }
    }

    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
