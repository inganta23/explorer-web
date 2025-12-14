import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test";
import { FolderService } from "./folder.service";
import { folderRepository } from "../../repositories/folder.repository";
import { filesRepository } from "../../repositories/file.repository";

const mockFolderRepo = {
  getById: mock(),
  getChildren: mock(),
  createFolder: mock(),
  updateFolder: mock(),
  deleteFolder: mock(),
  getAll: mock(),
  searchFolders: mock(),
};

const mockFileRepo = {
  searchFiles: mock(),
};

Object.assign(folderRepository, mockFolderRepo);
Object.assign(filesRepository, mockFileRepo);

describe("FolderService", () => {
  const service = new FolderService();

  beforeEach(() => {
    mockFolderRepo.getById.mockReset();
    mockFolderRepo.getChildren.mockReset();
    mockFolderRepo.createFolder.mockReset();
    mockFolderRepo.updateFolder.mockReset();
    mockFolderRepo.deleteFolder.mockReset();
    mockFolderRepo.getAll.mockReset();
    mockFolderRepo.searchFolders.mockReset();
    mockFileRepo.searchFiles.mockReset();
  });

  describe("createFolder", () => {
    it("should throw error if name is empty", async () => {
      expect(
        service.createFolder({ name: "   ", parentId: null })
      ).rejects.toThrow("Folder name cannot be empty.");
    });

    it("should throw error if parent folder does not exist", async () => {
      mockFolderRepo.getById.mockResolvedValue(null);

      expect(
        service.createFolder({
          name: "New Folder",
          parentId: "non-existent-id",
        })
      ).rejects.toThrow("Parent folder does not exist");

      expect(mockFolderRepo.getById).toHaveBeenCalledWith("non-existent-id");
    });

    it("should create folder if input is valid (Root)", async () => {
      const newFolder = {
        id: "1",
        name: "Docs",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockFolderRepo.createFolder.mockResolvedValue(newFolder);

      const result = await service.createFolder({ name: "Docs", parentId: "" });

      expect(result).toEqual(newFolder);
      expect(mockFolderRepo.createFolder).toHaveBeenCalledWith("Docs", null);
    });
  });

  describe("updateFolder", () => {
    it("should throw error if folder being updated does not exist", async () => {
      mockFolderRepo.getById.mockResolvedValue(null);

      expect(service.updateFolder("id", { name: "New" })).rejects.toThrow(
        "Folder not found."
      );
    });

    it("should throw error if target parent does not exist", async () => {
      mockFolderRepo.getById
        .mockResolvedValueOnce({ id: "folder-id" })
        .mockResolvedValueOnce(null);

      expect(
        service.updateFolder("folder-id", { parentId: "bad-parent" })
      ).rejects.toThrow("Target parent does not exist.");
    });

    it("should throw error if trying to be its own parent", async () => {
      mockFolderRepo.getById.mockResolvedValue({ id: "folder-id" });

      expect(
        service.updateFolder("folder-id", { parentId: "folder-id" })
      ).rejects.toThrow("Folder cannot be its own parent.");
    });

    it("should throw error if moving into its own descendant", async () => {
      const folder = { id: "A" };
      const child = { id: "B", parentId: "A" };

      mockFolderRepo.getById.mockResolvedValue(folder);
      mockFolderRepo.getById.mockResolvedValue(child);

      mockFolderRepo.getChildren.mockResolvedValue([child]);

      expect(service.updateFolder("A", { parentId: "B" })).rejects.toThrow(
        "Cannot move folder into its own descendant."
      );
    });

    it("should update folder successfully", async () => {
      const folder = { id: "A", name: "Old" };
      mockFolderRepo.getById.mockResolvedValue(folder);
      mockFolderRepo.updateFolder.mockResolvedValue({ ...folder, name: "New" });

      const result = await service.updateFolder("A", { name: "New" });

      expect(result?.name).toBe("New");
      expect(mockFolderRepo.updateFolder).toHaveBeenCalledWith("A", {
        name: "New",
      });
    });
  });

  describe("deleteFolder", () => {
    it("should throw if folder missing", async () => {
      mockFolderRepo.getById.mockResolvedValue(null);
      expect(service.deleteFolder("missing")).rejects.toThrow(
        "Folder not found"
      );
    });

    it("should call repo delete if exists", async () => {
      mockFolderRepo.getById.mockResolvedValue({ id: "1" });
      await service.deleteFolder("1");
      expect(mockFolderRepo.deleteFolder).toHaveBeenCalledWith("1");
    });
  });

  describe("buildTree", () => {
    it("should construct a tree from flat list", async () => {
      const flatList = [
        { id: "1", name: "Root", parentId: null },
        { id: "2", name: "Child", parentId: "1" },
        { id: "3", name: "Grandchild", parentId: "2" },
      ];
      mockFolderRepo.getAll.mockResolvedValue(flatList);

      const tree = await service.buildTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe("1");

      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe("2");

      expect(tree[0].children[0].children).toHaveLength(1);
      expect(tree[0].children[0].children[0].id).toBe("3");
    });
  });

  describe("search", () => {
    it("should return empty if query is empty", async () => {
      const result = await service.search("  ");
      expect(result.folders).toBeEmpty();
      expect(result.files).toBeEmpty();
      expect(mockFolderRepo.searchFolders).not.toHaveBeenCalled();
    });

    it("should combine folder and file results", async () => {
      mockFolderRepo.searchFolders.mockResolvedValue([{ id: "f1" }]);
      mockFileRepo.searchFiles.mockResolvedValue([{ id: "file1" }]);

      const result = await service.search("invoice");

      expect(result.folders).toHaveLength(1);
      expect(result.files).toHaveLength(1);
      expect(mockFolderRepo.searchFolders).toHaveBeenCalledWith("invoice");
      expect(mockFileRepo.searchFiles).toHaveBeenCalledWith("invoice");
    });
  });
});
