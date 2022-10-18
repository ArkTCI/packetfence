import store from '@/store'
import StoreModule from './_store'

export const useRouter = $router => {
  return {
    goToCollection: () => $router.push({ name: 'clouds' }),
    goToItem: params => $router
      .push({ name: 'cloud', params })
      .catch(e => { if (e.name !== "NavigationDuplicated") throw e }),
    goToClone: params => $router.push({ name: 'cloneCloud', params: { ...params, cloudType: params.type } }),
    goToNew: params => $router.push({ name: 'newCloud', params }),
  }
}

const TheSearch = () => import(/* webpackChunkName: "Configuration" */ './_components/TheSearch')
const TheView = () => import(/* webpackChunkName: "Configuration" */ './_components/TheView')

export const beforeEnter = (to, from, next = () => {}) => {
  if (!store.state.$_clouds) {
    store.registerModule('$_clouds', StoreModule)
  }
  next()
}

export default [
  {
    path: 'clouds',
    name: 'clouds',
    component: TheSearch,
    beforeEnter
  },
  {
    path: 'clouds/new/:cloudType',
    name: 'newCloud',
    component: TheView,
    meta: {
      track: ['cloudType']
    },
    props: (route) => ({ isNew: true, cloudType: route.params.cloudType }),
    beforeEnter
  },
  {
    path: 'cloud/:id',
    name: 'cloud',
    component: TheView,
    props: (route) => ({ id: route.params.id }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_clouds/getCloud', to.params.id).then(() => {
        next()
      })
    }
  },
  {
    path: 'cloud/:id/clone/:cloudType',
    name: 'cloneCloud',
    component: TheView,
    meta: {
      track: ['cloudType']
    },
    props: (route) => ({ id: route.params.id, cloudType: route.params.cloudType, isClone: true }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_clouds/getCloud', to.params.id).then(() => {
        next()
      })
    }
  }
]
