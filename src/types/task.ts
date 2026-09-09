export type TaskType = {
  Id: string;
  ProjectId: string;
  ParentId: string | null;
  Type: number;
  Number: string | null,
  Title: string;
  Status: number;
};