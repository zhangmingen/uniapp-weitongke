<template>
  <view class="page" v-cloak>
    <!-- 轮播图 -->
    <view id="banners" class="banners">
      <swiper class="carousel" :indicator-dots="false" :circular="true" @change="changeSwiper">
        <block v-for="(item,index) in swipers" :key="index">
          <swiper-item>
            <image :src="item" mode="aspectFill" lazy-load></image>
          </swiper-item>
        </block>
      </swiper>
      <view class="pagination">{{curSwiper}}/{{swipers.length}}</view>
    </view>
    <!-- 悬浮Tab栏 -->
    <view class="tabs" v-if="scrollTop > 10" :style="{opacity: opacity}">
      <block v-for="item in tabs" :key="item.title">
        <view class="flex-sub flex justify-center align-center" @tap="changeTab(item)">
          <view class="tab-item" :class="{'active': curTab == item.id}">{{item.title}}</view>
        </view>
      </block>
    </view>
    <!-- 价格展示区 -->
    <view class="prices">
      <view class="box">
        <view class="top text-white">
          <text>
            <text class="text-price text-xl"></text>
            <text class="text-xxl">{{goodsInfo.price}}</text>
          </text>
          <text class="text-through margin-left-sm">
            <text class="text-price text-lg"></text>
            <text class="text-lg">{{goodsInfo.market_price}}</text>
          </text>
        </view>
      </view>
    </view>
    <!-- 商品信息展示区 -->
    <view class="infos padding bg-white">
      <view class="text-lg text-333">{{goodsInfo.name}}</view>
      <view class="flex justify-between align-center margin-top-sm">
        <text class="text-sm text-999">{{goodsInfo.description}}</text>
        <view class="margin-left flex flex-direction align-center justify-center" style="width: 100rpx;" @tap="collect">
          <text v-if="goodsInfo.is_collect" class="cuIcon-likefill fu-cred"></text>
          <text v-else class="cuIcon-like"></text>
          <text class="text-xs text-333 margin-left-xs" :class="{'fu-cred': goodsInfo.is_collect}">{{goodsInfo.is_collect ? '取消' : '收藏'}}</text>
        </view>
      </view>
      <view class="margin-top-sm text-sm text-999">
        <text>库存: {{goodsInfo.stock}}</text>
        <text class="margin-left">销量: {{goodsInfo.sales_sum}}</text>
      </view>
    </view>
    <!-- 规格,地址,服务,参数 -->
    <view class="margin-top-sm bg-white radius-20 padding-lr">
      <!-- 规格 -->
      <view class="list-item" @tap="openPopup('specs')" v-if="goodsInfo.is_spec">
        <view class="title">规格</view>
        <view class="content solid-bottom">
          <view class="mes text-df text-333 text-cut">{{sku_name}}，{{goodsInfo.number}}件</view>
          <view class="icon">
            <text class="cuIcon-right text-999" style="font-size: 16rpx;"></text>
          </view>
        </view>
      </view>
      <!-- 优惠 -->
      <!-- <view class="list-item">
        <view class="title">优惠</view>
        <view class="content solid-bottom">
          <view class="mes text-df text-333 text-cut"></view>
          <view class="icon">
            <text class="cuIcon-right text-999" style="font-size: 16rpx;"></text>
          </view>
        </view>
      </view> -->
      <!-- 地址 -->
      <view class="list-item" @tap="switchAddress" v-if="curAddr">
        <view class="title">送至</view>
        <view class="content solid-bottom">
          <view class="mes text-df text-333 text-cut">
            <text class="cuIcon-locationfill fu-cred"></text>
            <text class="margin-left-xs">{{curAddr.province}}{{curAddr.city}}{{curAddr.district}}{{curAddr.address}}</text>
          </view>
          <view class="icon">
            <text class="cuIcon-right text-999" style="font-size: 16rpx;"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 评价展示区 -->
    <view id="evaluates" class="evaluates margin-top-sm radius-20 bg-white padding-lr">
      <view class="title flex justify-between align-center">
        <text>
          <text class="text-lg text-333">商品评价</text>
          <text class="text-333 text-df margin-left-xs">({{comment_total}})</text>
          <!-- <text class="text-sm text-999 margin-left">好评率: 99.9%</text> -->
        </text>
        <text @tap="navToComment">
          <text class="text-sm text-999">查看全部</text>
          <text class="cuIcon-right text-999 margin-left-xs" style="font-size: 24rpx;"></text>
        </text>
      </view>
      <view class="content" v-if="comment.length > 0">
        <block v-for="(item,index) in comment" :key="index">
          <fu-evaluate :prop="item"></fu-evaluate>
        </block>
      </view>
    </view>
    <!-- 商品详情 -->
    <view id="details" class="details radius-20 bg-white margin-top-sm">
      <view class="title">
        <view class="icon icon1"></view>
        <view class="margin-lr">商品详情</view>
        <view class="icon icon2"></view>
      </view>
      <view class="padding-lr padding-bottom" v-html="body"></view>
    </view>
    <!-- 底部菜单 -->
    <view class="tools">
      <view class="toolbar">
        <view class="left">
          <view class="left-item" @tap="navToServer">
            <image class="block-32" src="/static/shop/007.png" mode="aspectFit"></image>
            <text class="margin-top-xs">客服</text>
          </view>
          <view class="left-item" @tap="navToCart">
            <image class="block-32" src="/static/shop/008.png" mode="aspectFit"></image>
            <text class="margin-top-xs">购物车</text>
          </view>
          <view class="left-item" @tap="openPopup('share')">
            <image class="block-32" src="/static/shop/006.png" mode="aspectFit"></image>
            <text class="margin-top-xs">分享</text>
          </view>
        </view>
        <view class="right">
          <view class="btn btn1" @tap="openPopup('specs','cart')">
            <text class="text-df">加购物车</text>
          </view>
          <view class="btn btn2" @tap="openPopup('specs','buy')">
            <text class="text-df">立即抢购</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 优惠券弹窗 -->
    <!-- <ben-coupon ref="coupon"></ben-coupon> -->
    <!-- 地址弹窗 -->
    <fu-goods-address ref="address" :addrs="addrs" @change="changeAddress"></fu-goods-address>
    <!-- 分享弹窗 -->
    <fu-share ref="share" @getPosterInfo="setPosterInfo"></fu-share>
    <!-- 规格弹窗 -->
    <fu-specs-popup
			ref="specs"
			:speclist="spec_list"
			:skulist="sku_list"
			:currentId="sku_id"
			:info="goodsInfo"
			:limit="limit"
			@changeNumber="setNumber"
			@changeSpec="setSpec"
			@addCart="addCart"
			@buyNow="buyNow"
		></fu-specs-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        curSwiper: 1, // 当前轮播图index
        tabs: [
          {
            title: '宝贝',
            id: 'banners',
          },
          {
            title: '评价',
            id: 'evaluates',
          },
          {
            title: '详情',
            id: 'details',
          },
          // {
          //   title: '推荐',
          //   id: 'recoms',
          // }
        ],
        curTab: 'banners',
        scrollTop: 0,
        opacity: 0,
        swipers: [], // 轮播图
        goodsInfo: {}, // 商品信息
        spec_list: [], // 规格列表
        sku_list: [], // 规格参照列表
        sku_id: 0, // 当前规格id
        sku_name: '', //  当前规格名称
        goods_id: 0, // 商品id
        body: '', // 商品介绍
        comment: [], // 评论列表
        comment_total: 0, // //评论条数
        activityInfo: null, // 活动信息
        limit: 0, // 限购数量
        addrs: [],
        curAddr: null
      };
    },
    onLoad(options) {
      const {goods_id,sku_id = 0,scene,type} = options;
      if (scene) {
        const params = decodeURIComponent(options.scene);
        params.split('&').forEach((item, index) => {
          switch (index) {
            case 0:
              id = item.split('=')[1];
              break;
            case 1:
              activity_id = item.split('=')[1];
              break;
            case 2:
              sku_id = item.split('=')[1];
              break;
            case 3:
              invite_code = item.split('=')[1];
              break;
          }
        });
        type = 'share';
      }
      this.goods_id = goods_id;
      this.sku_id = sku_id;
      if (type) {
        this.openModel = 'share'
      }
      this.loadData();
    },
    onShow() {
      if(global.token){
        this.loadAddress();
      }
    },
    onReady() {
      this.$nextTick(() => {
        this.observeTabDom();
      })
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
      this.opacity = (e.scrollTop / 100).toFixed(2);
    },
    onShareAppMessage() {
      return {
        title: this.goodsInfo.name,
        path: `/fu-templete/pages/shop-template/goods_detail?goods_id=${this.goods_id}&sku_id=${this.sku_id}&type=share`,
        imageUrl: this.goodsInfo.thumb,
      }
    },
    methods: {
      // 轮播图切换
      changeSwiper(e) {
        this.curSwiper = e.detail.current + 1;
      },
      // 
      loadAddress(){
        this.$api.post(global.apiUrls.getUserAddressAddressList)
        .then(res => {
          console.log("地址列表", res);
          if (res.data.code == 1) {
            this.addrs = res.data.data;
          }
        })
      },
      // tab栏切换
      changeTab(item) {
        this.curTab = item.id;
        let nowScrollTop = this.scrollTop;
        uni.createSelectorQuery().in(this).select('.' + item.id).boundingClientRect(pos => {
          let posTop = pos.top;
          if (posTop == 0 && nowScrollTop != 0) return;
          uni.pageScrollTo({
            duration: 0,
            scrollTop: posTop + nowScrollTop - 100
          })
        }).exec();
      },
      // 元素观察器
      observeTabDom() {
        this.tabs.forEach(item => {
          uni.createIntersectionObserver(this).relativeToViewport({
            top: 100,
            bottom: -100
          }).observe('.' + item.id, res => {
            // console.log('动态',res);
          })
        })
      },
      // 打开弹窗
      openPopup(type, param) {
        this.$refs[type].open(param);
      },
      // 获取商品详情
      loadData() {
        this.$api.get(global.apiUrls.getGoodsDetail, {
            goods_id: this.goods_id,
            user_id: global.userInfo && global.userInfo.id || 0
          })
          .then(res => {
            if (res.data.code == 1) {
              console.log('goods detail', res.data.data);
              let data = res.data.data;
              this.swipers = data.images;
              this.goodsInfo = {
                name: data.name,
                price: data.shop_price,
                market_price: data.market_price,
                discounts: data.discounts || 0.00,
                thumb: data.thumb,
                description: data.description,
                is_collect: data.is_collect,
                share_award_money: data.share_award_money || 0.00,
                number: 1,
                stock: data.stock || 0,
                sales_sum: data.sales_sum,
                is_spec: data.is_spec,
              }
              this.limit = data.limit || 0;
              this.body = data.body.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"');
              this.comment = data.comment || [];
              this.comment_total = data.comment_total || 0;
              if (data.is_spec == 1) {
                this.spec_list = data.spec_list;
                this.sku_list = Object.values(data.sku_list).map(item => {
                  item.sku_spec = item.key_name.split("-");
                  return item;
                }).filter(item => {
                  return item.stock > 0;
                })
              }
              uni.stopPullDownRefresh();
              this.$nextTick(() => {
                if (data.is_spec == 1) {
                  this.$refs.specs.init();
                }
              })
            } else {
              uni.navigateBack();
              setTimeout(() => {
                this.$message.info('获取详情失败');
              }, 300)
            }
          })
      },
      // 收藏
      collect() {
        this.$util.actionAuth(() => {
          this.$api.post(global.apiUrls.postGoodsCollection,{
            collect_id: this.goods_id,
            sku_id: this.sku_id,
            collect_title: this.goodsInfo.name,
            type: 1,
          }).then(res => {
            if(res.data.code == 1){
              console.log('collect',res.data)
              if (this.goodsInfo.is_collect) {
                this.goodsInfo.is_collect = 0;
              } else {
                this.goodsInfo.is_collect = 1;
              }
              this.$message.info(res.data.msg);
            }
          })
        })
      },
      // 修改购买数量
      setNumber(num) {
        this.goodsInfo.number = num;
      },
      // 修改购买规格
      setSpec(skuInfo) {
        const {key_name, shop_price,market_price,sku_id,stock} = skuInfo;
        this.sku_id = sku_id;
        this.sku_name = key_name;
        this.goodsInfo.price = shop_price;
        this.goodsInfo.stock = stock;
      },
      // 立即购买
      buyNow() {
        this.$util.actionAuth(() => {
          let data = {
            type: 'buy',
            goods_id: this.goods_id,
            number: this.goodsInfo.number,
          }
          if (this.sku_id) {
            data.sku_id = this.sku_id;
          }
          if(this.curAddr){
            data.address_id = this.curAddr.address_id;
          }
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/shop-template/create_order',
            params: data
          })
        })
      },
      // 加入购物车
      addCart() {
        this.$util.actionAuth(() => {
          const data = {
            num: this.goodsInfo.number,
            goods_id: this.goods_id,
          }
          if (this.sku_id) {
            data.sku_id = this.sku_id;
          }
          this.$api.post(global.apiUrls.postGoodsAddToCart,data)
          .then(res => {
            if(res.data.code == 1){
              console.log(res.data);
              this.$message.info('加入购物车成功');
              uni.$emit('updateCart');
            }else{
              this.$message.info(res.data.msg);
            }
          })
        })
      },
      // 选择地址
      switchAddress(){
        this.$util.actionAuth(() => {
          this.openPopup('address');
        })
      },
      // 去评价列表
      navToComment(){
        if(this.comment_total == 0) return this.$message.info('该商品暂无评论哦');
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/goods_evaluate',
          params: {
            goods_id: this.goods_id
          }
        });
      },
      // 改变收货地址
      changeAddress(e){
        this.curAddr = e;
      },
      // 去购物车
      navToCart(){
        this.$urouter.navigateTo('/fu-templete/pages/shop-template/cart')
      },
      // 客服
      navToServer(){
        this.$urouter.navigateTo('/fu-templete/pages/shop-template/')
      },
      // 获取分享二维码
      getShareCode(){
        uni.showLoading();
      	let dataStr = `goods_id=${this.goods_id}&sku_id=${this.sku_id}`;
      	this.$api.post(global.apiUrls.postShareCode,{
      		page: '/fu-templete/pages/shop-template/goods_detail',
      		scene: dataStr,
      		width: 200,
      	}).then(res => {
          if(res.data.code == 1){
            let data = res.data.data.base64;
            this.$util.base64ToPath(data).then(res => {
            	console.log('图片临时路径',res);
            	this.setPosterInfo(res);
            }).catch(err => {
              uni.hideLoading();
              this.$message.info('保存临时图片错误');
            })
          }else{
            uni.hideLoading();
            this.$message.info(res.data.msg);
          }
      	}).catch(err => {
          uni.hideLoading();
      		console.log('获取二维码错误',err);
      	})
      },
      // 分享海报信息
      setPosterInfo(codePath){
      	this.$refs.share.init({
      		goodsName: this.goodsInfo.name,
      		goodsImage: this.swipers[0],
      		price: this.goodsInfo.shop_price,
      		market_price: this.goodsInfo.market_price,
      		// code: codePath,
      		avatar: global.userInfo.head_img,
      		name: global.userInfo.user_name,
      	})
      },
    },
    onPullDownRefresh() {
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100%;
    padding-bottom: 100rpx;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  }

  .banners {
    height: 500rpx;
    position: relative;
    .carousel {
      width: 100%;
      height: 100%;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .pagination {
      width: 80rpx;
      height: 40rpx;
      border-radius: 40rpx;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      right: 32rpx;
      bottom: 32rpx;
      line-height: 40rpx;
      font-size: 28rpx;
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .tabs {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 88rpx;
    background-color: #FFFFFF;
    box-shadow: 0 6rpx 4rpx rgba(0, 0, 0, 0.06);
    display: flex;
    z-index: 999;

    .tab-item {
      height: 100%;
      line-height: 88rpx;
      font-size: 28rpx;
      color: #999999;
      border-bottom: 4rpx solid white;
    }

    .tab-item.active {
      color: #333333;
      font-size: 32rpx;
      border-bottom-color: $fu-main-color;
    }
  }

  .prices {
    height: 112rpx;
    background-color: #FFFFFF;
    .box {
      height: 100%;
      // border-radius: 24rpx 24rpx 0 0;
      background: linear-gradient(90deg, #FF154F 0%, #F12228 100%);
      padding: 0 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .top {
        line-height: 1;
      }
      .bot {
        display: inline-block;
        height: 32rpx;
        font-size: 20rpx;
        line-height: 32rpx;
        border-radius: 8rpx;
        padding: 0 14rpx;
        background-color: #FFFFFF;
        margin-top: 10rpx;
        color: $fu-main-color;
      }
    }
  }

  .infos {
    border-radius: 0 0 20rpx 20rpx;
  }

  .list-item {
    height: 112rpx;
    line-height: 112rpx;
    display: flex;

    .title {
      width: 100rpx;
      min-width: 100rpx;
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }

    .content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      overflow: hidden;

      .mes {
        flex: 1;
      }

      .icon {
        width: 50rpx;
        min-width: 50rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

  .evaluates {
    .title {
      height: 100rpx;
    }
  }

  .shopinfos {
    .title {
      height: 260rpx;
      background-repeat: no-repeat;
      background-size: cover;
      padding: 30rpx;
      border-radius: 20rpx 20rpx 0 0;

      .tag {
        padding: 5rpx 10rpx;
        font-size: 16rpx;
        background-color: rgba(255, 0, 0, 0.6);
        border-radius: 100rpx;
        color: #FFFFFF;
      }

      .tag+.tag {
        margin-left: 10rpx;
      }

      .action {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        border-radius: 60rpx;
        background-color: rgba(0, 0, 255, 0.3);
        color: #FFFFFF;
        font-size: 24rpx;
      }
    }

    .recommend {
      .wrap {
        width: 100%;

        .list {
          display: flex;
          align-props: flex-start;

          .goods-item+.goods-item {
            margin-left: 20rpx;
          }
        }
      }
    }
  }

  .details {
    .title {
      height: 120rpx;
      font-size: 40rpx;
      color: #333333;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 60rpx;
        height: 28rpx;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .icon1 {
        background-image: url('/static/shop/left.png');
      }

      .icon2 {
        background-image: url('/static/shop/right.png');
      }
    }
  }

  .tools {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #FFFFFF;
    box-shadow: 0px -1px 0px #EEEEEE;

    .toolbar {
      height: 100rpx;
      display: flex;

      .left {
        flex: 1;
        padding-left: 32rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-item {
          display: flex;
          flex-direction: column;
          font-size: 18rpx;
          color: #333333;
          align-items: center;
        }

      }

      .right {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 32rpx;

        .btn {
          width: 200rpx;
          height: 80rpx;
          text-align: center;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1.3;
        }

        .btn1 {
          border-radius: 80rpx 0 0 80rpx;
          background-color: #343434;
        }

        .btn2 {
          border-radius: 0 80rpx 80rpx 0;
          background-color: #f8324b;
        }
      }
    }
  }

  .block-30 {
    width: 30rpx;
    height: 28rpx;
  }

  .block-32 {
    width: 32rpx;
    height: 32rpx;
  }

  .radius-20 {
    border-radius: 20rpx;
  }

  .block-90 {
    width: 90rpx;
    height: 90rpx;
    min-width: 90rpx;
    min-height: 90rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .block-220 {
    width: 220rpx;
    height: 220rpx;
    min-width: 220rpx;
    min-height: 220rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
</style>
