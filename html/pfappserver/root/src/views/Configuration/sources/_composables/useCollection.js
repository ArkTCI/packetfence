import { computed, toRefs } from '@vue/composition-api'
import i18n from '@/utils/locale'
import { types } from '../config'

export const useItemProps = {
  id: {
    type: String
  },
  sourceType: {
    type: String
  }
}

import { useDefaultsFromMeta } from '@/composables/useMeta'
export const useItemDefaults = (meta, props) => {
  const {
    sourceType
  } = toRefs(props)
  return { ...useDefaultsFromMeta(meta), type: sourceType.value }
}

export const useItemTitle = (props) => {
  const {
    id,
    isClone,
    isNew
  } = toRefs(props)
  return computed(() => {
    switch (true) {
      case !isNew.value && !isClone.value:
        return i18n.t('Authentication Source <code>{id}</code>', { id: id.value })
      case isClone.value:
        return i18n.t('Clone Authentication Source <code>{id}</code>', { id: id.value })
      default:
        return i18n.t('New Authentication Source')
    }
  })
}

export const useItemTitleBadge = (props, context, form) => {
  const {
    sourceType
  } = toRefs(props)
  return computed(() => {
    const type = sourceType.value || form.value.type
    return types[type]
  })
}

export const useServices = (props, context, form) => {
  return computed(() => {
    const {
      sourceType
    } = toRefs(props)
    const type = sourceType.value || form.value.type
    const message = i18n.t('Some services must be restarted after updating this source.')
    return (() => {
      switch (type) {
        case 'Email':
        case 'SponsorEmail':
          return {
            message,
            services: ['haproxy-portal'],
            k8s_services: ['haproxy-portal']
          }
          //break
        default:
          return {}
          //break
      }
    })()
  })
}

export { useRouter } from '../_router'

export { useStore } from '../_store'

import { pfSearchConditionType as conditionType } from '@/globals/pfSearch'
import makeSearch from '@/store/factory/search'
import api from '../_api'
export const useSearch = makeSearch('sources', {
  api,
  sortBy: null, // use natural order (sortable)
  columns: [ // output uses natural order (w/ sortable drag-drop), ensure NO columns are 'sortable: true'
    {
      key: 'selected',
      thStyle: 'width: 40px;', tdClass: 'text-center',
      locked: true
    },
    {
      key: 'id',
      label: 'Name', // i18n defer
      required: true,
      searchable: true,
      visible: true
    },
    {
      key: 'type',
      label: 'Type', // i18n defer
      required: true,
      searchable: true,
      visible: true,
      formatter: value => types[value]
    },
    {
      key: 'description',
      label: 'Description', // i18n defer
      searchable: true,
      visible: true
    },
    {
      key: 'buttons',
      class: 'text-right p-0',
      locked: true
    },
    {
      key: 'class',
      required: true,
      visible: false
    },
    {
      key: 'not_deletable',
      required: true,
      visible: false
    },
    {
      key: 'not_sortable',
      required: true,
      visible: false
    },
  ],
  fields: [
    {
      value: 'id',
      text: i18n.t('Name'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'description',
      text: i18n.t('Description'),
      types: [conditionType.SUBSTRING]
    },
    {
      value: 'type',
      text: i18n.t('Type'),
      types: [conditionType.SUBSTRING]
    }
  ]
})
