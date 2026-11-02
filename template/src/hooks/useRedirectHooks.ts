import { useUserStore } from "@/store";
import { objectToQueryString } from '@/utils/functions'

export default function() {
  const {
    VITE_APP_ENV,
    VITE_SZAI_HOST, 
    VITE_AI_HOST,
    VITE_SJJX_HOST,
    VITE_SJJX_PORTAL_HOST,
    VITE_VR_HOST,
    VITE_VR_TEACH_HOST,
    VITE_ZYK_HOST,
    VITE_MOOCPEOPLE_HOST
  } = import.meta.env
  const { isLogin, userInfo } = useUserStore()
  const token = userInfo.authorization
  const loginSource = 'ul'

  enum REDIRECT_KEY {
    SZMY_AI = 'SZMY_AI',
    ULEARNING_AI = 'ULEARNING_AI',
    SJJX = 'SJJX',
    SJJX_PORTAL = 'SJJX_PORTAL',
    VR = 'VR',
    VR_CLASS = 'VR_CLASS',
    ZYK = 'ZYK',
    MOOCPEOPLE = 'MOOCPEOPLE',
  }

  // 免登录网址
  const REDIRECT_HOST = [
    { key: REDIRECT_KEY.SZMY_AI, value: VITE_SZAI_HOST },
    { key: REDIRECT_KEY.ULEARNING_AI, value: VITE_AI_HOST },
    { key: REDIRECT_KEY.SJJX, value: VITE_SJJX_HOST },
    { key: REDIRECT_KEY.SJJX_PORTAL, value: VITE_SJJX_PORTAL_HOST },
    { key: REDIRECT_KEY.VR, value: VITE_VR_HOST },
    { key: REDIRECT_KEY.VR_CLASS, value: VITE_VR_TEACH_HOST },
    { key: REDIRECT_KEY.ZYK, value: VITE_ZYK_HOST },
    { key: REDIRECT_KEY.MOOCPEOPLE, value: VITE_MOOCPEOPLE_HOST },
  ] as const

  function redirectUrl(hostType: REDIRECT_KEY, path: string) {
    const host = REDIRECT_HOST.find(el => el.key === hostType)!.value
    if (!isLogin) return host
    const query = objectToQueryString({
      redirect_uri: path,
      source: loginSource,
      AUTHORIZATION: token
    })
    return `${host}/nologin/index.html?${query}`
  }

  // 思政智能体
  function SzmyAIUrl(path?: string, single?: true) {
    const singlePath = single ? `/single/#` : '/#' 
    const szmyPath = path ? `${singlePath}${path}` : singlePath
    return redirectUrl(REDIRECT_KEY.SZMY_AI, szmyPath)
  }
  function toSzmyAI(path?: string, single?: true) {
    window.open(SzmyAIUrl(path, single), "_blank")
  }

  // 优学院智能体
  function yxyAIUrl(path?: string) {
    const host = REDIRECT_HOST.find(el => el.key === REDIRECT_KEY.ULEARNING_AI)!.value
    return path ? `${host}/${path}` : host
  }
  function toYxyAI(path?: string) {
    window.open(yxyAIUrl(path), "_blank");
  }

  // 实践教学
  function sjjxUrl(path?: string) {
    const sjjxPath = path ? `/#${path}` : '/#/'
    return redirectUrl(REDIRECT_KEY.SJJX, sjjxPath)
  }
  function toSjjx(path?: string) {
    window.open(sjjxUrl(path), "_blank");
  }

  // 实践教学门户
  function sjjxPortalUrl(path?: string) {
    const host = REDIRECT_HOST.find(el => el.key === REDIRECT_KEY.SJJX_PORTAL)!.value
    if (!token) return path ? host + '/#' + path : host
    const query = objectToQueryString({
      redirect_uri: path ?? '/',
      source: loginSource,
      AUTHORIZATION: token
    })
    return `${host}/#/otherLogin?${query}`
  }
  function toSjjxPortal(path?: string) {
    window.open(sjjxPortalUrl(path),  "_blank");
  }
  
  // VR创作
  function vrUrl(path?: string) {
    const vrPath = path ? `/#${path}` : '/#/'
    return redirectUrl(REDIRECT_KEY.VR, vrPath)
  }
  function toVr(path?: string) {
    window.open(vrUrl(path), "_blank");
  }

  // VR教学
  function vrClassUrl(path?: string) {
    const vrClassPath = path ? `/#${path}` : '/#/'
    return redirectUrl(REDIRECT_KEY.VR_CLASS, vrClassPath)
  }
  function toVrClass(path?: string) {
    window.open(vrClassUrl(path), "_blank");
  }

  // 资源库
  function zykUrl(path?: string) {
    const zykPath = path ? `/#${path}` : '/#/'
    return redirectUrl(REDIRECT_KEY.ZYK, zykPath)
  }
  function toZyk(path?: string) {
    window.open(zykUrl(path), "_blank")
  }

  // 人民公开课
  function moocpeopleUrl(path?: string) {
    const isProduction = VITE_APP_ENV === 'production'
    const moocPath = isProduction && path ? `/publicCourse/portal/#${path}` : `/#${path}`
    return redirectUrl(REDIRECT_KEY.MOOCPEOPLE, moocPath)
  }
  function toMoocpeople(path?: string) {
    window.open(moocpeopleUrl(path), "_blank")
  }

  return {
    SzmyAIUrl,
    toSzmyAI,
    yxyAIUrl,
    toYxyAI,
    sjjxUrl,
    toSjjx,
    sjjxPortalUrl,
    toSjjxPortal,
    vrUrl,
    toVr,
    vrClassUrl,
    toVrClass,
    zykUrl,
    toZyk,
    moocpeopleUrl,
    toMoocpeople
  }
}