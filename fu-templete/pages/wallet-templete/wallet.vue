<template>
  <view class="page-user">
    <view class="user-section">
      <view class="bg"></view>
      <view class="info_box">
        <view class="money">
          {{money}}
        </view>
        <view class="t">账户余额(元)</view>
      </view>
    </view>
    <view class="list">
      <view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/chongzhi">
        <text class="text">充值</text>
        <view class="arrow">
          <text class="iconfont icon-fanhui1"></text>
        </view>
      </view>
      <view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/bind">
        <text class="text">绑定</text>
        <view class="arrow">
          <text class="iconfont icon-fanhui1"></text>
        </view>
      </view>
      <view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/tixian">
        <text class="text">提现</text>
        <view class="arrow">
          <text class="iconfont icon-fanhui1"></text>
        </view>
      </view>
      <view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/yue_info">
        <text class="text">消费明细</text>
        <view class="arrow">
          <text class="iconfont icon-fanhui1"></text>
        </view>
      </view>
      <view class="item" @tap="handleJump" data-url="/fu-templete/pages/wallet-templete/recharge_record">
        <text class="text">充值记录</text>
        <view class="arrow">
          <text class="iconfont icon-fanhui1"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        money: '' //余额
      };
    },
    onUnload() {
      uni.$off('changeMoney', function(data) {})
    },
    onLoad(options) {
      let _this = this;
      _this.getMoney();
      uni.$on('changeMoney', function(data) {
        _this.money = ''
        _this.getMoney();
      })
    },
    onShow() {
      this.getMoney()
    },
    methods: {
      getMoney() {
        let _this = this;
        _this.$api.get(global.apiUrls.getMyMoney, {}).then(res => {
          if (res.data.code == 1) {
            _this.money = res.data.data.user_money;
          }
        }).catch(err => {
          console.log(err, 'get_my_money')
        })
      }
    }
  };
</script>

<style lang="scss">
  .page-user {
    background: #fff;
    height: 100vh;
  }

  .user-section {
    width: 100%;
    height: 416upx;
    position: relative;

    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: $fu-type-primary
    }
  }

  .info_box {
    position: relative;
    z-index: 99;
    height: 416upx;
    overflow: hidden;

    .money {
      margin-top: 184upx;
      color: #fff;
      font-size: 80upx;
      text-align: center;
    }

    .t {
      margin-top: 20upx;
      color: #fff;
      font-size: 24upx;
      text-align: center;
    }
  }

  .list {
    width: 686upx;
    margin: 0 auto;

    .item {
      height: 104upx;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10upx 28upx rgba(0, 0, 0, 0.08);
      border-radius: 16upx;
      display: flex;
      align-items: center;
      padding: 0 20upx;
      margin-top: 46upx;
    }

    .text {
      color: #333;
      margin-left: 20upx;
    }

    .arrow {
      flex: 1;
      text-align: right;

      .iconfont {
        color: #666;
        font-size: 28upx
      }
    }
  }
</style>
