import { describe, expect, it, mock, beforeEach } from "bun:test";
import { FileService } from "./file.service";
import { filesRepository } from "../../repositories/file.repository";
import { folderRepository } from "../../repositories/folder.repository";
import { FileModel } from "../../types/file.type";

const mockFilesRepo = {
  getFileById: mock(),
  getFilesByFolderId: mock(),
  createFile: mock(),
  updateFile: mock(),
  deleteFile: mock(),
};

const mockFolderRepo = {
  getById: mock(),
};

Object.assign(filesRepository, mockFilesRepo);
Object.assign(folderRepository, mockFolderRepo);

describe("FileService", () => {
  const service = new FileService();

  const createMockFile = (overrides: Partial<FileModel> = {}): FileModel => ({
    id: "file-1",
    name: "test.txt",
    folderId: "folder-1",
    size: 1024,
    mimeType: "text/plain",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    mockFilesRepo.getFileById.mockReset();
    mockFilesRepo.getFilesByFolderId.mockReset();
    mockFilesRepo.createFile.mockReset();
    mockFilesRepo.updateFile.mockReset();
    mockFilesRepo.deleteFile.mockReset();
    mockFolderRepo.getById.mockReset();
  });

  describe("getFileById", () => {
    it("should return file if exists", async () => {
      const mockFile = createMockFile();
      mockFilesRepo.getFileById.mockResolvedValue(mockFile);

      const result = await service.getFileById("file-1");
      expect(result).toEqual(mockFile);
      expect(mockFilesRepo.getFileById).toHaveBeenCalledWith("file-1");
    });

    it("should return null if not found", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(null);
      const result = await service.getFileById("missing");
      expect(result).toBeNull();
    });
  });

  describe("getFilesByFolderId", () => {
    it("should return list of files", async () => {
      const files = [createMockFile(), createMockFile({ id: "file-2" })];
      mockFilesRepo.getFilesByFolderId.mockResolvedValue(files);

      const result = await service.getFilesByFolderId("folder-1");
      expect(result).toEqual(files);
      expect(mockFilesRepo.getFilesByFolderId).toHaveBeenCalledWith("folder-1");
    });
  });

  describe("createFile", () => {
    it("should throw error if name is empty", async () => {
      expect(
        service.createFile({ name: "   ", folderId: "f1" })
      ).rejects.toThrow("File name cannot be empty.");
    });

    it("should throw error if target folder does not exist", async () => {
      mockFolderRepo.getById.mockResolvedValue(null); // Folder not found

      expect(
        service.createFile({ name: "test.pdf", folderId: "missing-folder" })
      ).rejects.toThrow("Target folder does not exist.");
    });

    it("should create file if input is valid", async () => {
      mockFolderRepo.getById.mockResolvedValue({ id: "f1", name: "Docs" }); // Folder exists
      const newFile = createMockFile({ name: "test.pdf", folderId: "f1" });
      mockFilesRepo.createFile.mockResolvedValue(newFile);

      const input = { name: "test.pdf", folderId: "f1", size: 500 };
      const result = await service.createFile(input);

      expect(result).toEqual(newFile);
      expect(mockFilesRepo.createFile).toHaveBeenCalledWith({
        name: "test.pdf",
        folderId: "f1",
        mimeType: null,
        size: 500,
      });
    });
  });

  describe("renameFile", () => {
    it("should throw error if file not found", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(null);
      expect(service.renameFile("missing", "newname.txt")).rejects.toThrow(
        "File not found."
      );
    });

    it("should call update if file exists", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(createMockFile());

      await service.renameFile("file-1", "renamed.txt");

      expect(mockFilesRepo.updateFile).toHaveBeenCalledWith("file-1", {
        name: "renamed.txt",
      });
    });
  });

  describe("moveFile", () => {
    it("should throw error if file not found", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(null);
      expect(service.moveFile("missing", "folder-2")).rejects.toThrow(
        "File not found."
      );
    });

    it("should throw error if target folder does not exist", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(createMockFile());
      mockFolderRepo.getById.mockResolvedValue(null); // Target folder missing

      expect(service.moveFile("file-1", "bad-folder")).rejects.toThrow(
        "Target folder does not exist."
      );
    });

    it("should call update if valid", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(createMockFile());
      mockFolderRepo.getById.mockResolvedValue({ id: "folder-2" });

      await service.moveFile("file-1", "folder-2");

      expect(mockFilesRepo.updateFile).toHaveBeenCalledWith("file-1", {
        folderId: "folder-2",
      });
    });
  });

  describe("deleteFile", () => {
    it("should throw error if file not found", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(null);
      expect(service.deleteFile("missing")).rejects.toThrow("File not found.");
    });

    it("should delete file if exists", async () => {
      mockFilesRepo.getFileById.mockResolvedValue(createMockFile());

      await service.deleteFile("file-1");

      expect(mockFilesRepo.deleteFile).toHaveBeenCalledWith("file-1");
    });
  });
});
