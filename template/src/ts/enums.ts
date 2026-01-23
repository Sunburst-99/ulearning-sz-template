// 用户身份（roleId)
export enum ROLE {
  TEACHER = 8, //教师
  STUDENT = 9, //学生
  BACKMANAGER = 10, //后门管理员
  PARTNER = 15, //合作伙伴
  REGTEACHER = 81, //自注册教师（开发注册的教师）
  SUPERMANAER = 182, //超级管理员（测试）
  MANAGER = 183, //管理员
  SERVICE = 184, //客服
  LEAGUEMANAGER = 185, //联盟管理员
  SERVICEACCOUNT = 250 //服务账号（服务账号）
}

// 菜单风格
export enum MENU_STYLE {
  DEFAULT = 'default',
  DARK = 'dark',
  LIGHT = 'light',
  BLUE = 'blue',
  RED = 'red' // 思政主题
}

// 主题色
export enum THEME_COLOR {
  BLUE = '#2970FF', // 科技蓝
  RED = '#E60012', // 中国红
  ORANGE = '#DC6803', // 活力橙
  GREEN = '#00ADB6', // 松石绿
  EMERALD = '#147831', // 翡翠绿
  DEEP_BLUE = '#026AA2', // 深海蓝
  PURPLE = '#7839EE', // 极光紫
  GRAPE = '#C11574' // 葡萄紫
}

// 上传类型名称
export enum FILE_TYPE_NAME {
  FOLDER = 'folder',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  DOCUMENT = 'document',
  RICHTEXT = 'richText',
  LINK = 'link',
  VR = 'vr',
  PACKAGE = 'package',
  OTHER = 'other'
}

// document文件类型
export enum DOCUMENT_TYPE {
  WORD = 'word',
  EXCEL = 'excel',
  PPT = 'ppt',
  PDF = 'pdf',
  TXT = 'txt',
}