<template>
  <view class="page">
    <!-- 自定义头部 -->
    <cu-custom bgColor="bg-white" :isBack="true">
      <block slot="content" class="text-black">{{'确认订单'}}</block>
    </cu-custom>
    <!-- 地址 -->
    <view class="address padding-lr-sm padding-top-xs padding-bottom" @click="chooseAddress">
      <view class="flex align-center" v-if="addressData">
        <view class="flex-sub flex flex-direction">
          <view class="text-bold text-333 text-lg">
            <text>{{ addressData.name }}</text>
            <text class="margin-left-sm">{{addressData && addressData.mobile | filterMobile }}</text>
          </view>
          <text class="text-cut-2 text-df text-666">{{addressData.province}}{{addressData.city}}{{addressData.district}}{{ addressData.address}}</text>
        </view>
        <text class="cuIcon-right text-gray margin-left"></text>
      </view>
      <view class="flex" v-else>
        <view class="flex-sub">
          <view class="text-lg text-999">您还没有收货地址,去添加</view>
        </view>
        <text class="cuIcon-right text-gray margin-left"></text>
      </view>
    </view>
    <!-- 商品信息 -->
    <view class="margin-top-sm bg-white radius-20">
      <block v-for="(item,index) in goods" :key="index">
        <view class="padding-lr padding-tb-sm flex">
          <view class="block-180 radius">
            <image class="radius" :src="item.thumb" mode="aspectFill"></image>
          </view>
          <view class="margin-left-sm flex-sub flex flex-direction justify-between">
            <view class="text-df text-bold text-cut-2">{{ item.name }}</view>
            <view class="text-sm text-999 text-cut">{{ item.key_name }}</view>
            <view class="flex justify-between align-center">
              <view class="text-lg text-theme text-bold flex align-center">
                <text>
                  <text class="text-price text-sm"></text>
                  <text class="">{{item.shop_price}}</text>
                </text>
              </view>
              <text class="text-sm text-999">x {{ item.number }}</text>
            </view>
          </view>
        </view>
      </block>
      <form>
        <view class="cu-form-group radius-20">
          <view class="title">留言</view>
          <input class="text-right text-sm text-333" placeholder-class="placeholderClass" placeholder="选填,给商家留言" name="input"
            v-model="remark"></input>
        </view>
      </form>
    </view>
    <!-- 优惠明细 -->
    <view class="margin-top-sm bg-white radius-20 overHiddren">
      <view class="cu-list menu sm-border">
        <view class="cu-item" @click="chooseCoupon">
          <view class="content">
            <text class="text-666">优惠券</text>
          </view>
          <view class="action text-999">
            <text v-if="!coupon" class="text-xs">无可用</text>
            <text v-else class="text-xs text-theme">已使用1张,共抵扣¥{{coupon && coupon.money}}</text>
            <text class="icon cuIcon-right"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 金额明细 -->
    <view class="margin-top-sm bg-white radius-20 overHiddren">
      <view class="cu-list menu sm-border">
        <view class="cu-item">
          <view class="content">
            <text class="text-333">商品金额</text>
          </view>
          <view class="action text-theme text-df text-bold">
            <text class="text-price">{{goods_price}}</text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="text-333">运费</text>
          </view>
          <view v-if="express_price" class="action text-theme text-df text-bold">
            <text>+</text>
            <text class="text-price">{{express_price}}</text>
          </view>
          <view v-else class="action text-theme text-df text-bold">
            免邮
          </view>
        </view>
        <view class="cu-item" v-if="coupon">
          <view class="content">
            <text class="text-333">优惠券</text>
          </view>
          <view class="action text-theme text-df text-bold">
            <text>-</text>
            <text class="text-price">{{coupon.money || '0.00'}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer">
      <view class="text-theme">
        <text class="text-bold text-df">￥</text>
        <text class="text-bold text-xxl">{{ payable_money }}</text>
      </view>
      <button class="cu-btn round fu-bgcred fu-cwhite" @click="handleSubmit">提交订单</button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        coupon: null,
        goods: [],
        addressData: null,
        goods_price: 0,
        express_price: 0,
        payable_money: 0,
        remark: '',
        order: {},
        coupon_id: 0,
        cartData: null,
        shipping_coupon: null,
        order_type: 3,
      };
    },
    filters: {
      filterMobile(val) {
        if (!val) return '';
        return val.substr(0, 3) + '****' + val.substr(-4);
      }
    },
    onLoad(options) {
      console.log('create order options', options)
      const {type,ids} = options;
      if(options.address_id){
        this.addressData = {
          address_id: options.address_id
        }
      }
      if (type == 'cart' && ids) {
        this.cartData = options;
        this.get_cart_order_info();
      } else {
        this.order = options;
        this.get_one_order_info();
      }
      uni.$on('select_address', (data) => {
        this.addressData = data;
        if (this.cartData) {
          this.get_cart_order_info();
        } else {
          this.get_one_order_info();
        }
      })
      uni.$on('select_coupon', (data) => {
        if (data) {
          this.use_not_coupon = 0;
          this.coupon = data;
          this.coupon_id = data.id;
        } else {
          this.use_not_coupon = 1;
          this.coupon = null;
          this.coupon_id = 0;
        }
        if (this.cartData) {
          this.get_cart_order_info();
        } else {
          this.get_one_order_info();
        }
      })
    },
    onUnload() {
      uni.$off('select_address');
      uni.$off('select_coupon');
    },
    methods: {
      get_one_order_info() {
        const {goods_id,sku_id,number} = this.order;
        const _data = {
          goods_id: goods_id,
          sku_id: sku_id,
          number: number,
          coupon_id: this.coupon_id || '0',
          address_id: this.addressData && this.addressData.address_id || 0,
        }
        console.log("_data", _data)
        if (this.use_not_coupon == 1) {
          _data.use_not_coupon = 1;
        }
        this.$api.post(global.apiUrls.postBuyNowOrderInfo, _data)
          .then(res => {
            console.log('buynow order', res.data)
            if (res.data.code == 1) {
              let data = res.data.data;
              if(data.address && !Array.isArray(data.address)){
                this.addressData = data.address;
              }
              this.goods = data.goods;
              this.coupon = data.coupon ? data.coupon : null;
              if (data.coupon) {
                this.coupon_id = data.coupon.id;
              }
              this.goods_price = data.goods_price;
              this.express_price = data.express_price;
              this.payable_money = data.payable_money;
              if (data.order_type) {
                this.order_type = data.order_type;
              }
              if (data.shipping_coupon) {
                this.shipping_coupon = data.shipping_coupon;
              }
            } else {
              this.$message.info(res.data.msg);
              setTimeout(function() {
                uni.navigateBack();
              }, 800)
            }
            uni.stopPullDownRefresh();
          })
      },
      get_cart_order_info() {
        let data = {
          cart_ids: this.cartData.ids,
          coupon_id: this.coupon_id || '0',
          address_id: this.addressData && this.addressData.address_id || 0
        }
        if (this.use_not_coupon == 1) {
          data.use_not_coupon = 1;
        }
        this.$api.post(global.apiUrls.postCartOrderInfo, data)
          .then(res => {
            console.log("购物车订单信息: ", res);
            if (res.data.code == 1) {
              let data = res.data.data;
              this.goods = data.goods;
              if(data.address && !Array.isArray(data.address)){
                this.addressData = data.address;
              }
              this.coupon = res.data.data.coupon ? res.data.data.coupon : null;
              if (res.data.data.coupon) {
                this.coupon_id = res.data.data.coupon.id;
              }
              this.goods_price = res.data.data.order_money;
              this.express_price = res.data.data.express_price;
              this.payable_money = res.data.data.payable_money;
              if (res.data.data.shipping_coupon) {
                this.shipping_coupon = res.data.data.shipping_coupon;
              }
            } else {
              this.$message.info(res.data.msg);
              setTimeout(() => {
                uni.navigateBack();
              }, 800);
            }
            uni.stopPullDownRefresh();
          })
          .catch(err => {
            console.log("err: " + JSON.stringify(err));
          })
      },
      // 选择地址
      chooseAddress() {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/address-template/address',
          params: {
            type: 1,
            id: this.addressData && this.addressData.address_id || 0
          }
        })
      },
      // 去选择优惠券
      chooseCoupon() {
        let cid = this.goods.map(item => item.cid);
        cid = [...new Set(cid)].join(',');
        let all_money = {};
        this.goods.forEach((item, index) => {
          let price = item.shop_price;
          all_money[item.id] = {
            'price': price * item.number,
            'cid': item.cid
          };
        })
        let data = {
          order_price: this.goods_price,
          coupon_id: this.coupon_id,
          cid: cid,
          all_money: JSON.stringify(all_money)
        }
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/choose_coupon',
          params: data
        })
      },
      // 下单
      handleSubmit() {
        if (!this.addressData) return this.$message.info('请选择可用收货地址');
        var order_info = {};
        order_info.address = this.addressData;
        order_info.goods = this.goods;
        order_info.express_price = this.express_price;
        order_info.remark = this.remark;
        var postdata = {
          order_type: this.order_type,
          order_money: this.goods_price,
          payable_money: this.payable_money,
          coupon_id: this.coupon && this.coupon.id ? this.coupon.id : 0,
          order_info: JSON.stringify(order_info),
        };
        if (this.order && this.order.team_id) {
          postdata.group_id = this.order.team_id;
        };
        if (this.shipping_coupon) {
          postdata.shipping_coupon = this.shipping_coupon.id;
        }
        if (this.order.invite_code) {
          postdata.share_sign = this.order.invite_code;
        }
        console.log('postdata',postdata)
        this.$api.post(global.apiUrls.postCreateOrder,postdata)
        .then(res => {
          if(res.data.code == 1){
            this.$message.info('订单提交成功，请支付…');
            if (this.cartData) {
              uni.$emit('delCartGoods', this.cartData.ids);
            }
            setTimeout(() => {
              this.$urouter.redirectTo({
                url: '/fu-templete/pages/shop-template/pay_order',
                params: {
                  order_sn: res.data.data.order_sn,
                  order_type: this.order_type,
                }
              })
            }, 500);
          }else{
            this.$message.info(res.data.msg);
          }
        })
      },
    },
    onPullDownRefresh() {
      if (this.cartData) {
        this.get_cart_order_info();
      } else {
        this.get_one_order_info();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    padding-bottom: 150rpx;
    padding-bottom: calc(150rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(150rpx + env(safe-area-inset-bottom));
  }

  .address {
    background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAKBAMAAACOO0tGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURf///4u16Oxtbezz/J3B7NDh9vSmprjS8vGNjfjDw/vd3f7w8O57e0EOI68AAABSSURBVCjPY2CAAE4l7GACVJ4hUBArEIXJL8KuXw0mz4xdv2ABVJ77EHYDGmAGmGDXLwKT58CuX2cDTIEjdgOcYfJJ2A3Qgsmz4/CBwWgQUiMIAXzCOFELLk/nAAAAAElFTkSuQmCC) -7px bottom repeat-x;
    background-size: 64px 5px;
  }

  .placeholderClass {
    color: #999999;
    font-size: 24rpx;
  }

  .cu-form-group .title {
    min-width: calc(4em + 15px);
  }

  .icon {
    font-size: 20rpx;
    margin-left: 15rpx;
  }

  .overHiddren {
    overflow: hidden;
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #FFFFFF;
    padding: 0 32rpx;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100rpx;
    height: calc(100rpx + constant(safe-area-inset-bottom));
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;

    .price-content {
      padding-left: 30upx;
    }

    .price-tip {
      margin-left: 8upx;
    }

    .price {
      font-size: 48upx;
    }

    .submit {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 280upx;
      height: 100%;
      color: #fff;
      font-size: 32upx;
      background-color: $fu-main-color;
    }
  }

  .block-36 {
    width: 36rpx;
    min-width: 36rpx;
    height: 36rpx;
    min-height: 36rpx;
  }

  .block-180 {
    width: 180rpx;
    min-width: 180rpx;
    height: 180rpx;
    min-height: 180rpx;
    background-color: #EEEEEE;

    image {
      width: 100%;
      height: 100%;
    }
  }

  image {
    width: 100%;
    height: 100%;
  }

  // 底部占位
  .bottom-status {
    height: 120rpx;
    height: calc(120rpx + constant(safe-area-inset-bottom));
    height: calc(120rpx + env(safe-area-inset-bottom));
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
    background-color: white;
  }
</style>
