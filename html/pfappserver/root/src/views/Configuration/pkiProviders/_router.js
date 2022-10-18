import store from '@/store'
import PkiProvidersStoreModule from './_store'
import PkisStoreModule from '../pki/_store'

const TheSearch = () => import(/* webpackChunkName: "Configuration" */ './_components/TheSearch')
const TheView = () => import(/* webpackChunkName: "Configuration" */ './_components/TheView')

export const useRouter = $router => {
  return {
    goToCollection: () => $router.push({ name: 'pki_providers' }),
    goToItem: params => $router
      .push({ name: 'pki_provider', params })
      .catch(e => { if (e.name !== "NavigationDuplicated") throw e }),
    goToClone: params => $router.push({ name: 'clonePkiProvider', params: { ...params, providerType: params.type } }),
    goToNew: params => $router.push({ name: 'newPkiProvider', params })
  }
}

export const beforeEnter = (to, from, next = () => {}) => {
  if (!store.state.$_pki_providers)
    store.registerModule('$_pki_providers', PkiProvidersStoreModule)
  if (!store.state.$_pkis)
    store.registerModule('$_pkis', PkisStoreModule)
  next()
}

export default [
  {
    path: 'pki_providers',
    name: 'pki_providers',
    component: TheSearch,
    beforeEnter
  },
  {
    path: 'pki_providers/new/:providerType',
    name: 'newPkiProvider',
    component: TheView,
    meta: {
      track: ['providerType']
    },
    props: (route) => ({ isNew: true, providerType: route.params.providerType }),
    beforeEnter
  },
  {
    path: 'pki_provider/:id',
    name: 'pki_provider',
    component: TheView,
    props: (route) => ({ id: route.params.id }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_pki_providers/getPkiProvider', to.params.id).then(() => {
        next()
      })
    }
  },
  {
    path: 'pki_provider/:id/clone/:providerType',
    name: 'clonePkiProvider',
    component: TheView,
    meta: {
      track: ['providerType']
    },
    props: (route) => ({ id: route.params.id, providerType: route.params.providerType, isClone: true }),
    beforeEnter: (to, from, next) => {
      beforeEnter()
      store.dispatch('$_pki_providers/getPkiProvider', to.params.id).then(() => {
        next()
      })
    }
  }
]
