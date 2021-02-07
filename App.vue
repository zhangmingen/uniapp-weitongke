<script>
	export default {
		onLaunch: function() {
			// let pages = getCurrentPages();
			// let route = pages[pages.length - 1].route;
			// console.log(route)
			// var _this = this;
			// const USER_TOKEN = uni.getStorageSync('USER_TOKEN');
			// const USER_INFO = uni.getStorageSync('USER_INFO');
			// if(!USER_TOKEN) return  _this.$isResolve();
			// var code = this.urlResolve().code;
			
			// if(USER_INFO&&USER_TOKEN) return;
			// const local = (window.location.href); // 对当前地址用encodeURIComponent进行编码
			// window.location.href =
			// 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4a93109fb28061a&redirect_uri=' + encodeURIComponent(
			// 	local, "UTF-8") + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
			
			// if (code) {
			// 	uni.request({
			// 		url: 'https://app.vtongke.com/index.php/index/Wechat/index', //仅为示例，并非真实接口地址。
			// 		method: "POST",
			// 		data: {
			// 			code: code
			// 		},
			// 		header: {
			// 			'Content-Type': 'application/x-www-form-urlencoded',
			// 		},
			// 		success: (res) => {
			// 			if (res.data.code == '1') {
			// 				global.token = res.data.data.user_info.user_token;
			// 				global.userInfo = res.data.data.user_info;
			// 				uni.setStorageSync('USER_TOKEN', global.token);
			// 				uni.setStorageSync('USER_INFO', global.userInfo);
			// 			}
			// 			// 请求成功
			// 			_this.$isResolve();
			// 		}
			// 	});
			// } else {
			// 	// 请求成功
			// 	_this.$isResolve();
			// }
		},
		onShow: function() {
			console.log('App onShow')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//获取code
			urlResolve() {
				var url = location.search; //获取url中"?"符后的字符串
				var theRequest = new Object(); //声明一个对象
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
					}
				}
				return theRequest;
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";

	page {
		background-color: #FFFFFF;
	}

	.text-theme {
		color: #83B928;
	}

	.text-blu {
		color: #2B98FA;
	}

	.text-org {
		color: #FF5916;
	}

	.text-666 {
		color: #666666;
	}

	.text-999 {
		color: #999999;
	}

	.text-bf {
		color: #BFBFBF;
	}

	.text-indent {
		text-indent: 2em;
	}

	.visibility-hidden {
		visibility: hidden;
	}
	.overflow {
		overflow: hidden;
	}
	.bg-de {
		background-color: #DEDEDE;
	}

	.bg-theme {
		background-color: #83B928;
	}

	.bg-org {
		background-color: #FF5916;
		color: #FFFFFF;
	}

	.flex-shrink {
		flex-shrink: 0;
	}

	.nodata {
		width: 500rpx;
		height: 416rpx;
		margin-top: 200rpx;
		margin-bottom: 20rpx;
	}

	.pb-0 {
		padding-bottom: 0;
	}

	/* mask */
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 900;
		background-color: rgba(0, 0, 0, .6);
	}

	/* 搜索栏 */
	.fixed-top {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1000;
	}

	.search {
		padding: 28rpx 32rpx 0;
	}

	.cu-bar .search-form {
		margin: 0;
	}

	/* icon */
	.cuIcon-search,
	.cuIcon-roundclosefill {
		font-size: 28rpx;
	}

	/* 分界线 */
	.boundary {
		height: 12rpx;
		background: #F6F7F9;
		border-radius: 16rpx;
	}

	/* 教师头像 */
	.user_head {
		position: relative;
		height: 88rpx;
		margin-right: 24rpx;
	}

	.head_img {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}

	.attention_img {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 30rpx;
		height: 30rpx;
	}

	.line300 {
		width: 300rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.lineoverflow {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.multi-line2 {
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		display: -webkit-box;
	}
</style>
