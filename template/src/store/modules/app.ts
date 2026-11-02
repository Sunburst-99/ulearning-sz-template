import { defineStore } from 'pinia'

const MOBILE_MEDIA_QUERY = '(max-width: 768px)'
const isMobileDevice = () => /Android|iPhone|iPad|iPod|Mobile|Tablet|HarmonyOS|OpenHarmony/i.test(navigator.userAgent)

interface AppState {
  loginDialog: boolean  // 登录弹窗
  isMobile: boolean
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => {
    return {
      loginDialog: false,
      isMobile: window.matchMedia(MOBILE_MEDIA_QUERY).matches || isMobileDevice(),
    }
  },
  actions: {
    initResponsive() {
      const media = window.matchMedia(MOBILE_MEDIA_QUERY)
      const update = () => {
        this.isMobile = media.matches || isMobileDevice()
        // 放在 html 上，Teleport 到 body 的弹窗也能继承移动端样式。
        document.documentElement.classList.toggle('mobile', this.isMobile)
      }
      media.addEventListener('change', update)
      update()
      return () => media.removeEventListener('change', update)
    },
  },
})
