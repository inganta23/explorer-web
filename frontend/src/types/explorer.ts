export interface FileModel {
  id: string
  name: string
  folderId: string
  size: number
  mimeType: string | null
  updatedAt: string
}

export interface FolderNode {
  id: string
  name: string
  parentId: string | null
  children: FolderNode[]
  isOpen?: boolean
  isSelected?: boolean
}

export interface SearchResult {
  folders: FolderNode[]
  files: FileModel[]
}
