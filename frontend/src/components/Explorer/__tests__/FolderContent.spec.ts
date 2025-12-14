import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FolderContent from '../FolderContent.vue'
import type { FolderNode, FileModel } from '@/types/explorer'

describe('FolderContent.vue', () => {
  const mockFolder: FolderNode = {
    id: 'f1',
    name: 'Work',
    parentId: null,
    children: [],
  }

  const mockFile: FileModel = {
    id: 'file1',
    name: 'resume.pdf',
    folderId: 'f1',
    size: 1024,
    mimeType: 'pdf',
    updatedAt: '',
  }

  it('renders loading state correctly', () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [],
        files: [],
        isLoading: true,
      },
    })

    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('.grid').exists()).toBe(false)
  })

  it('renders empty state correctly', () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [],
        files: [],
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Folder is empty')
  })

  it('renders folders and files when provided', () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [mockFolder],
        files: [mockFile],
        isLoading: false,
      },
    })

    expect(wrapper.text()).toContain('Work')
    expect(wrapper.find('.item.folder').exists()).toBe(true)

    expect(wrapper.text()).toContain('resume.pdf')
    expect(wrapper.find('.item.file').exists()).toBe(true)
  })

  it('selects an item on single click (Highlighting)', async () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [mockFolder],
        files: [],
        isLoading: false,
      },
    })

    const folderItem = wrapper.find('.item.folder')

    expect(folderItem.classes()).not.toContain('is-selected')

    await folderItem.trigger('click')

    expect(folderItem.classes()).toContain('is-selected')
  })

  it('emits "open-folder" on double click', async () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [mockFolder],
        files: [],
        isLoading: false,
      },
    })

    await wrapper.find('.item.folder').trigger('dblclick')

    expect(wrapper.emitted()).toHaveProperty('open-folder')
    expect(wrapper.emitted('open-folder')![0]).toEqual([mockFolder])
  })

  it('deselects when clicking empty background', async () => {
    const wrapper = mount(FolderContent, {
      props: {
        folders: [mockFolder],
        files: [],
        isLoading: false,
      },
    })

    const folderItem = wrapper.find('.item.folder')

    await folderItem.trigger('click')
    expect(folderItem.classes()).toContain('is-selected')

    await wrapper.find('.content-panel').trigger('click')

    expect(folderItem.classes()).not.toContain('is-selected')
  })
})
