export type FolderModel = {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface FolderNode extends FolderModel {
  children: FolderNode[];
}
