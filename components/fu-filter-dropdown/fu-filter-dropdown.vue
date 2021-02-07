<template>
  <view id="wrapper" class="wrapper bg-white" :style="[{top: top+'px'}]">
    <view id="content1" class="padding-lr flex content1" style="height: 80rpx;">
      <view class="flex-sub flex align-center justify-center text-333" :class="[{'active': curFilter == 0}]" @click="filterClick(0)">
        <text class="text-df margin-right-xs">{{selects[curSelected].title}}</text>
        <view class="flex flex-direction">
          <view v-if="showTopPop && (curFilter == 0)" class="cuIcon-fold" style="font-size: 20rpx;"></view>
          <!-- <view v-else class="cuIcon-unfold" style="font-size: 20rpx;"></view> -->
        </view>
      </view>
      <view class="flex-sub flex justify-center align-center text-333" :class="[{'active': curFilter == 1}]" @click="filterClick(1)">
        <text class="text-df">销量</text>
      </view>
      <view class="flex-sub flex justify-center align-center text-333" :class="[{'active': curFilter == 2}]" @click="filterClick(2)">
        <text class="text-df margin-right-xs">价格</text>
        <view class="flex flex-direction">
          <view v-if="curFilter != 2 || (order == 'desc')" class="cuIcon-fold" style="font-size: 20rpx;"></view>
          <view v-if="curFilter != 2 || (order == 'asc')" class="cuIcon-unfold" style="font-size: 20rpx;"></view>
        </view>
      </view>
      <view class="flex right justify-between">
        <view class="flex justify-center align-center" @tap="changeLayout">
          <text v-if="model == 'block'" class="cuIcon-apps text-333" style="font-size: 36rpx;"></text>
          <text v-else class="cuIcon-list text-333" style="font-size: 36rpx;"></text>
        </view>
        <!-- <view class="flex justify-center align-center text-333" :class="[{'active': curFilter == 3}]" @tap="filterClick(3)">
          <text class="text-df">商铺</text>
        </view> -->
      </view>
    </view>
    <!-- <view id="content2" class="padding-lr flex content2">
            <scroll-view class="left" scroll-x>
                <block v-for="(item,index) in filters" :key="index">
                    <view class="list-item padding-tb-xs padding-lr text-sm text-333 round" :class="[{'active2': item.selected}]" @tap="filter2Click(index)">
                        <text>{{item.title}}</text>
                        <text v-if="item.children && item.children.length != 0" class="margin-left-xs">
                            <text v-if="item.checked" class="cuIcon-fold" style="font-size: 20rpx;"></text>
                            <text v-else class="cuIcon-unfold" style="font-size: 20rpx;"></text>
                        </text>
                    </view>
                </block>
            </scroll-view>
            <view class="right flex align-center justify-end" @click="drawerhandle">
                <text class="text-333 text-sm">筛选</text>
                <text class="cuIcon-filter text-333"></text>
            </view>
        </view> -->
    <view v-if="showTopPop" class="masks flex" @touchmove.stop.prevent="moveHandle" @tap.stop="moveHandle">
      <view class="top" :style="[{height: posTop+'px'}]"></view>
      <view class="bot">
        <view class="container">
          <block v-for="(item,index) in selects" :key="index">
            <view class="flex justify-between padding-tb-xs text-333" :class="[{'active': index == curSelected}]"
              @tap.stop="selectHandle(index)">
              <text class="text-df" :class="[{'active': index == curSelected}]">{{item.title}}</text>
              <image v-if="index == curSelected" class="block-28" src="/static/images/checked.png" mode="aspectFill"></image>
            </view>
          </block>
        </view>
      </view>
    </view>
    <view v-if="showBotPop" class="masks flex" @touchmove.stop.prevent="moveHandle" @tap.stop="moveHandle">
      <view class="top" :style="[{height: posTop+'px'}]"></view>
      <view class="bot">
        <view class="container">
          <view class="grid col-2">
            <block v-for="(item,index) in curScreenList" :key="index">
              <view class="text-cut padding-right padding-tb-xs text-df text-333" @tap.stop="filter2Choice(item,index)">
                <image v-if="item.selected" class="block-28 margin-right-xs" src="/static/images/checked.png" mode="aspectFill"></image>
                <text :class="[{'text-bold': item.selected}]">{{item.title}}</text>
              </view>
            </block>
          </view>
          <view class="action-box">
            <view class="action reset" @tap.stop="resetHandle">重置</view>
            <view class="action confirm" @tap.stop="confirmHandle">确定</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="showDrawer" class="masks2" @touchmove.stop.prevent="moveHandle" @tap.stop="moveHandle">
      <view class="container animation-slide-right">
        <view :style="[{height: CustomBar + 'px'}]"></view>
        <view></view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      top: {
        type: [String, Number],
        default: 0,
      },
    },
    data() {
      return {
        CustomBar: this.CustomBar,
        selects: [
          {
            title: '综合推荐',
            type: 'multiple'
          },
          // {
          //   title: '信用优先',
          //   type: 'credit'
          // },
          {
            title: '新品优先',
            type: 'new'
          }
        ],
        curSelected: 0,
        curFilter: 0,
        filterType: 'multiple',
        order: 'asc', // 升序:asc 倒序:desc
        model: 'inline', // inline block
        filters: [{
            title: '特卖',
            type: '123',
            selected: false
          },
          {
            title: '品牌',
            type: '456',
            selected: false,
            children: [{
              title: '全部',
              type: '0'
            }, {
              title: 'AOC',
              type: '1'
            }, {
              title: '飞利浦',
              type: '2'
            }, {
              title: '戴尔',
              type: '3'
            }]
          },
          {
            title: '尺寸',
            type: '789',
            selected: false,
            children: [{
              title: '21.5英寸',
              type: '1'
            }, {
              title: '24英寸',
              type: '2'
            }, {
              title: '27英寸',
              type: '3'
            }, {
              title: '32英寸',
              type: '4'
            }]
          },
        ],
        curFilter2: 0,
        curScreen: [],
        curScreenList: [],
        windowWidth: 0,
        windowHeight: 0,
        posTop: 0, // 遮罩顶部距离
        showTopPop: false, // 显示一层筛选遮罩
        showBotPop: false, // 显示二层筛选遮罩
        showDrawer: false, // 侧边遮罩
      };
    },
    methods: {
      // 上层筛选条件
      async filterClick(type) {
        let oldType = this.curFilter;
        switch (type) {
          case 0:
            if (oldType == 0) {
              // let rect = await this.getDOMRect('#content1');
              // this.posTop = rect.bottom;
              // this.showTopPop = !this.showTopPop;
            } else {
              this.curFilter = 0;
            }
            this.order = 'asc';
            break;
          case 1:
            this.curFilter = 1;
            this.order = 'asc';
            break;
          case 2:
            if (oldType == 2) {
              if (this.order == 'asc') {
                this.order = 'desc';
              } else {
                this.order = 'asc';
              }
            } else {
              this.order = 'asc';
              this.curFilter = 2;
            }
            break;
          case 3:
            this.curFilter = 3;
            this.order = 'asc';
            break;
        }
        this.$emit('changeFilter', this.curFilter, this.order);
      },
      // 下层筛选条件
      async filter2Click(index) {
        if (this.filters[index].children && this.filters[index].children.length != 0) {
          this.curScreenList = this.filters[index].children;
          this.curFilter2 = index;
          let rect = await this.getDOMRect('#wrapper');
          this.posTop = rect.bottom;
          this.showBotPop = !this.showBotPop;
        } else {
          this.filters[index].selected = !this.filters[index].selected;
        }
      },
      // 下层单个筛选条件的多选
      filter2Choice(item, index) {
        this.$set(item, 'selected', !item.selected);
      },
      // 打开筛选侧边弹窗
      drawerhandle() {
        this.showDrawer = true;
      },
      // 获取当前组件位置
      getDOMRect(dom) {
        return new Promise((resolve) => {
          const query = uni.createSelectorQuery().in(this);
          query.select(dom).boundingClientRect(data => {
            resolve(data);
          }).exec();
        })
      },
      // 禁止触摸穿透
      moveHandle() {
        this.showTopPop = false;
        this.showBotPop = false;
        this.showDrawer = false;
        return false;
      },
      // 综合排序切换
      selectHandle(index) {
        this.curSelected = index;
        this.filterType = this.selects[index].type;
        this.showTopPop = false;
      },
      // 排列布局切换
      changeLayout() {
        if (this.model == 'inline') {
          this.model = 'block';
        } else {
          this.model = 'inline';
        }
        this.$emit('changeLayout',this.model);
      },
      resetHandle() {
        this.curScreenList.forEach(item => item.selected = false);
      },
      confirmHandle() {
        let selected = false;
        this.curScreenList.forEach(item => {
          if (item.selected) {
            selected = true;
          }
        });
        this.filters[this.curFilter2].selected = selected;
        this.showBotPop = false;
      },
    },
    created() {
      let info = uni.getSystemInfoSync();
      this.windowWidth = info.windowWidth;
      this.windowHeight = info.windowHeight;
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    position: sticky;
    z-index: 9999;

    .content1 {
      .right {
        width: 80rpx;
        position: relative;
        padding-left: 20rpx;
      }

      .right::after {
        content: "";
        width: 2rpx;
        height: 26rpx;
        background-color: #999999;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }

    .content2 {
      padding: 0 30rpx 20rpx 30rpx;

      .left {
        width: calc(100% - 100rpx);
        white-space: nowrap;

        .list-item {
          background-color: #F5F5F5;
          display: inline-block;
        }
      }

      .right {
        width: 100rpx;
      }
    }

    .masks {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: transparent;
      display: flex;
      flex-direction: column;

      .top {
        background-color: rgba(0, 0, 0, 0);
      }

      .bot {
        flex: 1;
        background-color: rgba(0, 0, 0, 0.7);

        .container {
          border-radius: 0 0 16rpx 16rpx;
          background-color: #F5F5F5;
          padding: 30rpx;

          .scroll-view {
            max-height: 300rpx;
          }
        }
      }
    }

    .active {
      color: #F02325 !important;
    }

    .active2 {
      box-shadow: inset 0 0 2rpx 2rpx #F02325;
      background-color: rgba(240, 35, 37, 0.1) !important;
      color: #F02325;
    }

    .active3 {}

    .masks2 {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: flex-end;

      .container {
        width: 70%;
        height: 100%;
        border-radius: 16rpx 0 0 16rpx;
        background-color: #FFFFFF;
      }
    }
  }

  .list-item+.list-item {
    margin-left: 20rpx;
  }

  .action-box {
    display: flex;
    margin-top: 30rpx;

    .action {
      flex: 1;
      height: 76rpx;
      line-height: 76rpx;
      border-radius: 76rpx;
      font-size: 28rpx;
      text-align: center;
    }

    .action+.action {
      margin-left: 26rpx;
    }

    .reset {
      color: #333333;
      background-color: #FFFFFF;
      border: 1rpx solid #999999;
    }

    .confirm {
      color: #FFFFFF;
      background: linear-gradient(271deg, #FF1450 0%, #F02325 100%);
    }
  }

  .block-28 {
    width: 28rpx;
    height: 28rpx;
  }
</style>
