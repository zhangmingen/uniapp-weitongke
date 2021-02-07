<template>
  <view class="page-wrapper">
    <fu-notwork @retry="retry" mode="full"></fu-notwork>

    <view class="page-header">
      <view class="header">
        <view class="rside">
          <view class="title">全屏模式</view>
          <view class="desc">请在手机上运行查看效果</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default{
    data(){
      return {

      }
    },
    methods:{
      retry(e){
        console.log(e);
      }
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
