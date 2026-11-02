import type { UserInfo } from '@/types/user'
import { MENU_STYLE, THEME_COLOR } from '@/ts/enums'

export interface CaptchaInfo {
  image: string
  verKey: string
}

export interface ResetPasswordInfo {
  message: string
  status: number
}

export interface OtherLoginInfo {
  status: number
  userDTO: UserInfo
}

export interface ThemeInfo {
  domain: string
  id: number
  loginLogo: string | null
  loginPic: string
  logo: string
  orgId: number
  siteName: string
  style: MENU_STYLE
  themeColor: THEME_COLOR
}
