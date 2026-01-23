import { FILE_TYPE_NAME, DOCUMENT_TYPE } from '@/ts/enums'

export default function() {

  // 是否为图片
  function isImageFile(suffix: string) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    return imageExtensions.includes(suffix.toLowerCase());
  }

  // 是否为视频
  function isVideoFile(suffix: string) {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    return videoExtensions.includes(suffix.toLowerCase());
  }

  // 是否为音频
  function isAudioFile(suffix: string) {
    const audioExtensions = ['mp3', 'wav', 'wma', 'aac', 'flac', 'ogg'];
    return audioExtensions.includes(suffix.toLowerCase());
  } 

  // 是否为文件
  function isDocumentFile(suffix: string) {
    const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt'];
    return officeExtensions.includes(suffix.toLowerCase());
  }

  // 是否为压缩包
  function isPackageFile(suffix: string) {
    const officeExtensions = ['zip', 'rar'];
    return officeExtensions.includes(suffix.toLowerCase());
  }

  /**
   * 获取文件类型
   * @param path 带后缀的文件名
   * @returns UploadTypeName
   */
  const formatFileType = (path: string) => {
    const suffix = formatSuffix(path);
    if (isImageFile(suffix)) {
      return FILE_TYPE_NAME.IMAGE;
    } else if (isVideoFile(suffix)) {
      return FILE_TYPE_NAME.VIDEO;
    } else if (isAudioFile(suffix)) {
      return FILE_TYPE_NAME.AUDIO;
    } else if (isDocumentFile(suffix)) {
      return FILE_TYPE_NAME.DOCUMENT;
    } else if (isPackageFile(suffix)) {
      return FILE_TYPE_NAME.PACKAGE;
    } else {
      return FILE_TYPE_NAME.OTHER
    }
  }

  /**
   * 获取docuemnt类型
   * @param path 带后缀的文件名
   * @returns DOCUMENT_TYPE
   */
  const formatDocumentType = (path: string) => {
    const suffix = formatSuffix(path);
    const wordExts = ['doc', 'docx'];
    const excelExts = ['xls', 'xlsx'];
    const pptExts = ['ppt', 'pptx'];
    const pdfExts = ['pdf'];
    const txtExts = ['txt'];
    if (wordExts.includes(suffix)) {
      return DOCUMENT_TYPE.WORD
    } else if (excelExts.includes(suffix)) {
      return DOCUMENT_TYPE.EXCEL
    } else if (pptExts.includes(suffix)) {
      return DOCUMENT_TYPE.PPT
    } else if (pdfExts.includes(suffix)) {
      return DOCUMENT_TYPE.PDF
    } else if (txtExts.includes(suffix)) {
      return DOCUMENT_TYPE.TXT
    }
  }

  /**
   * 文件icon
   * @param type 文件类型
   * @param path 文件路径
   */
  const formatFileIcon = (type: FILE_TYPE_NAME, path = '') => {
    switch (type) {
      case FILE_TYPE_NAME.FOLDER:
        return 'file-folder';
      case FILE_TYPE_NAME.VIDEO:
        return 'file-video';
      case FILE_TYPE_NAME.AUDIO:
        return 'file-audio';
      case FILE_TYPE_NAME.IMAGE:
        return 'file-image';
      case FILE_TYPE_NAME.RICHTEXT:
        return 'file-richText';
      case FILE_TYPE_NAME.LINK:
        return 'file-html';
      case FILE_TYPE_NAME.VR:
        return 'file-vr';
      case FILE_TYPE_NAME.DOCUMENT:
        const documentType = formatDocumentType(path)
        switch (documentType) {
          case DOCUMENT_TYPE.WORD:
            return 'file-word';
          case DOCUMENT_TYPE.EXCEL:
            return 'file-excel';
          case DOCUMENT_TYPE.PPT:
            return 'file-ppt';
          case DOCUMENT_TYPE.PDF:
            return 'file-pdf';
          case DOCUMENT_TYPE.TXT:
            return 'file-txt';
        }
      default:
        return 'file-other';
    }
  }

  /**
   * 文件大小转换
   * @param bytes //文件大小
   * @param decimals  //保留小数
   */ 
  const formatBytes = (bytes: number | null, decimals = 2) => {
    if (bytes === 0) return '0B'
    if (bytes === null) return '--'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['ByteS', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i];
  }

  /**
   * 获取文件后缀名
   */
  const formatSuffix = (filePath: string) => {
    const suffix = filePath.substr(filePath.lastIndexOf('.') + 1);
    return suffix
  }

  /**
   * 转换文件地址
   * @param path 
   * @param type 
   * @returns {string}
   */
  const formatFilePath = (path: string, type: FILE_TYPE_NAME) => {
    let url = path

    // 转换document文件
    if (type === FILE_TYPE_NAME.DOCUMENT && import.meta.env.VITE_UPLOAD_STRATEGY === 'standard') {
      url = import.meta.env.VITE_DOCS_HOST + '?time=1&ssl=1&furl=' + path
    }
    return url
  }

  return {
    isImageFile,
    isVideoFile,
    isAudioFile,
    isDocumentFile,
    isPackageFile,
    formatFileType,
    formatDocumentType,
    formatFileIcon,
    formatBytes,
    formatSuffix,
    formatFilePath
  }
}