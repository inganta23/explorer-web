import { HttpError } from "../utils/http-error";
import { fileService } from "../services/file/file.service";
import { FileModel } from "../types/file.type";

export class FileController {
  async getFileById(id: string): Promise<FileModel> {
    if (!id) throw new HttpError(400, "id is required");
    const file = await fileService.getFileById(id);
    if (!file) throw new HttpError(404, "File not found");
    return file;
  }

  async getFilesByFolderId(folderId: string): Promise<FileModel[]> {
    if (!folderId) throw new HttpError(400, "folderId is required");
    return fileService.getFilesByFolderId(folderId);
  }

  async createFile(input: {
    name: string;
    folderId: string;
    mimeType?: string | null;
    size?: number;
  }): Promise<FileModel> {
    if (!input || typeof input.name !== "string" || !input.folderId)
      throw new HttpError(400, "Invalid payload");
    return fileService.createFile({
      name: input.name,
      folderId: input.folderId,
      mimeType: input.mimeType ?? null,
      size: input.size ?? 0,
    });
  }

  async deleteFile(id: string): Promise<{ success: true }> {
    if (!id) throw new HttpError(400, "id is required");
    await fileService.deleteFile(id);
    return { success: true };
  }
}
