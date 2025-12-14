import { HttpError } from "../utils/http-error";
import { folderService } from "../services/folder/folder.service";
import { FolderModel } from "../repositories/folder.repository";
import { FileModel } from "../repositories/file.repository";

export class FolderController {
  async getFolderById(id: string): Promise<FolderModel> {
    if (!id) throw new HttpError(400, "id is required");
    const folder = await folderService.getFolderById(id);
    if (!folder) throw new HttpError(404, "Folder not found");
    return folder;
  }

  async getChildren(id: string): Promise<FolderModel[]> {
    if (!id) throw new HttpError(400, "id is required");
    return folderService.getChildren(id);
  }

  async createFolder(input: {
    name: string;
    parentId?: string | null;
  }): Promise<FolderModel> {
    if (!input || typeof input.name !== "string")
      throw new HttpError(400, "Invalid payload");
    const payload = { name: input.name, parentId: input.parentId ?? null };
    return folderService.createFolder(payload);
  }

  async updateFolder(
    id: string,
    input: { name?: string; parentId?: string | null }
  ): Promise<FolderModel> {
    if (!id) throw new HttpError(400, "id is required");
    const updated = await folderService.updateFolder(id, input);
    if (!updated) throw new HttpError(404, "Folder not found");
    return updated;
  }

  async deleteFolder(id: string): Promise<{ success: true }> {
    if (!id) throw new HttpError(400, "id is required");
    await folderService.deleteFolder(id);
    return { success: true };
  }

  async buildTree() {
    return folderService.buildTree();
  }

  async search(
    query: string
  ): Promise<{ folders: FolderModel[]; files: FileModel[] }> {
    if (!query || !query.trim()) throw new HttpError(400, "Query is required");
    return folderService.search(query);
  }
}
