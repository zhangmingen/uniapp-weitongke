<template>
  <view class="page" v-if="end">
    <view class="cu-custom bg-white" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
      <view class="cu-bar bg-white fixed" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
        <view class="action" @click="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="action" style="color:#333">文章详情</view>
        <view class="action" @click="ChangePopup">
          <text class="cuIcon-more"></text>
        </view>
      </view>
    </view>
    <!-- 文章标题 start -->
    <view class="title">{{detail.title}}</view>
    <view class="time">{{detail.add_time}}</view>
    <!-- 文章标题 end -->

    <!-- 文章详情 start -->
    <view class="article-detail" >
      <fu-parse :content="body"></fu-parse>
    </view>
    <!-- 文章详情 end -->

    <!-- 文章 action start -->
    <!-- <view class="article-footer"> -->
      <!-- <view class="shoucang collection" @click="dianzan"><text class="fu-iconfont " :class="like==1 ? 'act' : ''">&#xe71e;</text>{{detail.like_num}}</view> -->
      <!-- <view class="shoucang"><text class="iconfont iconstar5" @click="dianzan"></text>{{detail.}}</view> -->
      <!-- <view class="pinglun"><text class="iconfont iconzu2" @click="toReply"></text>200</view> -->
    <!-- </view> -->
    <!-- 文章 action end -->

    <!-- 精选留言 start -->
    <view class="comment-box">
      <view class="good-title">
        <!-- <image src="../../../static/login/login_top_bg.png" class="bg-img"></image> -->
        评论区
        <text @click="handleJump" :data-url="'../acticle_comments/index?id='+id">查看更多</text>
      </view>
      <view class="box">
        <view class="comment" v-for="(item,index) in commentList" :key="index" v-if="commentList.length>0">
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
       <!-- <view class="comment" v-if="commentList.head_img">
          <image :src="commentList.head_img" class="icon"></image>
          <view class="info">
            <view class="head">
              <view class="name">{{commentList.user_nickname}}</view>
            </view>
            <view class="desc">
             {{commentList.content}}
            </view>
          </view>
        </view> -->

      </view>
    </view>
    <view class="fixed-comment">
      <input type="text" placeholder="请输入评论" placeholder-style="color: #CCCCCC; font-size: 28upx;" @focus="focusFn"  v-model="content" confirm-type="search" @confirm="send()"/>
      <view class="like" @click="changLike" ><text class="fu-iconfont " :class="like==1 ? 'act' : ''">&#xe71e;</text>{{detail.like_num}}</view>
      <view class="collect" @click="collection" ><text class="fu-iconfont " :class="isCollect==1 ? 'act' : ''"></text>{{detail.collection_num}}</view>
      <!-- <view class="btn" v-if="isFocus" @click="send">发送</view> -->
    </view>
    <!-- 精选留言 end -->
    <fu-popup v-model="showPopup" mode="center" width="80%">
      <view class="report_box">
        <view class="reportTitle">举报类型</view>
        <view class="reportType">
          <text class="history-tag cu-tag radius text-cut" v-for="(item,index) in reportList" :key="index" :class="reportIndex==index ? 'act' : ''" @click="changeReport(index,item.id)">{{item.name}}</text>
        </view>
        <view class="reportCause">
          <text class="reportTitle">举报原因</text>
          <input type="text" placeholder="请输入" v-model="value">
        </view>
        <fu-button class="button" shape="circle" type="primary" @click="reportSumbit">确定</fu-button>
      </view>
    </fu-popup>
  </view>

