declare module 'xlsx' {
  interface IUtils {
    // Sheet creation
    aoa_to_sheet(data: any[][], opts?: any): any;
    json_to_sheet(data: any[], opts?: any): any;
    
    // Sheet conversion
    sheet_to_csv(worksheet: any, opts?: any): string;
    sheet_to_json(worksheet: any, opts?: any): any[];
    
    // Workbook operations
    book_new(): any;
    book_append_sheet(workbook: any, worksheet: any, name?: string): any;
    
    // Sheet manipulation
    sheet_add_aoa(worksheet: any, data: any[][], opts?: any): any;
    sheet_add_json(worksheet: any, data: any[], opts?: any): any;
  }

  interface Workbook {
    SheetNames: string[];
    Sheets: { [sheet: string]: any };
  }

  interface XLSX {
    // Main utils object containing all utility functions
    utils: IUtils;
    
    // File operations
    writeFile(workbook: any, filename: string): void;
    read(data: any, opts?: { type: string }): Workbook;
  }

  const XLSX: XLSX;
  export = XLSX;
  export as namespace XLSX;
}
