import { phoneRegex, passwordRegex } from './regexp.d'

// 校验手机号
export const validPhoneNumber = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value.length === 0) return callback(new Error("请输入手机号"));
  if (value.length < 11 && value.length > 0)
    return callback(new Error("手机号不足11位"));
  if (!phoneRegex.test(value)) return callback(new Error("请输入正确的手机号"));
  callback();
};

// 校验密码
export const validPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
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
