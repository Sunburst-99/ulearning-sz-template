import axios from 'axios'
import { useUserStore } from '@/store/modules'
import { ElMessage } from "element-plus";

interface RequestHeaderConfig {
  tokenKey: string; // token 对应的请求头 key
}

const DEFAULT_HEADER_CONFIG: RequestHeaderConfig = {
  tokenKey: 'Authorization',
};

const service = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 60 * 1000 * 30
})

service.interceptors.request.use(
  (config) => {
    const token = useUserStore().userInfo.authorization || ""
    const tokenKey = config.headers.tokenKey || DEFAULT_HEADER_CONFIG.tokenKey;
    config.headers[tokenKey] = token;
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 这个状态码是和后端约定的
    const { code } = res;
    if (code === undefined) {
      // 如果没有 code 代表这不是标准的后端开发的接口
      return response;
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {        
        case 1:
          return response;
        case 0:
          ElMessage.error(res.message);
          return Promise.reject(res);
        default:
          ElMessage.warning(res.message);
          return Promise.reject(res);
      }
    }
  },
  (error) => {
    // Do something with response error
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          logout()
          break;
        case 400:
          ElMessage.error(error.response.data.message);
          break;
        case 403:
          ElMessage.error(error.response.data.message);
          break;
        default:
          return Promise.reject(error.response);
      }
    }
    return Promise.reject(error);
  },
)

// 退出登录
const logout = () => {
  ElMessage.error('登录信息过期，请重新登录！');
  useUserStore().logout()
}

export default service