import { App } from 'vue'

export default function initDirective(app: App) {
  const list: HTMLElement[] = []
  let timer: any
  window.addEventListener('scroll', () => {
    run()
  }, true);

  const run = () => {
    const tempList: HTMLElement[]  = []
    let t = 50
    list.forEach(el => {
      // if (elementInViewport(el, true)) {
      //   tempList.push(el)
      // }
    })
    while(tempList.length > 0) {
      const el = tempList.shift()
      if (el) {
        list.splice(list.indexOf(el), 1)
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0px)'
        }, t += 20)
      }
    }
  }

  app.directive('animate', {
    mounted: (el) => {
      el.style.transition = 'all 1.2s'
      el.style.opacity = '0'
      el.style.transform = 'translateY(40px)'
      list.push(el)
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        run() // 执行动画
      }, 150)
      // setTimeout(() => {
      //   run()
      // }, 300)
    },
    unmounted: (el) => {
      // if (timer) {
      //   clearTimeout(timer)
      // }
      // list.splice(list.indexOf(el), 1)
    }
  })
}
