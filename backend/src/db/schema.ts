import { folders } from "../schemas/folder";
import { files } from "../schemas/file";

// Export everything together for easy consumption in the main application

export * from "../schemas/folder";
export * from "../schemas/file";

const schema = {
  folders,
  files,
};

export default schema;
