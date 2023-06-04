import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const fileType =
  "application/vnd.msexcel-openxmlformats.spreadsheetml.sheet;charset=UTF-8";
// Desired file extesion
const fileExtension = ".xlsx";

let loading = false;



export const exportToSpreadsheet = (data, fileName, callback=()=>{} ) => {
  try {

    loading = true;
    callback(loading)
    //Create a new Work Sheet using the data stored in an Array of Arrays.
    const workSheet = XLSX.utils.aoa_to_sheet(data);
    // Generate a Work Book containing the above sheet.
    const workBook = {
      Sheets: { data: workSheet, cols: [] },
      SheetNames: ["data"],
    };
    // Exporting the file with the desired name and extension.
    const excelBuffer = XLSX.write(workBook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(fileData, fileName + fileExtension);
    // console.log('Excel file exported successfully.');


    // Set loading state to false after export is done
    loading = false;
    callback(loading)

    // console.log("loading", loading)
  } catch (error) {
    // console.error('An error occurred while exporting to Excel:', error);

    // Set loading state to false in case of an error
    loading = false;
    callback(loading)

    // console.log("loading", loading)

  }



};
