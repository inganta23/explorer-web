import { Elysia, t } from "elysia";
import { FolderController } from "../controllers/folder.controller";

const folderController = new FolderController();

export const folderRoutes = (app: Elysia) =>
  app
    .get("/api/v1/folders/tree", () => folderController.buildTree(), {
      detail: {
        summary: "Get full folder tree",
        tags: ["Folders"],
      },
    })

    .get(
      "/api/v1/folders/:id",
      ({ params }) => {
        return folderController.getFolderById(params.id);
      },
      {
        detail: {
          summary: "Get folder by ID",
          tags: ["Folders"],
        },
      }
    )

    .get(
      "/api/v1/folders/:id/children",
      ({ params }) => {
        return folderController.getChildren(params.id);
      },
      {
        detail: {
          summary: "Get direct children of folder",
          tags: ["Folders"],
        },
      }
    )

    .post(
      "/api/v1/folders",
      async ({ body }) => {
        return folderController.createFolder(body as any);
      },
      {
        body: t.Object({
          name: t.String(),
          parentId: t.Optional(t.Union([t.String(), t.Null()])),
        }),
        detail: {
          summary: "Create folder",
          tags: ["Folders"],
        },
      }
    )

    .put(
      "/api/v1/folders/:id",
      async ({ params, body }) => {
        return folderController.updateFolder(params.id, body as any);
      },
      {
        body: t.Object({
          name: t.Optional(t.String()),
          parentId: t.Optional(t.Union([t.String(), t.Null()])),
        }),
        detail: {
          summary: "Update folder (rename/move)",
          tags: ["Folders"],
        },
      }
    )

    .delete(
      "/api/v1/folders/:id",
      async ({ params }) => {
        await folderController.deleteFolder(params.id);
        return { success: true };
      },
      {
        detail: {
          summary: "Delete folder",
          tags: ["Folders"],
        },
      }
    )

    .get(
      "/api/v1/folders/search",
      async ({ query }) => {
        const q = query.q as string;
        return folderController.search(q);
      },
      {
        query: t.Object({
          q: t.String(),
        }),
        detail: {
          summary: "Search folders and files by name",
          tags: ["Folders"],
        },
      }
    );
