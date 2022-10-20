import {
  BaseView,
  ButtonSamlMetaData,
  FormButtonBar,
  TheForm
} from './'

const components = {
  FormButtonBar,
  TheForm
}

import { computed, toRefs } from '@vue/composition-api'
import { renderHOCWithScopedSlots } from '@/components/new/'
import { useViewCollectionItem, useViewCollectionItemProps } from '../../_composables/useViewCollectionItem'
import * as collection from '../_composables/useCollection'

const props = {
  ...useViewCollectionItemProps,
  ...collection.useItemProps
}

const setup = (props, context) => {

  const {
    sourceType
  } = toRefs(props)

  const viewCollectionItem = useViewCollectionItem(collection, props, context)
  const {
    form,
    isLoading,
    isModified
  } = viewCollectionItem

  const scopedSlotProps = computed(() => ({ ...props, isLoading: isLoading.value, isModified: isModified.value, sourceType: sourceType.value || form.value.type }))

  return {
    ...viewCollectionItem,

    scopedSlotProps
  }
}

const render = renderHOCWithScopedSlots(BaseView, { components, props, setup }, {
  buttonsAppend: ButtonSamlMetaData
})

// @vue/component
export default {
  name: 'the-view',
  inheritAttrs: false,
  props,
  render
}
