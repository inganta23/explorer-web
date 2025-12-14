<script setup lang="ts">
import type { FolderNode } from '@/types/explorer'

const props = defineProps<{
  node: FolderNode
  activeId: string | null
  depth: number
}>()

const emit = defineEmits<{
  (e: 'select', node: FolderNode): void
}>()

const toggleOpen = () => {
  props.node.isOpen = !props.node.isOpen
}

const handleSelect = () => {
  emit('select', props.node)
}
</script>

<template>
  <div class="tree-item">
    <div
      class="row"
      :class="{ 'is-active': activeId === node.id }"
      :style="{ paddingLeft: `${depth * 20}px` }"
      @click="handleSelect"
    >
      <span
        class="toggle-icon"
        @click.stop="toggleOpen"
        v-if="node.children && node.children.length > 0"
      >
        {{ node.isOpen ? '▼' : '▶' }}
      </span>
      <span class="spacer" v-else></span>

      <span class="folder-icon">📁</span>
      <span class="label">{{ node.name }}</span>
    </div>

    <div v-if="node.isOpen && node.children && node.children.length > 0">
      <FolderTreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :activeId="activeId"
        :depth="depth + 1"
        @select="(n) => emit('select', n)"
      />
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
}
.row:hover {
  background-color: #f3f4f6;
}
.row.is-active {
  background-color: #e0e7ff;
  color: #3730a3;
  font-weight: 500;
}
.toggle-icon {
  width: 20px;
  text-align: center;
  font-size: 10px;
  color: #666;
}
.spacer {
  width: 20px;
}
.folder-icon {
  margin-right: 8px;
}
.label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
