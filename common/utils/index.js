import Router from './router.js'
// 在可预见的未来会把moment.js更换为更轻量级的day.js
// import moment from './moment.js'
import Dayjs from './day.js'
import UploadImage from './upload-image.js'
import UploadFileToQINIU from './upload-file-to-qiniu.js'
import UploadFileToOSS from './upload-file-to-oss.js'
import { message } from './message.js'
import { validate } from './validate.js'
import updateApp from './update_app.js'

export {
  Dayjs,
  message,
  validate,
  UploadImage,
  UploadFileToQINIU,
  UploadFileToOSS,
  updateApp,
  Router
}
