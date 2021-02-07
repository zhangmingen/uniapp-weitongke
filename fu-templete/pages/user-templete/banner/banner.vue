<template>
  <view>
    <!-- banner图 -->
    <view class="banner">
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
        duration="500">
        <swiper-item v-for="(item, index) in bannerList" :key="index" @click="click_num(item)">
          <image :src="item.thumb" mode=""></image>
          <text>{{item.name}}</text>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        bannerList: [{
          name: 'feoifg'
        }]
      }
    },
    onLoad() {
      this.get_banner()
    },
    methods: {
      get_banner() {
        //获取首页轮播图
        this.$api.post(global.apiUrls.getAds, {
          typeid: 3
        }).then(res => {
          if (res.data.code == 1) {
            this.bannerList = res.data.data
          }

        })
      },
      // 触发广告位埋点
      click_num(item) {
        let user_id = '';
        let info = uni.getStorageSync('USERINFO')
        if (info) {
          user_id = info.id
        }
        // 统计数量
        this.$api.get(global.apiUrls.getAdsClick, {
          typeid: 3,
          adsid: item.id,
          user_id: user_id
        }).then(res => {
          if (res.code == 1) {

          }

        })
        // 判断链接  1 内链   2 外链
        if (item.link_type == 1) {
          this.inner_tip(item.href)
        } else {
          this.to_outLink(item.href)
        }
      },
      // 外链跳转
      to_outLink(link) {
        uni.navigateTo({
          url: '/fu-templete/pages/user-templete/banner/outLink?link=' + link
        })
      },
      // 内链提示
      inner_tip(link) {
        uni.showToast({
          title: '即将跳转至本地页面' + link,
          icon: 'none'
        })
      }
    }
  }
</script>

<style>
  page {
    background: #FFFFFF;
  }
</style>
