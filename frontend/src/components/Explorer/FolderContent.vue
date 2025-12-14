<script setup lang="ts">
import type { FolderNode, FileModel } from '@/types/explorer'
import { ref } from 'vue'

defineProps<{
  folders: FolderNode[]
  files: FileModel[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'open-folder', folder: FolderNode): void
}>()

const selectedId = ref<string | null>(null)

const handleSingleClick = (id: string) => {
  selectedId.value = id
}

const handleDoubleClick = (folder: FolderNode) => {
  emit('open-folder', folder)
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="content-panel" @click="selectedId = null">
    <div v-if="isLoading" class="loading">Loading...</div>

    <div v-else>
      <div v-if="folders.length > 0" class="section">
        <h3>Folders</h3>
        <div class="grid">
          <div
            v-for="folder in folders"
            :key="folder.id"
            class="item folder"
            :class="{ 'is-selected': selectedId === folder.id }"
            @click.stop="handleSingleClick(folder.id)"
            @dblclick.stop="handleDoubleClick(folder)"
          >
            <div class="icon">📁</div>
            <div class="name">{{ folder.name }}</div>
          </div>
        </div>
      </div>

      <div v-if="files.length > 0" class="section">
        <h3>Files</h3>
        <div class="grid">
          <div
            v-for="file in files"
            :key="file.id"
            class="item file"
            :class="{ 'is-selected': selectedId === file.id }"
            @click.stop="handleSingleClick(file.id)"
          >
            <div class="icon">📄</div>
            <div class="details">
              <div class="name">{{ file.name }}</div>
              <div class="meta">{{ formatSize(file.size || 0) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="folders.length === 0 && files.length === 0" class="empty-state">
        Folder is empty
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-panel {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}
.section {
  margin-bottom: 30px;
}
h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}
.item:hover {
  background-color: #f0f9ff;
  border-color: #bae6fd;
}
.icon {
  font-size: 40px;
  margin-bottom: 5px;
}
.name {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
}
.meta {
  font-size: 10px;
  color: #999;
}
.empty-state {
  text-align: center;
  color: #999;
  margin-top: 50px;
}
.item.is-selected {
  background-color: #cce5ff;
  border-color: #99c2ff;
}
</style>
