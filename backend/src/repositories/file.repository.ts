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

  async getAllFilesInTree(folderId: string): Promise<FileModel[]> {
    const query = sql<FileModel>`
      WITH RECURSIVE folder_tree AS (
          SELECT id
          FROM folders
          WHERE id = ${folderId} -- Drizzle handles safe interpolation here!

          UNION ALL

          SELECT f.id
          FROM folders f
          INNER JOIN folder_tree ft ON f.parent_id = ft.id
      )
      SELECT
        -- You must explicitly select all columns you need for the result to match FileModel
        ${files.id},
        ${files.name},
        ${files.folderId},
        ${files.size},
        ${files.mimeType},
        ${files.createdAt},
        ${files.updatedAt}
      FROM ${files}
      WHERE ${files.folderId} IN (SELECT id FROM folder_tree)
      ORDER BY ${files.createdAt} DESC;
  `;
    const rawResult = await db.execute(query);

    return (rawResult as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      folderId: String(row.folderId),
      size: row.size === null ? 0 : Number(row.size),
      mimeType: row.mimeType === null ? null : String(row.mimeType),
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    })) as FileModel[];
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
