import { defineComponent } from 'vue'
import './index.scss'

import { RouteRecordRaw, RouteMeta } from 'vue-router'
interface MenuType {
  key: string
}

export default defineComponent({
  computed: {
    routes() {
      const routes = this.$router.options.routes
        .filter(item => item.path === '/')
        .reduce((pre: Array<RouteRecordRaw>, next: any) => {
          pre.push(...next.children)
          return pre
        }, [])
        .filter((item: RouteRecordRaw) => item?.meta?.default)
        .sort((a: RouteRecordRaw | RouteMeta, b: RouteRecordRaw | RouteMeta) => a.meta.sort - b.meta.sort)
      return routes
    },
    activeRoutes() {
      return this.$route.name
    }
  },
  methods: {
    selectionItem({ key }: MenuType) {
      this.$router.push({ name: key })
    }
  },
  render() {
    const { routes, activeRoutes, selectionItem } = this

    return (
      <a-layout-sider>
        <div class="logo">logo</div>
        <a-menu theme="light" mode="inline" selectedKeys={[activeRoutes]}>
          {routes.map(item => {
            if (item?.children?.length) {
              return (
                <a-sub-menu
                  key={item.path}
                  v-slots={{
                    title: () => (
                      <div>
                        <i class={(item.meta as RouteMeta).icon}></i>
                        <span class="menu-item">{(item.meta as RouteMeta).title}</span>
                      </div>
                    )
                  }}
                >
                  {item?.children.map(element => (
                    <a-menu-item onClick={selectionItem} key={element.name}>
                      {(element.meta as RouteMeta).title}
                    </a-menu-item>
                  ))}
                </a-sub-menu>
              )
            } else {
              return (
                <a-menu-item key={item.name} onClick={selectionItem}>
                  <i class={(item.meta as RouteMeta).icon}></i>
                  <span class="menu-item">{(item.meta as RouteMeta).title}</span>
                </a-menu-item>
              )
            }
          })}
        </a-menu>
      </a-layout-sider>
    )
  }
})
