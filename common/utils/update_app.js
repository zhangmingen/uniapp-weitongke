import { API_BASE_URL } from '../config.js'

export default function () {
  plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
    uni.request({
      url: `${API_BASE_URL}/api/index/getVersion`,
      data: {
        version_name: widgetInfo.version
      },
      success: (result) => {
        console.log(widgetInfo.version)
        console.log(`${API_BASE_URL}/api/index/getVersion`)
        console.log(result.data)
        const data = result.data
        if (data.code === 1) {
          if (data.data.is_new === 1) {
            let wgtUrl = data.data.version_url
            let ignoreVersons = uni.getStorageSync('IGNORE_VERSION');
            ignoreVersons = ignoreVersons ? ignoreVersons : ['0.0.0'];
            if (ignoreVersons.findIndex(item => item == data.data.version) != -1) {
              return false;
            }
            uni.showModal({
              confirmText: '立即更新',
              cancelText: '忽略版本',
              title: '版本更新',
              content: `检测到有新版本${data.data.version},是否更新？`,
              success: function (res) {
                if (res.confirm) {
                  console.log('执行到这里')
                  uni.showLoading({
                    title: '更新中'
                  })
                  uni.downloadFile({
                    url: wgtUrl,
                    success: (downloadResult) => {
                      if (downloadResult.statusCode === 200) {
                        uni.hideLoading()
                        plus.runtime.install(downloadResult.tempFilePath, {
                          force: false
                        }, function () {
                          uni.hideLoading()
                          plus.runtime.restart();
                        }, function (e) {
                          if (plus.os.name == 'Android') {
                            uni.hideLoading()
                            uni.downloadFile({
                              url: API_BASE_URL + '/down/shipper.apk',
                              success: (downloadResult) => {
                                if (downloadResult.statusCode === 200) {
                                  plus.runtime.install(downloadResult.tempFilePath);
                                  uni.hideLoading()
                                }
                              }
                            });
                          } else if (plus.os.name == 'ios') {
                            uni.hideLoading()
                            //window.location.href="https://itunes.apple.com/us/app/%E6%8E%8C%E4%B8%8A%E8%80%83%E5%8B%A4-%E8%80%83%E5%8B%A4-%E6%89%93%E5%8D%A1-%E7%BB%A9%E6%95%88%E7%AE%A1%E7%90%86/id1443705062?l=zh&ls=1&mt=8";
                          }
                        });
                      } else if (downloadResult.statusCode === 400) {
                        uni.hideLoading()
                        if (plus.os.name == 'Android') {
                          uni.hideLoading()
                          uni.downloadFile({
                            url: API_BASE_URL + '/down/shipper.apk',
                            success: (downloadResult) => {
                              if (downloadResult.statusCode === 200) {
                                plus.runtime.install(downloadResult.tempFilePath);
                                uni.hideLoading()
                              }
                            }
                          });
                        } else if (plus.os.name == 'ios') {
                          uni.hideLoading()
                          //window.location.href="https://itunes.apple.com/us/app/%E6%8E%8C%E4%B8%8A%E8%80%83%E5%8B%A4-%E8%80%83%E5%8B%A4-%E6%89%93%E5%8D%A1-%E7%BB%A9%E6%95%88%E7%AE%A1%E7%90%86/id1443705062?l=zh&ls=1&mt=8";
                        }
                      }
                    }
                  });
                }
              },
              fail: function () {
                uni.hideLoading()
                ignoreVersons.push(data.data.version)
                uni.setStorageSync('IGNORE_VERSION', ignoreVersons)
              }
            });
          } else {
            console.log('暂无更新~')
          }
        }
      }
    });
  });
}
