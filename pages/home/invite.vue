<template>
	<view class="invite">
		<image src="../../static/imgs/bg-yaoqing.png" class="bg-invite" mode="aspectFill"></image>
		<image src="../../static/imgs/yaoqinghaoyou.png" class="bg-text" mode="aspectFill"></image>
		<image src="../../static/imgs/share.png" class="share" mode="aspectFill" @tap="shareStatus=!shareStatus"></image>
		<view :class="shareStatus?'shareArrow text-center':'hidden'" @tap="shareStatus=false">
			<image src="../../static/share.png" mode="aspectFill" class="shareimg"></image>
		</view>
	</view>
</template>

<script>
	// var wx = require('../../js_sdk/h5share.js');
	import wx from '@/js_sdk/wxLogin/index.js'
	export default {
		data() {
			return {
				showData: null,
				shareStatus: false
			}
		},
		onShow() {
			var surl = encodeURIComponent(window.location.href);
			this.$api.post(global.apiUrls.getShareConfig, {
				'url': surl
			}).then(res => {
				var data = res.data
				console.log(data)
				if (data.code == 1) {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
						appId: data.data.share_arr.appid, // 必填，公众号的唯一标识  
						timestamp: ""+data.data.share_arr.timestamp, // 必填，生成签名的时间戳  
						nonceStr: data.data.share_arr.noncestr, // 必填，生成签名的随机串  
						signature: data.data.share_arr.signature, // 必填，签名，见附录1  
						// surl: data.data.share_arr.surl, //自己添加的，debug为true的时候可以网页打印出对应的URL是否正确  
						jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]  
					});  
					
					wx.ready(function() {
						//自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）  
						wx.updateAppMessageShareData({
							title: data.data.share_arr.title, // 分享标题  
							desc: data.data.share_arr.desc, // 分享描述  
							link:data.data.share_arr.share_url, // 分享链接  
							imgUrl: data.data.share_arr.image, // 分享图标                                
							success: function(ret) {
								// 用户确认分享后执行的回调函数
								console.log(JSON.stringify(ret))
							},  
							cancel: function(ret) {
								// 用户取消分享后执行的回调函数  
								console.log(JSON.stringify(ret))
							}  
						});  
						//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）  
						wx.updateTimelineShareData({  
							title: data.data.share_arr.title, // 分享标题                                  
							link: data.data.share_arr.share_url, // 分享链接  
							imgUrl: data.data.share_arr.image, // 分享图标                                
							success: function(ret) {
								// 用户确认分享后执行的回调函数  
								console.log(JSON.stringify(ret))
							},  
							cancel: function(ret) {  
								// 用户取消分享后执行的回调函数
								console.log(JSON.stringify(ret))
							}  
						});  
					
					});
				} else {
					console.log(data)
				}
			})
		}
	}
</script>

<style lang="less" scoped>
	.invite {
		position: fixed;
		width: 100%;
		height: 100%;

		.bg-invite {
			width: 100%;
			height: 100%;
		}

		.bg-text {
			width: 566rpx;
			height: 309rpx;
			position: absolute;
			top: 112rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
		}

		.share {
			width: 56rpx;
			height: 56rpx;
			position: absolute;
			top: 36rpx;
			right: 32rpx;
		}

		.shareArrow {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .5);
		}

		.shareimg {
			width: 700rpx;
			height: 1058rpx;
		}

		.hidden {
			display: hidden;
		}
	}
</style>
