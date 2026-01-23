import Markdownit from 'markdown-it'
import mk from 'markdown-it-katex'
import hljs from 'highlight.js'
import 'highlight.js/scss/default.scss'

export const mdi: any = new Markdownit({
  html: true,
  linkify: true,
  typographer: true,
  // breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>'
        )
      } catch (err) {
        console.log(err)
      }
    }
    return (
      '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>'
    )
  },
})
.use(mk) // 启用KaTeX数学公式支持
