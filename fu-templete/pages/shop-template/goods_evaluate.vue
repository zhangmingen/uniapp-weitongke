<template>
  <view class="page">
    <!-- 列表 -->
    <view class="bg-white padding-lr">
      <block v-for="(item,index) in lists" :index="index">
        <fu-evaluate :prop="item"></fu-evaluate>
      </block>
    </view>
    <!-- 空布局 -->
    <fu-empty :paging-list-loaded-all="false" :paging-list-no-list-data="false" :list-data-length="0"></fu-empty>
    <!-- 加载状态 -->
    <uni-load-more v-if="lists.length > 5" :status="status"></uni-load-more>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        lists: [],
        page: 1,
        size: 10,
        status: 'more',
        isInit: false,
        goods_id: 0,
      }
    },
    onLoad(options) {
      const {goods_id} = options;
      this.goods_id = goods_id;
      this.loadData();
    },
    onPullDownRefresh() {
      this.page = 1;
      this.status = 'more';
      this.loadData();
    },
    onReachBottom() {
      this.loadData();
    },
    methods: {
      loadData(){
      	if(this.status != 'more') return ;
      	this.status = 'loading';
        this.$api.post(global.apiUrls.postGoodsCommentList,{
          goods_id: this.goods_id,
          page: this.page,
          size: this.size,
        })
        .then(res => {
          if(res.data.code == 1){
            let list = res.data.data.list;
            let total = res.data.data.total;
            if(this.page == 1) this.lists = [];
            this.lists = this.lists.concat(list);
            if(this.lists.length >= total){
              this.status = 'noMore';
            }else{
              this.status = 'more';
              this.page++;
            }
            this.$nextTick(() => {
              this.isInit = true;
              uni.stopPullDownRefresh();
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
