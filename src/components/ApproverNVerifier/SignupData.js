/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import moment from "moment";
import { exportToSpreadsheet } from "../../utilities/exportToSpreadsheet";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../src/_components/table_components/filters/CountPerPage";
import DateFormatter from "../../utilities/DateConvert";
import FormikController from "../../_components/formik/FormikController";
import { fetchSignupData } from "../../slices/signupDataSlice";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../_components/formik/Yup";


const validationSchema = Yup.object({
  from_date: Yup.date().required("Required").nullable(),
  to_date: Yup.date()
    .min(Yup.ref("from_date"), "End date can't be before Start date")
    .required("Required"),
});

const SignupData = () => {
 const [signupData, setSignupData] = useState([]);
  const [filterSignupData, setFilterSignupData] = useState([]);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [saveData, setSaveData] = useState();
  const dispatch = useDispatch();
  const [loadingState, setLoadingState] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setDisable] = useState(false)

  const signupDataList = useSelector(
    (state) => state?.signupData.signupDataDetails

  )

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
      filterSignupData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
    if (filterSignupData.length === 0) {
      setPageSize(0);
    }

  
  };

  useEffect(() => {
    const signupDataDataList = signupDataList?.Merchant_Info

    const dataCount = signupDataList?.count;

    if (signupDataDataList) {
      setSignupData(signupDataDataList);
      setFilterSignupData(signupDataDataList);
      setDataCount(dataCount)
    }
  }, [signupDataList]); //


  useEffect(() => {
    if (saveData?.from_date && saveData?.to_date) {
      const postData = {
        from_date: moment(saveData.from_date).startOf('day').format('YYYY-MM-DD'),
        to_date: moment(saveData.to_date).startOf('day').format('YYYY-MM-DD'),
        page: currentPage,
        pageSize: pageSize
      };
      setLoadingState(true)

      dispatch(fetchSignupData(postData)).then((resp) => {
        setLoadingState(false);
      })

        .catch((error) => {
          setLoadingState(false);
        });
    }
  }, [pageSize, currentPage]);


  const handleSubmit = (values) => {
    setLoadingState(true);
    setDisable(true)
    const postData = {
      from_date: moment(values.from_date).startOf('day').format('YYYY-MM-DD'),
      to_date: moment(values.to_date).startOf('day').format('YYYY-MM-DD'),
      page: currentPage,
      pageSize: pageSize
    };
    setSaveData(values);
    dispatch(fetchSignupData(postData))
      .then((resp) => {
        isButtonClicked(true)
        setLoadingState(false);
        setDisable(false)

      })
      .catch((error) => {
        setLoadingState(false);
        setDisable(false)

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
    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...")
      }
      return state
    }
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
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
    {
      id: "1",
      name: "S. No.",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px"
    },
    {
      id: "2",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px"
    },
    {
      id: "3",
      name: "Email",
      selector: (row) => row.email,
      width: "180px"
    },
    {
      id: "4",
      name: "Contact Number",
      selector: (row) => row.mobileNumber,
    },
    {
      id: "5",
      name: "Registered Date",
      selector: (row) => DateFormatter(row.createdDate, true),
      sortable: true,
      width: "170px"
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
    <section className="">
      <main className="">
        <div className="">
          <div >
            <h5 className="">Signup Data</h5>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
            }}
            enableReinitialize={true}
          >
            {(formik) => (
              <Form className="row mt-5">
                <div className="row">
                  <div className="form-group  col-md-3 ">
                    <FormikController
                      control="date"
                      label="From Date"
                      id="from_date"
                      name="from_date"
                      value={formik.values.from_date ? new Date(formik.values.from_date) : null}
                      onChange={date => formik.setFieldValue('from_date', date)}
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["from_date"]}
                    />
                  </div>
                  <div className="form-group col-md-3 ml-3">
                    <FormikController
                      control="date"
                      label="End Date"
                      id="to_date"
                      name="to_date"
                      value={formik.values.to_date ? new Date(formik.values.to_date) : null}
                      onChange={date => formik.setFieldValue('to_date', date)}
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["to_date"]}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn cob-btn-primary approve text-white"
                        disabled={disable}
                      >
                        {disable && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )} {/* Show spinner if disabled */}
                        Submit
                      </button>
                      {signupData?.length > 0 ? (
                        <button
                          className="btn cob-btn-primary  approve  text-white ml-3"
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
            )}
          </Formik>

          {/* {!loadingState && signupData?.length !== 0 && ( */}
          {filterSignupData?.length !== 0 &&
          <div className="row mt-4">
            {/* {signupData.length === 0 ? "" : */}
              <div className="form-group col-lg-3 ml-2">
                <SearchFilter
                  kycSearch={kycSearch}
                  searchText={searchText}
                  searchByText={searchByText}
                  setSearchByDropDown={setSearchByDropDown}
                />

              </div>
              {/* } */}
            {/* {signupData.length === 0 ? "" : */}
              <div className="form-group col-lg-3">
                <CountPerPageFilter
                  pageSize={pageSize}
                  dataCount={dataCount}
                  changePageSize={changePageSize}
                />
              </div>
              {/* } */}
          </div>}
          <div className="container-fluid ">
            <div className="scroll overflow-auto">
              {signupData.length === 0 ? "" : <h6>Total Count : {dataCount}</h6>}
              {buttonClicked === true && signupData.length === 0 && <h5 className="text-center font-weight-bold mt-5">
                No Data Found
              </h5>}
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
          </div>

          {/* )} */}
        </div>
      </main>
    </section>
  );
};

export default SignupData;
