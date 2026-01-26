<script lang="ts" setup>
import { ref, reactive, toRefs, nextTick } from 'vue'
import { apiGetImgCaptcha } from "@/api/login";
import type { FormInstance } from 'element-plus'
import type { CaptchaInfo } from '@/types/login'

interface Emit {
  (e: 'submit', captcha: string, verifyKey: string): void
}
const emit = defineEmits<Emit>()

const verifyFormRef = ref<FormInstance | null>(null)

const visible = ref(false)

const state = reactive({
  verifyForm: {
    captcha: ""
  },
  verifyRules: {
    captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
  },
  verifyImg: "",
  verifyKey: "",
})
const { verifyForm, verifyRules, verifyImg } = toRefs(state)

const open = () => {
  visible.value = true
  state.verifyForm.captcha = "";
  getCaptcha();
  nextTick(() => {
    verifyFormRef.value?.clearValidate();
  });
}

const close = () => {
  visible.value = false
}

const getCaptcha = async () => {
  // 获取新验证码之前清空之前的验证码
  if (state.verifyForm.captcha) {
    state.verifyForm.captcha = "";
  }
  try {
    const res = await apiGetImgCaptcha<CaptchaInfo>();
    state.verifyImg = res.image;
    state.verifyKey = res.verKey;
  } catch (err) {
    console.error(err);
  }
}

const handleSubmit = () => {
  verifyFormRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', state.verifyForm.captcha, state.verifyKey)
    }
  });
}

defineExpose({ open, close })
</script>

<template>
  <el-dialog
    class="custom-dialog"
    title="身份验证"
    width="260px"
    top="15%"
    v-model="visible"
    :modal-append-to-body="false"
    :center="true"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div class="verifyBox">
      <img :src="verifyImg" />
      <el-button link @click="getCaptcha">换一张</el-button>
    </div>
    <el-form
      ref="verifyFormRef"
      :model="verifyForm"
      :rules="verifyRules"
      class="verifyForm"
    >
      <el-form-item prop="captcha">
        <el-input v-model="verifyForm.captcha" placeholder="请输入验证码" />
      </el-form-item>
    </el-form>
    <el-button type="primary" class="confirmButton" @click="handleSubmit">确定</el-button>
  </el-dialog>
</template>

<style lang="scss" scoped>
.verifyBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  img {
    width: 122px;
  }
}
.confirmButton {
  width: 100%;
  margin-bottom: 24px;
}
</style>
