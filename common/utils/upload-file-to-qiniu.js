import { message } from './message.js'
import { http } from '@/common/api/index.js';

export default class UploadFileToQINIU {
  /**
   * [constructor description]
   * @param  {[Array]} files [chooseImg选中的tempFilePaths、chooseVideo选中的rempFilePath]
   * @param  {[Object]} json  [success每上传成功一张调用 complete全部上传完成调用]
   * @return {[void]}       [description]
   */

  constructor(files, json) {
    if (!Array.isArray(files)) {
      throw new Error('Class UploadFileToQINIU parameter must be an array');
    }
    this.data = [];
    this.fn = json.success;
    this.complete = json.complete;
    this.files = files;
    this.fileLen = this.files.length;
    this.curIndex = 0;
    uni.showLoading({
      title: '上传中'
    });
    this.upload();
  }

  upload() {
    http.post(global.apiUrls.postQINIUToken).then(res => {
      console.log(res)
      if (res.data.code == 1) {
        let ossData = res.data.data;
        uni.uploadFile({
          url: 'https://up-z2.qiniup.com',            // 七牛云资源存储地区 默认华南地区
          filePath: this.files[this.curIndex],
          name: 'file',
          formData: {
            key: ossData.fileName,                    // 文件名
            token: ossData.token,                     // token
          },
          success: res => {
            console.log(res);
            if(res.statusCode == 200){
              let videoInfo = JSON.parse(res.data)
              console.log(videoInfo)
              this.data.push({
                id: videoInfo.key,
                path: ossData.baseUrl + videoInfo.key,
                cover: ossData.baseUrl + videoInfo.key + '?vframe/jpg/offset/0'
              });
              if (this.fn) this.fn(this.data);
            }else{
              message.info('视频上传失败，请重试')
            }
          },
          complete: () => {
            this.curIndex ++;                           // 当前文件执行完上传后，开始上传下一张
            if (this.curIndex == this.fileLen) {        // 当文件传完时，停止调用
              this.complete(this.data);
              uni.hideLoading()
            } else {                                    // 若文件还没有传完，则继续调用函数
              this.upload();
            }
          }
        });
      }
    })

  }
}
