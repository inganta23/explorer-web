import { Elysia, t } from "elysia";
import { FileController } from "../controllers/file.controller";

const fileController = new FileController();

export const fileRoutes = (app: Elysia) =>
  app
    .get(
      "/api/v1/files/:id",
      ({ params }) => {
        return fileController.getFileById(params.id);
      },
      {
        detail: {
          summary: "Get a file by ID",
          tags: ["Files"],
        },
      }
    )

    .get(
      "/api/v1/folders/:id/files",
      ({ params }) => {
        return fileController.getFilesByFolderId(params.id);
      },
      {
        detail: {
          summary: "Get files under a folder",
          tags: ["Files"],
        },
      }
    )

    .post(
      "/api/v1/files",
      async ({ body }) => {
        return fileController.createFile(body as any);
      },
      {
        body: t.Object({
          name: t.String(),
          folderId: t.String(),
          mimeType: t.Optional(t.Union([t.String(), t.Null()])),
          size: t.Optional(t.Number()),
        }),
        detail: {
          summary: "Create new file",
          tags: ["Files"],
        },
      }
    )

    .delete(
      "/api/v1/files/:id",
      async ({ params }) => {
        return fileController.deleteFile(params.id);
      },
      {
        detail: {
          summary: "Delete file",
          tags: ["Files"],
        },
      }
    );
