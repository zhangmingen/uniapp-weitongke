<template>
  <view class="my">
    <!-- 顶部背景图 -->
    <image class="my_bgImg" src="../../static/mine/my-bg.jpg" mode="scaleToFill"></image>

    <!-- 处理状态栏高度 -->
    <view class="nav_barH"></view>

    <!-- 导航按钮 -->
    <view class="nav_btns flex justify-end align-center">
      <!-- 消息按钮 -->
      <view class="item cu-avatar" @tap="handleNav('1')">
        <view class="cu-tag badge">99</view>
        <text class="lg text-gray cuIcon-message text-white"></text>
      </view>

      <!-- 设置按钮 -->
      <view class="item" @tap="handleNav('2')"><text class="lg text-gray cuIcon-settings text-white"></text></view>
    </view>

    <!-- 用户信息 - 已登录 -->
    <!-- <navigator url="null" v-if="userInfo.id > 0"> -->
      <view class="userInfo" @tap="handleNav('3')"  v-if="userInfo.id > 0">
        <view class="tui-msg-box">
          <view class="flex flex-sub align-center">
            <image :src="userInfo.head_img || '../../static/mine/logo.png'" class="tui-msg-pic" mode="widthFix"></image>
            <view class="tui-msg-item">
              <view class="tui-msg-name">{{ userInfo.user_nickname }}</view>
            </view>
          </view>
          <view class="tui-msg-right"><text class="lg text-gray cuIcon-right text-white"></text></view>
        </view>
      </view>
    <!-- </navigator> -->

    <!-- 用户信息 - 未登录 -->
    <!-- <navigator url="null" v-else> -->
      <view class="userInfo" @tap="handleNav('3')" v-else>
        <view class="tui-msg-box">
          <view class="flex flex-sub align-center">
            <image src="../../static/mine/logo.png" class="tui-msg-pic" mode="widthFix"></image>
            <view class="tui-msg-item"><view class="tui-msg-name">登录/注册</view></view>
          </view>
          <view class="tui-msg-right"><text class="lg text-gray cuIcon-right text-white"></text></view>
        </view>
      </view>
    <!-- </navigator> -->

    <!-- 浮动导航 -->
    <view class="padding" style="position: relative;">
      <view class="float-nav flex shadow color-gray radius">
        <view class="item flex-sub text-center" @tap="handleNav('4')">
          <image src="../../static/mine/icon_qianbao.png" mode="aspectFit"></image>
          <view class="txt">我的钱包</view>
        </view>

        <view class="item flex-sub text-center" @tap="handleNav('5')">
          <image src="../../static/mine/icon_youhuijuan.png" mode="aspectFit"></image>
          <view class="txt">我的优惠券</view>
        </view>
        <view class="item flex-sub text-center" @tap="handleNav('6')">
          <image src="../../static/mine/icon_yaoqing.png" mode="aspectFit"></image>
          <view class="txt">我的邀请</view>
        </view>
      </view>

      <!-- 我的订单 -->
      <!-- <view class="myOrder float-nav margin-top radius">
				<view class="title flex justify-between align-center">
					<view class="">
						我的订单
					</view>
					<view class="dir">
						全部订单
						<text class="lg text-gray cuIcon-right"></text>
					</view>
				</view>
				<view class="flex">
					<view class="item flex-sub text-center">
						<image src="../../static/images/my/icon_quanbu.png" mode="aspectFit"></image>
						<view class="txt">全部</view>
					</view>
					<view class="item flex-sub text-center">
						<image src="../../static/images/my/icon_hdfk.png" mode="aspectFit"></image>
						<view class="txt">货到付款</view>
					</view>
					<view class="item flex-sub text-center">
						<image src="../../static/images/my/icon_yfk.png" mode="aspectFit"></image>
						<view class="txt">已付款</view>
					</view>
					<view class="item flex-sub text-center">
						<image src="../../static/images/my/icon_th.png" mode="aspectFit"></image>
						<view class="txt">退款/售后</view>
					</view>
				</view>
			</view> -->

      <!-- 列表导航 -->
      <view class="nav_list margin-top shadow color-gray radius">
        <view class="cu-list menu" style="border-radius: 5px 5px 0 0">
          <view @tap="handleNav('7')" class="cu-item arrow">
            <view class="content">
              <text class="text-gray cuIcon-form text-grey"></text>
              <text class="text-grey">我的签到</text>
            </view>
          </view>

          <view @tap="handleNav('8')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-profile text-grey"></text>
              <text class="text-grey">身份认证</text>
            </view>
          </view>

          <view @tap="handleNav('9')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-location text-grey"></text>
              <text class="text-grey">收货地址</text>
            </view>
          </view>

          <view @tap="handleNav('10')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-like text-grey"></text>
              <text class="text-grey">我的关注</text>
            </view>
          </view>

          <view @tap="handleNav('11')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-like text-grey"></text>
              <text class="text-grey">实名认证</text>
            </view>
          </view>

          <view @tap="handleNav('12')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-like text-grey"></text>
              <text class="text-grey">我的粉丝</text>
            </view>
          </view>

          <view @tap="handleNav('13')" class="cu-item arrow">
            <view class="content">
              <text class="cuIcon-circlefill text-grey"></text>
              <text class="text-grey">我的收藏</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
