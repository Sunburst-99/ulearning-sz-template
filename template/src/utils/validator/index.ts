import { phoneRegex, passwordRegex } from './regexp.d'

// 校验手机号
export const validPhoneNumber = (rule: any, value: any, callback: any) => {
  if (value.length === 0) callback(new Error("请输入手机号"));
  if (!phoneRegex.test(value)) callback(new Error("请输入正确的手机号"));
  if (value.length < 11 && value.length > 0)
    callback(new Error("手机号不足11位"));
  callback();
};

// 校验密码
export const validPassword = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (value.length < 8 || value.length > 16) {
    callback(new Error("请输入8~16位密码"));
  } else if (!passwordRegex.test(value)) {
    callback(
      new Error("密码须包含至少3种字符（数字、大写字母、小写字母或特殊符号）")
    );
  } else {
    callback();
  }
};