import { db } from "./index";
import { folders, files } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const [docs] = await db
    .insert(folders)
    .values({
      name: "Documents",
      parentId: null,
    })
    .returning();

  const [pics] = await db
    .insert(folders)
    .values({
      name: "Pictures",
      parentId: null,
    })
    .returning();

  await db.insert(folders).values([
    { name: "Work", parentId: docs.id },
    { name: "Personal", parentId: docs.id },
    { name: "Vacation 2024", parentId: pics.id },
  ]);

  await db.insert(files).values({
    name: "tes.pdf",
    folderId: docs.id,
    mimeType: "application/pdf",
    size: 1024,
  });

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
