<template>
  <view class="page">
    <!-- 分类start -->
    <!-- #ifdef APP-PLUS -->
    <view class="classify-template1" style="top:0">
      <text :class="classIfyIndex==0 ? 'active' : ''" @click="changeTab(0,0)">推荐</text>
      <text v-for="(item,index) in classIfyTabList" :class="classIfyIndex==index+1 ? 'active' : ''" @click="changeTab(index+1,item.id)">{{item.name}}</text>
    </view>
    <!-- #endif -->

    <!-- #ifdef H5  -->
    <view class="classify-template1" style="top: '44px'">
      <text :class="classIfyIndex==0 ? 'active' : ''" @click="changeTab(0,0)">推荐</text>
      <text v-for="(item,index) in classIfyTabList" :class="classIfyIndex==index+1 ? 'active' : ''" @click="changeTab(index+1,item.id)">{{item.name}}</text>
    </view>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN  -->
    <view class="classify-template1" style="top: 0">
      <text :class="classIfyIndex==0 ? 'active' : ''" @click="changeTab(0,0)">推荐</text>
      <text v-for="(item,index) in classIfyTabList" :class="classIfyIndex==index+1 ? 'active' : ''" @click="changeTab(index+1,item.id)">{{item.name}}</text>
    </view>
    <!-- #endif -->
    <!-- 分类end -->
    <view :style="{'margin-top':TopHeight+'px'}">
      <!-- <view class="page-content">
        <view class="page-item" v-for="(item,index) in classIfyList" :key="index" @click="handleJump" :data-url="'../acticle_detail/index?id='+item.id" >
          <view class="left-box">
            <text class="title">{{item.title}}</text>
            <view class="time">{{item.add_time.split(' ')[0]}}
              <text>
                <text class="fu-iconfont ">&#xe645;</text>
                <text>{{item.click_count}}</text>
              </text>
              <text>
                <text class="fu-iconfont ">&#xe71e;</text>
                <text>{{item.click_count}}</text>
              </text>
            </view>

          </view>
          <view class="right-box">
            <image :src="item.img_url"></image>
          </view>
        </view>
      </view> -->

      <view class="page-item1 page-item2" v-for="(item,index) in listData" :key="index">

      	<view class="item" v-if="item.img_url.length>1" @click="handleJump" :data-url="'../acticle_detail/index?id='+item.id">
      		<view class="name">
      			<image v-if="item.is_best" src="/static/user/hot_ico.png" mode=""></image>
      			<image v-if="item.is_new" src="/static/user/new_ico.png" mode=""></image>
      			{{item.title}}
      		</view>
          <view class="img_box" >
      			<block v-for="(item1,index) in item.img_url" :key="index">
      				<view>
      					<image :src="item1" mode=""></image>
      				</view>
      			</block>
      		</view>
      		<view class="infor">
      			<image v-if="item.is_hot" src="/static/user/hot_ico.png" mode=""></image>
      			<!-- <text class="nick">{{item.user_nickname}}</text> -->
      			<!-- <rich-text :nodes="item.user_nickname" class="nick"></rich-text> -->
      			<text>{{item.article_comment_num}}评论</text>
      			<text>{{item.add_time}}</text>
      		</view>
      	</view>

        <view class="item" v-if="item.img_url.length==0" @click="handleJump" :data-url="'../acticle_detail/index?id='+item.id">
        	<view class="name">
        		<image v-if="item.is_best" src="/static/user/hot_ico.png" mode=""></image>
        		<image v-if="item.is_new" src="/static/user/new_ico.png" mode=""></image>
        		{{item.title}}
        	</view>

        	<view class="infor">
        		<image v-if="item.is_hot" src="/static/user/hot_ico.png" mode=""></image>
        		<!-- <text class="nick">{{item.user_nickname}}</text> -->
        		<!-- <rich-text :nodes="item.user_nickname" class="nick"></rich-text> -->
        		<text>{{item.article_comment_num}}评论</text>
        		<text>{{item.add_time}}</text>
        	</view>
        </view>

      	<view class="item item_img" v-if="item.img_url.length == 1" @click="handleJump" :data-url="'../acticle_detail/index?id='+item.id">
      		<view class="img_right">
      			<image :src="item.img_url[0]" mode=""></image>
      		</view>
      		<view class="name">
      			<image v-if="item.is_best" src="/static/user/hot_ico.png" mode=""></image>
      			<image v-if="item.is_new" src="/static/user/new_ico.png" mode=""></image>
      			{{item.title}}
      		</view>
      		<view class="infor">
      			<!-- <rich-text :nodes="item.user_nickname" class="nick"></rich-text> -->
      			<text class="nick">{{item.article_comment_num}}评论</text>
            <text>{{item.add_time}}</text>
      		</view>
      	</view>
      </view>
      <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
       :list-data-length="listDataLength"></fu-empty>

    </view>
  </view>
</template>

<script>
  import pagingList from '@/common/minix/paging_list.js'
  export default {
    mixins: [pagingList],
    data() {
      return {
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        classIfyIndex:0,
        TopHeight:42,
        classIfyTabList:[],
        classIfyList: [],
        hasData:true,
        loadding:false,
        noData:false,
        classIfyId:0,
        minixPagingListsApi: global.apiUrls.postOperationGetColumnArticleList,
        allowOnloadGetList: false,
        keyWords:''
      }
    },
    onLoad(options){
      if(options.keyWords){
        this.keyWords = options.keyWords
      }
       // uni.startPullDownRefresh();
      // this.getArticle()
      this.getArticle()
      // this.pagingListGetLists()
      this.allowOnloadGetList = true
    },
    onShow() {
      // this.classIfyList = []
      // this.articleID = options.id
      this.pagingListToggle()
    },

    methods: {
      pagingListPostData(){
        return {
          category_id:this.classIfyId,
          is_recommend:this.classIfyId==0 ? 1 : 0,
          keyWords:this.keyWords
        }
      },
      changeTab(index,id) {
        // uni.showLoading({
        //     title: '加载中'
        // });
        this.classIfyIndex = index
        this.classIfyId = id
        // this.classIfyList = []
        // this.listData = []
        this.pagingListToggle()
        // this.getData()
      },
      getArticle(){
        var self = this
        this.$api.post(global.apiUrls.postOperationgetArticleColumn, {
        }).then(res => {
          // console.log(res.data)
          self.classIfyTabList = res.data.data
          // self.classIfyId = res.data.data[0].id
          // self.getData()
        }).catch(err => {
          // this.loginBtnLoading = false;
        })
      },
      getData(){
        var self = this
        this.$api.post(global.apiUrls.postOperationGetColumnArticleList, {
          category_id:self.classIfyId,
          is_recommend:self.classIfyId==0 ? 1 : 0
        }).then(res => {
          console.log(JSON.stringify(res))
          self.classIfyList = self.classIfyList.concat(res.data.data.data);
          uni.hideLoading()
        }).catch(err => {
          // this.loginBtnLoading = false;
        })
      },
    },
    onPullDownRefresh() {
      this.classIfyId = this.classIfyId
      
      this.pagingListGetLists()
      // setTimeout(function () {
      //     uni.stopPullDownRefresh();
      // }, 1000);
    },
  }
</script>

<style lang="scss">
 @import './index.scss';
</style>
