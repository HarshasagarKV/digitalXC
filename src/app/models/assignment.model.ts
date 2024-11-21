import { Employee } from "./employee.model";

export interface PreviousAssignment extends Employee {
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}