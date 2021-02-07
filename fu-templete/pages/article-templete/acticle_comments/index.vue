<template>
  <view class="page">

    <!-- 精选留言 start -->
    <view class="comment-box">
      <view class="box">
        <view class="comment" v-for="(item,index) in listData" :key="index">
          <image :src="item.head_img" class="icon"></image>
          <view class="info">
            <view class="head">
              <view class="name">{{item.user_nickname}}</view>
              <view class="shoucang">{{item.create_time}}</view>
            </view>
            <view class="desc">
              {{item.content}}
            </view>
          </view>
        </view>
      </view>
    </view>
    <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
     :list-data-length="listDataLength"></fu-empty>
    <!-- <view class="fixed-comment">
      <textarea type="text" placeholder="请输入评论" placeholder-style="color: #CCCCCC; font-size: 28upx;" @focus="focusFn"  v-model="content"/></textarea>
      <view class="like" @click="changLike" v-if="!isFocus"><text class="fu-iconfont " :class="like==1 ? 'act' : ''">&#xe71e;</text>{{detail.like_num}}</view>
      <view class="btn" v-if="isFocus" @click="send">发送</view>
    </view> -->
    <!-- 精选留言 end -->
  </view>
</template>

<script>
  import pagingList from '@/common/minix/paging_list.js'
  export default {
    mixins: [pagingList],
    data() {
      return {
        commentList: [], //评论列表
        id:'',
        minixPagingListsApi: global.apiUrls.postOperationGetArticleComment,
        allowOnloadGetList: false
      }
    },
    onLoad(option) {
      this.id = option.id
      this.allowOnloadGetList = true
      this.pagingListGetLists()
    },
    methods: {

      pagingListPostData(){
        return {
          article_id: this.id,
          page_size:10
        }
      }

    }
  }
</script>

<style lang="scss">
 @import '../acticle_detail/index.scss';
 .comment-box{
   padding-top: 0;
   border: 0;
   padding-bottom: 0;
 }
 
</style>
