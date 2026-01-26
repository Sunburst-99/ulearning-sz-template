import { App, DirectiveBinding } from 'vue'

export default function initDirective(app: App) {
  let delay = 50
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement
        animateElement(el)
        observer.unobserve(el)
      }
    })
  })

  const animateElement = (el: HTMLElement) => {
    setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0px)'
    }, delay += 20)
  }

  app.directive('animate', {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
      el.style.transition = 'all 1.2s'
      el.style.opacity = '0'
      el.style.transform = 'translateY(40px)'

      observer.observe(el)
      
      if (!window.IntersectionObserver) {
        animateElement(el)
      }
    },
    unmounted: (el: HTMLElement) => {
      observer.unobserve(el)
    }
  })
}