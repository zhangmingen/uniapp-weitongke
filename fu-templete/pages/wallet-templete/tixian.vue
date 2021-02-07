<template>
	<view class="">
		<view class="tx_cont">
			<text class="tx_money">提现金额</text>
			<view class="tx_box">
				<text>¥</text>
				<input type="number" placeholder="请输入提现金额" v-model="change_money" />
			</view>
			<text class="tx_yue">账户余额<text> ¥{{moeny}}</text>
      <text v-if="moeny != 0" class="min" @tap="total_tx">全部提现</text>
      <text class="min">最小提现额度 ¥{{min}}</text>
      </text>
		</view>
		<view class="tx_main">
			<text class="tx_choose">选择提现方式</text>
      <view class="payMain">
        <view class="tx_mainBox" :class="tabCurrentIndex == 1?'act':''" @tap="get_type" :data-index="1">
          <text class="tx_name">支付宝</text>
        </view>
        <view class="tx_mainBox" :class="tabCurrentIndex == 2?'act':''" @tap="get_type" :data-index="2">
          <text class="tx_name">微信</text>
        </view>
      </view>
		</view>
		<view class="tx_final">
			<text class="tx_pb">注：提现申请将在两天内审批到账</text>
		</view>
		<view class="tx_btn" @click="tijiao">
			立即提现
		</view>
    <fu-popup v-model="showPopup" mode="center" width="500rpx" height="100px">
        <view class="fu-flex-center fu-flex-vcenter padding">{{fast_detaile||''}}</view>
    </fu-popup>
    <pay-keyboard :show_key="show_key" @hideFun="hideFun" @getPassword="getPassword"></pay-keyboard>
	</view>
</template>

<script>
  import ssPaymentPassword from '@/components/sanshui-payment-password'
    import payKeyboard from '@/components/keyboard/keyboard.vue'
	export default {
    components: {
    	ssPaymentPassword,
      payKeyboard
    },
		data() {
			return {
				tabCurrentIndex: 1,
				moeny: '',
				account_name: '',
				account: '',
				change_money: '',
				is_click: false,
        show_key:false,
        min:1,
        showPopup:false,
        fast_detaile:'',
        is_true:true
			};
		},
		onShow(options) {
			this.getMoney();
      this.addTime()
		},
    onNavigationBarButtonTap(e) {
      console.log(e)
      let _this = this;
      _this.$api.post(global.apiUrls.postOperationGetColumn, {
        category_id:5
      }).then(res => {
        if(res.data.code == 1){
          console.log(res.data.data.name)
          _this.fast_detaile = res.data.data.name
            this.showPopup =true
        }
      }).catch(err => {
         console.log(err, 'get_my_money')
      })
    },
		methods: {
      showFun(){
      	this.show_key = true
      },
      hideFun(){
      	this.show_key = false
      },
      addTime(){
        let _this = this
        _this.$api.post(global.apiUrls.get_car_modelsif, {
          pay_money:10
        }).then(res => {
          console.log(res)
          if(res.data.code==-1){
            _this.is_true = false
          }
        })
      },
      getPassword(n){
        this.show_key = false
        let _this = this
        let {account_name,tabCurrentIndex,change_money,account,moeny,min} = _this;
        _this.$api.get(global.apiUrls.getWithdrawAccount, {
          account_type: tabCurrentIndex==1?2:1
        }).then(res => {
          if(res.data.data.true_name){

            _this.$api.post(global.apiUrls.withdraw, {
              type: tabCurrentIndex==1?2:1,
              money: change_money,
              pay_password:n.password
            }).then(res => {
              _this.$message.info(res.data.msg);
              if(res.data.code == 1){
                uni.$emit('changeMoney', {
                    msg: '页面更新'
                })
                setTimeout(res => {
                	_this.$urouter.navigateTo({
                	   url: '/fu-templete/pages/wallet-templete/tx_succ',
                	   params: {
                	      type: tabCurrentIndex==1?"支付宝":"微信",
                	      money:this.change_money
                	   }
                	 })
                }, 500);
              }
            }).catch(err => {
               console.log(err, 'get_my_money')
            })
          }else{
            console.log(tabCurrentIndex)
            _this.$message.info(tabCurrentIndex==1?'请先绑定支付宝':'请先绑定微信');
            let urls = ''
            if(tabCurrentIndex==1){
              urls = '/fu-templete/pages/wallet-templete/alipay'
            }else{
              urls = '/fu-templete/pages/wallet-templete/wechat'
            }
            setTimeout(()=>{
              _this.$urouter.navigateTo({
                 url: urls,
                 params: {
                    id: 1
                 }
               })
            },500)
          }
           _this.is_click = false;
        }).catch(err => {
            _this.is_click = false;
           console.log(err, 'get_withdraw_account')
        })
      },
      showModal(){
      	this.show_key = true;
      },
      submitHandle(e){

      },
      total_tx(){
      	this.change_money = this.moeny
      },
			get_type(e) {
				this.tabCurrentIndex = e.currentTarget.dataset.index;
			},
      getMoney() {
        let _this = this;
        _this.$api.get(global.apiUrls.getMyMoney, {
        }).then(res => {
          console.log(res, 'get_my_money');
          if(res.data.code == 1){
             _this.moeny = res.data.data.user_money;
             if(res.data.data.min_withdraw_money){
               _this.min = res.data.data.min_withdraw_money;
             }
          }
        }).catch(err => {
           console.log(err, 'get_my_money')
        })
      },

			tijiao() {
				let _this = this;
				let {account_name,tabCurrentIndex,change_money,account,moeny,min} = _this;
				if (!change_money) {
           _this.$message.info('请输入提现金额');
					return false;
				}
				if (Number(change_money) < Number(min)) {
					 _this.$message.info('最小提现金额为'+min+'元');
					return false;
				}

				if (Number(change_money) > Number(moeny)) {
           _this.$message.info('可提现余额不足');
					return false;
				}
        if(!_this.is_true){
         _this.$message.info('请先设置支付密码');
         setTimeout(()=>{
           _this.$urouter.navigateTo({
              url: '/fu-templete/pages/setting-templete/change-pay-password',
              params: {
                 type: tabCurrentIndex==1?"支付宝":"微信",
                 money:this.change_money
              }
            })
         },500)
          return false
        }
        _this.showModal()
			}
		}
	};
