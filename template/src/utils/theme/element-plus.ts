/** 变量前缀 */
const PRE = '--el-color-primary'
/** 浅色变量前缀 */
const PRE_LIGHT = `${PRE}-light`
/** 深色变量前缀 */
const PRE_DARK = `${PRE}-dark`
/** 透明变量前缀 */
const PRE_OPACITY = `${PRE}-opacity`
/** 色阶 */
const Levels = [2, 3, 4, 5, 6, 7, 8, 9]

/** 白色 */
const WHITE = '#FFFFFF'
/** 黑色 */
const BLACK = '#000000'

/**
 * 给root设置样式变量
 * @param name 
 * @param value 
 */
export function setRootProperty(name: string, value: string) {
  const html = document.documentElement
  html.style.setProperty(name, value)
}

/**
 * 设置html的class
 * @param classStr html的class字符串
 */
export function setHtmlClass(classStr: string) {
  const html = document.documentElement as HTMLElement
  html.setAttribute('class', classStr)
}

/**
 * 混合颜色
 */
const mix = (color1: string, color2: string, weight: number) => {
  weight = Math.max(Math.min(Number(weight), 1), 0)
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)
  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)
  const r = Math.round(r1 * (1 - weight) + r2 * weight)
  const g = Math.round(g1 * (1 - weight) + g2 * weight)
  const b = Math.round(b1 * (1 - weight) + b2 * weight)
  const _r = ('0' + (r || 0).toString(16)).slice(-2)
  const _g = ('0' + (g || 0).toString(16)).slice(-2)
  const _b = ('0' + (b || 0).toString(16)).slice(-2)
  return '#' + _r + _g + _b
}

/**
 * 将hex转成rgba并添加透明度
 * @param {*} hex 例：#000000
 * @param {*} opacity 例：0.8
 * @returns rgba(0, 0, 0, 0.8)
 */
const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * 更换颜色的方法
 * @param color 颜色
 */
export function changeElementPlusTheme (color: string) {
  if (!color) {
    console.warn('未获取到颜色的值')
    return
  }
  // 设置主要颜色变量 --el-color-primary
  setRootProperty(PRE, color)
  // 循环设置色阶颜色
  // --el-color-primary-light-${level}
  Levels.forEach(level => {
    setRootProperty(`${PRE_LIGHT}-${level}`, mix(color, WHITE, level * 0.1))
  })
  // 设置主要暗色
  // --el-color-primary-dark-2
  const dark = mix(color, BLACK, 0.2)
  setRootProperty(`${PRE_DARK}-2`, dark)
  // 设置透明色
  setRootProperty(`${PRE_OPACITY}-8`, hexToRgba(color, 0.8))
}

/**
 * 切换主题色的方法
 * @param {*} color
 */
export function changeThemeColor(color: string) {
  changeElementPlusTheme(color)
}

/**
 * 切换整体风格
 * @param {*} style
 */
export function changeLayoutStyle(style: string) {
  setHtmlClass(`${style}-layout`)
}
