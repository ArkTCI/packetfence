import store from '@/store'
import StoreModule from './_store'
import { analytics } from './config'

const TheSearch = () => import(/* webpackChunkName: "Configuration" */ './_components/TheSearch')
const TheView = () => import(/* webpackChunkName: "Configuration" */ './_components/TheView')

export const useRouter = $router => {
  return {
    goToCollection: () => $router.push({ name: 'scanEngines' }),
    goToItem: params => $router
      .push({ name: 'scanEngine', params })
      .catch(e => { if (e.name !== "NavigationDuplicated") throw e }),
    goToClone: params => $router.push({ name: 'cloneScanEngine', params: { ...params, scanType: params.type } }),
  }
}

export const beforeEnter = (to, from, next = () => {}) => {
  if (!store.state.$_scans)
    store.registerModule('$_scans', StoreModule)
  next()
}

export default [
  {
    path: 'scan_engines',
    name: 'scanEngines',
    component: TheSearch,
    props: () => ({ tab: 'scan_engines' }),
    beforeEnter
  },
  {
    path: 'scan_engines/new/:scanType',
    name: 'newScanEngine',
    component: TheView,
    meta: {
      ...analytics
    },
    props: (route) => ({ isNew: true, scanType: route.params.scanType }),
    beforeEnter
  },
  {
    path: 'scan_engine/:id',
    name: 'scanEngine',
    component: TheView,
    props: (route) => ({ id: route.params.id }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_scans/getScanEngine', to.params.id).then(() => {
        next()
      })
    }
  },
  {
    path: 'scan_engine/:id/clone/:scanType',
    name: 'cloneScanEngine',
    component: TheView,
    meta: {
      ...analytics
    },
    props: (route) => ({ id: route.params.id, scanType: route.params.scanType, isClone: true }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_scans/getScanEngine', to.params.id).then(() => {
        next()
      })
    }
  }
]
