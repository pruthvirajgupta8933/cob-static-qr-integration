import React, { useState, useEffect } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import { Formik, Form } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../_components/formik/FormikController";
import { filterForAllDebitReportsSlice } from "../slices/subscription-slice/debitSlice";
import toastConfig from "../utilities/toastTypes";
import Table from "../_components/table_components/table/Table";
import CountPerPageFilter from "../_components/table_components/filters/CountPerPage";
import CustomLoader from "../_components/loader";
import { DebitReportData } from "../utilities/tableData";
import { exportToSpreadsheet } from "../utilities/exportToSpreadsheet";

const DebitReport = () => {
  const dispatch = useDispatch();

  const rowData = DebitReportData;
  const { auth } = useSelector((state) => state);
   
  const { user } = auth;
  const { loginId } = user;
  const loadingState = useSelector((state) => state.DebitReports.isLoadingDebitHistory);


  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [showData, setShowData] = useState(false);
  const [debitReport, setDebitReport] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [saveData, setSaveData] = useState();
  const [disable, setDisable] = useState(false);
  const [isexcelDataLoaded, setIsexcelDataLoaded] = useState(false);


  const options1 = [
    { key: "ALL", value: "ALL" },
    { key: "RETURNED", value: "RETURNED" },
    { key: "REALISED", value: "REALISED" },
];


  const validationSchema = Yup.object({
    fromDate: Yup.date()
      .required("Required")
      .nullable(),
    toDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
    status: Yup.string().required("Required"),
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
    fromDate: todayDate,
    toDate: todayDate,
    status: "ALL",
  };


  const debitReportSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    dispatch(
      filterForAllDebitReportsSlice({
        page: currentPage,
        size: pageSize,
        fromDate: saveData?.from_date,
        toDate: saveData?.to_date,
        status: saveData?.status,
        m_id:"2",
      })
    )
      .then((resp) => {
        // resp?.payload?.status_code && toastConfig.errorToast("");
        setSpinner(false);

        const data = resp?.payload?.records;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setDebitReport(data);
      })

      .catch((err) => {});
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        debitReport.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(debitReport);
    }
  }, [searchText]);



  

  // console.log(pageSize,"page Size")

  const handleSubmit = (values) => {
    // console.log(values);
    setDisable(true);
    const formData = {
        page: currentPage,
        size: pageSize,
        fromDate: values?.fromDate,
        toDate: values?.toDate,
        status: values?.status,
        m_id:"2"
    };

    setSaveData(values);

    dispatch(filterForAllDebitReportsSlice(formData))
      .then((resp) => {
        const data = resp?.payload?.records;
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
        setDebitReport(data);
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
    const excelHeaderRow = [
        "S.No",
        "Transaction ID",
        "UMRN Number",
        "Payment Status",
        "Reason",
        "Settelment Amount",
        "Settlement Status",
        "Merchant Name",
        "Bank Message",
        "Bank Reference Number",
        "Batch Reference Number",
        "Transaction Initialization Date",
        "Transaction Complete Date",
        "Next Due Date",
        "Statue Reason Code",
        "Division Code",
        "Customer Reference Number",
        "Remarks",
        "Remarks 1",
        "Remarks 2",
        "Remarks 3",
        "Remarks 4",
        "Remarks 5",
        "Customer Transaction Reference Number",
        "Bank Id",
        "Bank Response Code",
        "Bank Name",
        "issettled",
        "issettledsponcer",
        "pAmount",
        "settlementamountsponcer",
        "settlementbankref",
        "settlementbankrefsponcer",
        "settlementby",
        "settlementbysponcer",
        "settlementdate",
        "settlementdatesponcer",
        "settlementremarks",
        "settlementremarkssponcer",
        "settlementstatussponcer",
        "settlementutr",
        "settlementutrsponcer",
        "transactionAmount",

        
    ];
    let excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    debitReport.map((item, index) => {
        const allowDataToShow = {
            srNo: item.srNo === null ? "" : index + 1,
            transId: item.transId === null ? "" : item.transId,
            umrn: item.umrn === null ? "" : item.umrn,
            paymentStatus: item.paymentStatus === null ? "" : item.paymentStatus,
            statusreasoncode: item.statusreasoncode === null ? "" : item.statusreasoncode,
            settlementamount: item.settlementamount === null ? "" : item.settlementamount,
            settlementstatus: item.settlementstatus === null ? "" : item.settlementstatus,
            merchantname: item.merchantname === null ? "" : item.merchantname,
            bankMessage: item.bankMessage === null ? "" : item.bankMessage,
            bankReferenceNo: item.bankReferenceNo === null ? "" : item.bankReferenceNo,
            batchRefNumber: item.batchRefNumber === null ? "" : item.batchRefNumber,
            transInitDate: item.transInitDate === null ? "" : item.transInitDate,
            transCompleteDate: item.transCompleteDate === null ? "" : item.transCompleteDate,
            nextDueDate: item.nextDueDate === null ? "" : item.nextDueDate,
            statusreasoncode: item.statusreasoncode === null ? "" : item.statusreasoncode,
            divisioncode: item.divisioncode === null ? "" : item.divisioncode,
            additionalInfo: item.additionalInfo === null ? "" : item.additionalInfo,
            remarks: item.remarks === null ? "" : item.remarks,
            remarks1: item.remarks1 === null ? "" : item.remarks1,
            remarks2: item.remarks2 === null ? "" : item.remarks2,
            remarks3: item.remarks3 === null ? "" : item.remarks3,
            remarks4: item.remarks4 === null ? "" : item.remarks4,
            remarks5: item.remarks5 === null ? "" : item.remarks5,
            customertxnrefnumber: item.customertxnrefnumber === null ? "" : item.customertxnrefnumber,


            bankId: item.bankId === null ? "" : item.bankId,
            bankResponseCode: item.bankResponseCode === null ? "" : item.bankResponseCode,
            bankname: item.bankname === null ? "" : item.bankname,
            issettled: item.issettled === null ? "" : item.issettled,
            issettledsponcer: item.issettledsponcer === null ? "" : item.issettledsponcer,
            pAmount: item.pAmount === null ? "" : item.pAmount,
            settlementamountsponcer: item.settlementamountsponcer === null ? "" : item.settlementamountsponcer,
            settlementbankref: item.settlementbankref === null ? "" : item.settlementbankref,
            settlementbankrefsponcer: item.settlementbankrefsponcer === null ? "" : item.settlementbankrefsponcer,
            settlementby: item.settlementby === null ? "" : item.settlementby,
            settlementbysponcer: item.settlementbysponcer === null ? "" : item.settlementbysponcer,
            settlementdate: item.settlementdate === null ? "" : item.settlementdate,
            settlementdatesponcer: item.settlementdatesponcer === null ? "" : item.settlementdatesponcer,
            settlementremarks: item.settlementremarks === null ? "" : item.settlementremarks,
            settlementremarkssponcer: item.settlementremarkssponcer === null ? "" : item.settlementremarkssponcer,
            settlementstatussponcer: item.settlementstatussponcer === null ? "" : item.settlementstatussponcer,
            settlementutr: item.settlementutr === null ? "" : item.settlementutr,
            settlementutrsponcer: item.settlementutrsponcer === null ? "" : item.settlementutrsponcer,
            transactionAmount: item.transactionAmount === null ? "" : item.transactionAmount,
            
            
        };

        excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Debit-Reports";
    exportToSpreadsheet(excelArr, fileName);
};

  return (
    <section className="ant-layout">
      <div>
        
      </div>
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h5 className="ml-2">
            Debit Report
          </h5>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          enableReinitialize={true}
        >
          <Form>
            <div className="container">
              <div className="row">
                <div className="form-group col-lg-3">
                  <FormikController
                    control="select"
                    label="Registration Status"
                    name="status"
                    className="form-control form-select rounded-0 mt-0"
                    options={options1}
                  />
                </div>

                <div className="form-group col-lg-3">
                  <FormikController
                    control="input"
                    type="date"
                    label="From Date"
                    name="fromDate"
                    className="form-control rounded-0"
                    // value={startDate}
                    // onChange={(e)=>setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group col-lg-3">
                  <FormikController
                    control="input"
                    type="date"
                    label="End Date"
                    name="toDate"
                    className="form-control rounded-0"
                  />
                </div>
                

                <div className=" col-lg-4">
                  <button
                    type="submit"
                    disabled={disable}
                    className="btn approve  cob-btn-primary text-white  btn-sm"
                  >
                    Submit
                  </button>
                </div>

                {showData === true  ? data.length===0 ? ""  : (
                  <div className="form-row mt-2">
                  {/* <div className="container-fluid flleft"> */}
                    <div className="form-group col-md-3">
                      <label>Search</label>
                      <input
                        className="form-control"
                        onChange={debitReportSearch}
                        type="text"
                        placeholder="Search Here"
                      />
                    </div>
                    <div></div>
                    <div className="form-group col-md-3">
                      <CountPerPageFilter
                        pageSize={pageSize}
                        dataCount={dataCount}
                        changePageSize={changePageSize}
                      />
                    </div>

                    <div className="form-group col-md-3 mt-4">
                      <button
                        className="btn btn-sm text-white  "
                        type="button"
                        disabled={isexcelDataLoaded}
                        onClick={() => exportToExcelFn()}
                        style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                  // </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Form>
        </Formik>
        {showData === true ? (
          <div className="col-md-12 col-md-offset-4 mt-4">
            <p className="font-weight-bold">Total Records: {data?.length}</p>
            <div className="scroll overflow-auto">
              <Table
                row={rowData}
                data={data}
                dataCount={dataCount}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
               
              />
            </div>
            <CustomLoader loadingState={loadingState} />
            {/* {data?.length == 0 && !loadingState && (
              <h2 className="text-center font-weight-bold">No Data Found</h2>
            )} */}
          </div>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default DebitReport;
