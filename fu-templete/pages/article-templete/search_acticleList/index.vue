<template>
  <view class="page">
    <!-- 头部 -->
    <view class="cu-custom bg-white" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
      <view class="cu-bar bg-white fixed" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
        <view class="action" @click="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input confirm-type="search" type="text" v-model="keyword" :focus="true" :adjust-position="false"
            :hold-keyboard="false" :placeholder="placeholder" @input="handleInput" @confirm="handleSearch"></input>
          <text v-if="keyword.length != 0" class="cuIcon-close text-gray padding-right-xs" @click="clear"></text>
        </view>
      </view>
    </view>
    <view >
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
        keyword: '', // 搜索关键字
        placeholder: '搜点什么',
        classIfyId:0,
        keyboardheight: 0, // 键盘高度
        minixPagingListsApi: global.apiUrls.postOperationGetColumnArticleList,
        allowOnloadGetList: false,
      }
    },
    onLoad(options){
      console.log(options)
      if(options.keyWords){
        this.allowOnloadGetList = true
        this.keyword = options.keyWords
        this.pagingListGetLists()
      }
      uni.onKeyboardHeightChange(res => {
        console.log('键盘监听', res);
        this.keyboardheight = res.height;
      });
    },
    onShow() {
    },
    methods: {
      // 后退
      back() {
        uni.navigateBack();
      },
      pagingListPostData(){
        return {
          category_id:0,
          is_recommend:0,
          keyword:this.keyword
        }
      },
      // 输入监听
      handleInput(e,text) {
        let txt = e && e.detail.value.trim() || text;
        if (txt) {
          this.$api.post(global.apiUrls.postSearchWords, {
              keyWords: txt
            })
            .then(res => {
              console.log(res);
              if (res.statusCode == 200 && res.data.code == 1) {
                let list = res.data.data;
                this.words = list;
                this.isInit = true;
              }
            })
            .catch(err => {
              console.log(err);
            })
        } else {
          this.words = [];
        }
      },
      // 去搜索
      handleSearch(e, item) {
        uni.hideKeyboard();
          // 搜索按钮或语音搜索
          if (this.keyword.trim() != '') {
            // 输入框触发搜索
            this.pagingListToggle()
          }else{
            this.$message.info('请输入搜索关键字');
          }
          this.keyword = '';
          this.keyboardheight = 0;
      },
    }
  }
</script>

<style lang="scss">
 @import './index.scss';
</style>
