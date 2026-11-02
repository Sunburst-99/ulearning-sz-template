import { get, post } from '@/utils/request'
import type { ResetPasswordInfo } from '@/types/login'

const SZACCOUNT_API = import.meta.env.VITE_SZACCOUNT_API
const COURSE_API = import.meta.env.VITE_COURSE_API

// 登录
export function apiLogin<T>(
  data: {
    loginName: string
    password: string
  }
) {
  return post<T>({
    url: SZACCOUNT_API + `/uc/login?source=sa`,
    data
  })
}

// 退出登录
export function apiLogout<T>(){
  return get<T>({
    url: SZACCOUNT_API + `/uc/logout?source=sa`
  })
}

// 重置密码--发送短信
export function apiSendResetSms<T>(
  data: {
    cellphone: string
    regionCode: string
    captcha: string
    verKey: string
  }
) {
  return post<T>({
    url: COURSE_API + `/findpassword/sendsms`,
    data
  });
};

// 重置密码--发送邮件
export function apiSendResetEmail<T>(
  data: {
    captcha: string
    verKey: string
    type: number
    lang: string
    mail: string
  }
) {
  return post<T>({
    url: COURSE_API + `/findpassword/sendmail`,
    data
  });
};

// 获取图片验证码
export function apiGetImgCaptcha<T>() {
  return get<T>({
    url: COURSE_API + `/captcha`,
  });
};

// 重置密码--验证手机验证码
export const apiCheckCaptchaByPhone = (
  data: {
    areaCode: string
    cellphone: string
    code: string
  }
) => {
  return post<ResetPasswordInfo>({
    url: COURSE_API + `/findpassword/verifycode`,
    data
  });
};

// 重置密码--验证邮箱验证码
export const apiCheckCaptchaByEmail = (
  data: {
    mail: string
    code: string
  }
) => {
  return post<ResetPasswordInfo>({
    url: COURSE_API + `/findpassword/verifymailcode`,
    data
  });
};


// 重置密码--保存信息
export function apiSaveResetInfo<T>(
  data: {
    password: string;
    code: string;
    type: number;
    loginName: string;
  }
) {
  return post<T>({
    url: COURSE_API + `/findpassword/resetPassword`,
    data
  });
};
