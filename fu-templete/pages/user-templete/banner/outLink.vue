<template>
  <view class="page-body">
    <web-view :src="link"></web-view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        link:''
      }
    },
    onLoad(e) {
      this.link = e.link;
    }
  }
</script>

<style scoped>

</style>
