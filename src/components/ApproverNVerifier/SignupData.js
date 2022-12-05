import React, { useState, useEffect } from 'react'
import NavBar from '../dashboard/NavBar/NavBar'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import moment from "moment";
import * as Yup from "yup";
import { toast } from "react-toastify";

import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import { exportToSpreadsheet } from '../../utilities/exportToSpreadsheet';


const validationSchema = Yup.object({
    from_date: Yup.string().required("Required").nullable(),
    to_date: Yup.string().required("Required").nullable(),

})


const SignupData = () => {
    const[signupData,setSignupData]= useState([]);
    const [spinner, setSpinner] = useState(true);
    

    let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const [todayDate, setTodayDate] = useState(splitDate);
    const[show,setShow]= useState(false)
    const initialValues = {
      from_date: todayDate,
      to_date: todayDate,
  
  }

  

    const handleSubmit = (values) => {
      
      setShow(true)
      setSpinner(true)
        const postData = {
            "from_date": values.from_date,
            "to_date": values.to_date

        };
        
               let apiRes= axiosInstanceAuth
            .post(API_URL.GET_SIGNUP_DATA_INFO, postData).then((resp) => {
                 toast.success("Data Loaded");
                setSignupData(resp?.data?.Merchant_Info)
                
                setSpinner(false)

           }).catch((error) => {
              apiRes = error.response;
             toast.error(apiRes?.data?.message)


            })
    }

    const exportToExcelFn = () => {
        const excelHeaderRow = [
          "S.No",
           "Name",
          " Email",
         " Mobile Number",
          " Created Date",
           "Status",
          " Business category Name"

        ];
        let excelArr = [excelHeaderRow];
        // eslint-disable-next-line array-callback-return
        signupData.map((item, index) => {
    
          const allowDataToShow = {
            srNo: item.srNo === null ? "" : index + 1,
            name: item.name === null ? "" : item.name,
            email: item.email === null ? "" : item.email,
            mobileNumber: item.mobileNumber === null ? "" : item.mobileNumber,
            createdDate: item.createdDate === null ? "" : item.createdDate,
            status: item.status === null ? "" : item.status,
            business_category_name: item.business_category_name === null ? "" : item.business_category_name,
                     };
    
          excelArr.push(Object.values(allowDataToShow));
        });
        const fileName = "Signup-Data";
        exportToSpreadsheet(excelArr, fileName);
      };
    return (
        <section className="ant-layout">
            <div>
                <NavBar />
            </div>
            <main className="gx-layout-content ant-layout-content">
                <div className="gx-main-content-wrapper">
                    <div className="right_layout my_account_wrapper right_side_heading">
                        <h1 className="m-b-sm gx-float-left">Signup Data</h1>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        // onSubmit={(values)=>handleSubmit(values)}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values)
                           
                        }}
                        enableReinitialize={true}
                    >
                        <Form>
                            <div class="container">
                                <div class="row">

                                    <div className="form-group col-md-4">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="From Date"
                                            name="from_date"
                                            className="form-control rounded-0"
                                        // value={startDate}
                                        // onChange={(e)=>setStartDate(e.target.value)}
                                        />

                                    </div>

                                    <div className="form-group col-md-4 mx-4">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="End Date"
                                            name="to_date"
                                            className="form-control rounded-0"
                                        />



                                    </div>
                                    <div className=" col-md-4 mx-4">
                                        <button type="subbmit" class="btn btn-primary">Submit</button>

                                    </div>
                                    {signupData?.length > 0 ? (
                                    <div className="form-row">
                            <div className="form-group col-md-1 ml-4">
                              <button
                                className="btn btn-sm text-white"
                                type="button"
                                 onClick={() => exportToExcelFn()}
                                style={{ backgroundColor: "rgb(1, 86, 179)" }}
                              >
                                Export
                              </button>
                            </div>
                          </div>
                            ) : (
                                <></>
                              )}


                                </div>
                            </div>

                        </Form>

                       </Formik>
                       <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
        {show === true ? (
          <table className="table table-bordered">
            <thead>
           
              <tr>
                <th>S. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Business category Name</th>
            </tr>
            
            </thead>
            <tbody>
            {spinner && <div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>}
              {signupData?.length === 0 || signupData?.length === undefined ? (
                
                <tr>
                  <td colSpan={"8"}>
                    <h1 className="nodatafound">No data found</h1>
                  </td>
                </tr>
              ) : (
                signupData?.map((SignData, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{SignData?.name}</td>
                    <td>{SignData?.email}</td>
                    <td>{SignData?.mobileNumber}</td>
                    <td>{SignData?.createdDate}</td>
                    <td>{SignData?.status}</td>
                    <td>{SignData?.business_category_name}</td>
                   
                    {/* <td>{SignData.status}</td> */}
                   
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
           ) : (
            <></>
        )}
        </div>
        
      </div>
      </div>
            </main>
        </section>


    )
}

export default SignupData
