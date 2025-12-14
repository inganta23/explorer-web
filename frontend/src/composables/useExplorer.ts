import { ref } from 'vue'
import { explorerService } from '@/api/explorerService'
import type { FolderNode, FileModel } from '@/types/explorer'

export function useExplorer() {
  const folderTree = ref<FolderNode[]>([])
  const currentFolderId = ref<string | null>(null)
  const currentSubFolders = ref<FolderNode[]>([])
  const currentFiles = ref<FileModel[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')

  const loadTree = async () => {
    try {
      isLoading.value = true
      const data = await explorerService.getFolderTree()
      folderTree.value = enhanceTreeData(data)
    } catch (e) {
      console.error('Failed to load tree', e)
    } finally {
      isLoading.value = false
    }
  }

  const enhanceTreeData = (nodes: FolderNode[]): FolderNode[] => {
    return nodes.map((node) => ({
      ...node,
      isOpen: false,
      children: enhanceTreeData(node.children || []),
    }))
  }

  const selectFolder = async (folder: FolderNode) => {
    currentFolderId.value = folder.id
    folder.isOpen = true

    try {
      isLoading.value = true
      const [subs, files] = await Promise.all([
        explorerService.getFolderChildren(folder.id),
        explorerService.getFolderFiles(folder.id),
      ])

      currentSubFolders.value = subs
      currentFiles.value = files
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const performSearch = async () => {
    if (!searchQuery.value) return
    isLoading.value = true
    try {
      const result = await explorerService.search(searchQuery.value)
      currentSubFolders.value = result.folders
      currentFiles.value = result.files
      currentFolderId.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    folderTree,
    currentFolderId,
    currentSubFolders,
    currentFiles,
    isLoading,
    searchQuery,
    loadTree,
    selectFolder,
    performSearch,
  }
}
