import { useUserStore } from "@/store";
import { objectToQueryString } from '@/utils/functions'

export default function() {

  const { isLogin, userInfo } = useUserStore()
  const { VITE_SZAI_HOST, VITE_AI_HOST, VITE_ZYK_HOST } = import.meta.env

  //跳转到思政智能体
  function toSzAI(path: string) {
    const host = VITE_SZAI_HOST
    if (!isLogin) {
      window.open(host, "_blank");
      return;
    }
    const query = objectToQueryString({
      redirect_uri: path,
      source: 'ul',
      AUTHORIZATION: userInfo.authorization
    })
    window.open(`${host}/nologin/index.html?${query}`);
  }

  // 跳转到优学院智能体
  function toYxyAI(path: string) {
    window.open(`${VITE_AI_HOST}/${path}`);
  }

  // 跳转到资源库
  function toZyk(path: string) {
    const host = VITE_ZYK_HOST
    const newPath = '/#/org/fjnl' + path
    if (!isLogin) {
      window.open(host + newPath, "_blank");
      return;
    }
    const query = objectToQueryString({
      redirect_uri: newPath,
      source: 'ul',
      AUTHORIZATION: userInfo.authorization
    })
    window.open(`${host}/nologin/index.html?${query}`);
  }

  return {
    toSzAI,
    toYxyAI,
    toZyk
  }
}