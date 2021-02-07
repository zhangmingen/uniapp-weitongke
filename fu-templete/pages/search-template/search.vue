<template>
  <view class="page">
    <!-- 头部 -->
    <view class="cu-custom bg-white" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
      <view class="cu-bar bg-white fixed" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="search-form round">
          <text class="cuIcon-search"></text>
          <input confirm-type="search" type="text" v-model="keyword" :focus="true" :adjust-position="false"
            :hold-keyboard="false" :placeholder="placeholder" @input="handleInput" @confirm="handleSearch"></input>
          <text v-if="keyword.length != 0" class="cuIcon-close text-gray padding-right-xs" @tap="clear"></text>
        </view>
      </view>
    </view>
    <!-- 历史,热搜 -->
    <scroll-view v-if="words.length == 0" class="content" :style="{height: 'calc(100% - '+CustomBar+'px)'}">
      <view class="wrap-box padding-sm">
        <!-- 搜索历史 -->
        <view v-if="history_list.length != 0">
          <view class="padding-tb-xs flex justify-between align-center">
            <text class="text-lg text-bold text-333">历史搜索</text>
            <view>
              <text v-if="!isEditor" class="cuIcon-delete text-666" style="font-size: 24rpx;" @tap="switchEdit"></text>
              <text v-if="isEditor" class="text-sm text-666 padding-right-xs" @tap="clearHistory">全部删除</text>
              <text v-if="isEditor" class="text-sm solid-left padding-left-sm" style="color: #f02523;border-color: #f02523;"
                @tap="switchEdit">完成</text>
            </view>
          </view>
          <view>
            <block v-for="(item,index) in history_list" :key="item.history_id">
              <view class="history-tag cu-tag radius text-cut" :class="[{'edited': isEditor}]" @click="handleSearch($event,item.history_content)">
                {{item.history_content}}
                <text v-if="isEditor" class="close cuIcon-close"></text>
              </view>
            </block>
          </view>
        </view>
        <!-- 搜索发现 -->
        <view v-if="search_found.length != 0">
          <view class="padding-tb-xs flex justify-between align-center">
            <text class="text-lg text-333 text-bold">搜索发现</text>
            <!-- <view class="text-sm text-333 padding-tb-xs padding-lr radius bg-white" @click="">换一批</view> -->
          </view>
          <view>
            <block v-for="(item,index) in search_found" :key="index">
              <view class="cu-tag radius text-cut" v-if="index < 10" @tap="toClassify(item)">{{item.name}}</view>
            </block>
          </view>
        </view>
        <!-- 热搜榜 -->
        <view>
          <view class="padding-tb-xs flex justify-between align-center">
            <text class="text-lg text-333 text-bold">热搜榜</text>
          </view>
          <view class="find_list">
            <block v-for="(item,index) in findData" :key="index">
              <view class="overflow-one text-cut" v-if="index < 10" @tap="toDetail(item)">
                <text class="top_num" :class="'top_'+index">{{index+1}}</text>
                {{ item.title }}
              </view>
            </block>
            <view style="text-align: center; line-height: 70rpx; font-size: 28rpx; color: #999;">—— 中犇研究院提供技术支持 ——</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 分词搜索 -->
    <scroll-view v-else class="bg-white" :style="{height: 'calc(100% - '+CustomBar+'px)'}">
      <view class="wrap-box padding-lr">
        <block v-for="(item,index) in words" :key="index">
          <view class="solid-bottom padding-tb flex align-center justify-between" @click="toDetail(item)">
            <view class="text-df text-333 text-cut">{{item.title}}</view>
            <view class="cuIcon-right text-999 margin-left" style="font-size: 20rpx;"></view>
          </view>
        </block>
      </view>
    </scroll-view>
    <!-- 底部语音按钮 -->
    <!-- #ifdef APP-PLUS || MP-WEIXIN -->
    <view v-if="keyboardheight > 0" class="bottom-fixed" :style="{bottom: keyboardheight+'px'}">
    	<view class="action-button animation-scale-up" @click="openVoicePop">
    		<text class="cuIcon-voicefill"></text>
    		点击说出你想要的商品
    	</view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        keyword: '', // 搜索关键字
        history_list: [], // 历史记录表
        words: [], // 搜索联想分词表
        placeholder: '搜点什么',
        isEditor: false, // 是否是删除状态
        listenerType: 'listener', // 是否识别成功 listener success fail
        listenerWord: '', // 语音识别的文字
        keyboardheight: 0, // 键盘高度
        isFind: true, // 是否展示搜索发现
        findData: [], // 热搜榜
        search_found: [], //热搜发现
        tabindex: 0,
        search_info: {},
        isInit: false,
      };
    },
    onShow() {
      this.initHistory();
    },
    onLoad(options) {
      this.search_info = options;
      if (options) {
        this.placeholder = options.name;
      }
      this.getFindData();
      this.getSearchFound();
      uni.onKeyboardHeightChange(res => {
        console.log('键盘监听', res);
        this.keyboardheight = res.height;
      });
    },
    methods: {
      // 切换删除状态
      switchEdit() {
        this.isEditor = !this.isEditor;
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
      // 获取热搜榜数据
      getFindData() {
        this.$api.post(global.apiUrls.postSearchHot)
          .then(res => {
            console.log("热搜榜", res);
            if (res.statusCode == 200 && res.data.code == 1) {
              this.findData = res.data.data;
            }
          })
          .catch(err => {
            console.log("hot list err: ", err);
          })
      },
      // 搜索发现
      getSearchFound() {
        if(global.token){
          this.$api.post(global.apiUrls.postSearchFind, {
              user_id: global.userInfo && global.userInfo.id || 0,
            })
            .then(res => {
              console.log("搜索发现", res);
              if (res.statusCode == 200 && res.data.code == 1) {
                this.search_found = res.data.data;
              }
            })
            .catch(err => {
              console.log("err: " + JSON.stringify(err));
            })
        }
      },
      // 删除单个历史记录
      removeHistory(id) {
        this.$api.post(global.apiUrls.postSearchHistoryDel, {
          user_id: global.userInfo && global.userInfo.id || 0,
          historyId: id,
        }).then(res => {
          if (res.statusCode == 200 && res.data.code == 1) {
            console.log('删除搜索历史', res);
            this.history_list = this.history_list.filter(item => item.history_id != id);
            if (this.history_list.length == 0) {
              this.isEditor = false;
            }
          }
        })
      },
      //清除历史记录
      clearHistory() {
        global.customShowModalPopup({
          title: '提示',
          content: '确定删除吗?',
          success: res => {
            if (res.confirm) {
              this.$api.post(global.apiUrls.postSearchHistoryDel, {
                user_id: global.userInfo && global.userInfo.id || 0,
              }).then(res => {
                if (res.statusCode == 200 && res.data.code == 1) {
                  console.log('删除搜索历史', res);
                  this.history_list = [];
                }
              })
            }
          }
        })
      },
      // 去搜索
      handleSearch(e, item) {
        uni.hideKeyboard();
        if (item) {
          console.log("搜索历史触发")
          if (this.isEditor) {
            this.removeHistory(item.history_id);
            return false;
          }
          // 点击历史记录去搜索
          this.$urouter.navigateTo({
            url: '/fu-templete/pages/shop-template/classify_goods_list',
            params: {
              keyWords: item
            }
          })
        } else {
          console.log("搜索栏触发");
          // 搜索按钮或语音搜索
          if (this.keyword.trim() != '') {
            // 输入框触发搜索
            this.addHistory(this.keyword.trim());
            this.$urouter.navigateTo({
              url: '/fu-templete/pages/shop-template/classify_goods_list',
              params: {
                keyWords: this.keyword
              }
            })
          } else if (this.placeholder != '搜点什么') {
            // 首页带过来的数据触发搜索
            this.$urouter.navigateTo({
              url: '/fu-templete/pages/shop-template/classify_goods_list',
              params: {
                keyWords: this.placeholder
              }
            })
          } else {
            this.$message.info('请输入搜索关键字');
          }
          this.keyword = '';
          this.keyboardheight = 0;
        }
      },
      // 去详情页
      toDetail(item) {
        uni.hideKeyboard();
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/article-templete/acticle_detail/index',
          params: {
            id: item.id
          }
        })
      },
      // 去分类页面
      toClassify(item) {
        console.log(item);
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/article-templete/acticle_detail/index',
          params: {
            id: item.id
          }
        })
      },
      // 后退
      back() {
        uni.navigateBack();
      },
      // 打开语音识别弹窗
      openVoicePop(){
        // #ifdef MP-WEIXIN
        this.listenerType = 'listener';
        this.listenerWord = '';
      	this.$refs.voice.open();
      	this.startRecord();
        // #endif
        // #ifdef APP-PLUS
        let options = {
          engine: 'iFly',
          punctuation: false,
          timeout: 3000
        }
        plus.speech.startRecognize(options,(res) => {
          console.log('识别成功',res)
          this.keyword = res;
          setTimeout(() => {
            this.handleInput(null,res);
          },300)
        },(err) => {
          console.log('识别失败',err)
        });
        // #endif
      },
      // 热搜榜切换
      changeShowFind() {
        this.isFind = !this.isFind;
      },
      // 初始化历史记录列表
      initHistory() {
        if(global.token){
          this.$api.post(global.apiUrls.postSearchHistory, {
            user_id: global.userInfo && global.userInfo.id || 0,
          }).then(res => {
            console.log('搜索历史', res)
            if (res.statusCode == 200 && res.data.code == 1) {
              this.history_list = res.data.data;
            }
          })
        }
      },
      // 增加一条搜索历史记录
      addHistory(value) {
        if (value.trim() == '') return;
        this.$api.post(global.apiUrls.postSearchHistoryAdd, {
          user_id: global.userInfo && global.userInfo.id || 0,
          historyContent: value.trim()
        }).then(res => {
          if (res.statusCode == 200 && res.data.code == 1) {
            console.log('添加搜索历史', res.data.msg);
            this.initHistory();
          }
        })
      },
      // 清除输入框
      clear(){
        this.keyword = '';
        this.words = [];
      }
    },
  };
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
    background-color: #F8F8F9;
    .content {
      background: #F8F8F9;
      .wrap-box {
        min-height: 100%;
        background-color: #F8F8F9;
        .cu-tag {
          display: inline-block;
          max-width: 700rpx;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          background-color: #FFFFFF;
          color: #333333;
          font-size: 24rpx;
          padding: 10rpx 24rpx;
        }

        .cu-tag+.cu-tag {
          margin-left: 0;
        }

        .history-tag {
          position: relative;

          .close {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 10rpx;
            font-size: 20rpx;
          }
        }
        .cu-tag.edited{
          padding: 10rpx 38rpx 10rpx 10rpx;
        }
      }
    }
  }
  .search-form{
    position: relative;
    .close{
      position: absolute;
      right: 0;
    }
  }

  .find_list {
    margin-top: 20rpx;
    padding: 20rpx 0;
    background: #fff;
    border-radius: 30rpx;

    .overflow-one {
      width: 100%;
      text-align: left;
      font-size: 28rpx;
      padding: 0 32rpx 0 0;
      line-height: 72rpx;

      .top_num {
        display: inline-block;
        width: 46rpx;
        font-size: 30rpx;
        font-weight: bold;
        font-style: italic;
        text-align: center;
        color: #ff6d2a;
        margin: 0 20rpx;
        background-size: 100%;
        background-repeat: no-repeat;
      }

      .top_0 {
        background-image: url(../../static/search/1.png);
      }

      .top_1 {
        background-image: url(../../static/search/2.png);
      }

      .top_2 {
        background-image: url(../../static/search/3.png);
      }

      .top_0,
      .top_1,
      .top_2 {
        color: rgba(255, 255, 255, 0);
      }
    }
  }
  .bottom-fixed{
  	height: 90rpx;
  	position: fixed;
  	left: 0;
  	right: 0;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	padding-bottom: 10rpx;
  	background: #fff;
  	.action-button{
  		width: auto;
  		height: 60rpx;
  		border: none;
  		border-radius: 60rpx;
  		background-color: $fu-main-color;
  		box-shadow: 0 0 10rpx $fu-main-color;
  		color: #FFFFFF;
  		font-size: 26rpx;
  		margin-top: 15rpx;
  		padding: 0 32rpx;
  		text{
  			margin-right: 30rpx;
  			font-size: 38rpx;
  			color: #FFFFFF;
  		}
  	}
  }
  .action-button{
  	width: 80rpx;
  	height: 80rpx;
  	background-color: #FFFFFF;
  	border: 4rpx solid $fu-main-color;
  	border-radius: 50%;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  }
</style>
