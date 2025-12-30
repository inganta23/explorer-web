import { db } from "../db";
import { files } from "../db/schema";
import { desc, eq, sql, asc } from "drizzle-orm";
import { FileModel } from "../types/file.type";

export class FilesRepository {
  async getFilesByFolderId(folderId: string): Promise<FileModel[]> {
    const rows = await db
      .select()
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(desc(files.createdAt));

    return rows as FileModel[];
  }

  async getFileById(id: string): Promise<FileModel | null> {
    const [row] = await db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .limit(1);

    return (row ?? null) as FileModel | null;
  }

  async createFile(input: {
    name: string;
    folderId: string;
    size?: number;
    mimeType?: string | null;
  }): Promise<FileModel> {
    const [created] = await db
      .insert(files)
      .values({
        name: input.name,
        folderId: input.folderId,
        size: input.size ?? 0,
        mimeType: input.mimeType ?? null,
      })
      .returning();

    return created as FileModel;
  }

  async updateFile(
    id: string,
    updates: {
      name?: string;
      folderId?: string;
      size?: number;
      mimeType?: string | null;
    }
  ): Promise<FileModel | null> {
    const [updated] = await db
      .update(files)
      .set({
        ...updates,
      })
      .where(eq(files.id, id))
      .returning();

    return (updated ?? null) as FileModel | null;
  }

  async deleteFile(id: string): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }
  
  async searchFiles(query: string): Promise<FileModel[]> {
    const rows = await db
      .select()
      .from(files)
      .where(sql`${files.name} ILIKE ${`%${query}%`}`)
      .orderBy(desc(files.createdAt));

    return rows as FileModel[];
  }
}

export const filesRepository = new FilesRepository();
