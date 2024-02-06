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
} from "../slices/emamiSlice";
import toastConfig from "../utilities/toastTypes";
import Blob from "blob";
import { ChallanReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";
import CountPerPageFilter from "../../src/_components/table_components/filters/CountPerPage";
import SearchFilter from "../_components/table_components/filters/SearchFilter";
import CustomLoader from "../_components/loader";

const ChallanTransactReport = () => {
  const dispatch = useDispatch();

  const rowData = ChallanReportData;

  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const loadingState = useSelector((state) => state.challanReducer.isLoading);

  const challanTransactionList = useSelector(
    (state) => state?.challanReducer?.challanTransactionData
  );

  const { user } = auth;
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saveData, setSaveData] = useState();
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [dataCountGmv, setDataGmv] = useState(0);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);





  useEffect(() => {
    const transactionHistoryDataList = challanTransactionList?.results.transactions;
    const dataCount = challanTransactionList?.count;
    const gmvCount = challanTransactionList?.results?.gmv;

    if (transactionHistoryDataList) {
      setData(transactionHistoryDataList);
      setVerifiedMerchant(transactionHistoryDataList);
      setDataGmv(gmvCount)

      setDataCount(dataCount)
    }
  }, [challanTransactionList]); //









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

  // console.log("splitDate", splitDate)
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
    // console.log("e is here", e)
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    console.log("text", text)
    console.log("searchText", searchText)
    // console.log("verfiedMerchant-s", verfiedMerchant)
    // console.log("data-s", data)
    if (searchText) {
      setData(
        verfiedMerchant?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(verfiedMerchant)

    }

  };



  useEffect(() => {
    if (saveData?.from_date && saveData?.clientCode) {
      dispatch(
        challanTransactions({
          page: currentPage,
          page_size: pageSize,
          from_date: saveData?.from_date,
          to_date: saveData?.to_date,
          client_code: saveData?.clientCode,

        })
      )


    }

  }, [currentPage, pageSize]);



  const handleSubmit = (values) => {

    const formData = {
      from_date: values.from_date,
      to_date: values.to_date,
      client_code: values.clientCode,
      page: currentPage,
      page_size: pageSize,
    };

    setSaveData(values);

    dispatch(challanTransactions(formData))


      .catch((err) => {
        toastConfig.errorToast(err);


      });
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (ps) => {
    // console.log("ct2", ps)
    setPageSize(ps);
  };

  const exportToExcelFn = () => {

    dispatch(
      exportTransactions({
        page: currentPage,
        page_size: pageSize,
        from_date: saveData?.from_date,
        to_date: saveData?.to_date,
        client_code: saveData?.clientCode,
      })
    ).then((res) => {

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
                      className="form-select mr-4 mb-3"
                      options={clientCodeOption}
                    />
                  </div>
                  <div className="form-group col-md-3 ml-3">
                    <FormikController
                      control="input"
                      type="date"
                      label="From Date"
                      name="from_date"
                      className="form-control mr-4 mb-3"
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
                      className="form-control mr-4 mb-3"
                    />
                  </div>


                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn cob-btn-primary approve text-white">
                        Search
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
          {data?.length === 0 && <h5 className="text-center font-weight-bold mt-5">
            No Data Found
          </h5>}


          {data?.length !== 0 && (
            <>
              <div className="row mt-4">

                <div className="form-group col-lg-3 mr-3">
                  <SearchFilter
                    kycSearch={kycSearch}
                    searchText={searchText}
                    searchByText={searchByText}
                    setSearchByDropDown={setSearchByDropDown}
                    searchTextByApiCall={false}
                  />
                  {/* <div></div> */}
                </div>

                <div className="form-group col-lg-3">
                  <CountPerPageFilter
                    pageSize={pageSize}
                    dataCount={dataCount}
                    clientCode={saveData?.clientCode}
                    currentPage={currentPage}
                    changePageSize={changePageSize}
                    changeCurrentPage={changeCurrentPage}
                  />
                </div>
              </div>
              <div className="container-fluid ">
                <div className="scroll overflow-auto">
                  <p className="d-inline mr-3" style={{ fontSize: '15px' }}>Total Record(s): {dataCount}</p>
                  <p className="d-inline" style={{ fontSize: '15px' }}>GMV(INR): {dataCountGmv}</p>

                  {!loadingState && data?.length !== 0 && (
                    <Table
                      row={rowData}
                      data={data}
                      dataCount={dataCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}

                    />
                  )}


                </div>
                {loadingState && data?.length !== 0 && (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                  >
                    <CustomLoader loadingState={loadingState} />
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </main>
    </section>


  );
};

export default ChallanTransactReport;