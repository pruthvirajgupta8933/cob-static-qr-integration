/* eslint-disable array-callback-return */
import React, { useState} from 'react'
import { axiosInstanceJWT } from '../../utilities/axiosInstance';
import API_URL from '../../config';
import Blob from "blob";
import toastConfig from '../../utilities/toastTypes';

const MerchnatListExportToxl = (props) => {
  const [loading, setLoading] = useState(false);
  const[disable,setDisable]=useState(false)

  const exportToExcelFn = async () => {
    
    setLoading(true)
    setDisable(true)
    await axiosInstanceJWT.get(`${API_URL?.Export_FOR_MERCHANT_LIST}${props.URL}`,{
      responseType: 'arraybuffer'
    }).then((res) => {
      if (res.status === 200) {
        const data = res?.data;
         setLoading(false)
         setDisable(false)
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${ props?.filename}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
       
       

      }
    }).catch((err)=>{
      if(err.response?.status===500){
        toastConfig.errorToast("Something went wrong.")
      }
      setLoading(false)
      setDisable(false)

    })
  }

  return (
    <div className='form-group col-lg-3 col-md-12'>
      
        <p>&nbsp;</p>
        <button
          className="btn btn-sm text-white  cob-btn-primary"
          disabled={disable}
          type="button"
          onClick={() => exportToExcelFn()}
          style={{ backgroundColor: "rgb(1, 86, 179)" }}
        >
         <i className="fa fa-download"/> {loading ? "Downloading..." : "Export"}
         
        </button>
     

    </div>
  )
}

export default MerchnatListExportToxl
