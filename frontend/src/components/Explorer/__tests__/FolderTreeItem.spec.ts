import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FolderTreeItem from '../FolderTreeItem.vue'

describe('FolderTreeItem.vue', () => {
  const mockNode = {
    id: '1',
    name: 'Documents',
    parentId: null,
    children: [],
    isOpen: false,
  }

  it('renders the folder name', () => {
    const wrapper = mount(FolderTreeItem, {
      props: {
        node: mockNode,
        activeId: null,
        depth: 0,
      },
    })

    expect(wrapper.text()).toContain('Documents')
  })

  it('emits "select" event when clicked', async () => {
    const wrapper = mount(FolderTreeItem, {
      props: {
        node: mockNode,
        activeId: null,
        depth: 0,
      },
    })

    await wrapper.find('.row').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('select')
    expect(wrapper.emitted('select')![0]).toEqual([mockNode])
  })

  it('shows active state class when activeId matches', () => {
    const wrapper = mount(FolderTreeItem, {
      props: {
        node: mockNode,
        activeId: '1',
        depth: 0,
      },
    })

    expect(wrapper.find('.row').classes()).toContain('is-active')
  })
})
