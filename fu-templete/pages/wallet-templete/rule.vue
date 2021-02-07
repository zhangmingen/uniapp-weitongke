<template>
  <view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        data: ''
      };
    },
    onLoad() {
      this.getDetali()
    },
    methods: {
      //切换充值方式
      getDetali() {
          this.$api.get(global.apiUrls.getRechargeRule, {
            group: 0,
          }).then(res => {
            console.log(res)
          })
      }
    }
  };
</script>

<style>
</style>
