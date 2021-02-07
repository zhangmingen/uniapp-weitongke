<template>
	<view class="page">
		<view class="content">
      <image class="logo" :src="SYSTEM_CONFIG.logo"></image>
      <text class="name">{{SYSTEM_CONFIG.appName}}</text>
      <view class="conter">
        <fu-parse :content="about"></fu-parse>
      </view>
      <text class="bottom">@2020</text>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        SYSTEM_CONFIG:'',
        about:''
			};
		},
		onLoad() {
      this.SYSTEM_CONFIG = global.SYSTEM_CONFIG
      this.getData()
		},
		onReady() {

		},
		methods: {
        getData(id) {	//关于我们
            this.$api.post(global.apiUrls.postOperationGetColumn, {
               category_id:6,
            }).then(res => {
              var res = res.data
              if(res.code==1){
                this.about = res.data.content
                // this.body = res.data.content
              }
            })
		    }
		}
	}
</script>

<style lang="scss">
  .page{
    height: 100vh;
    background-color: #fff;
  }
	.content{
    width: 100%;
    overflow: hidden;
    text-align: center;
    .logo{
      width: 120upx;
      height: 120upx;
      // background-color: #999;
      border-radius: 10upx;
      margin: 160upx auto 0;
    }
    .conter{
      width: calc(100% - 60upx);
      display: block;
      overflow: hidden;
      margin: 60upx auto 0;
    }
    .name{
      width: 100%;
      display: block;
      margin-top: 10upx;
    }
    .bottom{
      display: block;
      position: absolute;
      width: 100%;
      bottom: 30upx;
      text-align: center;
    }
  }
</style>
