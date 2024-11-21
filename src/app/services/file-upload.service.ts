import { Injectable } from '@angular/core';
import { PreviousAssignment } from '../models/assignment.model';
import { Employee } from '../models/employee.model';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  generateAssignments(employees:any, previousAssignments:any): PreviousAssignment[] {
    if (!employees || employees.length < 2) {
      throw new Error('At least two employees are required for Secret Santa.');
    }

    const unassigned = [...employees];
    const assigned = new Set();
    const previousMap = new Map(
      previousAssignments.map((item: any) => [item.Employee_EmailID, item.Secret_Child_EmailID])
    );
    console.log(previousMap)
    let newAssignments = employees.map((employee:any) => {
      const employeeEmail = employee.Employee_EmailID;

      // Filter valid candidates for assignment
      const candidates = unassigned.filter((candidate) =>
        candidate.Employee_EmailID !== employeeEmail &&
        previousMap.get(employeeEmail) !== candidate.Employee_EmailID
      );
      console.log(candidates)
      if (candidates.length === 0) {
        throw new Error('Cannot generate unique Secret Santa assignments. Please try again.');
      }

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      unassigned.splice(unassigned.indexOf(chosen), 1); // Remove from unassigned
      assigned.add(chosen.Employee_EmailID);

      return {
        Employee_Name: employee.Employee_Name,
        Employee_EmailID: employee.Employee_EmailID,
        Secret_Child_Name: chosen.Employee_Name,
        Secret_Child_EmailID: chosen.Employee_EmailID,
      };
    });
    return newAssignments;
  }


  parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        resolve(jsonData);
      };
      reader.onerror = () => reject('Error reading the Excel file.');
      reader.readAsArrayBuffer(file);
    });
  }

  
}
