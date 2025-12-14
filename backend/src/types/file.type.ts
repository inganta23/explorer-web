export interface FileModel {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
}
