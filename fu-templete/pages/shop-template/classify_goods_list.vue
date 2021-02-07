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
          <input
            confirm-type="search"
            type="text"
            v-model="keywords"
            :adjust-position="false"
            :hold-keyboard="false"
            :placeholder="placeholder"
            @confirm="searchConfirm"
          ></input>
          <text v-if="keywords.length != 0" class="cuIcon-close text-gray padding-right-xs" @tap="handleClear"></text>
        </view>
      </view>
    </view>
		<!-- 筛选 -->
    <fu-filter-dropdown :top="CustomBar" @changeLayout="changeLayout" @changeFilter="changeFilter"></fu-filter-dropdown>
		<!--商品列表-->
    <view class="list">
      <view v-if="model == 'inline'">
        <block v-for="item in lists" :key="item.id">
          <fu-goods-inline :info="item"></fu-goods-inline>
        </block>
      </view>
      <view v-else class="padding-lr-sm">
        <view class="grid col-2">
          <block v-for="item in lists" :key="item.id">
            <view class="padding-lr-xs">
              <fu-goods-block :info="item"></fu-goods-block>
            </view>
          </block>
        </view>
      </view>
    </view>
    <!-- 空布局 -->
    <fu-empty-01 v-if="lists.length == 0 && isInit"></fu-empty-01>
    <!-- 加载状态 -->
    <uni-load-more v-if="lists.length > 5" :status="status"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
        StatusBar: this.StatusBar,
        keywords: '', // 搜索的文本
        placeholder: '', // 默认文本
        model: 'inline', // 布局样式
        lists: [], // 结果列表
        cid: '', // 分类id(点击分类跳转过来必传)
        isInit: false,// 是否请求过数据
        status: 'more', // 加载状态
        page: 1, // 页数
        size: 10, // 页条数
        sorts: '1', // 条件
        order: 'asc', // 排序 asc: 正序 desc: 倒序
			};
		},
		onLoad(options) {
			console.log(options, "搜索参数");
			const {keyWords = '', cid = ''} = options;
      if(keyWords != ''){
        this.keywords = keyWords;
      }
      if(cid != ''){
        this.cid = cid;
      }
      this.handleSearch();
		},
    onReachBottom() {
      this.handleSearch();
    },
		methods: {
      // 切换布局
      changeLayout(e){
        this.model = e;
      },
      // 切换搜索条件
      changeFilter(type,order){
        this.sorts = ++type;
        this.order = order;
        this.page = 1;
        this.status = 'more';
        this.handleSearch();
        this.$nextTick(() => {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        })
      },
      searchConfirm(e){
        if(e && e.detail.value.trim() == '') return ;
        this.cid = 0;
        this.page = 1;
        this.status = 'more';
        this.handleSearch();
      },
      // 搜索
			handleSearch() {
        if(this.status != 'more') return ;
        this.status = 'loading';
				let data = {
					sort: this.sorts,
					order: this.order,
					page: this.page,
					pagesize: this.size,
				}
        if(this.placeholder.trim() || this.keywords.trim()){
          data.keyword = this.keywords;
        }
        if(this.cid){
          data.cid = this.cid;
        }
        console.log('search data',data);
        this.$api.get(global.apiUrls.getGoodsGetGoodsList,data)
        .then(res => {
          console.log('搜索结果',res)
          if(res.data.code == 1){
            let totalSize = res.data.data.total;
            let list = res.data.data.data;
            if(this.page == 1) this.lists = [];
            this.lists = this.lists.concat(list);
            if(this.lists.length >= totalSize){
              this.status = 'noMore';
            }else{
              this.status = 'more';
              this.page += this.page;
            }
            this.$nextTick(() => {
              this.isInit = true;
            })
          }else{
            this.$message.error(res.data.msg);
          }
        })
			},
      handleClear(){
        this.keywords = '';
      },
			// 返回
      back(){
        uni.navigateBack();
      }
    }
	};
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100%;
		background: #F6F6F6;
	}

	.head-top {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.nav-bar-wrap {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.sort-wrap {
		position: fixed;
		left: 0;
		right: 0;
	}

	.height-100 {
		height: 100rpx;
	}

	.block-180 {
		width: 180rpx;
		min-width: 180rpx;
		height: 180rpx;
		min-height: 180rpx;
		position: relative;
		image {
			width: 100%;
			height: 100%;
			border-radius: 8rpx;
		}
		.null{
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			border-radius: 8rpx;
			background-color: rgba(0,0,0,.45);
			color: #FFFFFF;
			font-size: 36rpx;
			text-align: center;
			line-height: 180rpx;
		}

	}

	.list-item+.list-item {
		border-top: 1rpx solid #EEEEEE;
	}

	.overlay-animate {
		position: fixed;
	}

	.float-action {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		// background-color: rgba(165, 165, 165, .85);
		position: fixed;
		right: 20rpx;
		bottom: 280rpx;
		z-index: 996;
		border: 1rpx solid #CCCCCC;
		.cuIcon-cart{
			color: #CCCCCC;
		}
	}
	.animate {
		position: fixed;
		border-radius: 50%;
		z-index: 995;
		transform-origin: 50% 50%;
		transition: transform linear 0.5s, left linear 0.5s, top cubic-bezier(0.3, -0.2, 1, 0) 0.5s !important;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}
</style>
