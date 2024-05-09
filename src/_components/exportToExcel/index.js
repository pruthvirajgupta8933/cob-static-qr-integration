
import React from "react";
import { ExportFileservice } from "../../services/exportFile-service/export-file-service";
const ExportToExcel = () => {
  // console.log("running");
  ExportFileservice.exportFileDownload().then((resp) => {
    // console.log(resp);
  });
  return (
    <button onClick={ExportToExcel} className="btn btn-sm btn-primary cob-btn-primary ">
      <i className="fa fa-file-excel-o mr-1"ariaHidden="true"></i>
      Export
    </button>
  );
};
export default ExportToExcel;
