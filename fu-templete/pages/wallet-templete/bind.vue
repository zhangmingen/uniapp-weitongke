<template>
	<view class="page-user">
		<view class="list">
			<view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/alipay">
				<text class="text">支付宝</text>
        <view><text v-if="is_ali" class="Popups_del">已绑定</text><image src="../../static/wallet/yous.png" class="adds" mode=""></image></view>
        <!-- <text>  >  </text> -->
			</view>
			<view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/wechat">
				<text class="text">微信</text>
        <view><text v-if="if_cat" class="Popups_del">已绑定</text><image src="../../static/wallet/yous.png" class="adds" mode=""></image></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        is_ali:false,
        if_cat:false
      };
		},
		methods: {
      Detail(type) {
        let _this = this;
        _this.$api.get(global.apiUrls.getWithdrawAccount, {
          account_type: type
        }).then(res => {
          if(res.data.code == 1){
              console.log(res)
              if(type==1&&res.data.true_name!=''){
                _this.if_cat = true
              }else  if(type==2&&res.data.true_name!=''){
                _this.is_ali = true
              }
          }
        }).catch(err => {
           console.log(err, 'get_withdraw_account')
        })
      },
		},
    onShow() {
      this.Detail(1)
      this.Detail(2)
    }
	};
</script>

<style lang="scss">
  .Popups_del{
    color: $fu-type-error;
    font-size: 12px;
  }
	.list {
    background: #FFFFFF;
		.item {
			height: 104upx;
			background: rgba(255, 255, 255, 1);
			display: flex;
			align-items: center;
      justify-content: space-between;
			padding: 0 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				background: #f4f4f4;
				display: block;
				height: 1px;
			}

			&:nth-last-child(1):after {
				background: none;
			}
		}

		.icon_w {

			width: 44upx;
			height: 44upx;

			svg {
				width: 44upx;
				height: 44upx;

			}
		}

		.text {
			color: #333;
			margin-left: 20upx;
		}
    .adds{
      width: 18rpx;height: 18rpx;margin: 0 20rpx;
    }
		.arrow {
			text-align: right;
      color: #000000;
			.iconfont {
				color: #666;
				font-size: 28upx;
			}
		}
	}
</style>
