<template>
	<view class="page">
		<!-- 头部 -->
		<view class="header" :style="[{height:'44px'}]">
			<text class="iconfont icon-fanhui" @click="BackPage()"></text>
			<view class="search">
				<icon type="search" size="16"></icon>
				<input type="text" @input="inputTyping" placeholder="搜索城市名或拼音" placeholder-style="color:#BFBFBF;" />
			</view>
			<text class="search-btn">搜索</text>
		</view>
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" >
			<view id="top"></view>
			<view class="tui-list search-result">
				<view class="tui-list-cell" hover-class="tui-list-cell-hover" v-for="(item,index) in searchResult" :key="index"
				 @tap="selectCity" :data-name="item.region_name" :hover-stay-time='150'  :data-id="item.region_id">
					<view class="tui-list-cell-navigate">
						{{item.region_name}}
					</view>
				</view>
			</view>
			<view v-if="!inputVal">
				<view class="current-city">
					<text class="city-name">当前城市：{{localCity}}</text>
					<picker @change="bindPickerChange" range-key="text" :range="array">
						<view class="uni-input">{{areaDis?areaDis:"选择县区"}}<text class="iconfont icon-unfold"></text></view>
					</picker>
				</view>
				<view class="hot-city" v-if="search_City.length > 0">
					<view class="title">最近访问</view>
					<view class="city-names">
						<view class="city-name-item" v-for="(item,index) in search_City"  :key="index" :hover-stay-time="150"
						 @tap="selectCity" :data-name="item" :data-id="search_CityId[index]">
							{{item}}
							<text @click.stop="del" :data-index="index" class="iconfont icon-guanbi1"></text>
						</view>
					</view>
				</view>
				<view class="hot-city">
					<view class="title">热门访问</view>
					<view class="city-names">
						<view class="city-name-item" v-for="(item,index) in hotCity" :key="index" :hover-stay-time="150"
						 @tap="selectCity" :data-name="item.region_name" :data-id="item.region_id">
							{{item.region_name}}
						</view>
					</view>
				</view>
				<view class="tui-list city-list">
					<block v-for="(list,index) in lists" :key="index" v-if="list.data[0]">
						<view class="tui-list-cell-divider" :id="index === 0 ? 'suoyin' : list.letter">
							{{list.letter}}
						</view>
						<view class="tui-list-cell" hover-class="tui-list-cell-hover" v-for="(item,index2) in list.data" :key="index2"
						 @tap="selectCity" :data-name="item.region_name" :hover-stay-time='150'  :data-id="item.region_id">
							<view :id="item.region_name" class="tui-list-cell-navigate" :class="[list.data.length-1==index?'last':'']">
								{{item.region_name}}
							</view>
						</view>
					</block>
				</view>
			</view>
		</scroll-view>
		<view class="tui-indexed-list-bar" @touchstart="touchStart" @touchmove.stop="touchMove"
		 @touchend.stop="touchEnd" @touchcancel.stop="touchCancel" v-if="!inputVal">
			<text v-for="(items,index) in lists" :key="index" class="tui-indexed-list-text" :style="{height:indexBarItemHeight+'px'}">
				{{index == 0?'热':items.letter}}
			</text>
		</view>
		<view class="tui-indexed-list-alert" v-if="touchmove && lists[touchmoveIndex].letter">
			{{lists[touchmoveIndex].letter}}
		</view>
	</view>
