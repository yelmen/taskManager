export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  status: number;
  createDate:string;
  lastUpdateDate:string;
  fromId:number;
  fromName:string;
}
