import { defineComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import style from './Tab.module.scss'

const Tab = defineComponent({
  name: 'Tab',
  setup() {
    const tabs = [
      { name: '推荐', path: '/recommend' },
      { name: '歌手', path: '/singer' },
      { name: '排行', path: '/rank' },
      { name: '搜索', path: '/search' },
    ]
    const route = useRoute()

    return () => (
      <div class={style.tab}>
        {tabs.map((tab) => {
          return (
            <RouterLink
              class={[
                style['tab-item'],
                route.path === tab.path ? style['tab-item-active'] : '',
              ].join(' ')}
              to={tab.path}
            >
              <span class={style['tab-link']}>{tab.name}</span>
            </RouterLink>
          )
        })}
      </div>
    )
  },
})

export default Tab
