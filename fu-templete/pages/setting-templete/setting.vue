<template>
	<view>
		<view class="per">
      <view @tap="handleJump" data-url="/fu-templete/pages/user-templete/revisePhone/checkPhone">
      	<view class="per_row">
      		<text>更换手机号</text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
			<view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/change-password">
				<view class="per_row">
					<text>修改密码</text>
					<text class="fu-iconfont">&#xe839;</text>
				</view>
			</view>
			<view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/change-pay-password">
				<view class="per_row">
					<text>修改支付密码</text>
					<text class="fu-iconfont">&#xe839;</text>
				</view>
			</view>
			<view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/reset-pay-password">
				<view class="per_row">
					<text>忘记支付密码</text>
					<text class="fu-iconfont">&#xe839;</text>
				</view>
			</view>
      <view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/about">
      	<view class="per_row">
      		<text>关于我们</text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
      <view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/userAgreement?id=3">
      	<view class="per_row">
      		<text>用户协议</text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
      <view @tap="handleJump" data-url="/fu-templete/pages/setting-templete/userAgreement?id=4">
      	<view class="per_row">
      		<text>隐私协议</text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
      <view @tap="handleTestingVersion" >
      	<view class="per_row">
      		<text>系统版本<text>v{{version}}</text></text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
      <view @tap="clear" >
      	<view class="per_row">
      		<text>清除缓存<text>{{cache}}MB</text></text>
      		<text class="fu-iconfont">&#xe839;</text>
      	</view>
      </view>
			<view class="btn_cloce" style="padding:30rpx;"><fu-button type="primary" @click="logout">退出登录</fu-button></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
      version: '',
      cache:''
    };
	},
	onLoad() {
    let storageSize = uni.getStorageSync('STORAGE_SIZE') || 1.2;
    console.log(storageSize,'-----')
    this.cache = (storageSize * 1 > 30 ? storageSize * 1 : storageSize * 1 + Math.random() * 2).toFixed(2);
    uni.setStorageSync('STORAGE_SIZE',this.cache)
    this.version = global.VERSION_CODE
  },
	onReady() {},
	methods: {
    handleTestingVersion(){
      this.$message.info('当前已经是最新版本！')
    },
		logout() {
			//退出登录
			let that = this;
			uni.showModal({
				title: '退出登录',
				content: '您确定要退出登录吗？',
				success(res) {
					if (res.confirm) {
						uni.removeStorageSync('USERINFO');
						uni.navigateBack();
					}
				}
			});
		},
		clear() {
			//清除缓存
			var user = uni.getStorageSync('USERINFO');
			global.customShowModalPopup({
				title: '确定清除本地缓存？',
				success: res => {
					uni.clearStorageSync();
          this.cache = 0
					uni.setStorageSync('USERINFO', user);
          uni.setStorageSync('STORAGE_SIZE',0)
				}
			});
		}
	}
};
</script>

<style lang="scss">
.types {
	width: 686upx;
	height: 88upx;
	color: #fff;
	line-height: 88upx;
	background: linear-gradient(90deg, rgba(73, 170, 52, 1) 0%, rgba(33, 154, 60, 1) 100%);
	opacity: 1;
	border-radius: 40px;
	margin: 0 auto;
}

.per {
	padding: 0 20upx;
	font-size: 28upx;
	background-color: #fff;

	.per_row {
		padding: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #ededed;
    text{
        &:nth-child(1){
          width: 100%;
          text{
            width: auto;
            margin-right: 10upx;
            color: #999;
            float: right;
            line-height: 36upx;
          }
        }
      }
		.row_right {
			text-align: right;

			.aa {
				color: #999999;
				display: inline-block;
				margin-right: 10upx;
			}
		}
	}
}

.out_login {
	margin-top: 30%;
	line-height: 88upx;
	background-color: rgb(0, 129, 255);
	color: #fff;
	text-align: center;
	border-radius: 45px;
	margin-left: 25upx;
	margin-right: 25upx;
}

.btn_cloce {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	text-align: center;
}
</style>
