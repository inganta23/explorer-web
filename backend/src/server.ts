import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

import { folderRoutes } from "./routes/folder.route";
import { fileRoutes } from "./routes/file.route";
import { HttpError } from "./utils/http-error";

const PORT = process.env.PORT || 3000;
export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Windows Explorer API",
          version: "1.0.0",
        },
      },
    })
  )
  .onError(({ error, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status;
      return { error: error.message };
    }

    console.error("Unhandled error:", error);
    set.status = 500;
    return { error: "Internal Server Error" };
  })

  .get("/", () => ({
    message: "Backend is running",
  }))

  .use(folderRoutes)
  .use(fileRoutes)

  .listen(PORT);

console.log(`Backend running at http://localhost:${PORT}`);
console.log(`Swagger: http://localhost:${PORT}/swagger`);
