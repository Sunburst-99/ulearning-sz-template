import Obs from "ulearning-obs/dist/obs-huawei.js";
import axios from 'axios';
import { useUserStore } from "@/store";
import { dateFormat, download } from '@/utils/functions';

const { VITE_COURSE_API, VITE_API_HOST } = import.meta.env

// obs基础配置
const obsBaseConfig = {
  obsHost: '',
  uptokenHost: VITE_COURSE_API,
  isMediaLengthNotNeeded: true
}

export default function() {
  const { userInfo } = useUserStore()
  const obsUploader = (options: any = {}) => {
    const obs = new Obs({
      ...obsBaseConfig,
      authorization: userInfo.authorization,
      ...options,
    })
    return obs
  }

  // 上传路径
  const formatUploadPath = (file: any, basePath: string = 'sjjx') => {
    const date = dateFormat(Date.now(), 'YYYYMMDD');
    const suffix = file.name.split(".").pop()
    const random = Date.now() + Math.round(Math.random() * 10000)
    return `${basePath}/${userInfo.userId}/${date}/${random}.${suffix}`
  }

  // 本地部署上传
  const uploadByLocal = (file: any, successCb?: Function, failCb?: Function, progressCb?: Function) => {
    const date = dateFormat(Date.now(), 'YYYYMMDD');
    const random = Date.now() + Math.round(Math.random() * 10000)
    const path = `${userInfo.userId}/${date}/${random}`
    const formData = new FormData();
    formData.append("file", file);
    formData.append("basePath", path);
    axios({
      url: `${VITE_API_HOST}/uploadToken`,
      headers: { Authorization: userInfo.authorization },
      method: "post",
      data: formData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          progressCb && progressCb(percent);
        }
      }
    }).then(res => {
      if (res.data.code === 1) {
        successCb && successCb(res.data.result[0].filePath);
      } else {
        failCb && failCb(res.data);
      }
    }).catch(res => {
      failCb && failCb(res.data);
    });
  }

  // 下载
  const obsDownload = (url: string, name?: string) => {
    if (import.meta.env.VITE_UPLOAD_STRATEGY === 'local') {
      download(url, name)
    } else {
      const obs = obsUploader()
      obs.download(url, name);
    }
  }

  return {
    obsUploader,
    formatUploadPath,
    uploadByLocal,
    obsDownload
  }
}
