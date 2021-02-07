<template>
  <view class="page-wrapper">
    <fu-popup v-model="showTopPopup" mode="top">
      <view class="transverse fu-flex-center fu-flex-vcenter">顶部弹出</view>
    </fu-popup>

    <fu-popup v-model="showBottomPopup" mode="bottom">
      <view class="transverse fu-flex-center fu-flex-vcenter">底部弹出</view>
    </fu-popup>

    <fu-popup v-model="showLeftPopup" mode="left">
      <view class="vertical fu-flex-center fu-flex-vcenter">左边弹出</view>
    </fu-popup>

    <fu-popup v-model="showRightPopup" mode="right">
      <view class="vertical fu-flex-center fu-flex-vcenter">右边弹出</view>
    </fu-popup>

    <fu-popup v-model="showCenterPopup" mode="center">
      <view class="middle fu-flex-center fu-flex-vcenter">中间弹出</view>
    </fu-popup>

    <view class="button-wrapper">
      <view class="title">fu-popup 用于展示弹窗，支持上、下、左、右和中部弹出，组件只提供容器，内部内容由用户自定义</view>
      <fu-button class="button" type="primary" shape="circle" @click="showTopPopup = true">顶部弹出</fu-button>
      <fu-button class="button" type="primary" shape="circle" @click="showBottomPopup = true">底部弹出</fu-button>
      <fu-button class="button" type="primary" shape="circle" @click="showLeftPopup = true">左边弹出</fu-button>
      <fu-button class="button" type="primary" shape="circle" @click="showRightPopup = true">右边弹出</fu-button>
      <fu-button class="button" type="primary" shape="circle" @click="showCenterPopup = true">中间弹出</fu-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showTopPopup: false,
      showBottomPopup: false,
      showLeftPopup: false,
      showRightPopup: false,
      showCenterPopup: false,
    }
  },

  methods: {
    handleShowPopup(mode){
      this.popupMode = mode
      this.$nextTick(()=>{
        this.showPopup = true
      })
    }
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
