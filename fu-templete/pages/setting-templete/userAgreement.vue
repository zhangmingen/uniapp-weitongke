<template>
	<view class="page">
    <fu-parse :content="body"></fu-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        body:' ',
			};
		},
		onLoad(options) {
       // setTimeout(() => {
          uni.setNavigationBarTitle({
              title: options.id==3 ? '用户协议' : '隐私协议'
          })
       // }, 500)
       this.getData(options.id)
		},
		onReady() {

		},
		methods: {
		    getData(id) {	//获取协议
            this.$api.post(global.apiUrls.postOperationGetColumn, {
               category_id:id,
            }).then(res => {
              var res = res.data
              if(res.code==1){
                this.body = res.data.content
              }
            })
		    }

		}
	}
</script>

<style lang="scss">
	.page{
    background: #fff;
    overflow: hidden;
    height: 100vh;
    padding: 20upx;
    overflow-y: scroll;
  }
</style>
