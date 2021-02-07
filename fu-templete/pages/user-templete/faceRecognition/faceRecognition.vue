<template>
	<view class="margin-top">
    <fu-button class="button" shape="circle" type="primary" @tap="shua">开始人脸识别</fu-button>
	</view>
</template>

<script>
	// #ifdef APP-PLUS
	// const faceRecognition = uni.requireNativePlugin('BenBen-FaceRecognition');
  const faceRecognition = uni.requireNativePlugin('DcloudFaceRecognition');
	// #endif
	export default {
		data() {
			return {
				is_click:false
			};
		},
		methods:{
			shua() {
				if(this.is_click) return;
			    let that = this;
				that.is_click = true;
				uni.showLoading({
					title:'刷脸开启中...',
					mask:true
				})
        // #ifdef APP-PLUS
        faceRecognition.show({ command: 'init' }, function(res) {
          // console.log(res)
          let imgUrl = res.result;
          console.log(imgUrl);
          uni.hideLoading();
          that.is_click = false;
          return;
          that.$api.post(global.apiUrls.feedbackTypes).then(res => {
            console.log(res)
            setTimeout(function(){
              uni.redirectTo({
                url:'/pages/user/succ'
              })
            },500)
          }).catch(err => {
            console.log(err)
          })
        });
        // #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
