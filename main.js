import Vue from 'vue';
import App from './App';

/*===============================================================
=                           WeChat  pay                 =
===============================================================*/

import "./js_sdk/ican-H5Api/ican-H5Api.js";

/*===============================================================
=                           global user info                    =
===============================================================*/
global.token = '';
global.userInfo = null; // 用户信息
global.loginInfo = null; //注册信息
global.inviteCode = false; //是否有邀请码

// 获取账户信息
try {
	const USER_TOKEN = uni.getStorageSync('USER_TOKEN');
	const USER_INFO = uni.getStorageSync('USER_INFO');
	global.token = USER_TOKEN || '';
	if (USER_INFO) global.userInfo = USER_INFO;
	global.userInfo = USER_INFO;
} catch (e) {}

/*======================================================================
=                    global attributes and methods                     =
======================================================================*/

import apiUrls from '@/common/api/url.js'
import {
	http
} from '@/common/api/index.js';
import {
	message,
	Router,
	Dayjs
} from '@/common/utils/index.js';
import {
	IMG_BASE_URL,
	SYSTEM_CONFIG,
	PAGE_SIZE,
	VERSION_CODE,
	IS_DEV
} from '@/common/config.js';
import utils from '@/common/utils/utils';

const router = new Router({
	needLoginPages: [
		'/pages/home/pay',
		'/pages/home/home',
		'/pages/home/invite',
		'/pages/openclass/masterList',
		'/pages/openclass/openClass',
		'/pages/class/signUp',
		'/pages/class/recordedDetail',
		'/pages/class/liveDetail',
		'/pages/class/search',
		'/pages/class/class',
		'/pages/member/homeeditData',
	],



});

Vue.config.productionTip = false;
Vue.prototype.$urouter = router;
Vue.prototype.$api = http;
Vue.prototype.$message = message;
Vue.prototype.$util = utils;
// 异步回调后执行onLoad
Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})


global.apiUrls = apiUrls;
global.imgBaseUrl = IMG_BASE_URL;
global.IS_DEV = IS_DEV;
global.PAGE_SIZE = PAGE_SIZE;
global.VERSION_CODE = VERSION_CODE;
global.SYSTEM_CONFIG = SYSTEM_CONFIG;


/*=================================================================
=                          global components                      =
=================================================================*/
import classModal from './components/modal/modal.vue'
Vue.component('class-modal', classModal)
import uImage from './components/u-image/u-image.vue'
Vue.component('u-image', uImage)

/*=================================================================
=                          global filters                         =
=================================================================*/


// 识别图片路径是否为全路径 若不是则进行拼接
Vue.filter('assembleImgSrc', src => {
	src = src || ''
	return src.indexOf('http://') != -1 || src.indexOf('https://') != -1 ?
		src :
		IMG_BASE_URL + src;
});

// 日期格式转换
Vue.filter('formatDate', (date, format = 'YYYY-MM-DD') => {
	return Dayjs(date).format(format);
});

// 取整
Vue.filter('integerFilter', (price) => {
	if (price) {
		return Math.floor(price);
	} else {
		return 0;
	}
})

/*==================================================================
=                           global mixins                          =
==================================================================*/

Vue.mixin({
	data() {
		return {

		}
	},
	methods: {
		// 页面跳转
		handleJump(e) {
			let target = e.currentTarget || e.target,
				url = target.dataset.url,
				type = target.dataset.type;
			if (url == '' || url == '#') return;
			switch (type) {
				case 'SWITCH':
					router.switchTab(url);
					break;
				case 'REDIRECT':
					router.redirectTo(url);
					break;
				case 'RELAUNCH':
					router.reLaunch(url);
					break;
				case 'BACK':
					router.navigateBack();
					break;
				default:
					router.navigateTo(url);
					break;
			}
		},
		// 判断是否登录
		judgeLogin() {
			if (!global.userInfo) return uni.navigateTo({
				url: "/pages/member/login"
			})
		},
		// jumpLogin
		jumpLogin() {
			const local = 'https://app.vtongke.com/h5/pages/member/login'; // 对当前地址用encodeURIComponent进行编码
			window.location.href =
				'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4a93109fb28061a&redirect_uri=' + encodeURIComponent(
					local, "UTF-8") + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
		}
	}
})

/*==================  End of global mixins  =====================*/



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
