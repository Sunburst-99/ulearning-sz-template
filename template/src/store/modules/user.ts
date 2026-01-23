import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/user'
import cookie from '@/utils/cache/cookie'
import { DefaultUserInfo } from '@/ts/models/user'
import { LOCAL_NAME } from '@/ts/constants'

interface UserState {
  userInfo: UserInfo
}

const YXY_LOCAL_NAME = 'USERINFO'

// 免登录优学院
const ulearningCookieSetting = { 
  expires: 8 / 24,
  domain: import.meta.env.VITE_ULEARNING_DOMAIN 
};

export const useUserStore = defineStore('user-store', {
  state: (): UserState => {
    const user = cookie.get(LOCAL_NAME) as UserState | null
    return {
      userInfo: user ? { ...new DefaultUserInfo(), ...user } : new DefaultUserInfo()
    }
  },
  getters: {
    isLogin: (state) => {
      return !!state.userInfo?.authorization
    },
  },
  actions: {
    // 刷新用户信息
    updateUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.recordState()
    },
    // 退出登录
    logout() {
      this.clearState()
      window.location.reload()
    },
    // 存储
    recordState() {
      cookie.set(LOCAL_NAME, this.userInfo);
      cookie.set(YXY_LOCAL_NAME, this.userInfo, ulearningCookieSetting);
    },
    // 清除存储
    clearState(){
      cookie.clear()
    }
  },
})
