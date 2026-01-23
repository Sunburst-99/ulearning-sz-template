import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import Empty from '@/components/Empty.vue'

export default (app: App<Element>) => {
  app.component('SvgIcon', SvgIcon)
  app.component('Empty', Empty)
}