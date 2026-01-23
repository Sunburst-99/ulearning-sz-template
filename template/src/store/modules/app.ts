import { defineStore } from 'pinia'

interface AppState {
  loginDialog: boolean  // 登录弹窗
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => {
    return {
      loginDialog: false,
    }
  },
})
