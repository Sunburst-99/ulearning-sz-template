import { THEME_COLOR, MENU_STYLE } from '@/ts/enums'

// cookie存储的userInfo的key
export const LOCAL_NAME = 'USERINFO'

// 主题色列表
export const THEME_LIST = [
  { name: '科技蓝', color: THEME_COLOR.BLUE },
  { name: '中国红', color: THEME_COLOR.RED },
  { name: '活力橙', color: THEME_COLOR.ORANGE },
  { name: '松石绿', color: THEME_COLOR.GREEN },
  { name: '翡翠绿', color: THEME_COLOR.EMERALD },
  { name: '深海蓝', color: THEME_COLOR.DEEP_BLUE },
  { name: '极光紫', color: THEME_COLOR.PURPLE },
  { name: '葡萄紫', color: THEME_COLOR.GRAPE }
]
export const DEFAULT_THEME = THEME_COLOR.RED
export const LS_THEME_KEY = 'theme'

// 菜单风格
export const MENU_STYLE_LIST = [
  { name: '默认', value: MENU_STYLE.DEFAULT },
  // { name: '暗黑', value: MENU_STYLE.DARK },
  { name: '明亮', value: MENU_STYLE.LIGHT },
  { name: '蓝色', value: MENU_STYLE.BLUE, theme: THEME_COLOR.BLUE },
  { name: '红色', value: MENU_STYLE.RED, theme: THEME_COLOR.RED },
]
export const DEFAULT_MENU_STYLE = MENU_STYLE.DEFAULT
export const LS_MENU_STYLE_KEY = 'menu_style'