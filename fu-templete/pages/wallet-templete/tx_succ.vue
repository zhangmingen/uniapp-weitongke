<template>
	<view class="">
		<view class="succ">
			<image src="../../static/wallet/succ.png" mode=""></image>
			<text class="succ_pa">提现成功</text>
			<text class="succ_pb">提现方式：{{type}}</text>
			<text class="succ_pb">提现金额：{{money}}元</text>
		</view>
	</view>
</template>

<script>
  export default {
    data() {
      return {
        type:'',
        money:''
      };
    },
    onLoad(options) {
      this.type = options.type
      this.money = options.money
    }

  };
</script>

<style lang="scss">
	page,body,html{
		background: white;
		min-height: 100%;
	}
	.succ{
		width: 100%;
		height: auto;
		overflow: hidden;
		image{
			display: block;
			width: 284upx;
			height: 226upx;
			margin: 60upx auto;
		}
		.succ_pa{
			font-size:32upx;
			color: #333333;
			margin-top: 30upx;
			display: block;
			text-align: center;

		}
		.succ_pb{
			display: block;
			text-align: center;
			font-size: 24upx;
			color: #333333;
			margin-top: 20upx;

		}
		.succ_box{
			width: 460upx;
			height: auto;
			overflow: hidden;
			margin: 100upx auto 0;
			text{
				display: block;
				width:200upx;
				height:78upx;
				border:1px solid rgba(191,191,191,1);
				border-radius:39upx;
				font-size: 28upx;
				text-align: center;
				line-height: 78upx;
				float: left;
				&:nth-last-child(1){
					float: right;
					background: #C2132A;
					border:1px solid rgba(0,0,0,0);
					color: white;
				}
			}
		}
	}
</style>
