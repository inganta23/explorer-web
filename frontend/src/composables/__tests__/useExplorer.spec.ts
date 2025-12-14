import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useExplorer } from '../useExplorer'
import { explorerService } from '@/api/explorerService'

vi.mock('@/api/explorerService', () => ({
  explorerService: {
    getFolderTree: vi.fn(),
    getFolderChildren: vi.fn(),
    getFolderFiles: vi.fn(),
  },
}))

describe('useExplorer Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loadTree should fetch and enhance data', async () => {
    const mockTree = [{ id: '1', name: 'Root', parentId: null, children: [] }]
    ;(explorerService.getFolderTree as any).mockResolvedValue(mockTree)

    const { loadTree, folderTree } = useExplorer()
    await loadTree()

    expect(folderTree.value).toHaveLength(1)
    expect(folderTree.value[0]!.name).toBe('Root')
    expect(folderTree.value[0]!.isOpen).toBe(false)
  })

  it('selectFolder should fetch children and files', async () => {
    const { selectFolder, currentSubFolders, currentFiles, currentFolderId } = useExplorer()

    ;(explorerService.getFolderChildren as any).mockResolvedValue([{ id: '2', name: 'Child' }])
    ;(explorerService.getFolderFiles as any).mockResolvedValue([{ id: 'f1', name: 'File.txt' }])

    const folder = { id: '1', name: 'Root', children: [], isOpen: false }

    await selectFolder(folder as any)

    expect(currentFolderId.value).toBe('1')
    expect(folder.isOpen).toBe(true)
    expect(currentSubFolders.value).toHaveLength(1)
    expect(currentFiles.value).toHaveLength(1)
  })
})
