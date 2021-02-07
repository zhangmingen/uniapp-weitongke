<template>
	<view class="page">
    <view class="cu-custom bg-white" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
      <view class="cu-bar bg-white fixed" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
        <view class="action" @click="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="action" style="color:#333">我的足迹</view>
        <view class="action" @click="showSelect">{{edit}}</view>
      </view>
    </view>
		<view class="content">
			<!-- <view class="edit" v-if="list.length>0" @click="showSelect()">
				<text class="select-tip" v-show="showDel==1">请选择要删除的商品</text> {{edit}}
			</view> -->
			<view class="item" :class="showDel==1 ? 'item-active' : '' "   v-for="(item,index) in list" :key="index">
				<view class="check" v-if="showDel==1" @click.stop="checkChange(item.isSelect,item.aid,index)">
         <text v-if="!item.isSelect" class="fu-iconfont">&#xe867;</text>
         <text v-if="item.isSelect"  class="fu-iconfont act">&#xe65b;</text>
				</view>
        <image class="goods-img" :src="item.collect_img" mode="" @click.stop="handleJump" :data-url="'/fu-templete/pages/shop-template/goods_detail?goods_id='+item.collect_id+'&sku_id='+item.sku_id"></image>
        <view class="article" @click.stop="handleJump" :data-url="'/fu-templete/pages/shop-template/goods_detail?goods_id='+item.collect_id+'&sku_id='+item.sku_id">
          <view>{{item.collect_title}}</view>
          <view>￥{{item.shop_price}}
          <text class="text-through text-price text-999 margin-left-sm">{{item.market_price}}</text>
          </view>
        </view>
			</view>
      <view class="btn-box cf" v-if="list.length>0" v-show="showDel==1">
				 <!-- <button type="mini-btn" plain="true" @click="cancle()">取消</button> -->
				 <button type="mini-btn" plain="true" @click="del()">删除</button>
			</view>
		</view>

    <view class="flex align-center justify-center flex-direction" style="width: 100%;height: 600rpx;" v-if="list.length==0">
    	<image :src="emptyImages.collection['image']" :style="{width: emptyImages.collection['width'], height: emptyImages.collection['height']}"></image>
    	<text class="text-gray margin-top">暂无数据</text>
    </view>
    <view class="flex align-center justify-center flex-direction" style="width: 100%;padding-bottom: 20upx;" v-if="isEnd">
    	<text class="text-gray margin-top">没有更多了</text>
    </view>
    <!-- <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"></fu-empty> -->
	</view>
</template>

