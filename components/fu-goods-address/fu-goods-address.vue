<template>
  <fu-popup v-model="show" mode="bottom" :safe-area-inset-bottom="true" :border-radius="24">
    <view class="padding" @touchmove="">
      <view class="flex justify-between padding-bottom">
        <view class="flex-sub text-center">配送至</view>
        <view class="close-box" @tap="close">
          <text class="cuIcon-close"></text>
        </view>
      </view>
      <scroll-view class="container" scroll-y>
        <block v-for="(item,index) in addrs" :key="item.address_id">
          <view class="flex align-center padding-sm" :class="{'text-bold': curTab == item.address_id}" @tap="selectAddress(index)">
            <view class="margin-right-sm text-999" :class="{'fu-cred': curTab == item.address_id}">
              <text class="cuIcon-locationfill"></text>
            </view>
            <view class="text-df">{{item.province}}{{item.city}}{{item.district}}{{item.address}}</view>
          </view>
        </block>
      </scroll-view>
    </view>
  </fu-popup>
</template>

<script>
	export default {
    props: {
      addrs: {
        type: Array,
        default(){
          return []
        }
      },
    },
		data() {
			return {
        show: false,
        curTab: 0,
			};
		},
    watch: {
      addrs(val){
        console.log('val',val)
        if(val.length != 0){
          let cur = val.find(item => item.is_default == 1);
          this.curTab = cur.address_id;
          this.$emit('change',cur);
        }
      },
    },
    methods: {
      open(){
        this.show = true;
      },
      close(){
        this.show = false;
      },
      selectAddress(index){
        this.curTab = this.addrs[index].address_id;
        this.$emit('change',this.addrs[index]);
        this.close();
      },
      chooseOther(){
        this.close();
      }
    },
	}
</script>

<style lang="scss" scoped>
  .container{
    height: 600rpx;
  }

</style>
