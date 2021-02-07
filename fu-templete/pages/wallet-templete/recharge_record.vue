<template>
  <view class="page">
    <view class="info_list" v-for="(item,index) in listData" :key="index">
      <view class="info_box">
        <rich-text class="info_pa" :nodes="item.remark"></rich-text>
        <text class="info_pb">{{item.create_time}}</text>
      </view>
      <text class="info_pc">{{item.change_money}}</text>
    </view>
    <view class="zanwu" :class="hidden?'act':''">
      <text class="iconfont icon-zanwushuju"></text>
    </view>
    <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
     :list-data-length="listDataLength"></fu-empty>
  </view>
</template>

<script>
  import pagingList from '@/common/minix/paging_list.js'
  export default {
    mixins: [pagingList],
    data() {
      return {
        hidden: false,
        minixPagingListsApi: global.apiUrls.getMoneyDetail,
        pageingListApiMethod:"post",
      }
    },

    methods: {
      pagingListPostData() {
      	return {
      		change_type: 1,
      		page_size: 10
      	}
      },
    }
  }
</script>

<style lang="scss">
  page {
    background: #FFFFFF;
  }

  .info_list {
    width: 100%;
    height: auto;
    overflow: hidden;
    border-bottom: 1px #EEEEEE solid;
    padding: 30upx;

    .info_box {
      width: calc(100% - 170upx);
      height: auto;
      float: left;
      overflow: hidden;

      .info_pa {
        font-size: 30upx;
        color: #333;
        line-height: 45upx;
        display: block;
      }

      .info_pb {
        font-size: 24upx;
        color: #999999;
        display: block;
        margin-top: 16upx;
      }
    }

    .info_pc {
      font-size: 32upx;
      color: #333333;
      line-height: 88upx;
      display: block;
      float: right;
    }
  }

  .act .info_pc {
    color: #C2132A;
  }
  .cont{
    text-align: center;
    line-height: 30px;
  }
</style>
