import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function search(query: string, page: number, showSinger: boolean) {
  return get('/api/search', {
    query,
    page,
    showSinger,
  })
}