const navObj = {
  1: '/service/message/message-list.vue',   // 我的消息
  2: '/index/setting/setting.vue',  // 设置
  3: '/fu-templete/pages/mine-template/userinfo',  // 用户信息
  4: '/user/wallet/my-wallet.vue',  // 我的钱包
  5: '/user/coupon/my-coupon.vue',  // 我的优惠券
  6: '/fu-templete/pages/mine-template/userinfo',   // 我的邀请
  7: '/fu-templete/pages/mine-template/userinfo',  // 我的签到
  8: '/fu-templete/pages/mine-template/userinfo',  // 身份认证
  9: '/user/address/address-list.vue',   // 收货地址
  10: '/fu-templete/pages/mine-template/userinfo',   // 我的关注
  11: '/fu-templete/pages/mine-template/userinfo',  // 实名认证
  12: '/fu-templete/pages/mine-template/userinfo',  // 我的粉丝
  13: '/fu-templete/pages/mine-template/userinfo',  // 我的收藏
}
export default {
  data() {
    return {
      userInfo: {},   // 当前登录用户的用户信息
      img: global.SYSTEM_CONFIG.logo
    };
  },
  onLoad: function(options) {},
  onShow: function() {
    this.userInfo = global.userInfo;
    console.log("当前用户的用户信息", this.userInfo);
  },
  // 下拉刷新事件
  onPullDownRefresh: function() {
    this.refreshFunc();
  },
  methods: {

    /**
     * 跳转到key对应的路径
     * @param {String} key navObj中对应的key值
     * @param {Object} params 跳转时需要携带的参数 { key1: val1, key2: val2 }
     */
    handleNav(key, params = {}){
      if(!key || !navObj[key]) {
        this.$message.info('没有得到key值 || 跳转路径未填写');
        return;
      }
      this.$urouter.navigateTo({
        url: navObj[key],
        params
      })
    },

    // 下拉刷新时执行的函数
    refreshFunc: function() {
      // 结束下拉刷新
      uni.stopPullDownRefresh();
    },
  }
};
</script>
<style lang="scss">
/* 状态栏高度 */
.nav_barH {
  display: block;
  width: 100%;
  height: var(--status-bar-height);
}

.userInfo {
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx 0;
}

.dir {
  color: #999999;
}

.tui-msg-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tui-msg-pic {
  width: 120upx;
  height: 120upx;
  border-radius: 50%;
  border: 1px solid #fff;
  display: block;
  margin-right: 24upx;
}

.tui-msg-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tui-msg-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 34upx;
  line-height: 1;
  color: #fff;
}

.tui-msg-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 26upx;
  line-height: 1;
  color: #9397a4;
}

.my {
  position: relative;
}

.my_bgImg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 431rpx;
}

.nav_btns {
  padding: 20rpx 30rpx;
  .item {
    font-size: 48rpx;
    margin-left: 20rpx;
  }

  .cu-avatar {
    background: transparent;
  }
  /* #ifdef MP-WEIXIN */
  padding-right: 240upx;
  /* #endif */
  /* #ifdef MP-ALIPAY */
  padding-right: 170upx;
  /* #endif */
}

.userMsg {
  .cu-item {
    background-color: transparent;
  }
}

/* 浮动导航 */
.float-nav {
  padding: 30rpx 0;
  background: #fff;

  image {
    width: 90rpx;
    height: 90rpx;
  }

  .txt {
    font-size: 14px;
  }
}

.myOrder {
  .title {
    padding: 0 30rpx;
    margin-bottom: 20rpx;
  }
  image {
    width: 50rpx;
    height: 50rpx;
  }
  .dir {
    font-size: 12px;
  }
}
.fonticon {
  font-size: 34rpx;
}
</style>
