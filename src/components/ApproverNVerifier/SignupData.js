import React, { useState } from 'react'
import NavBar from '../dashboard/NavBar/NavBar'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import moment from "moment";
import * as Yup from "yup";
import { toast } from "react-toastify";

import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import { exportToSpreadsheet } from '../../utilities/exportToSpreadsheet';
// import toastConfig from '../../utilities/toastTypes';


const validationSchema = Yup.object({
  from_date: Yup.date().required("Required").nullable(),
  to_date: Yup.date()
    .min(Yup.ref("from_date"), "End date can't be before Start date")
    .required("Required"),

})


const SignupData = () => {
  const [signupData, setSignupData] = useState([]);

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const [show, setShow] = useState(false)
  const initialValues = {
    from_date: splitDate,
    to_date: splitDate,

  }



  const handleSubmit = (values) => {
    const postData = {
      "from_date": values.from_date,
      "to_date": values.to_date

    };
    let apiRes = axiosInstanceAuth
      .post(API_URL.GET_SIGNUP_DATA_INFO, postData).then((resp) => {

        // resp?.data?.Merchant_Info !== [] ? toastConfig.successToast("Data Loaded") : toastConfig.errorToas("No Data Found")
        // // toast.success("Data Loaded");
        setSignupData(resp?.data?.Merchant_Info)
        setShow(true)

      }).catch((error) => {
        apiRes = error.response;
        toast.error(apiRes?.data?.message)
      })
  }

  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "S.No",
      "Name",
      "Email",
      "Mobile Number",
      "Created Date",
      "Status",
      "Business Category Name",
      "Business Category Code",
      "Company Name",
      "Company's Website",
      "GST Number",
      "Business Type",
      "Expected Transactions",
      "Zone Code",
      "Address",
      "Product Name",
      "Plan Name",
      "Landing  Page Name",
      "Platform",
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
        business_cat_code: item.business_cat_code === null ? "" : item.business_cat_code,
        company_name: item.company_name === null ? "" : item.company_name,
        companyWebsite: item.companyWebsite === null ? "" : item.companyWebsite,
        gstNumber: item.gstNumber === null ? "" : item.gstNumber,
        businessType: item.businessType === null ? "" : item.businessType,
        expectedTransactions: item.businessType === null ? "" : item.expectedTransactions,
        zone_code: item.zone_code === null ? "" : item.zone_code,
        address: item.address === null ? "" : item.address,
        product_name:item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.appName,
        plan_name:item?.website_plan_details?.planName === null ? "" : item?.website_plan_details?.planName,
        landing_page_name:item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.page,
        platForm:item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.platform,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Signup-Data";
    exportToSpreadsheet(excelArr, fileName);
  };

// Return list from the json object
  // const objectToList = (data, forExcel = false) => {
  //   console.log(data)
  //   return forExcel ?
  //     JSON?.stringify(data)
  //     :
  //     data?.map((d, i) => {
  //       return Object.keys(d)?.map((k, i) => (
  //         <p key={k}> <span>{k}</span> : <span>{Object.values(d)[i]}</span></p>
  //       ))
  //     })
  // }



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
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values)

            }}
            enableReinitialize={true}
          >
            <Form>
              <div className="container">
                <div className="row">

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
                    <button type="subbmit" className="btn btn-primary">Submit</button>

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
                      <th>Product Name</th>
                      <th>Plan Name</th>
                      <th>Landing Page Name</th>
                      <th>Platform</th>
                    </tr>
                  </thead>
                  <tbody>

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
                          <td>{SignData?.website_plan_details?.appName}</td>
                          <td>{SignData?.website_plan_details?.planName}</td>
                          <td>{SignData?.website_plan_details?.page}</td>
                          <td>{SignData?.website_plan_details?.platform_id}</td>
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
