import { db } from "../db";
import { folders } from "../schemas/folder";
import { eq, isNull, sql } from "drizzle-orm";
import { FolderModel } from "../types/folder.type";

export class FolderRepository {
  async getById(id: string) {
    const result = await db.select().from(folders).where(eq(folders.id, id));
    return result[0] ?? null;
  }

  async getAll(): Promise<FolderModel[]> {
    const allFolders = await db.select().from(folders);
    return allFolders as FolderModel[];
  }

  async getChildren(parentId: string | null) {
    if (!parentId) {
      return await db.select().from(folders).where(isNull(folders.parentId));
    }

    return await db
      .select()
      .from(folders)
      .where(eq(folders.parentId, parentId));
  }

  async createFolder(name: string, parentId: string | null = null) {
    const result = await db
      .insert(folders)
      .values({
        name,
        parentId,
      })
      .returning();

    return result[0];
  }

  async updateFolder(
    id: string,
    payload: {
      name?: string;
      parentId?: string | null;
    }
  ) {
    const result = await db
      .update(folders)
      .set(payload)
      .where(eq(folders.id, id))
      .returning();

    return result[0];
  }

  async deleteFolder(id: string) {
    await db.delete(folders).where(eq(folders.id, id));
  }

  async buildTree() {
    const all = await db.select().from(folders);

    const map = new Map<string | null, any[]>();

    all.forEach((f) => {
      const key = f.parentId ?? null;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        ...f,
        children: [],
      });
    });

    const attach = (node: any) => {
      const children = map.get(node.id) ?? [];
      node.children = children;
      children.forEach(attach);
    };

    const roots = map.get(null) ?? [];

    roots.forEach(attach);

    return roots;
  }

  async searchFolders(query: string) {
    return db
      .select()
      .from(folders)
      .where(sql`${folders.name} ILIKE ${`%${query}%`}`);
  }
}

export const folderRepository = new FolderRepository();
