<template>
	<view class="page">
        <cu-custom bgColor="bg-white" :isBack="true">
			<view slot="content">优惠券</view>
		</cu-custom>

		<view class="navbar solid-top">
			<block v-for="(item, index) in navList" :key="index">
				<view class="nav-item" :class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
					{{item.text}}
				</view>
			</block>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(item,index) in navList" :key="index">
				<coupon-list :i="index" :index="tabCurrentIndex" :type="item.type"></coupon-list>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import couponList from './coupon_list.vue';
	export default {
		components: {
			couponList
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [
					{
						state: 0,
						text: this.$t('coupon')[1],
						type: 1,
					},
					{
						state: 1,
						text: this.$t('coupon')[2],
						type: 2,
					},
					{
						state: 2,
						text: this.$t('coupon')[3],
						type: 3,
					},
				],
			};
		},
		computed: {
			i18n () {  
                return this.$t('coupon')
            }
		},
		onLoad(options){
			const { type } = options;
			const _item = this.navList.find((item) => {
				return item.type == type
			})
			this.tabCurrentIndex = _item.state;
			uni.setNavigationBarTitle({
				title:this.$t('coupon')[0]
			})
		},
		methods: {
			// swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
			},
			// 顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
            },
            openPopup(type){
				this.$refs[type].show();
			},
			InputFocus(){},
			InputBlur(){},
		},
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100%;
		min-height: 100%;
	}

    .navbar{
    	display: flex;
    	height: 40px;
    	padding: 0 5px;
    	background: #FFFFFF;
    	box-shadow: 0 1px 5px rgba(0,0,0,.06);
    	.nav-item{
    		flex: 1;
    		display: flex;
    		justify-content: center;
    		align-items: center;
    		height: 100%;
    		font-size: 15px;
    		color: #999999;
    		position: relative;
    		&.current{
                color: #333333;
                font-weight: bold;
    			&:after{
    				content: '';
    				position: absolute;
    				left: 50%;
    				bottom: 0;
    				transform: translateX(-50%);
    				width: 30px;
    				height: 0;
    				border-bottom: 2px solid $theme;
    			}
    		}
    	}
    }

	.swiper-box{
        height: calc(100% - 40px);
        padding-top: 26rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.uni-swiper-item{
		height: 100%;
	}
</style>
