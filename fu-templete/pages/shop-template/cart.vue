<template>
  <view class="page">
    <view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
    	<view class="cu-bar fixed bg-white" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
    		<view class="action"></view>
    		<view class="content" :style="[{top:StatusBar + 'px'}]">购物车</view>
        <!-- #ifdef APP-PLUS || H5 -->
        <view class="margin-right" @tap="changeEditType">{{ isEditor ? '完成': '编辑' }}</view>
        <!-- #endif -->
    	</view>
    </view>
    <template v-if="!isLogin">
      <view class="page-kong padding-bottom">
        <view class="block-262">
          <image src="/static/empty/empty10.png" mode="aspectFill"></image>
        </view>
        <view class="margin-top-sm text-lg text-333">购物车竟然是空的</view>
        <view class="margin-top-xs text-sm text-999">“再忙，也要记得买点什么犒赏自己~”</view>
        <view class="cu-btn text-df margin-top-xl" @click="navToLogin">去登录</view>
      </view>
    </template>
    <template v-if="isLogin && cartList.length == 0">
      <view class="page-kong padding-bottom">
        <view class="block-262">
          <image src="/static/empty/empty10.png" mode="aspectFill"></image>
        </view>
        <view class="margin-top-sm text-lg text-333">购物车竟然是空的</view>
        <view class="margin-top-xs text-sm text-999">“再忙，也要记得买点什么犒赏自己~”</view>
        <view class="cu-btn text-df margin-top-xl" @click="navToHome">去逛逛吧</view>
      </view>
    </template>
    <template v-if="isLogin && cartList.length != 0">
      <!-- #ifdef MP-WEIXIN -->
      <view class="tool-box text-right padding-sm" :style="{top: CustomBar+'px'}">
        <view class="cu-btn text-sm" @tap="changeEditType">{{isEditor?'完成':'编辑'}}</view>
      </view>
      <!-- #endif -->
      <view class="page-list margin-lr-sm">
        <block v-for="(item, index) in cartList" :key="item.id">
          <!-- <u-swipe-action :show="item.show" :index="index" @click="delFromCart(item.id)" @open="open(index)" :options="options"> -->
          <view class="content-goods-list bg-white flex align-center padding-lr">
            <view @tap="check(item,index)">
              <checkbox v-if="isEditor" class="round" :class="item.delChecked ? 'checked' : ''" :checked="item.delChecked?true:false"></checkbox>
              <checkbox v-if="!isEditor" class="round" :class="item.checked ? 'checked' : ''" :checked=" item.checked?true:false"
                :disabled="item.stock == 0"></checkbox>
            </view>
            <view class="goods-info flex align-center solid-bottom">
              <view class="wrap-image margin-sm img-150 radius bg-grey">
                <view class="box-kong text-df text-white" v-if="item.stock == 0">
                  <view class="box-kong-item">
                    无货
                  </view>
                </view>
                <image class="radius" :src="item.goods_thumb" mode="aspectFill" @tap="toDetail(item,index)"></image>
              </view>
              <view class="goods-desc">
                <view class="text-df text-cut-2" @tap="toDetail(item,index)">{{ item.goods_name }}</view>
                <view class="text-sm text-999" @tap="toDetail(item,index)">{{ item.sku_name }}</view>
                <view class="desc-number flex justify-between align-center">
                  <view class="text-theme" @tap="toDetail(item,index)">
                    <text class="text-price text-df"></text>
                    <text class="text-xl">{{ item.shop_price }}</text>
                  </view>
                  <view class="number">
                    <uni-number-box :min="1" :max="item.stock" :value="item.num" @change="numberChange($event,index)"></uni-number-box>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!-- </u-swipe-action> -->
        </block>
      </view>
      <view class="action-bar cu-bar bg-white flex justify-between">
        <view class="flex flex-sub padding-lr">
          <view class="flex justify-between align-center" @tap="checkAll">
            <checkbox v-if="isEditor" class="round theme" :class="delAllChecked ? 'checked' : ''" :checked="delAllChecked?true:false"></checkbox>
            <checkbox v-if="!isEditor" class="round theme" :class="allChecked ? 'checked' : ''" :checked=" allChecked?true:false"></checkbox>
            <text class="ml-20 text-df text-999">全选</text>
          </view>
          <view class="ml-20 text-lg text-333" v-if="!isEditor">
            合计:<text class="m text-price" style="color: #FF2424; font-size: 32rpx;">{{ totalPrice }}</text>
          </view>
        </view>
        <button v-if="!isEditor" class="cu-btn bg-theme text-white lg round" style="background:linear-gradient(90deg,#FF4517 0%,#F02325 100%);"
          @click="createOrder">去结算({{ totalNumber }})</button>
        <button v-if="isEditor" class="cu-btn bg-theme text-white lg round" style="width: 200rpx;background:linear-gradient(90deg,#FF4517 0%,#F02325 100%);"
          @click="del">删除</button>
      </view>
    </template>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        CustomBar: this.CustomBar,
        StatusBar: this.StatusBar,
        isEditor: false, // 编辑 or 完成
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#F02523'
          }
        }, ],
        isLogin: global.token ? true : false,
        cartList: [], // 购物车列表
        checkedCache: [], // 上一次缓存的选中状态
      };
    },
    computed: {
      // 选择的商品总价
      totalPrice() {
        let list = this.cartList;
        let total = 0;
        list.forEach(item => {
          if (item.checked == true) {
            let _price = item.shop_price;
            total += Number(_price) * Number(item.num);
          }
        });
        return Number(total.toFixed(2));
      },
      // 选择的商品数量
      totalNumber() {
        let list = this.cartList;
        let total = 0;
        list.forEach(item => {
          if (item.checked == true) {
            total += Number(item.num);
          }
        });
        return total;
      },
      // 购物车内的商品数量
      allNumber() {
        let list = this.cartList;
        let total = 0;
        list.forEach(item => {
          total += Number(item.num);
        });
        return total;
      },
      // 编辑模式全选状态
      delAllChecked() {
        let list = this.cartList;
        let bool = true;
        list.forEach(item => {
          if (item.delChecked == false) {
            bool = false;
          }
        });
        return bool;
      },
      // 正常模式全选状态
      allChecked() {
        let list = this.cartList;
        let bool = true;
        list.forEach(item => {
          if (item.checked == false) {
            bool = false;
          }
        });
        return bool;
      },
    },
    onPullDownRefresh() {
      this.getCartData();
    },
    onShow() {
      if (global.token) {
        this.getCartData();
      }
      this.isEditor = false;
    },
    onLoad() {
      uni.$on('updateCart', () => {
        console.log("刷新购物车数据");
        this.getCartData();
      })
      uni.$on('delCartGoods', (data) => {
        // 删除已买商品
        console.log("删除的ids", data);
        // this.$Request.post(this.$api.shop.del_cart, {
        //     cart_ids: data
        //   })
        //   .then(res => {
        //     console.log("删除购物车", res);
        //     this.getCartData();
        //   })
        //   .catch(err => {
        //     console.log("err: " + JSON.stringify(err));
        //   })
      })
    },
    onUnload() {
      uni.$off('updateCart');
      uni.$off('delCartGoods');
    },
    methods: {
      // 获取购物车数据
      getCartData() {
        this.$api.post(global.apiUrls.getCartList)
          .then(res => {
            if (res.data.code == 1) {
              console.log('cart', res.data);
              let data = res.data.data;
              uni.stopPullDownRefresh();
              this.initCheckedType(data);
            }
          })
      },
      // 初始化购物车商品选中状态
      initCheckedType(list) {
        list.forEach(item => {
          item.show = false;
          // 判断是否是选中状态
          if (this.checkedCache.includes(item.id)) {
            item.checked = false;
          } else {
            item.checked = false;
          }
          item.delChecked = false;
        })
        this.cartList = list;
      },
      // 判断是否是选中状态
      isChecked(id) {
        return this.checkedCache.includes(id);
      },
      // 缓存购物车选中状态 记录ids
      cacheCartChecked() {
        let ids = this.cartList.filter(item => {
          return item.checked === true;
        })
        let arr = [];
        ids.forEach(item => {
          arr.push(item.id);
        })
        uni.setStorageSync('cart_checked_cache', arr);
      },
      // 获取购物车选中状态
      getCartChecked() {
        let cache = uni.getStorageSync('cart_checked_cache');
        this.checkedCache = cache || [];
      },
      // open(index) {
      //   // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      //   // 原本为'false'，再次设置为'false'会无效
      //   this.cartList[index].show = true;
      //   this.cartList.map((val, idx) => {
      //     if (index != idx) this.cartList[idx].show = false;
      //   })
      // },
      // 点击导航编辑按钮
      changeEditType() {
        let _text = '';
        this.isEditor = !this.isEditor;
        if (!this.isEditor) {
          _text = '编辑';
        } else {
          console.log('编辑状态');
          _text = '完成';
          this.cartList.forEach(item => {
            item.delChecked = true;
          });

        }
      },
      // 删除购物车
      delFromCart(ids) {
        global.customShowModalPopup({
          title: '提示',
          content: '确认删除吗?',
          success: (res) => {
            if(res.confirm){
              this.delCartGoods(ids);
            }
          }
        })
      },
      delCartGoods(ids){
        this.$api.post(global.apiUrls.delCart, {
          cart_ids: ids
        })
        .then(res => {
          console.log("res: " + JSON.stringify(res));
          this.getCartData();
        })
        .catch(err => {
          console.log("err: " + JSON.stringify(err));
        })
      },
      // 商品选中状态处理
      check(item, i) {
        if (this.isEditor) {
          item.delChecked = !item.delChecked;
        } else {
          if (item.stock == 0) return this.$Common.toast('该商品已售完,正在采购中');
          this.cartList[i].checked = !this.cartList[i].checked;
          this.cacheCartChecked();
        }
      },
      checkfor() {
        //选中状态，页面关闭的时候全部为false
        let _type = false;
        this.cartList.forEach(item => {
          item.checked == false
          item.delChecked == false
        });
        this.allChecked = false;
        this.delAllChecked = false;
      },
      //全选|取消全选
      checkAll() {
        if (this.isEditor) {
          const bool = !this.delAllChecked;
          this.cartList.forEach(item => {
            item.delChecked = bool;
          });
        } else {
          const bool = !this.allChecked;
          this.cartList.forEach(item => {
            item.checked = bool;
          });
          // this.cacheCartChecked();
        }
      },
      //数量改变
      numberChange(e, index) {
        let item = this.cartList[index];
        this.$api.post(global.apiUrls.postSetCartNumber,{
          cart_id: item.id,
          sku_id: item.sku_id,
          num: e,
        })
        .then(res => {
          console.log('cart number',res.data)
          if(res.data.code == 1){
            this.$set(this.cartList[index],'num',e);
          }
        })
      },
      // 删除商品
      del() {
        const list = this.cartList;
        let ids = [];
        list.forEach(item => {
          if (item.delChecked) {
            ids.push(item.id);
          }
        });
        if (ids.length == 0) return this.$Common.toast('未选择商品');
        this.delFromCart(ids.join(','));
      },
      // 创建订单
      createOrder() {
        const list = this.cartList;
        let ids = [];
        list.forEach(item => {
          if (item.checked) {
            ids.push(item.id);
          }
        });
        const cart_ids = ids.join(',');
        if (cart_ids == '') return this.$Common.toast(this.i18n[9]);
        setTimeout(() => {
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/shop-template/create_order',
            params: {
              type: 'cart',
              ids: cart_ids
            }
          })
        }, 500)
      },
      // 去商品详情
      toDetail(item) {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/goods_detail',
          params: {
            goods_id: item.goods_id,
            sku_id: item.sku_id,
          }
        })
      },
      // 去登陆
      navToLogin() {
        this.$urouter.navigateTo('/fu-template/pages/login-templete/login-templete001/login-password');
      },
      // 去首页
      navToHome() {
        this.$urouter.switchTab('/pages/tab/tab01/index');
      },
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    background: #F8F8F8;
    padding-bottom: 100rpx;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));

    .page-nologin {
      width: 100%;
      height: 600rpx;
      background-color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tips {
      line-height: 88rpx;
      background: rgba(240, 35, 37, 0.1);
      color: #F02325;
      font-size: 28rpx;
      color: #F02325;

      image {
        width: 44rpx;
        height: 50rpx;
        margin-right: 24rpx;
      }

      .cu-btn {
        width: 147rpx;
        height: 48rpx;
        color: #fff;
        background: linear-gradient(180deg, rgba(240, 35, 37, 1) 0%, rgba(255, 20, 80, 1) 100%);
        border-radius: 8rpx;
        padding: 0;
      }
    }

    .vip_tips {
      width: 100%;
      line-height: 72rpx;
      /* margin: 22rpx 0;
			background: rgba(255, 255, 255, 0.7); */
      border-radius: 20rpx;
      display: flex;
      justify-content: space-between;
      padding: 0 30rpx;

      view {
        text {
          margin: 0 10rpx 0 0;
          color: #999;
        }
      }
    }

    .page-kong {
      width: 100%;
      // height: 30vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #999999;
      font-size: 28rpx;

      .cu-btn {
        width: 200rpx;
        height: 72rpx;
        color: #FFFFFF;
        border-radius: 16rpx;
        background: linear-gradient(90deg, rgba(255, 69, 23, 1) 0%, rgba(240, 35, 37, 1) 100%);
      }
    }
  }

  .page-list {
    width: calc(100% -24rpx);
    border-radius: 16rpx;
    overflow: hidden;
  }

  .content-goods-list {
    width: 100%;
    border-radius: 16rpx;
    overflow: hidden;
    margin-top: 24rpx;
  }

  .goods-info {
    width: 598rpx;
    padding: 20rpx 0;

    .goods-desc {
      flex: 1;
      min-width: 1px;
      min-height: 160rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .round {
    transform: scale(0.7);
  }

  .cu-bar {
    position: fixed !important;
    left: 0;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 100upx !important;
    /* #endif */
    height: 98rpx;
    z-index: 99;

    .action {
      flex: 1;
    }

    .action-btn {
      width: 250rpx;
      height: 100%;
      background-color: $fu-main-color;
      color: #ffffff;
      font-size: 32rpx;
      line-height: 98rpx;
      text-align: center;
    }
  }

  .action-bar {
    position: fixed;
    bottom: 0!important;
    width: 100%;
    z-index: 999;
  }

  .img-150 {
    width: 150rpx;
    min-width: 150rpx;
    height: 150rpx;
    min-height: 150rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .size-32 {
    font-size: 32rpx;
  }

  .size-28 {
    font-size: 28rpx;
  }

  .size-24 {
    font-size: 24rpx;
  }

  .ml-20 {
    margin-left: 20rpx;
  }

  .info {
    height: 30rpx;

    .info-title {
      width: 80rpx;
      line-height: 30rpx;
      text-align: center;
    }

    .info-number {
      width: 70rpx;
      line-height: 22rpx;
      text-align: center;
      border: 4rpx solid $fu-main-color;
      border-left: none;
    }
  }

  .wrap-image {
    position: relative;

    .box-kong {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .5);
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6rpx;

      .box-kong-item {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 1rpx solid #FFFFFF;
        text-align: center;
        line-height: 100rpx;
      }
    }
  }

  .block-262 {
    /* width: 262rpx;
		min-width: 262rpx;
		height: 262rpx;
		min-height: 262rpx; */

    image {
      width: 176rpx;
      height: 151rpx;
    }
  }

  .tool-box {
    position: sticky;
    z-index: 999;
    background: #F8F8F8;

    .cu-btn {
      width: 144rpx;
      height: 56rpx;
      border-radius: 56rpx;
      border: 2rpx solid rgba(191, 191, 191, 1);
      background: #fff;

    }
  }
</style>
