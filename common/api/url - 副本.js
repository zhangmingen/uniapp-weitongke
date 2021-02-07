hexport default {

  /*========================================
  =            public interface            =
  ========================================*/

  // type 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手机号5绑定手机号
  aliSend: '/v1/5b5bdc44796e8',                                         // 发送验证码

  loginByMobile: '/v1/5eeb3eb8907b8',                                   // 注册
  registerByMobile:'/v1/5cad9f63e4f94',                                  //注册
  loginBycont:'/v1/5c78dbfd977cf',//登录
  perfectData: '/v1/5f03dc8eab3d8',                                     // 完善资料
  forgetPassword: '/v1/5caeeba9866aa',                                  // 忘记密码
  loginByAccount: '/v1/5c78dbfd977cf',                                  // 账号密码登录
  loginByWechat: '/v1/5d7757d28d076',                                   // 微信登录绑定手机号
  postAliYunGetStsvoucher: '/v1/5f0594f25b428',                         // 阿里云oss图片直传签名
  postQINIUToken: '/v1/5f0d5773a93d0',                                   // 七牛云视频直传上传签名
  loginCode:'/v1/5f43c94178732',                                          //一键登录
  user_mobile_login:'/v1/5c78dca45ebc1',                                      //手机号加验证码登录注册
  /*====================================
  =            work control            =
  ====================================*/

  getWorkType: '/v1/5f06e5d4a6f18',                                     // 作品类型
  postWorkAddWork: '/v1/5ef01a165d430',                                 // 发布图文
  getWorkWorkList: '/v1/5ef023c308ca0',                                 // 作品列表
  postWorkConcern: '/v1/5ef05070e6780',                                 // 关注用户
  postWorkLike: '/v1/5ef0548068bc8',                                    // 作品/视频点赞
  getWorkWorkDetail: '/v1/5ef05eef032c8',                               // 作品详情
  postWorkAddRemark: '/v1/5ef0714eb3b00',                               // 作品/视频添加评论
  getWorkRemark: '/v1/5ef07cf0b5a40',                                   // 评论列表
  postWorkRemarkLike: '/v1/5ef083ad27100',                              // 作品/视频评论点赞
  postWorkCollect: '/v1/5ef08952a2990',                                 // 作品/视频收藏
  postWorkComplain: '/v1/5ef16888c3ff0',                                // 发布投诉
  postWorkSend: '/v1/5ef87b9843df0',                                    // 送花朵数
  postWorkDashang: '/v1/5ef9a2c1a9ad8',                                 // 作品打赏/视频打赏
  getWorkPlate: '/v1/5f0308be35b60',                                    // 送花/打赏模板
  getWorkWorkType: '/v1/5f0440f19a650',                                 // 作品/视频分类
  getWorkMyConcern: '/v1/5f0d6f74afd48',                                // 首页-关注

  /*=========================================
  =            operation control            =
  =========================================*/


  postOperationGetColumn: '/v1/5d63befcb25d9',                          // 获取指定的文章单页信息
  postOperationgetArticleColumn: '/v1/5f4a1ca007cd7',                   // 获取指定的文章分类
  postOperationGetColumnArticleList: '/v1/5d648c8d37977',               // 获取指定的文章列表
  postOperationGetArticleDetail: '/v1/5d64a46459991',                   // 获取指定的文章详情
  postOperationArticleCommentAdd: '/v1/5f4a1ff7b138e',                  // 添加文章评论
  postOperationGetArticleComment: '/v1/5f4a20fd89aa6',                  // 获取文章评论
  postOperationGetArticleLikeDo: '/v1/5f4a19845938a',                   // 文章点赞、取消点赞


  /*=====================================
  =            index control            =
  =====================================*/

  getIndexImages: '/v1/5efee403df4a8',                                  // 获取首页轮播图
  getAds: '/v1/5c94aa1a043e7',                                          // 获取指定广告位的广告列表
  getAdsClick: '/v1/5f438bc1d9673',                                          // 获取指定广告位的广告列表

  /*=====================================
  =            video control            =
  =====================================*/

  postVideoGetVideoSign: '/v1/5ef1c6702b2a0',                           // 上传视频签名
  postVideoAddVideo: '/v1/5ef1da16429a0',                               // 发布视频内容
  getVideoVideoList: '/v1/5ef2f1dee4778',                               // 视频列表
  getVideoVideoDetail: '/v1/5ef300e979c70',                             // 视频详情
  postVideoShare: '/v1/5ef303689ee30',                                  // 转发成功接口
  postVideoVideo: '/v1/5ef322ef33f40',                                  // 视频上传成功回调




  feedbackType: '/api/index/feedback_type',                             // 获取意见反馈类型
  feedbackSubmit: '/api/index/addUserFeedback',                         // 提交意见反馈
  publicUpdateAPP: '/api/index/getVersion',                             // 静默更新
  publicGetAgreement: '/api/index/getAgreement',                        // 注册协议

  /*=====================================
  =               user                  =
  =====================================*/

 feedbackTypes: '/v1/5d63ba953ee01',                             // 获取意见类型
 feedbackAdd:'/v1/5cc3f28296cf0',                                //提交意见反馈


  /*=====================================
  =            wallet module            =
  =====================================*/
  get_my_money: '/v1/5cc45274d6be9',                                    // 获取金额信息
  bind_withdraw_account: '/v1/5d7b7d4007529',                           // 绑定提现账号
  get_withdraw_account: '/v1/5d7b9bd1c7d7c',                            // 获取绑定的提现账号
  withdraw: '/v1/5ce25d5e1ffb8',                                        // 提现申请
  get_money_detail: '/v1/5cc45422e5c87',                                // 金额流水明细

 /*=====  End of wallet module ======*/






}
