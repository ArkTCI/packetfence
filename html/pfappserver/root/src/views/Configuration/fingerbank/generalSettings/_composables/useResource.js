import { computed } from '@vue/composition-api'
import i18n from '@/utils/locale'

export const useTitle = () => i18n.t('General Settings')

export const useStore = $store => {
  return {
    isLoading: computed(() => $store.getters['$_fingerbank/isGeneralSettingsLoading']),
    getItem: () => $store.dispatch('$_fingerbank/getGeneralSettings'),
    getItemOptions: () => $store.dispatch('$_fingerbank/optionsGeneralSettings'),
    updateItem: params => $store.dispatch('$_fingerbank/setGeneralSettings', params)
  }
}

export const useServices = () => computed(() => {
  return {
    message: i18n.t('Creating or modifying the general configuration requires to restart the fingerbank-collector service.'),
    services: ['fingerbank-collector'],
    k8s_services: ['fingerbank-collector']
  }
})
