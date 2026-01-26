<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { apiSendResetSms, apiSendResetEmail, apiCheckCaptchaByPhone, apiCheckCaptchaByEmail, apiSaveResetInfo } from "@/api/login";
import { validPhoneNumber, validPassword } from "@/utils/validator";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { ResetPasswordInfo } from '@/types/login'

interface ResetForm {
  phone: string
  email: string
  password: string
  confirmPassword: string
  captcha: string
}

interface Emit {
  (e: 'openDialog'): void
  (e: 'closeDialog'): void
}
const emit = defineEmits<Emit>()

const resetFormRef = ref<FormInstance | null>(null)

let countdownId: NodeJS.Timeout | undefined = undefined

const validConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== resetForm.password) {
    return callback(new Error("两次输入密码不一致!"));
  }
  callback();
};

const props = defineProps({
  imgCaptchaInfo: {
    type: Object,
    default: () => {}
  }
})

const resetForm = reactive<ResetForm>({
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  captcha: ""
})
const resetRules = reactive<FormRules<ResetForm>>({
  phone: [{ required: true, validator: validPhoneNumber, trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
  password: [{ required: true, validator: validPassword, trigger: "blur" }],
  confirmPassword: [{ required: true, validator: validConfirmPassword, trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
})
const resetByPhone = ref(false) //通过手机号重置
const hasSendSms = ref(false)  //是否发送了验证码
const countdown = ref(60)  //验证码发送倒计时

watch(
  () => props.imgCaptchaInfo,
  (newVal, oldVal) => {
    if (newVal && newVal.captcha && (newVal.captcha !== oldVal.captcha)) {
      handleCheckImgCaptcha();
    }
  }
)

// 通过手机号/邮箱重置密码
const handleChangeResetType = () => {
  resetByPhone.value = !resetByPhone.value;
  resetFormRef.value?.clearValidate();
  resetFormRef.value?.resetFields();
}

// 获取验证码
const handleGetImgCaptcha = () => {
  resetFormRef.value?.validateField(
    resetByPhone.value ? "phone" : "email",
    (valid) => {
      if (valid) {
        emit("openDialog");
      }
    }
  );
}

// 根据图片验证码发送短信
const handleCheckImgCaptcha = async () => {
  const { captcha, verifyKey } = props.imgCaptchaInfo
  try {
    let params: any = {
      captcha,
      verKey: verifyKey,
    };
    params = Object.assign(
      params,
      resetByPhone.value
        ? { regionCode: "86", cellphone: resetForm.phone }
        : { lang: "zh-CN", type: 1, mail: resetForm.email }
    );
    const res = resetByPhone.value
      ? await apiSendResetSms<ResetPasswordInfo>(params)
      : await apiSendResetEmail<ResetPasswordInfo>(params);
    if (res.status === 1) {
      ElMessage.success("验证码已发送");
      emit("closeDialog");
      // 禁用获取验证码按钮
      hasSendSms.value = true;
      countdownId = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1;
        } else {
          clearInterval(countdownId);
          hasSendSms.value = false;
          countdown.value = 60;
        }
      }, 1000);
    } else {
      emit("closeDialog");
      ElMessage({ type: 'error', message: res.message });
    }
  } catch (err) {
    console.error(err);
  }
}

// 点击确定
const handleSubmit = () => {
  resetFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res = resetByPhone.value ? await checkPhoneCaptcha() : await checkEmailCaptcha();
      if (res.status === 1) {
        handleReset();
      } else {
        ElMessage.error(res.message);
      }
    }
  });
}

// 检查手机验证码
const checkPhoneCaptcha = async () => {
  const res = await apiCheckCaptchaByPhone({
    areaCode: "86",
    cellphone: resetForm.phone,
    code: resetForm.captcha
  });
  return res
}

// 检查邮箱验证码
const checkEmailCaptcha = async () => {
  const res = await apiCheckCaptchaByEmail({
    mail: resetForm.email,
    code: resetForm.captcha
  });
  return res
}

// 重置密码
const handleReset = async () => {
  try {
    const { password, captcha, phone, email } = resetForm;
    const params = {
      password,
      code: captcha,
      type: resetByPhone.value ? 1 : 2,
      loginName: resetByPhone.value ? phone : email
    }
    await apiSaveResetInfo<ResetPasswordInfo>(params);
    ElMessage.success('修改成功！');
    resetFormRef.value?.resetFields();
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <div class="resetPassword-container">
    <div class="header">重置密码</div>
    <div class="content">
      <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules">
        <template v-if="resetByPhone">
          <el-form-item prop="phone" class="phoneInput">
            <el-input
              name="phone"
              v-model="resetForm.phone"
              placeholder="请输入手机号"
            >
              <template #prefix><span class="prefix">+86</span></template>
            </el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item prop="email">
            <el-input v-model="resetForm.email" placeholder="请输入邮箱" />
          </el-form-item>
        </template>
        <el-form-item prop="password" class="password">
          <el-input
            type="password"
            v-model="resetForm.password"
            placeholder="设置新密码"
            autocomplete="new-password"
          />
          <div class="passwordRule">* 8-16位，须包含至少3种字符（数字、大写字母、小写字母或特殊符号）</div>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            type="password"
            v-model="resetForm.confirmPassword"
            placeholder="确认新密码"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item prop="captcha" class="captchaGroup">
          <el-input
            name="captcha"
            v-model="resetForm.captcha"
            placeholder="请输入验证码"
          >
          </el-input>
          <el-button
            class="captchaButton"
            :class="hasSendSms && 'countdown'"
            :disabled="hasSendSms"
            @click="handleGetImgCaptcha"
            >
            {{ hasSendSms ? `重新获取(${countdown})` : "获取验证码" }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button class="confirmButton" type="primary" @click="handleSubmit">确定</el-button>
      </div>
      <div class="footer">
        <el-button class="change" type="primary" link @click="handleChangeResetType">
          通过{{ resetByPhone ? "邮箱" : "手机号" }}重置密码
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("./index.scss");
.resetPassword-container {
  .password {
    position: relative;
  }
  .passwordRule {
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: #c0c4cc;
  }
  .footer {
    text-align: center;
    .confirmButton {
      width: 100%;
      margin-top: 10px;
      height: 44px;
    }
    .change {
      padding: 0;
      line-height: 12px;
      margin-top: 15px;
    }
  }
}
</style>
