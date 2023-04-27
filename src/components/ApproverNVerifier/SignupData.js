/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import { Formik, Form } from "formik";
import API_URL from "../../config";
import moment from "moment";
import * as Yup from "yup";
import { toast } from "react-toastify";

import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { exportToSpreadsheet } from "../../utilities/exportToSpreadsheet";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
// import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CountPerPageFilter from "../../../src/_components/table_components/filters/CountPerPage";

const validationSchema = Yup.object({
  from_date: Yup.date().required("Required").nullable(),
  to_date: Yup.date()
    .min(Yup.ref("from_date"), "End date can't be before Start date")
    .required("Required"),
});

const SignupData = () => {
  const [signupData, setSignupData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [saveData, setSaveData] = useState();

  const [loadingState, setLoadingState] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const [show, setShow] = useState(false);
  const initialValues = {
    from_date: splitDate,
    to_date: splitDate,
  };
  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    setSignupData(
      assignZone?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  //function for change current page
  // const changeCurrentPage = (page) => {
  //   setCurrentPage(page);
  // };

  // //function for change page size
  // const changePageSize = (pageSize) => {
  //   setPageSize(pageSize);
  // };

  useEffect(() => {
    const postData = {
      from_date: saveData?.from_date,
      to_date: saveData?.to_date,
    };
    let apiRes = axiosInstanceJWT
      .post(
        `${API_URL.GET_SIGNUP_DATA_INFO}?page=${currentPage}&page_size=${pageSize}`,
        postData
      )
      .then((resp) => {
        setSignupData(resp?.data?.Merchant_Info);
        setAssignzone(resp?.data?.Merchant_Info);
        // console.log(resp?.data)
        setShow(true);
        setLoadingState(false);
        setDataCount(resp?.data?.count);
      })
      .catch((error) => {
        setLoadingState(false);
      });
  }, [currentPage, pageSize]);

  const handleSubmit = (values) => {
    setSaveData(values);
    setLoadingState(true);
    const postData = {
      from_date: values.from_date,
      to_date: values.to_date,
    };
    let apiRes = axiosInstanceJWT
      .post(
        `${API_URL.GET_SIGNUP_DATA_INFO}?page=${currentPage}&page_size=${pageSize}`,
        postData
      )
      .then((resp) => {
        setSignupData(resp?.data?.Merchant_Info);
        setAssignzone(resp?.data?.Merchant_Info);
        // console.log(resp?.data)
        setShow(true);
        setLoadingState(false);
        setDataCount(resp?.data?.count);
      })
      .catch((error) => {
        setLoadingState(false);
        apiRes = error.response;
        toast.error(apiRes?.data?.message);
      });
  };

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
        business_category_name:
          item.business_category_name === null
            ? ""
            : item.business_category_name,
        business_cat_code:
          item.business_cat_code === null ? "" : item.business_cat_code,
        company_name: item.company_name === null ? "" : item.company_name,
        companyWebsite: item.companyWebsite === null ? "" : item.companyWebsite,
        gstNumber: item.gstNumber === null ? "" : item.gstNumber,
        businessType: item.businessType === null ? "" : item.businessType,
        expectedTransactions:
          item.businessType === null ? "" : item.expectedTransactions,
        zone_code: item.zone_code === null ? "" : item.zone_code,
        address: item.address === null ? "" : item.address,
        product_name:
          item?.website_plan_details?.appName === null
            ? ""
            : item?.website_plan_details?.appName,
        plan_name:
          item?.website_plan_details?.planName === null
            ? ""
            : item?.website_plan_details?.planName,
        landing_page_name:
          item?.website_plan_details?.appName === null
            ? ""
            : item?.website_plan_details?.page,
        platForm:
          item?.website_plan_details?.appName === null
            ? ""
            : item?.website_plan_details?.platform,
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

  console.log(signupData, "Sign Up Data Found That is alled in the main");
  console.log(loadingState, "State of the API Request");

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };

  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const rowSignUpData = [
    { id: "1", name: "S. No.", selector: (row) => row.sno, sortable: true },
    {
      id: "2",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      id: "3",
      name: "Email",
      selector: (row) => row.email,
    },
    {
      id: "4",
      name: "Contact Number",
      selector: (row) => row.mobileNumber,
    },
    {
      id: "5",
      name: "Registered Date",
      selector: (row) => covertDate(row.createdDate),
      sortable: true,
    },
    {
      id: "6",
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      id: "7",
      name: "Business Category",
      selector: (row) => row.business_category_name,
    },
    {
      id: "8",
      name: "Product Name",
      selector: (row) => row.website_plan_details?.appName,
    },
    {
      id: "9",
      name: "Plan Name",
      selector: (row) => row.website_plan_details?.planName,
    },
    {
      id: "10",
      name: "Landing Page Name",
      selector: (row) => row.website_plan_details?.page,
    },
    {
      id: "11",
      name: "Platform",
      selector: (row) => row.website_plan_details?.platform_id,
    },
  ];

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
              handleSubmit(values);
            }}
            enableReinitialize={true}
          >
            <Form>
              <div className="container">
                <div className="row">
                  <div className="form-group  col-md-3 ml-4">
                    <FormikController
                      control="input"
                      type="date"
                      label="From Date"
                      name="from_date"
                      className="form-control rounded-0 "
                      // value={startDate}
                      // onChange={(e)=>setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-md-3 mx-4">
                    <FormikController
                      control="input"
                      type="date"
                      label="End Date"
                      name="to_date"
                      className="form-control rounded-0"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className=" col-md-4">
                    <button
                      type="submit"
                      className="verify-btn approve text-white  text-white ml-4 "
                    >
                      Submit
                    </button>
                    {signupData?.length > 0 ? (
                      <button
                        className="verify-btn approve  text-white ml-4"
                        type="button"
                        onClick={() => exportToExcelFn()}
                        style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      >
                        Export
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
          {!loadingState && signupData?.length !== 0 && (
            <>
              <div className="form-group col-lg-3 col-md-12 mt-2 ml-4">
                <SearchFilter
                  kycSearch={kycSearch}
                  searchText={searchText}
                  searchByText={searchByText}
                  setSearchByDropDown={setSearchByDropDown}
                />
                <div></div>
              </div>

              <div className="form-group col-lg-3 col-md-12 mt-2 ml-3">
                <CountPerPageFilter
                  pageSize={pageSize}
                  dataCount={dataCount}
                  changePageSize={changePageSize}
                />
              </div>

              <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
                <div className="scroll overflow-auto ml-4">
                  {!loadingState && signupData?.length !== 0 && (
                    <Table
                      row={rowSignUpData}
                      data={signupData}
                      dataCount={dataCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}
                    />
                  )}
                </div>
                <CustomLoader loadingState={loadingState} />
                {signupData.length === 0 && !loadingState ? (
                  <h2 className="text-center font-weight-bold">
                    No Data Found
                  </h2>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </section>
  );
};

export default SignupData;
