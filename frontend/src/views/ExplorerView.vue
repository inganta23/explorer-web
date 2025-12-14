<script setup lang="ts">
import { onMounted } from 'vue'
import { useExplorer } from '@/composables/useExplorer'
import FolderTreeItem from '@/components/Explorer/FolderTreeItem.vue'
import FolderContent from '@/components/Explorer/FolderContent.vue'

const {
  folderTree,
  loadTree,
  selectFolder,
  currentFolderId,
  currentSubFolders,
  currentFiles,
  isLoading,
  searchQuery,
  performSearch,
} = useExplorer()

onMounted(() => {
  loadTree()
})
</script>

<template>
  <div class="explorer-container">
    <header class="toolbar">
      <div class="title">My Explorer</div>
      <div class="search-box">
        <input
          v-model="searchQuery"
          @keyup.enter="performSearch"
          type="text"
          placeholder="Search folders or files..."
        />
        <button @click="performSearch">🔍</button>
      </div>
    </header>

    <main class="split-view">
      <aside class="left-panel">
        <div class="tree-root">
          <FolderTreeItem
            v-for="node in folderTree"
            :key="node.id"
            :node="node"
            :activeId="currentFolderId"
            :depth="0"
            @select="selectFolder"
          />
        </div>
      </aside>

      <section class="right-panel">
        <FolderContent
          :folders="currentSubFolders"
          :files="currentFiles"
          :isLoading="isLoading"
          @open-folder="selectFolder"
        />
      </section>
    </main>
  </div>
</template>

<style>
.explorer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  height: 50px;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}

.search-box {
  display: flex;
  gap: 5px;
}
.search-box input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.split-view {
  display: flex;
  flex: 1;
  overflow: hidden; /* Prevent full page scroll, allow panels to scroll */
}

.left-panel {
  width: 250px;
  min-width: 200px;
  border-right: 1px solid #ddd;
  background: #fff;
  overflow-y: auto;
  padding: 10px 0;
  resize: horizontal; /* Bonus: resizable panel */
}

.right-panel {
  flex: 1;
  background: #fff;
  overflow-y: auto;
}
</style>