</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        commentList: [], //评论列表
        isFocus: false,
        showPopup: false,
        id:'',
        detail:'',
        content:'',
        like:0,
        isCollect:0,
        body:'',
        page:1,
        end:false,
        value:'',
        reportList:[],
        reportIndex:-1,
        reportId:''
      }
    },
    onLoad(option) {
      uni.showLoading({
          title: '加载中'
      });
      console.log(option)
      this.id = option.id || 1
      this.getData()
      this.getComments()
      this.getReportType()
    },
    methods: {
      changeReport(index,id){
        this.reportIndex = index;
        this.reportId = id
      },
      ChangePopup(){
        if(!global.token){
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/login-templete/login-templete001/login-password',
            params: {}
          })
          return false
        }
        this.showPopup = true
        // this.$refs.more.show()
      },
      reportSumbit(){
        console.log(11)
        if(this.reportId==''){
         this.$message.info('请选择举报类型')
         return false
        }else if(this.value==''){
          this.$message.info('请输入举报原因')
          return false
        }
        var self = this
        this.$api.post(global.apiUrls.postOperationAddArticleReport, {
           be_report_article_id:this.id,
           report_type:this.reportId,
           remark:this.value
        }).then(res => {
          console.log(res.data)
          var res = res.data
          if(res.code==1){
            this.$message.info('举报成功,等待审核')
            this.showPopup = false
          }
        })
      },
      getReportType(){
        var self = this
        this.$api.post(global.apiUrls.postOperationGetArticleReportType, {
        }).then(res => {
          console.log(res.data)
          var res = res.data
          self.reportList = res.data
        })
      },
      previewImage1(currImg) {
        uni.previewImage({
          indicator: "number",
          current: this.IMG_URL + currImg,
          urls: this.banner2
        })
      },
      back() {
        uni.navigateBack();
      },
      getData(){
        var self = this
        this.$api.post(global.apiUrls.postOperationGetArticleDetail, {
          id:this.id
        }).then(res => {
          console.log(res.data)
          self.end = true
          self.detail = res.data.data
          self.body = res.data.data.body.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;"')
          self.like = res.data.data.is_like
          self.isCollect = res.data.data.is_collection
          uni.hideLoading();
        })
      },
      getComments(){
        var self = this
        this.$api.post(global.apiUrls.postOperationGetArticleComment, {
          article_id:this.id,
          page:this.page
        }).then(res => {
          var res = res.data
          console.log(res.data)
          if(res.code==1){
            self.commentList = res.data.data
          }
        })
      },
      focusFn() {
        this.isFocus = true;
      },
      blurFn(){
        if(this.content=='') return this.isFocus = false;
      },
      send(){
        if(!global.token){
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/login-templete/login-templete001/login-password',
            params: {}
          })
          return false
        }
        var self = this
        if(this.content.trim()==''){
          self.$message.info('评论不能为空')
          return false
        }
       this.$api.post(global.apiUrls.postOperationArticleCommentAdd, {
         article_id:this.id,
         content:this.content
       }).then(res => {
         console.log(res.data)
         self.content = ''
         // self.$message.info(res.data.msg)
         self.$message.info('评论成功')
         self.isFocus = false
         self.getComments()
       })
      },
      changLike(){
        if(global.token==''){
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/login-templete/login-templete001/login-password',
            params: {}
          })
          return false
        }
        var self = this
        this.$api.post(global.apiUrls.postOperationGetArticleLikeDo, {
          article_id:this.id,
          status:this.like==1 ? 0 : 1
        }).then(res => {
          console.log(res.data)
          self.like = self.like==1 ? 0 : 1
          self.detail.like_num = self.like==1 ? self.detail.like_num+1 : self.detail.like_num-1
          self.$message.info(res.data.msg)
          // self.getComments()
        })
      },
      collection(){
        if(global.token==''){
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/login-templete/login-templete001/login-password',
            params: {}
          })
          return false
        }
        var self = this
        this.$api.post(global.apiUrls.postUserAddonsSetCollection, {
          collect_id:this.id,
          type:2,
          // status:this.like==1 ? 0 : 1
        }).then(res => {
          var res = res.data
          if(res.code==1){
            self.isCollect = self.isCollect==1 ? 0 : 1
            self.detail.collection_num = self.isCollect==1 ? self.detail.collection_num+1 : self.detail.collection_num-1
            self.$message.info(res.msg)
          }

          // self.getComments()
        })
      }
    }
  }
</script>

<style lang="scss">
 @import './index.scss';
 .report_box{
   width: 100%;
   padding: 32upx;
   border-radius: 10upx;
   background: #fff;
   .reportTitle{
     overflow: hidden;
     font-size: 32upx;
   }
   .reportType{
     overflow: hidden;
     margin: 30upx 0;
     text{
      background: #ccc;
      border-radius: 50upx;
      width: 25%;
       display: inline-block;
       text-align: center;
       line-height: 52upx;
       color: #666;
       &.act{
         color: #fff;
         background: $fu-bg-color;
       }
     }
   }
   .reportCause{
     input{
       margin: 30upx 0;
       border: 1px solid #f5f5f5;
       border-radius: 10upx;
       height: 80upx;
       font-size: 28upx;
       padding: 0 20upx;
     }
   }
 }
</style>