</script>

<style lang="scss">
	.uni-input-placeholder {
		color: #999
	}
  .fu-flex-center{
    background: $uni-text-color-inverse;
    justify-content: end !important;
  }
	.tx_btn {
		width: calc(100% - 60upx);
		height: 88upx;
		background: $fu-btn-bg;
		border-radius: 44upx;
		font-size: 32upx;
		color: white;
		line-height: 88upx;
		text-align: center;
		position: fixed;
		bottom: 60upx;
		left: 30upx;
	}

	.tx_final {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 0 30upx;

		text {
			display: block;
			margin-top: 24upx;
			font-size: 24upx;
			color: #999999;

			text {
				color: $fu-main-color;
				display: inline-block;
				margin-left: 6upx;
			}
		}
	}

	.tx_main {
		width: 100%;
		height: auto;
		overflow: hidden;
		padding: 30upx 30upx 0 30upx;
		background: white;
		margin-top: 20upx;
    .payMain {
      margin: 16px 0;
      display: flex;
      justify-content: space-between;
    }
    .tx_mainBox {
      width: 46%;
      height: auto;
      overflow: hidden;
      border-radius: 10rpx;
      border: 1px solid #999;
      .tx_name {
        display: block;
        line-height: 100upx;
        font-size: 30upx;
        color: #333;
        text-align: center;
      }

      &.act {
        border: 1px solid $fu-main-color;
        .tx_name {
          color: $fu-main-color;
        }
      }
    }
		.act .icon-yuanquan:before {
			content: "\E655";
			color: $fu-main-color;
		}
	}

	.tx_cont {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;

		.tx_money {
			font-size: 30upx;
			display: block;
			margin-top: 30upx;
			padding: 0 30upx;
		}

		.tx_box {
			width: 100%;
			height: auto;
			overflow: hidden;
			padding: 0 30upx 20upx 30upx;
			margin-top: 20upx;
			position: relative;

			&:before {
				content: '';
				position: absolute;
				height: 1px;
				background: #EEEEEE;
				left: 30upx;
				right: 0;
				bottom: 0;
				transform: scaleY(0.5);
			}

			text {
				display: block;
				font-size: 60upx;
				color: #333;
				font-weight: bold;
				float: left;
				line-height: 70upx;
			}

			input {
				display: block;
				width: auto;
				height: 70upx;
				font-size: 50upx;
				line-height: 70upx;
				padding: 0 30upx;
			}

		}

		.tx_yue {
			width: 100%;
			height: auto;
			padding: 0 30upx;
			line-height: 87upx;
			font-size: 24upx;
			color: #999999;

			.min {
				margin-left: 80upx;
			}

			text {
				font-size: 24upx;
				color: $fu-main-color;
				margin-left: 10upx;
			}
		}
	}

</style>
