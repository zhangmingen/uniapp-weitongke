<template>
	<view class="page">
    <cu-custom bgColor="bg-white" :isBack="true">
    	<block slot="content" class="text-black">付款成功</block>
    </cu-custom>
		<view class="bg-white">
			<view class="header">
				<view class="icon-success">
					<text class="cuIcon-check" style="font-size: 120rpx;"></text>
				</view>
				<view class="margin-top text-bold">付款成功</view>
			</view>
			<view class="bottom-action">
        <navigator open-type="redirect" url="/fu-templete/pages/shop-template/order">
          <button class="cu-btn round lines-red">查看订单</button>
        </navigator>
        <navigator open-type="switchTab" url="/pages/tab/tab01/index">
          <button class="cu-btn round bg-red fu-bgcred text-white">再去逛逛</button>
        </navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_sn:'',
			};
		},
		onLoad(options) {
			this.order_sn=options.order_sn;
			const discount = uni.getStorageSync('order_total_discount');
			console.log(discount);
			if(discount){
				this.discounts = discount;
				if(discount>0){
					this.shows = true
				}
			}
			uni.removeStorage({
				key: 'order_total_discount'
			})
		},
	};
</script>

<style lang="scss" scoped>
	// 弹框样式
	.Popups{
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0,0,0,0.5);
		z-index: 9999;
		.box{
			width: 553rpx;
			height: 730rpx;
			position: relative;
			margin: 236rpx auto 0;
			overflow: hidden;
			.bg{
				width: 553rpx;
				height: 730rpx;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}
			.texts{
				width: 320rpx;
				text-align: center;
				margin: 132rpx auto;
				.title{
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(206,133,45,1);
				}
				.moneys{
					padding-top: 30rpx;
					font-size:80rpx;
					font-family:Arial;
					font-weight:400;
					color:rgba(206,133,45,1);
					text{
						font-size: 40rpx;
					}
				}
				.tips_box{
					padding-top: 40rpx;
					font-size:24rpx;
					line-height: 35rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(234,166,82,1);
				}

			}
			.btns{
				width:312rpx;
				height:72rpx;
				background:rgba(255,197,126,1);
				box-shadow:0px 16rpx 32rpx rgba(147,88,8,0.4);
				border-radius:45rpx;
				text-align: center;
				line-height: 72rpx;
				font-size: 32rpx;
				color: #714B1D;
				margin: 210rpx auto 0;
			}

		}
		.close{
			display: block;
			width: 66rpx;
			height: 66rpx;
			margin: 60rpx auto;
		}

	}
  .icon-success{
    width: 150rpx;
    height: 150rpx;
    background-color: #F02523;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #FFFFFF;

  }

	.page {
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.header {
		height: 400rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.bottom-action {
		padding-top: 100rpx;
		padding-left: 32rpx;
		padding-right: 32rpx;
		display: flex;
		justify-content: space-between;
		button {
			width: 320rpx;
			height: 100rpx;
			background-color: #fff;
			line-height: 100rpx;
			text-align: center;
			font-size: 32rpx;
		}
    .fu-bgcred{
      background-color: $fu-type-error;
    }
	}
</style>
