import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../_components/reuseable_components/convertToFormikSelectJson";
import { useHistory } from "react-router-dom";
import {
  challanTransactions,
  exportTransactions,
} from "../slices/backTobusinessSlice";
import toastConfig from "../utilities/toastTypes";
import Blob from "blob";
import { ChallanReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";
import CountPerPageFilter from "../../src/_components/table_components/filters/CountPerPage";
import CustomLoader from "../_components/loader";
import SearchFilter from "../_components/table_components/filters/SearchFilter";

const ChallanTransactReport = () => {
  const dispatch = useDispatch();

  const rowData = ChallanReportData;

  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const loadingState = useSelector((state) => state.challanReducer.isLoading);

  const challanTransactionList = useSelector(
    (state) => state?.challanReducer?.challanTransactionData?.results
  );
  

  

  const { user } = auth;
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [showData, setShowData] = useState(false);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [loadingData,setLoadingData]=useState(true)
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saveData, setSaveData] = useState();
  const [disable, setDisable] = useState(false);
  const [isexcelDataLoaded, setIsexcelDataLoaded] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  console.log("datat",data)

  const validationSchema = Yup.object({
    from_date: Yup.date()
      .required("Required")
      .nullable(),
    to_date: Yup.date()
      .min(Yup.ref("from_date"), "End date can't be before Start date")
      .required("Required"),
    clientCode: Yup.string().required("Required"),
  });

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  // const [todayDate, setTodayDate] = useState(splitDate);

  let todayDate = splitDate;

  const initialValues = {
    from_date: todayDate,
    to_date: todayDate,
    clientCode: "",
  };

  let clientMerchantDetailsList = [];
  if (
    user &&
    user?.clientMerchantDetailsList === null &&
    user?.roleId !== 3 &&
    user?.roleId !== 13
  ) {
    history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    {},
    false,
    true
  );


  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    setData(
      verfiedMerchant?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  const challanSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {

    dispatch(
      challanTransactions({
        page: currentPage,
        page_size: pageSize,
        from_date: saveData?.from_date,
        to_date: saveData?.to_date,
      })
    )
      .then((resp) => {
        // resp?.payload?.status_code && toastConfig.errorToast("");
        setSpinner(false);
        setLoadingData(true)

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      })

      .catch((err) => { });
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        verfiedMerchant.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(verfiedMerchant);
    }
  }, [searchText]);







  const handleSubmit = (values) => {
    // console.log(values);
    setDisable(true);
    const formData = {
      from_date: values.from_date,
      to_date: values.to_date,
      client_code: values.clientCode,
      page: currentPage,
      page_size: pageSize,
    };

    setSaveData(values);

    dispatch(challanTransactions(formData))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;

        if (data?.length === 0 && data !== null) {
          // Return null value
        } else {
          // toastConfig.successToast("Data loaded");
        }

        setData(data);
        setSpinner(true);
        setDataCount(dataCoun);
        setShowData(true);
        setVerifiedMerchant(data);
        setDisable(false);
      })

      .catch((err) => {
        toastConfig.errorToast(err);
        setDisable(false);
      });
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const exportToExcelFn = () => {
    setIsexcelDataLoaded(true);
    dispatch(
      exportTransactions({
        page: currentPage,
        page_size: pageSize,
        from_date: saveData?.from_date,
        to_date: saveData?.to_date,
        client_code: saveData?.clientCode,
      })
    ).then((res) => {
      setIsexcelDataLoaded(false);
      const blob = new Blob([res?.payload?.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MIS_REPORT_${saveData?.clientCode}_${splitDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    // <section className="ant-layout">
    //   <div>

    //   </div>
    //   <div className="gx-main-content-wrapper">
    //     <div className="right_layout my_account_wrapper right_side_heading">
    //       <h6 className="m-b-sm gx-float-left mt-3">
    //       Transaction History
    //       </h6>
    //     </div>
    //     <Formik
    //       initialValues={initialValues}
    //       validationSchema={validationSchema}
    //       onSubmit={(values) => {
    //         handleSubmit(values);
    //       }}
    //       enableReinitialize={true}
    //     >
    //       <Form>
    //         <div className="container">
    //           <div className="row">
    //             <div className="form-group col-lg-4">
    //               <FormikController
    //                 control="select"
    //                 label="Client Code"
    //                 name="clientCode"
    //                 className="form-control rounded-0 mt-0"
    //                 options={clientCodeOption}
    //               />
    //             </div>

    //             <div className="form-group col-lg-4">
    //               <FormikController
    //                 control="input"
    //                 type="date"
    //                 label="From Date"
    //                 name="from_date"
    //                 className="form-control rounded-0"
    //                 // value={startDate}
    //                 // onChange={(e)=>setStartDate(e.target.value)}
    //               />
    //             </div>

    //             <div className="form-group col-lg-4">
    //               <FormikController
    //                 control="input"
    //                 type="date"
    //                 label="End Date"
    //                 name="to_date"
    //                 className="form-control rounded-0"
    //               />
    //             </div>

    //             <div className=" col-lg-4">
    //               <button
    //                 type="subbmit"
    //                 disabled={disable}
    //                 className="btn approve text-white  cob-btn-primary  btn-sm"
    //               >
    //                 Submit
    //               </button>
    //             </div>

    //             {showData === true ? (
    //               <div className="container-fluid flleft">
    //                 <div className="form-group col-lg-4 col-md-12 mt-2">
    //                   <label>Search</label>
    //                   <input
    //                     className="form-control"
    //                     onChange={challanSearch}
    //                     type="text"
    //                     placeholder="Search Here"
    //                   />
    //                 </div>
    //                 <div></div>
    //                 <div className="form-group col-lg-4 col-md-12 mt-2">
    //                   <CountPerPageFilter
    //                     pageSize={pageSize}
    //                     dataCount={dataCount}
    //                     changePageSize={changePageSize}
    //                   />
    //                 </div>

    //                 <div className="form-group col-lg-4 col-md-12 mt-5">
    //                   <button
    //                     className="btn btn-sm text-white  cob-btn-primary"
    //                     type="button"
    //                     disabled={isexcelDataLoaded}
    //                     onClick={() => exportToExcelFn()}
    //                     style={{ backgroundColor: "rgb(1, 86, 179)" }}
    //                   >
    //                     Export
    //                   </button>
    //                 </div>
    //               </div>
    //             ) : (
    //               <></>
    //             )}
    //           </div>
    //         </div>
    //       </Form>
    //     </Formik>
    //     {showData === true ? (
    //       <div className="col-md-12 col-md-offset-4">
    //         <h5 className="font-weight-bold">Total Records: {data?.length}</h5>
    //         <div className="scroll overflow-auto">
    //           <Table
    //             row={rowData}
    //             data={data}
    //             dataCount={dataCount}
    //             pageSize={pageSize}
    //             currentPage={currentPage}
    //             changeCurrentPage={changeCurrentPage}

    //           />
    //         </div>
    //         <CustomLoader loadingState={loadingState} />
    //         {data?.length == 0 && !loadingState && (
    //           <h2 className="text-center font-weight-bold">No Data Found</h2>
    //         )}
    //       </div>
    //     ) : (
    //       <></>
    //     )}
    //   </div>
    // </section>


    <section className="">
      <main className="">
        <div className="">
          <div className="mb-5">
            <h5 className="">Transaction History</h5>
          </div>

          <Formik
            initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                  enableReinitialize={true}
          >
            {(formik) => (
              <Form>
                <div className="row">
                  <div className="form-group  col-md-3 ">
                  <FormikController
                    control="select"
                    label="Client Code"
                    name="clientCode"
                    className="form-control rounded-0 mt-0"
                    options={clientCodeOption}
                  />
                  </div>
                  <div className="form-group col-md-3 ml-3">
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


                  <div className="form-group col-md-3 ml-3">
                    <FormikController
                      control="input"
                      type="date"
                      label="End Date"
                      name="to_date"
                      className="form-control rounded-0"
                    />
                  </div>


                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn cob-btn-primary approve text-white">
                        Submit
                      </button>
                      {data?.length > 0 ? (
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
          {data?.length === 0 && showData === true && <h5 className="text-center font-weight-bold mt-5">
            No Data Found
          </h5>}
          {!loadingState && data?.length !== 0 && (
            <>
              <div className="row mt-4">
                <div className="form-group col-lg-3 mr-3">
                  <SearchFilter
                    kycSearch={kycSearch}
                    searchText={searchText}
                    searchByText={searchByText}
                    setSearchByDropDown={setSearchByDropDown}
                  />
                  <div></div>
                </div>

                <div className="form-group col-lg-3">
                <CountPerPageFilter
                     pageSize={pageSize}
                     dataCount={dataCount}
                     currentPage={currentPage}
                     changePageSize={changePageSize}
                     changeCurrentPage={changeCurrentPage}
                  />
                </div>
              </div>
              <div className="container-fluid ">
                <div className="scroll overflow-auto">
                  {!loadingState && data?.length !== 0 && (
                    <Table
                      row={rowData}
                      data={challanTransactionList}
                      dataCount={dataCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}

                    />
                  )}
                </div>
                <CustomLoader loadingState={loadingState} />
              </div>
            </>
          )}
        </div>
      </main>
    </section>


  );
};

export default ChallanTransactReport;
