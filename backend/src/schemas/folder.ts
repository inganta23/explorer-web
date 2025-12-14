import {
  pgTable,
  uuid,
  text,
  timestamp,
  bigint,
  index,
  PgColumn,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const folders = pgTable(
  "folders",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => folders.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      parentIdIdx: index("idx_folders_parent_id").on(table.parentId),
      nameIdx: index("idx_folders_name").on(table.name),
    };
  }
);
