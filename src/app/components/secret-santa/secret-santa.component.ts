import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileUploadService } from 'src/app/services/file-upload.service';


@Component({
  selector: 'app-secret-santa',
  templateUrl: './secret-santa.component.html',
  styleUrls: ['./secret-santa.component.css']
})
export class SecretSantaComponent implements OnInit {

  constructor(private fileService:FileUploadService) { }

  ngOnInit(): void {
  }

  employees: any[] = [];
  previousAssignments: any[] = [];
  newAssignments: any[] = [];
  errorMessage: string = '';

  // Expected keys for validation
  expectedEmployeeKeys = ['Employee_Name', 'Employee_EmailID'];
  expectedPreviousKeys = ['Employee_Name', 'Employee_EmailID', 'Secret_Child_Name', 'Secret_Child_EmailID'];

  // Method to parse the uploaded CSV files
  onFileUpload(event: any, isPreviousAssignments: boolean): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Validate file structure
        const parsedData = sheetData as Record<string, any>[];

        const keys = Object.keys(parsedData[0] || {}); 
        const isValid = this.validateFile(keys, isPreviousAssignments);

        if (isValid) {
          if (isPreviousAssignments) {
            this.previousAssignments = sheetData;
          } else {
            this.employees = sheetData;
          }
          this.errorMessage = ''; // Clear error message on success
        } else {
          this.errorMessage = isPreviousAssignments
            ? 'Invalid file format for Previous Assignments. Ensure the file has the correct fields.'
            : 'Invalid file format for Employees. Ensure the file has the correct fields.';
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  validateFile(keys: string[], isPreviousAssignments: boolean): boolean {
    const expectedKeys = isPreviousAssignments ? this.expectedPreviousKeys : this.expectedEmployeeKeys;
    return expectedKeys.every((key) => keys.includes(key));
  }

  // Method to generate Secret Santa assignments
  generateAssignments() {
    if (this.employees.length === 0) {
      alert('Please upload the employees CSV file.');
      return;
    }
    this.newAssignments = this.fileService.generateAssignments(this.employees,this.previousAssignments);

  }

  // Method to download the new assignments as a CSV
  downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.newAssignments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Secret Santa Assignments');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'secret-santa-assignments.xlsx');
  }
  resetValues(): void {
    this.employees = [];
    this.previousAssignments = [];
    this.newAssignments = [];
  }
}