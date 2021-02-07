<template>
  <view class="page-wrapper">

    <view class="button-wrapper">
      <fu-button class="button">Default</fu-button>
      <fu-button class="button" type="primary">Primary</fu-button>
      <fu-button class="button" type="success">Success</fu-button>
      <fu-button class="button" type="warning">Warning</fu-button>
      <fu-button class="button" type="error">Error</fu-button>
      <fu-button class="button" type="info">Info</fu-button>
      <fu-button class="button" shape="circle" type="primary">圆角</fu-button>
      <fu-button class="button" plain shape="circle">镂空</fu-button>
      <fu-button class="button" :loading="true" plain shape="circle">加载中</fu-button>
      <fu-button class="button" ripple shape="circle" type="primary">水波纹</fu-button>
      <fu-button class="button" ripple shape="circle" disabled type="primary">禁用</fu-button>
      <fu-button class="button" ripple shape="circle" throttle-time="0" type="primary">自定义节流时间</fu-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },

  methods: {

  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
