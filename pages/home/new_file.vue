<template>
</template>

<script>
	var token = uni.getStorageSync("user_token");
	// var surl = encodeURIComponent(window.location.href.split('#')[0]); //据说可以解决URL中带参数的问题，前台用的js编码，后台php解码
	// var surl = encodeURIComponent('https://wtk.qmyxjy.com/h5/pages/home/invite?fromid=123'); //据说可以解决URL中带参数的问题，前台用的js编码，后台php解码 fromid
	this.$api.post(global.apiUrls.getShareConfig, {
		'url': window.location.href.split('#')[0]
	}).then(res => {
		var data = res.data
		console.log(data)
		if (data.code == 1) {
			wx.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
				appId: data.data.share_arr.appid, // 必填，公众号的唯一标识  
				timestamp: "" + data.data.share_arr.timestamp, // 必填，生成签名的时间戳  
				nonceStr: data.data.share_arr.noncestr, // 必填，生成签名的随机串  
				signature: data.data.share_arr.signature, // 必填，签名，见附录1  
				jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
			});
	
			wx.ready(function() {
				// 自定义“ 分享给朋友” 及“ 分享到QQ” 按钮的分享内容（ 1.4 .0）
				wx.updateAppMessageShareData({
					title: data.data.share_arr.title, // 分享标题  
					desc: data.data.share_arr.desc, // 分享描述  
					link: 'https://app.vtongke.com/h5/pages/home/invite?fromid=123', // 分享链接  
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
					link: 'https://app.vtongke.com/h5/pages/home/invite?fromid=123', // 分享链接  
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
		} else if (data.code == -201) {
			this.jumpLogin()
		} else {
			console.log(data)
		}
	})
</script>

<style>
</style>
