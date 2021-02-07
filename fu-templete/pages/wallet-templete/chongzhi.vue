<template>
  <view>
    <!-- 充值信息 start -->
    <view class="tx_cont" v-if="is_show">
      <text class="tx_money">充值金额</text>
      <view class="tx_box">
        <text>¥</text>
        <input type="number" value="" placeholder="请输入充值金额" v-model="change_money" />
      </view>
    </view>
    <view class="cz_cont">
      <text class="tx_money">选择金额</text>
      <view class="item_main">
        <view class="list" :class="act_type == index?'act':''" @tap="get_money(item,index)" :data-index="index" v-for="(item,index) in moneyData" :key="index">
          <text class="add_money">{{item.add_money}}</text>
          <text class="money">{{item.money}}元</text>
        </view>
      </view>
    </view>
    <view class="tx_main">
      <text class="tx_choose">充值方式</text>
      <view class="payMain">
        <view class="tx_mainBox " :class="acc_type == 1?'act':''" @tap="get_type" :data-index="1">
          <text class="tx_name">支付宝</text>
        </view>
        <view class="tx_mainBox " :class="acc_type == 2?'act':''" @tap="get_type" :data-index="2">
          <text class="tx_name">微信</text>
        </view>
      </view>
    </view>
    <!-- 充值信息 end -->
    <view class="tx_btn" @tap="payFn">
      立即充值
    </view>
    <fu-popup v-model="showPopup" mode="center" width="500rpx" height="100px">
        <view class="fu-flex-center fu-flex-vcenter padding">Fast-UI棒极了</view>
    </fu-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        change_money: '', //充值金额
        acc_type: 1, //充值方式
        act_type:-1,
        is_click: false,
        wxChannel: '',
        aliChannel: '',
        moneyData:[],
        showPopup:false,
        is_show:true,
        product_id:0,
        money:''
      };
    },
    onLoad(options) {
      let that = this;
      uni.getProvider({
        service: 'payment',
        success: function(res) {
          let provider = res.provider;
          provider.forEach(item => {
            if (item == 'wxpay') {
              that.wxChannel = item;
            } else {
              that.aliChannel = item;
            }
          })
        }
      });
      this.getDetali()
      console.log(uni.getSystemInfoSync().platform)
      if(uni.getSystemInfoSync().platform == 'ios'){
        this.is_show = false
      }else{
        this.is_show = true
      }

    },

    methods: {
      //获取充值规则
      getDetali() {
          this.$api.get(global.apiUrls.getRechargeRule, {
            group: 0,
          }).then(res => {
            console.log(res)
            this.moneyData = res.data.data
          })
      },
      confirm: async function() {
      	console.log(this.checked)
      	let _self = this
      	if(_self.checked){
      		//下单
      		if (_self.payType == 'wxpay') {
      			_self.requestPayment('wxpay', _self.order_sn)
      			uni.showLoading({
      				title: '请稍等，正在发起支付'
      			});
      		} else if (_self.payType == 'alipay') {
      			_self.requestPayment('alipay', _self.order_sn)
      			uni.showLoading({
      				title: '请稍等，正在发起支付'
      			});
      		}
      	}
      },
      //点击选择充值金额
      get_money(item,index){
        this.act_type = index;
        this.change_money = item.add_money;
        this.money = item.money;
        this.product_id = item.id;
      },
      //切换充值方式
      get_type(e) {
        this.acc_type = e.currentTarget.dataset.index;
      },
      //立即充值
      payFn() {
        let {
          acc_type,
          change_money,
          money
        } = this;
        let _this = this;
        if (!change_money) {
          _this.$message.info('请输入充值金额');
          return false;
        }
        if(change_money<'0.01'){
          _this.$message.info('输入金额有误');
          return false;
        }
        //充值接口暂未开放 需要重新对接 获取充值规则已调整
        let arr = {
          order_type: 1,
          pay_type: acc_type==1?'alipay':'wxpay',
          payable_money: '',
          order_info: '',
          coupon_id: ''
        }
        if(this.is_show){
          arr.order_money = change_money;
        }else{
          arr.product_id = this.product_id;
        }
        _this.$api.post(global.apiUrls.postAddOrder,arr ).then(res => {

          if (_this.acc_type == 1) {
            _this.$message.info('支付宝支付暂未开通');
            return
          }

          //   _this.$api.post(global.apiUrls.postAlipay, {
          //     order_sn: res.data.data.order_sn,
          //   }).then(res => {
          //     if(res.data.code == 1){
          //       uni.requestPayment({
          //         provider: 'alipay',
          //         orderInfo: res.data, //微信、支付宝订单数据
          //         success(res) {
          //           setTimeout(res => {
          //             uni.navigateBack();
          //           }, 500);
          //         },
          //         fail(err) {
          //        _this.$message.info(err);
          //           console.log('fail:' + JSON.stringify(err));
          //         }
          //       });
          //     }else{
          //       _this.$message.info(res.data.msg);
          //     }

          //   })
          // } else {
            console.log(res.data.data.order_sn)
            _this.$api.post(global.apiUrls.postWxpay, {
              order_sn: res.data.data.order_sn,
            }).then(res => {
              if(res.data.code == 1){

                uni.requestPayment({
                  provider: 'wxpay',
                  orderInfo: res.data.data, //微信、支付宝订单数据
                  success(res) {
                    console.log('success:' + JSON.stringify(res));
                    setTimeout(res => {
                      uni.navigateBack();
                    }, 500);
                  },
                  fail(err) {
                 _this.$message.info(err);
                    console.log('fail:' + JSON.stringify(err));
                  }
                });
              }else{
                 _this.$message.info(res.data.msg);
              }
            }).catch(err => {
              console.log(err, 'error 11')
            })
          // }
        }).catch(e => {
          console.log(e)
          _this.$message.info('网络繁忙,请稍后重试');
        })
      }
    },
    onNavigationBarButtonTap(e) {
      console.log(e)
      this.showPopup =true
    }
  };
