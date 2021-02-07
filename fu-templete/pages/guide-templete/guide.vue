<template>
  <view class="content">
    <!-- <view class="one" v-if="isfalse">
      <image :src="adImg" mode="" @tap="openLink"></image>
      <view class="countdown" @tap="goHome">
        跳过{{time}}s
      </view>
    </view> -->
    <!-- 启动图 -->
    <view class="two">
      <swiper class="swiper" @change="changeSwiper">
        <swiper-item v-for="(item,index) in imgList" :key="index" >
          <view class="swiper_one" v-if="index == imgList.length-1" >
            <image :src="item.thumb|assembleImgSrc" mode="aspectFill"></image>
            <view @tap="goPath()">立即体验</view>
          </view>
          <view class="swiper_one" v-else>
            <image :src="item.thumb|assembleImgSrc" mode="aspectFill"></image>

          </view>
        </swiper-item>
      </swiper>

      <!-- 轮播指示点样式修改 -->
      <view class="dots">
          <block v-for="(item,index) in imgList.length" :key="item">
              <view class="dot" :class="index == swiperCurrent ? ' active' : ''"></view>
          </block>
      </view>
      <!-- <uni-swiper-dot :info="imgList" :dotsStyles="dotsStyles" :current="swiperCurrent" field="content" >
          <swiper-item class="swiper" v-for="(item,index) in imgList" :key="index" @change="changeSwiper" :autoplay="true" :circular = "true">
            <view class="swiper_one" v-if="index == imgList.length-1" @touchstart="itemTouchstart" @touchmove="itemTouchmove">
              <image :src="item.thumb" ></image>
              <view @tap="goPath()">跳过</view>
            </view>
            <view class="swiper_one" v-else>
              <image :src="item.thumb" ></image>
              <view @tap="goPath()">跳过</view>
            </view>
          </swiper-item>
      </uni-swiper-dot> -->
      <!-- <view class="dots">
           <block v-for="(item,index) in imgList.length" :key="index">
               <view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
           </block>
       </view> -->
    </view>
  </view>
</template>

<script>
  let isLogin;
  export default{
    data(){
      return{
        imgList:[],//引导页列表
        touches: {
          startX: '',
          startY: '',
          moveEndX: '',
          moveEndY: ''
        },
        swiperCurrent:0,
        dotsStyles:{
          bottom:-20,
          backgroundColor:'rgba(230, 0, 54, 0.3)' ,
          selectedBackgroundColor:'#FE510D'
        },
      }
    },
    beforeCreate () {
      isLogin = uni.getStorageSync('LOGIN_TOKEN');
      if(isLogin) uni.switchTab({ url:'/pages/tab/tab01/index'})
    },
    onLoad() {
      if(isLogin) return;
      this.$api.post(global.apiUrls.postOperationGetAds, { typeid: 2 }).then(res=>{
       if(res.data.code == 1){
        this.imgList = res.data.data
         // this.imgList = res.data.data.guide_map;
         // console.log(this.imgList)
       }
      })
    },
    methods:{
      // 切换轮播图
      changeSwiper(e) {
          this.swiperCurrent = e.detail.current;
      },
      itemTouchstart(e) {
        e.preventDefault();
        this.touches.startX = e.changedTouches[0].pageX,
        this.touches.startY = e.changedTouches[0].pageY;
      },
      itemTouchmove(e) {
        e.preventDefault();
        this.touches.moveEndX = e.changedTouches[0].pageX;
        this.touches.moveEndY = e.changedTouches[0].pageY;
        let X = this.touches.moveEndX - this.touches.startX;
        let Y = this.touches.moveEndY - this.touches.startY;
        if (Math.abs(X) > Math.abs(Y) && X < 0) {
          uni.setStorageSync('LOGIN_TOKEN',true);
          uni.switchTab({
            url:'/pages/tab/tab01/index'
          })
        }
      },
      //跳过
      goPath(){
        uni.setStorageSync('LOGIN_TOKEN',true);
        uni.switchTab({ url:'/pages/tab/tab01/index'})
      },
      openLink(){
        plus.runtime.openWeb(this.adurl, function(res) {
          console.log(res);
        });
      },

    }
  }
</script>

<style lang="scss">
  page{
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .content{
    position: fixed;
    width: 100%;
    height: 100%;
    .one{
      height:100%;
      image{
        display: block;
        width: 100%;
        height: 100%;
      }
      .countdown{
        position: absolute;
        right: 20upx;
        top: calc(15upx + var(--status-bar-height));
        padding: 10upx 20upx;
        background: rgba(0,0,0,0.7);
        color: #fff;
        border-radius: 30upx;
      }
    }
    .two{
      position: relative;
      .swiper{
        width: 750upx;
        height: 100vh;
        swiper-item{
          height: 100vh;
          width:750upx;
          .swiper_one{
            image{
              height: 100vh;
              width: 750upx;
            }
            view{
              position: absolute;
              left: 50%;
              bottom: 150upx;
              transform: translateX(-50%);
              padding: 20upx 60upx;
              background: rgba(0,0,0,0.3);
              color: #fff;
              border-radius: 40upx;
              background-color: $fu-main-color;
            }
          }
        }
      }
      .dots {
          position: absolute;
          bottom: 84upx;
          left: 50%;
          // 这里一定要注意兼容不然很可能踩坑
          transform: translate(-50%, 0);
          -webkit-transform: translate(-50%, 0);
          z-index: 99;
          display: flex;
          flex-direction: row;
          justify-content: center;

          .dot {
              width: 10rpx;
              height: 10rpx;
          border-radius: 50%;
              transition: all .6s;
              background: #ccc;
              margin-right: 15rpx;
              border-radius:3px;
          }

          .active {
              width: 24rpx;
              height: 8rpx;
              background: $fu-main-color;
          }
      }
    }
  }
</style>
