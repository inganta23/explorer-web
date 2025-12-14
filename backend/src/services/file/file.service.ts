import { filesRepository } from "../../repositories/file.repository";
import { folderRepository } from "../../repositories/folder.repository";
import { FileModel } from "../../types/file.type";

export class FileService {
  async getFileById(id: string): Promise<FileModel | null> {
    return filesRepository.getFileById(id);
  }

  async getFilesByFolderId(folderId: string): Promise<FileModel[]> {
    return filesRepository.getFilesByFolderId(folderId);
  }

  async createFile(input: {
    name: string;
    folderId: string;
    mimeType?: string | null;
    size?: number;
  }): Promise<FileModel> {
    if (!input.name.trim()) {
      throw new Error("File name cannot be empty.");
    }

    const folder = await folderRepository.getById(input.folderId);
    if (!folder) {
      throw new Error("Target folder does not exist.");
    }

    return filesRepository.createFile({
      name: input.name,
      folderId: input.folderId,
      mimeType: input.mimeType ?? null,
      size: input.size ?? 0,
    });
  }

  async renameFile(id: string, newName: string): Promise<void> {
    if (!newName.trim()) {
      throw new Error("File name cannot be empty.");
    }

    const existing = await filesRepository.getFileById(id);
    if (!existing) {
      throw new Error("File not found.");
    }

    await filesRepository.updateFile(id, { name: newName });
  }

  async moveFile(id: string, targetFolderId: string): Promise<void> {
    const file = await filesRepository.getFileById(id);
    if (!file) {
      throw new Error("File not found.");
    }

    const folder = await folderRepository.getById(targetFolderId);
    if (!folder) {
      throw new Error("Target folder does not exist.");
    }

    await filesRepository.updateFile(id, { folderId: targetFolderId });
  }

  async deleteFile(id: string): Promise<void> {
    const existing = await filesRepository.getFileById(id);
    if (!existing) {
      throw new Error("File not found.");
    }

    await filesRepository.deleteFile(id);
  }
}

export const fileService = new FileService();
