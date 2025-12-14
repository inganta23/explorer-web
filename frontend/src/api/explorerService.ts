import type { FolderNode, FileModel, SearchResult } from '@/types/explorer'

const BASE_URL = 'http://localhost:3000/api/v1'

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options)
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`)
  return res.json()
}

export const explorerService = {
  getFolderTree: () => fetchJson<FolderNode[]>('/folders/tree'),
  getFolderChildren: (id: string) => fetchJson<FolderNode[]>(`/folders/${id}/children`),
  getFolderFiles: (id: string) => fetchJson<FileModel[]>(`/folders/${id}/files`),
  search: (query: string) =>
    fetchJson<SearchResult>(`/folders/search?q=${encodeURIComponent(query)}`),
}
