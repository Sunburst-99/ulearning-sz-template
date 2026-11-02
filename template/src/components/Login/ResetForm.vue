<script lang="ts" setup>
import { reactive, ref, watch, onBeforeUnmount } from 'vue'
import { apiSendResetSms, apiSendResetEmail, apiCheckCaptchaByPhone, apiCheckCaptchaByEmail, apiSaveResetInfo } from '@/api/login'
import { validPhoneNumber, validPassword } from '@/utils/validator'
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

const props = defineProps<{
  imgCaptchaInfo: { captcha: string; verifyKey: string }
}>()
const emit = defineEmits<{
  (e: 'openDialog'): void
  (e: 'closeDialog'): void
}>()
const resetFormRef = ref<FormInstance>()
const resetByPhone = ref(false)
const hasSendSms = ref(false)
const sending = ref(false)
const submitting = ref(false)
const countdown = ref(60)
let countdownId: ReturnType<typeof setInterval> | undefined
let active = true

const resetForm = reactive<ResetForm>({
  phone: '', email: '', password: '', confirmPassword: '', captcha: '',
})

const validConfirmPassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  callback(value !== resetForm.password ? new Error('两次输入密码不一致!') : undefined)
}

const resetRules = reactive<FormRules<ResetForm>>({
  phone: [{ required: true, validator: validPhoneNumber, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  password: [{ required: true, validator: validPassword, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validConfirmPassword, trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const stopCountdown = () => {
  clearInterval(countdownId)
  countdownId = undefined
  hasSendSms.value = false
  countdown.value = 60
}
const startCountdown = () => {
  stopCountdown()
  hasSendSms.value = true
  countdownId = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) stopCountdown()
  }, 1000)
}
onBeforeUnmount(() => {
  active = false
  stopCountdown()
})

watch(() => props.imgCaptchaInfo, (value, previous) => {
  if (value.captcha && (value.captcha !== previous.captcha || value.verifyKey !== previous.verifyKey)) {
    void handleCheckImgCaptcha()
  }
})

const handleChangeResetType = () => {
  if (sending.value || submitting.value) return
  stopCountdown()
  resetByPhone.value = !resetByPhone.value
  resetFormRef.value?.resetFields()
  resetFormRef.value?.clearValidate()
}

const handleGetImgCaptcha = async () => {
  if (hasSendSms.value || sending.value || !resetFormRef.value) return
  const valid = await resetFormRef.value.validateField(resetByPhone.value ? 'phone' : 'email').catch(() => false)
  if (valid) emit('openDialog')
}

const handleCheckImgCaptcha = async () => {
  if (sending.value || hasSendSms.value) return
  sending.value = true
  const { captcha, verifyKey } = props.imgCaptchaInfo
  try {
    const res = resetByPhone.value
      ? await apiSendResetSms<ResetPasswordInfo>({ captcha, verKey: verifyKey, regionCode: '86', cellphone: resetForm.phone })
      : await apiSendResetEmail<ResetPasswordInfo>({ captcha, verKey: verifyKey, lang: 'zh-CN', type: 1, mail: resetForm.email })
    if (!active) return
    emit('closeDialog')
    if (res.status !== 1) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch {
    // 错误提示沿用请求拦截器，保留表单内容供重试。
  } finally {
    sending.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value || !resetFormRef.value) return
  submitting.value = true
  try {
    const valid = await resetFormRef.value.validate().catch(() => false)
    if (!valid) return
    const check = resetByPhone.value
      ? await apiCheckCaptchaByPhone({ areaCode: '86', cellphone: resetForm.phone, code: resetForm.captcha })
      : await apiCheckCaptchaByEmail({ mail: resetForm.email, code: resetForm.captcha })
    if (!active) return
    if (check.status !== 1) {
      ElMessage.error(check.message)
      return
    }
    const res = await apiSaveResetInfo<ResetPasswordInfo>({
      password: resetForm.password,
      code: resetForm.captcha,
      type: resetByPhone.value ? 1 : 2,
      loginName: resetByPhone.value ? resetForm.phone : resetForm.email,
    })
    if (!active) return
    if (res.status !== 1) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success('修改成功！')
    stopCountdown()
    resetFormRef.value.resetFields()
  } catch {

  } finally {
    submitting.value = false
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
            :disabled="hasSendSms || submitting"
            :loading="sending"
            @click="handleGetImgCaptcha"
            >
            {{ hasSendSms ? `重新获取(${countdown})` : "获取验证码" }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button class="confirmButton" type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </div>
      <div class="footer">
        <el-button class="change" type="primary" :disabled="sending || submitting" link @click="handleChangeResetType">
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