</template>
<script>
	// import wPicker from '@/components/w-picker.vue';
	// import cityData from '@/utils/common/city-data/city.js';
	export default {
		// components: {
		// 	wPicker,
		// },
		data() {
			return {
				lists: [{"letter":"A","data":[]},{"letter":"A","data":[{"region_id":36,"region_name":"安庆","initials":"安庆ANQING"}]},{"letter":"B","data":[{"region_id":37,"region_name":"蚌埠","initials":"蚌埠BANGBU"}]}],
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // 索引二字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
				inputShowed: false, // 输入框是否显示
				inputVal: '', // 搜索框输入的内容
				hotCity: [{region_name:'上海',region_id:"1"},{region_name:'北京',region_id:"1"},{region_name:'深圳',region_id:"1"}], // 热门城市
				searchResult: [], // 搜索城市的结果,
				search_City:[],
				search_CityId:[],
				localCity: '',
				checkArr: [], // 当前选中的地址数组
				checkValue: ['0', '0', '0'] ,// 当前选中的城市码,
				address: '',
				region_id: '',
				array:[{"value":1299,"parent_id":152,"text":"汤阴县","region_type":3,"agency_id":0},{"value":1300,"parent_id":152,"text":"滑县","region_type":3,"agency_id":0},{"region_id":1301,"value":152,"text":"内黄县","region_type":3,"agency_id":0}],
				areaDis:'',
				areaId:'',
        cityData:[
            [{
              "text": "北京",
              "value": 1
            }],
            [{
              "text": "上海",
              "value": 2
            }],
            [{
              "text": "广州",
              "value": 3
            }],
            [{
              "text": "深圳",
              "value": 4
            }],
           ]
			}
		},
		onShow() {
			let search_City = uni.getStorageSync('search_City');
			let search_CityId = uni.getStorageSync('search_CityId');
			if(search_City){
				this.search_City = search_City
				this.search_CityId = search_CityId
				console.log(this.search_City)
			}
		},
		onLoad: function(options) {
			let _this = this;
			try {
			    const city_data = uni.getStorageSync('city_data');
			    if (city_data && city_data.city && city_data.cityId && city_data.disDes) {
					_this.localCity = city_data.city;
					_this.region_id = city_data.cityId;
					_this.areaId = city_data.disId;
					_this.areaDis = city_data.disDes;
					if(city_data.search_CityId){
						_this.search_CityId = city_data.search_CityId.split(",");
						_this.search_City = city_data.search_City.split(",");
					}else{
						_this.search_CityId = [];
						_this.search_City = [];
					}
					// _this.get_area();
			    }else{
					_this.getShopLocation();
				}
			} catch (e) {
			    // error
			}
			// this.get_list();
			const that = this;
			setTimeout(() => {
				uni.getSystemInfo({
					success: function(res) {
						let winHeight = res.windowHeight
						let barHeight = winHeight - uni.upx2px(204);
						that.winHeight = winHeight;
						that.indexBarHeight = barHeight;
						that.indexBarItemHeight = barHeight / 25;
						that.titleHeight = uni.upx2px(132);
					}
				})
			}, 50)
		},
		methods: {
			// 获取定位
			getShopLocation(){
				let _this = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function (res) {
						if (res.address) {
							_this.localCity = res.address.city.replace('市', '');;
							_this.areaDis = res.address.district;
							for(let i = 0; i < _this.cityData.length; i++){
								let item = _this.cityData[i];
								for(let j = 0; j < item.length; j++){
									if(item[j].text == _this.localCity){
										_this.region_id = item[j].value;
										break;
									}
								}
							}
						}
					},
				});
			},
			bindPickerChange(e) {
				let i = e.detail.value;
				this.areaDis = this.array[i].text;
				this.areaId = this.array[i].value;
				let arr = {};
				arr.city = this.localCity;
				arr.cityId = this.region_id;
				arr.disId = this.areaId;
				arr.disDes = this.areaDis;
				try {
					uni.setStorageSync('city_data', arr);
				} catch (e) {
					// error
				}
				uni.$emit("changeLocation",{
					disDes:this.areaDis
				});
			},
      // 县
			// get_area(){
			// 	console.log(this.region_id)
			// 	this.$request(this.$api.city.getRegionList,{
			// 		region_id: this.region_id
			// 	}).then(res => {
			// 		if(res.code == 1){
			// 			this.array = [];
			// 			console.log(res)
			// 			for(var i = 0; i < res.data.length; i++){
			// 				let item = {}
			// 				item["text"] = res.data[i].region_name;
			// 				item["value"] = res.data[i].region_id;
			// 				this.array.push(item)
			// 			}
			// 		}
			// 	}).catch(err => {
			// 		console.log(err)
			// 	})
			// },
			showInput() {
				this.inputShowed = true
			},
			inputTyping(e) {
				this.inputVal = e.detail.value;
				this.searchCity()
			},
			// 搜索城市
			searchCity() {
				if(this.inputVal != ''){
					let result = [];

					this.lists.forEach((item1, index1) => {
						item1.data.forEach((item2, index2) => {
							if (item2.initials.indexOf(this.inputVal.toLocaleUpperCase()) != -1) {
								console.log(item2.region_name)
								let arr = {};
								arr.region_name = item2.region_name;
								arr.region_id = item2.region_id;
								result.push(arr)
							}
						})
					})
					this.searchResult = result;
				}else{
					this.searchResult = []
				}

			},
			// 选择城市
			selectCity(e) {
				let region_name = e.currentTarget.dataset.name;
				this.region_id = e.currentTarget.dataset.id;
				if(this.search_City.indexOf(region_name) == -1){
					if(this.search_City.length == 5){
						this.search_City.splice(4,1)
						this.search_CityId.splice(4,1)
					}
					this.search_City.unshift(region_name)
					this.search_CityId.unshift(this.region_id)
				}else{
					this.search_City.splice(this.search_City.indexOf(region_name),1)
					this.search_City.unshift(region_name)
					this.search_CityId.splice(this.search_City.indexOf(region_name),1)
					this.search_CityId.unshift(this.region_id)
				}
				uni.setStorageSync('search_City',this.search_City)
				uni.setStorageSync('search_CityId',this.search_CityId)
				this.localCity = region_name;
				this.searchResult = [];
				this.inputVal = '';
				this.areaDis = "";
				this.areaId = "";
				this.scrollViewId = "top";
			},
			del(e){
				this.search_City.splice(e.currentTarget.dataset.index,1);
				this.search_CityId.splice(e.currentTarget.dataset.index,1);
				uni.setStorageSync('search_City',this.search_City)
				uni.setStorageSync('search_CityId',this.search_CityId)
				try {
					const city_data = uni.getStorageSync('city_data');
					city_data.search_City = this.search_City.join(',')
					city_data.search_CityId = this.search_CityId.join(',')
				    uni.setStorageSync('city_data', city_data);
				} catch (e) {
				    // error
				}
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight - 1)
				let item = this.lists[index === 0 ? 1 : index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight - 1)
				let item = this.lists[index === 0 ? 1 : index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss">
	.page {
		height: 100vh;
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
	}
	.uni-input{color: #666666;font-size: 15px;padding-right: 20px;}
	// 头部
	.header{box-sizing: border-box;width: 100%;display: flex;align-items: center;background:#fff;padding: 0 32rpx;border-bottom: 1px solid #E6E6E6;
		position: fixed;top: 0;left: 0;z-index: 5;
		.search{flex: 1; display: flex;align-items: center; height: 58rpx;background-color: #F9F9F9;border-radius: 29rpx;margin: 0 24rpx;padding: 0 24rpx;
			icon{font-size: 10rpx;margin-right: 12rpx;}
			input{flex: 1;font-size: 28rpx;color: #333;}
		}
		.search-btn{font-size: 28rpx;color: #999999;}
	}
	.scrollList {
		position: relative;
		flex: 1;

	}

	.tui-list-cell {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0;
	}

	.tui-list-cell::after{
		border: 0;
	}

	.tui-list-cell-hover {
		background-color: #eee !important;
	}

	.tui-list-cell-navigate {
		position: relative;
		line-height: 76upx;
		width: calc(100% - 68upx);
		margin: 0 34upx;
		font-size: 28upx;
		color: #333;
		border-bottom: 2upx solid #eee;
	}

	.current-city {
		height: 80upx;
		margin: 0 30upx;
		border-bottom: 2upx solid #eee;
		display: flex;
		align-items: center;
		color: #999;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.city-name {
		display: inline-block;
		font-size: 30upx;
		line-height: 30upx;
		color: #333;
	}
	.hot-city{
		margin: 0 30upx;
		border-bottom: 2upx solid #eee;
		padding-bottom: 10upx;
	}
	.hot-city .title {
		height: 80upx !important;
		font-size: 28upx !important;
		line-height: 80upx !important;
		color: #999;
	}

	.city-names {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-content: space-between;
		margin-right: 30upx;
	}

	.city-name-item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: auto;
		height: 60upx;
		margin-bottom: 16upx;
		margin-right: 30upx;
		padding: 0 40upx;
		border-radius: 10upx;
		font-size: 26upx;
		color: #333;
		background: #F9F9F9;
		position: relative;
	}

	.city-name-item text{
		position: absolute;
		top: -6upx;
		right: -12upx;
		color: #666;
	}

	.tui-list {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell-divider {
		height: 76upx;
		padding-left: 34upx;
		font-size: 24upx;
		color: #999;
		display: flex;
		align-items: center;
	}

	.tui-indexed-list-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 9999;
		position: absolute;
		right: 0;
		padding-right: 10upx;
		width: 44upx;
	}

	.tui-indexed-list-text {
		font-size: 26upx;
		white-space: nowrap;
	}

	.tui-indexed-list-bar.active {
		background-color: rgb(200, 200, 200);
	}

	.tui-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160upx;
		height: 160upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		line-height: 160upx;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
