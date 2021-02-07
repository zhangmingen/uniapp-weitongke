<template>
	<view class="content">
		<view class="list">
			<text @click="showPopup1">选择日期插件一:{{date}}</text>
		</view>
		<view class="list">
			<bentime-picker :placeholder="startDate" fields="day" @change="changeDatetimePicker"></bentime-picker>
		</view>
		<view class="list">
			<text >选择日期插件三:{{date2}}</text>
		</view>
		<ben-calendar @selected-change="datechange"></ben-calendar>
		<view class="tanchukuang" :class="{'act':popupShow1}" @close="hidePopup">
			<view class="titleTime">
				<text>选择游玩日期</text>
				<text class="right" @click="hidePopup">x</text>
			</view>
			<benyou-calendar :isFixed="false" @callback="getTime" />
		</view>
	</view>
</template>

<script>
	import benyouCalendar from '@/components/fu-date1/fu-date1.vue'
	import bentimePicker from '@/components/fu-date2/fu-date2.vue';
	import benCalendar from '@/components/fu-date3/fu-date3.vue';
	export default {
		data() {
			return {
				popupShow1: false,
				date:'',
				startDate:'选择日期插件二',
				date2:''
			}
		},
		components: {
			benyouCalendar,
			bentimePicker,
			benCalendar
		},
		onLoad() {

		},
		methods: {
			hidePopup: function() {
				this.popupShow1 = false;
			},
			showPopup1: function(e) {
				this.popupShow1 = true;
			},
			getTime(data) {
				this.date = data.startStr.dateStr
				this.popupShow1 = false;
			},
			changeDatetimePicker(date) {
				this.startDate = date
			},
			 datechange(e) {
				console.log(e);
				this.date2 = e.fullDate
			}
		}
	}
</script>

<style lang="scss">
  page {
    background-color: #fff;
  .content{
  	.list{
  		height: 45px;
  		line-height: 45px;
  		padding: 0 10px;
  		border-bottom: 1px solid #eeeeee;
  		text-align: center;
  	}
  }
  .titleTime {
  	line-height: 50px;
  	text-align: center;
  	padding: 0 10px;
  	text {
  		font-weight: bold;
  	}
  	.right {
  		float: right;
  	}
  }
  .tanchukuang {
  	position: fixed;
  	top: 0px;
  	left: 0;
  	width: 100%;
  	height: 100%;
  	z-index: 99999;
  	background-color: #FFFFFF;
  	transform: translate3d(0, 100%, 0);
  	transition: all 0.3s ease-in-out;
  	&.act {
  		transform: translate3d(0, 0, 0);
  	}
  }
    
  }

</style>
