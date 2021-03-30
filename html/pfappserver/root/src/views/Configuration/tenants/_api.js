import apiCall from '@/utils/api'

export default {
  list: params => {
    return apiCall.get('tenants', { params }).then(response => {
      return response.data
    })
  },
  listOptions: () => {
    return apiCall.options('tenants').then(response => {
      return response.data
    })
  },
  item: id => {
    return apiCall.get(['tenant', id]).then(response => {
      return response.data.item
    })
  },
  itemOptions: id => {
    return apiCall.options(['tenant', id]).then(response => {
      return response.data
    })
  },
  create: data => {
    return apiCall.post('tenants', data).then(response => {
      return response.data
    })
  },
  update: data => {
    return apiCall.patch(['tenant', data.id], data).then(response => {
      return response.data
    })
  },
  delete: id => {
    return apiCall.delete(['tenant', id])
  },
  reassign: data => {
    return apiCall.patch(['tenant', data.from, 'reassign'], { id: data.to })
  },
  search: data => {
    return apiCall.post('tenants/search', data).then(response => {
      return response.data
    })
  }
}
