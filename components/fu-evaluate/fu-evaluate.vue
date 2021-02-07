<template>
    <view class="evaluate-box solid-bottom">
        <view class="padding-tb-sm flex justify-between align-center">
            <view class="flex">
                <view class="block-80">
                    <image class="" :src="prop.head_img" mode="aspectFill" lazy-load></image>
                </view>
                <view class="margin-left-sm flex flex-direction justify-between">
                    <view class="text-df text-333">{{prop.user_nickname}}</view>
                    <view class="text-sm text-999">{{prop.create_time}}</view>
                </view>
            </view>
            <view>
                <block v-for="(item,index) in 5" :key="index">
                    <image class="block-24" :src="prop.star <=5 ?'/static/shop/stard2.png':'/static/shop/star2.png'" mode="aspectFill"></image>
                </block>
            </view>
        </view>
        <view class="padding-bottom padding-top-sm text-df text-333">{{prop.content}}</view>
        <view class="padding-tb-xs" v-if="prop.thumb.length != 0">
            <scroll-view class="wrap" scroll-x>
                <view class="list">
                    <block v-for="(ele,index) in prop.thumb" :key="index">
                        <view class="block-180" @tap="preview(ele)">
                            <image class="radius" :src="ele" lazy-load mode="aspectFill"></image>
                        </view>
                    </block>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        props: ['prop'],
        methods: {
            preview(item){
                uni.previewImage({
                	current: index,
                	urls: this.prop.thumb,
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap{
        width: 100%;
        .list{
            display: flex;
            align-items: flex-start;
            .block-180+.block-180{
                margin-left: 20rpx;
            }
        }
    }

    .block-80{
        width: 80rpx;
        height: 80rpx;
        min-width: 80rpx;
        min-height: 80rpx;
        background-color: #EEEEEE;
        border-radius: 50%;
        image{
            width: 100%;
            height: 100%;
        }
    }
    .block-24{
        width: 24rpx;
        height: 24rpx;
        min-width: 24rpx;
        min-height: 24rpx;
    }
    .block-180{
        width: 180rpx;
        height: 180rpx;
        min-width: 180rpx;
        min-height: 180rpx;
        image{
            width: 100%;
            height: 100%;
        }
    }
</style>
