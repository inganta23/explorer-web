import { describe, expect, it, beforeAll } from "bun:test";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { folderService } from "../services/folder/folder.service";
import { fileService } from "../services/file/file.service";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import { readdirSync } from "fs";

describe("Integration: File System Flow", () => {
  beforeAll(async () => {
    const dbUrl = process.env.DATABASE_URL || "";
    if (!dbUrl.includes("5433") && !dbUrl.includes("explorer_test_db")) {
      console.error("🚨 STOP! Wrong database:", dbUrl);
      process.exit(1);
    }

    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
    await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);

    const migrationPath = resolve(process.cwd(), "drizzle");
    const files = readdirSync(migrationPath);

    if (files.length === 0) {
      throw new Error("Migration folder is EMPTY!?");
    }

    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    console.log("Applying migrations from:", migrationPath);
    await migrate(db, { migrationsFolder: migrationPath });
  });

  let createdFolderId: string;

  it("1. Should create a real folder in DB", async () => {
    const folder = await folderService.createFolder({
      name: "Integration Docs",
      parentId: null,
    });

    expect(folder.id).toBeDefined();
    expect(folder.name).toBe("Integration Docs");

    createdFolderId = folder.id;
  });

  it("2. Should create a real file inside that folder", async () => {
    const file = await fileService.createFile({
      name: "contract.pdf",
      folderId: createdFolderId,
      size: 5000,
      mimeType: "application/pdf",
    });

    expect(file.id).toBeDefined();
    expect(file.folderId).toBe(createdFolderId);

    const dbFile = await fileService.getFileById(file.id);
    expect(dbFile).not.toBeNull();
    expect(dbFile?.name).toBe("contract.pdf");
  });

  it("3. Should prevent creating file in non-existent folder", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";

    expect(
      fileService.createFile({ name: "bad.txt", folderId: fakeId })
    ).rejects.toThrow("Target folder does not exist.");
  });

  it("4. Should retrieve children files correctly", async () => {
    const children = await fileService.getFilesByFolderId(createdFolderId);

    expect(children).toHaveLength(1);
    expect(children[0].name).toBe("contract.pdf");
  });

  it("5. Should support renaming the file", async () => {
    const children = await fileService.getFilesByFolderId(createdFolderId);
    const fileId = children[0].id;

    await fileService.renameFile(fileId, "contract_signed.pdf");

    const updated = await fileService.getFileById(fileId);
    expect(updated?.name).toBe("contract_signed.pdf");
  });
});
