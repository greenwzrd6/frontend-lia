/**
 * Raw node item DTO returned by the TOJ `getnodeitems` endpoint.
 * Field names keep the API's PascalCase serialization.
 */
export type NodeType = {
  Id: string;
  ProjectId: string;
  ParentId: string | null;
  Type: number;
  Number: string | null,
  Title: string;
  Status: number;
};