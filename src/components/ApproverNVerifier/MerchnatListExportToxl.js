import React, { useState, useEffect } from 'react'
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import { exportToSpreadsheet } from '../../utilities/exportToSpreadsheet';
import API_URL from '../../config';
import { CatchingPokemonSharp } from '@mui/icons-material';

const MerchnatListExportToxl = (props) => {
  const [isexcelDataLoaded, setIsexcelDataLoaded] = useState(false)

  const exportToExcelFn = async () => {
    setIsexcelDataLoaded(true)
    await axiosInstanceAuth.get(`${API_URL?.Export_FOR_MERCHANT_LIST}${props.URL}`).then((res) => {
      if (res.status === 200) {
        const data = res?.data;
        setIsexcelDataLoaded(false)
        // console.log(data)
        // const exportData = Object.keys(data);
        // // console.log(exportData, "export data ")


        // const excelHeaderRow = [
        //   "S.No",
        //   "Client Code",
        //   "Merchant Name",
        //   "Email",
        //   "Contact Number",
        //   "KYC Status",
        //   "Registered Date",
        //   "Onboard Type"

        // ];
        let excelArr = [];

        data?.map((item, index) => {
          // console.log("index",index)
          if(index===0){
            excelArr.push(Object.keys(item)) 
          }
          // const allowDataToShow = {
          //   srNo: item.srNo === null ? "" : index + 1,
          //   clientCode: item.clientCode === null ? "" : item.clientCode,
          //   clientName: item.clientName === null ? "" : item.clientName,
          //   emailId: item.emailId === null ? "" : item.emailId,
          //   contactNumber: item.contactNumber === null ? "" : item.contactNumber,
          //   status: item.status === null ? "" : item.status,
          //   signUpDate: item.signUpDate === null ? "" : item.signUpDate,
          //   isDirect: item.isDirect === null ? "" : item.isDirect
          // };

          const excelData =  Object.values(item)
          excelArr.push(excelData);
          // excelArr.push(Object.values(allowDataToShow));
        });
        // console.log("excelArr",excelArr)
        const fileName = props?.filename;
        exportToSpreadsheet(excelArr, fileName);

      }
    })
  }

  return (
    <div>
      <div className="form-group col-lg-3 col-md-12 mt-5">

        <button
          className="btn btn-sm text-white  "
          disabled={isexcelDataLoaded}
          type="button"
          onClick={() => exportToExcelFn()}
          style={{ backgroundColor: "rgb(1, 86, 179)" }}
        >
          Export
        </button>
      </div>

    </div>
  )
}

export default MerchnatListExportToxl
