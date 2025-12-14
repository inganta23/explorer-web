import {
  pgTable,
  uuid,
  text,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { folders } from "./folder";

export const files = pgTable(
  "files",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    folderId: uuid("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    size: bigint("size", { mode: "number" }).default(sql`0`),
    mimeType: text("mime_type"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      folderIdIdx: index("idx_files_folder_id").on(table.folderId),
    };
  }
);
