import { filesRepository } from "../../repositories/file.repository";
import { folderRepository } from "../../repositories/folder.repository";
import type {} from "../../repositories/folder.repository";
import { FileModel } from "../../types/file.type";
import { FolderModel, FolderNode } from "../../types/folder.type";

export class FolderService {
  async getFolderById(id: string): Promise<FolderModel | null> {
    return folderRepository.getById(id);
  }

  async getChildren(folderId: string): Promise<FolderModel[]> {
    return folderRepository.getChildren(folderId);
  }

  async getAllDescendants(folderId: string): Promise<FolderModel[]> {
    return folderRepository.getChildren(folderId);
  }

  async createFolder(input: {
    name: string;
    parentId: string | null;
  }): Promise<FolderModel> {
    if (!input.name.trim()) {
      throw new Error("Folder name cannot be empty.");
    }
    const parentId =
      input.parentId && input.parentId.trim() !== "" ? input.parentId : null;

    if (parentId) {
      const parent = await folderRepository.getById(parentId);
      if (!parent) {
        throw new Error("Parent folder does not exist.");
      }
    }

    return folderRepository.createFolder(input.name, parentId);
  }

  async updateFolder(
    id: string,
    input: { name?: string; parentId?: string | null }
  ): Promise<FolderModel | null> {
    const existing = await folderRepository.getById(id);
    if (!existing) {
      throw new Error("Folder not found.");
    }

    if (input.parentId) {
      const parent = await folderRepository.getById(input.parentId);
      if (!parent) {
        throw new Error("Target parent does not exist.");
      }

      if (input.parentId === id) {
        throw new Error("Folder cannot be its own parent.");
      }
    }

    if (input.parentId) {
      const descendants = await folderRepository.getChildren(id);
      const descendantIds = new Set(descendants.map((d) => d.id));
      if (descendantIds.has(input.parentId)) {
        throw new Error("Cannot move folder into its own descendant.");
      }
    }

    return folderRepository.updateFolder(id, input);
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await folderRepository.getById(id);
    if (!folder) {
      throw new Error("Folder not found.");
    }

    await folderRepository.deleteFolder(id);
  }

  async buildTree(): Promise<FolderNode[]> {
    const all = await folderRepository.getAll();

    const byParent: Record<string, FolderModel[]> = {};
    const root: FolderModel[] = [];

    for (const f of all) {
      if (!f.parentId) {
        root.push(f);
        continue;
      }
      byParent[f.parentId] = byParent[f.parentId] || [];
      byParent[f.parentId].push(f);
    }

    const attach = (nodes: FolderModel[]): FolderNode[] =>
      nodes.map((n): FolderNode => {
        const childrenFolders = byParent[n.id] || [];

        return {
          ...n,
          children: attach(childrenFolders),
        };
      });

    return attach(root);
  }

  async search(
    query: string
  ): Promise<{ folders: FolderModel[]; files: FileModel[] }> {
    if (!query.trim()) return { folders: [], files: [] };

    const folders = await folderRepository.searchFolders(query);
    const files = await filesRepository.searchFiles(query);

    return { folders, files };
  }
}

export const folderService = new FolderService();
