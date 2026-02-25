export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  status?: string;
  remarks?: string;
  createdOn: Date;
  lastUpdatedOn?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
}