</script>

<style lang="scss">
  // 充值信息 start
  .tx_btn {
    width: calc(100% - 60upx);
    height: 88upx;
    background:$fu-type-primary;
    border-radius: 44upx;
    font-size: 32upx;
    color: white;
    line-height: 88upx;
    text-align: center;
    position: fixed;
    bottom: 60upx;
    left: 30upx;
  }
  .cz_cont{
        width: 100%;
        height: auto;
        overflow: hidden;
        background: white;
        .item_main{
          display: flex;
          justify-content: flex-start;
          flex-wrap:wrap;
          padding: 0 10px;
          margin-top: 10px;
          align-content:space-around;

          .list{
            width: 23%;
            flex: none;
            text-align: center;
            height: 50px;
            border: 1px solid #F5F5F5;
            margin-bottom: 20rpx;
            display: flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            margin-right: 2.5%;
            &.act{
              border: 1px solid $fu-main-color;
            }
            .add_money{
              font-size: 30rpx;
              color: $fu-main-color;
            }
            .money{
              font-size: 24rpx;
              color: #999;
            }
          }

          .list:nth-child(4n){
            margin-right: 0;
          }
        }
  }
 .tx_money {
      font-size: 30upx;
      display: block;
      margin-top: 30upx;
      padding: 0 30upx;
    }

  .tx_main {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 0 30upx 30upx 30upx;
    background: white;
    border-top: 10px solid #f2f2f2;

    .payMain {
      display: flex;
      justify-content: space-between;
    }

    .tx_choose {
      font-size: 30upx;
      color: #333;
      line-height: 90upx;
      display: block;
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
      }
    }
  }

  .tx_cont {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: white;

    .all_out {
      &:after {
        border: none;
      }

      display: inline-block;
      background: none;
      font-size: 24upx;
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
  }
  .fu-flex-center{
    background: $uni-text-color-inverse;
  }
  // 充值信息 end
</style>
