
import React from "react";
import { ExportFileservice } from "../../services/exportFile-service/export-file-service";
const ExportToExcel = () => {
  console.log("running");
  ExportFileservice.exportFileDownload().then((resp) => {
    console.log(resp);
  });
  return (
    <button onClick={ExportToExcel} className="btn btn-sm btn-primary ">
      <i class="fa fa-file-excel-o mr-1" aria-hidden="true"></i>
      Export
    </button>
  );
};
export default ExportToExcel;