<script>
  // import pagingList from '@/common/minix/paging_list.js'
	export default {
    // mixins: [pagingList],
		data() {
			return {
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        emptyImages: {
          collection: {  // 收藏
            image: '/static/empty/empty10.png',
            width: '326rpx',
            height: '333rpx'
          },
        },
				page:1,
				list:[],//我的足迹列表
				isEnd:false,
				loadingType:1,
				nd_text:'暂无数据',
				videoList:'',
				showDel:0,
				selectId:[],
        edit:'编辑',
        minixPagingListsApi: global.apiUrls.GetUserAddonsGetCollectionList,
        allowOnloadGetList: false,
        pageingListApiMethod:'get'
			};
		},
		methods: {
      back() {
        uni.navigateBack();
      },
      // pagingListPostData(){
      //   return {
      //     page:this.page,
      //     type:1
      //   }
      // },
			getData(){
				 this.$api.get(global.apiUrls.GetUserAddonsGetCollectionList,{
           page:this.page,
           type:3
          }).then(res=>{
					console.log(res)
          var res = res.data
					if(res.code==1){
            var data = res.data.data;
						uni.stopPullDownRefresh();
						if(data.length<8){
							this.isEnd = true;
							this.loadingType = 3;
							data.map(item=>{
								item.isSelect=false;
								this.list.push(item);
							})
						}else{
              this.isEnd = false;
							this.loadingType = 1;
							data.map(item=>{
								item.isSelect=false;
								this.list.push(item);
							})
						}
					}else{

					}
				})
			},
			showSelect(){
        this.showDel = this.showDel==1 ? 0 : 1
        this.edit = this.showDel==1 ? '取消' : '编辑'
			},
			checkChange(isSelect,id,index) {
				if(!isSelect){
				    this.selectId.push(id)
				}else{
					this.selectId.splice(index,1)
				}
				this.list[index].isSelect=!isSelect;
			},
			cancle(){
			 this.showDel=0;
			},
			del(){
        var that = this
				console.log(this.selectId)
				if(!this.selectId||this.selectId.length==0){
          this.$message.info('请选择要删除的商品')
					return;
				}
        this.$api.post(global.apiUrls.PostUserAddonsCancelCollection,{
          aid:this.selectId.join(","),
          type:3
        }).then(res=>{
          var res = res.data
        if(res.code==1){
          this.$message.info('删除成功')
          for(let i in this.list){
            for(let b in this.selectId){
              if(this.list[i].aid==this.selectId[b]){
                that.list.splice(i,1)
              }
            }
          }
          // this.showSelect()
          // this.getData();
        }else{
          this.$message.info(res.msg)
        }
       })
			},
		},
		onLoad() {
			this.getData();
      // this.pagingListGetLists()
		},
		onReachBottom() {
			if(!this.isEnd){
				this.page++;
				this.getData();
			}
		},
		// onPullDownRefresh() {
		// 	this.page = 1;
		// 	this.status = 'more';
		// 	this.getData();
		// },

	}
</script>

<style lang="scss" scoped>
  html,body{
    background-color: #fff;
  }
	.page{
		background: #FFFFFF;
	}
	.content{
    padding: 0 34upx;
		.notData{
			padding-top: 200upx;
		}
		.check{
			display: inline-block;
			width: 60upx;
			height: 220upx;
			padding-top: 80upx;
      text{
        display: inline-block;
        vertical-align: top;
        font-size: 40upx;
        margin-right: 10upx;
        color: #999;
        &.act{
          color: $fu-bg-color;
        }
      }
		}
		.check-img{
			display: inline-block;
			vertical-align: top;
			width: 40upx;
			height: 40upx;
			margin-right: 10upx;
		}
		.item{
			padding: 28upx 0;
			border-bottom: 1upx solid #efefef;
      background: #fff;
			image.goods-img{
				display: inline-block;
				vertical-align: top;
				width: 220upx;
				height: 220upx;
			}
      &:last-child{
        border-bottom:0;
      }
			.article{
				display: flex;
				display: inline-block;
				margin-left:28upx;
				width: 430upx;
				height: 220upx;
        position:relative;
				vertical-align: top;
				view:nth-child(1){
					font-size: 32upx;
					line-height: 45upx;
					height: 90upx;
					margin-bottom: 40upx;
					color: #333333;
					font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				view:nth-child(2){
					font-size: 30upx;
					color: #E2231A;
					font-weight: bold;
          position: absolute;
          bottom: 6upx;
          text{
            font-size: 22upx;
          }
				}
			}
		}
		.item-active{
			label{line-height:160upx ;
			padding-top: 30upx;}
			.article{
				width:370upx;
			}
		}
		.btn-box{
			position: fixed;
			bottom:0;
			background: #fff;
			width:100%;
			height: 100upx;
			padding:30upx 40upx 0;
			z-index:100;
			button{
				border:1px solid #999;
				color:#666;
				width:auto;
				padding:0 40upx;
				font-size: 28upx;
				border-radius: 40upx;
				float: right;
				margin-right: 20upx;
				height: auto;
				line-height: 1.9;
			}
		}
		.edit{
			text-align: right;
			padding:20upx 20upx;
			font-size: 28upx;
			.select-tip{
				float: left;

			}
			}
	}
</style>
