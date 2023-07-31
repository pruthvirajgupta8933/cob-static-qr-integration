import React, { useState, useEffect } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import FormikController from "../_components/formik/FormikController";
import { Formik,Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { axiosInstance } from "../utilities/axiosInstance";
import API_URL from "../config";
import { exportToSpreadsheet } from "../utilities/exportToSpreadsheet";
import { MandateReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";
import toastConfig from "../utilities/toastTypes";
import { fetchFilterForAllMandatesReportsSlice } from "../slices/subscription-slice/registeredMandateSlice";
import CountPerPageFilter from "../_components/table_components/filters/CountPerPage";
import CustomLoader from "../_components/loader";



const MandateReport = () => {
  const dispatch = useDispatch();

  const rowData = MandateReportData;

  const loadingState = useSelector((state) => state.Reports.isLoadingMandateHistory);

  const [mandateData, setMandateData] = useState([]);
  const [frequencyList, setFrequencyList] = useState([]);
  const [mandateCategoryList, setMandateCategoryList] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState(false);
  const [saveData, setSaveData] = useState();
  const [disable, setDisable] = useState(false);
  const [mandateReport, setMandateReport] = useState()
  const [isexcelDataLoaded, setIsexcelDataLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  // To get m_id
  const { user } = useSelector((state) => state.auth);
  const subscription_merchant_id= user?.subscription_details?.subscription_merchant_id
const [todayDate, setTodayDate] = useState(splitDate);


  // Hardcoded value for Registration status dropdown
  const options1 = [
    { key: "ALL", value: "ALL" },
    { key: "FAILED", value: "FAILED" },
    { key: "SUCCESS", value: "SUCCESS" },
    { key: "PROCESSED", value: "PROCESSED" },
  ];


  const initialValues = {
    status: "ALL",
    mandatecategorycode: "ALL",
    pfrequency: "ALL",
    fromDate: todayDate,
    endDate: todayDate,
  };



  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
      status: Yup.string().required("Required"),
      mandatecategorycode: Yup.string().required("Required"),
      pfrequency: Yup.string().required("Required"),
  });



  const tempFrequency = [{ key: "All", value: "All" }];
  frequencyList.map((item) => (
    tempFrequency.push({ key: item.description, value: item.description })
  ));

  // 1.b)For frequency API
  const getfrequencyList = async () => {
    await axiosInstance
      .get(API_URL.MANDATE_FREQUENCY)
      .then((res) => {
        setFrequencyList(res.data);
      })
      .catch((err) => { });
  };



  const tempMandateCategory = [{ key: "All", value: "All" }];
  mandateCategoryList.map((item) => (
    tempMandateCategory.push({ key: item.code, value: item.description })
  ));


  const getMandateCategoryList = async () => {
    await axiosInstance
      .get(API_URL.MANDATE_CATEGORY)
      .then((res) => {
        setMandateCategoryList(res.data);
      })
      .catch((err) => { });
  };



  useEffect(() => {
    dispatch(
      fetchFilterForAllMandatesReportsSlice({
        aggregatecode: "",
        merchantcode: "",
        mandatecategorycode: saveData?.mandatecategorycode,
        pfrequency: saveData?.pfrequency,
        status: saveData?.status,
        fromDate: saveData?.fromDate,
        toDate: saveData?.endDate,
        m_id: subscription_merchant_id,
        page: currentPage,
        size: pageSize,
      })
    )
      .then((resp) => {
        const data = resp?.payload?.records;
        const dataCoun = resp?.payload?.count;
        setMandateData(data);
        setDataCount(dataCoun);
        setMandateReport(data);
      })

      .catch((err) => {});
  }, [currentPage, pageSize]);



  useEffect(() => {
    getMandateCategoryList();
    getfrequencyList();
  }, []);


  useEffect(() => {
    if (searchText.length > 0) {
      setMandateData(
        mandateReport.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setMandateData(mandateReport);
    }
  }, [searchText]);



  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "S.No",
      "Mandate Registration Id",
      "Client Code",
      "Client Registration Id",
      "Consumer Reference Number",
      "Mandate Purpose",
      "Payer Utility Code",
      "Payer Name",
      "Mandate End Date",
      "Mandate Max Amount",
      "Mandate Registration Time",
      "Mandate Type",
      "Merchant Id",
      "Mandate Start Date",
      "Message Id",
      "Mandate Collect Amount",
      "Pan No",
      "Mandate Category Code",
      // (npciPaymentBankCode) or (Payment Bank Code)
      "NPCI Payment Bank Code",
      // (payerAccountNumber) or (Payer Account Number)
      "Payer Account Number",
      "Payer Account Type",
      "Payer Bank",
      "Payer Email",
      "Payer Mobile",
      "Telephone Number",
      // (payerBankIfscCode) or (Payer IFSC)
      "Payer Bank IFSC",
      "Authentication Mode",
      "Frequency",
      "Request Type",
      "Scheme Reference No.",
      "Sponsor Bank",
      "Registration Status",
      "Total Amount",
      "UMRN Number",
      "Untill Cancelled",
      "Mandate Creation Date",
      "Mandate Update On",
      "Mandate Update By",
      "Regestration Error Code",
      "Regestration Error Desc",
      "Regestration Npci Ref Id",
      "Accept Details Cre_Dt_Tm",
      "Bank Name",
      "Mandate Category",
      "Mandate Physical Path",
      "isphymndtupdate",
      "isphymndtupdatedon",
      "isphymndtupdatedby",
      "isphymndtapprove",
      "isphymndtapproveon",
      "isphymndtapproveby",

      // Extra fields
      "userType",
      "mandateImage",
      "EMI Amount",
      "mandateCancelled",
      "reqInitPty",
      "accptd",
      "reasonCode",
      "reasonDesc",
      "rejectBy",
      "accptRefNo",
      "tableData",
    ];
    let excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    mandateReport.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        mandateRegistrationId:
          item.mandateRegistrationId === null ? "" : item.mandateRegistrationId,
        clientCode: item.clientCode === null ? "" : item.clientCode,
        clientRegistrationId:
          item.clientRegistrationId === null ? "" : item.clientRegistrationId,
        consumerReferenceNumber:
          item.consumerReferenceNumber === null
            ? ""
            : item.consumerReferenceNumber,
        mandatePurpose: item.mandatePurpose === null ? "" : item.mandatePurpose,
        payerUtilitityCode:
          item.payerUtilitityCode === null ? "" : item.payerUtilitityCode,

        payerName: item.payerName === null ? "" : item.payerName,

        mandateEndDate: item.mandateEndDate === null ? "" : item.mandateEndDate,
        mandateMaxAmount:
          item.mandateMaxAmount === null ? "" : item.mandateMaxAmount,
        mandateRegTime: item.mandateRegTime === null ? "" : item.mandateRegTime,
        mandateType: item.mandateType === null ? "" : item.mandateType,
        merchantId: item.merchantId === null ? "" : item.merchantId,

        mandateStartDate:
          item.mandateStartDate === null ? "" : item.mandateStartDate,

        messageId: item.messageId === null ? "" : item.messageId,
        mandateCollectAmount:
          item.mandateCollectAmount === null ? "" : item.mandateCollectAmount,
        panNo: item.panNo === null ? "" : item.panNo,
        mandateCategoryCode:
          item.mandateCategoryCode === null ? "" : item.mandateCategoryCode,
        npciPaymentBankCode:
          item.npciPaymentBankCode === null ? "" : item.npciPaymentBankCode,
        payerAccountNumber:
          item.payerAccountNumber === null ? "" : item.payerAccountNumber,
        payerAccountType:
          item.payerAccountType === null ? "" : item.payerAccountType,
        payerBank: item.payerBank === null ? "" : item.payerBank,
        payerEmail: item.payerEmail === null ? "" : item.payerEmail,
        payerMobile: item.payerMobile === null ? "" : item.payerMobile,
        telePhone: item.telePhone === null ? "" : item.telePhone,
        payerBankIfscCode:
          item.payerBankIfscCode === null ? "" : item.payerBankIfscCode,
        authenticationMode:
          item.authenticationMode === null ? "" : item.authenticationMode,
        frequency: item.frequency === null ? "" : item.frequency,
        requestType: item.requestType === null ? "" : item.requestType,
        schemeReferenceNumber:
          item.schemeReferenceNumber === null ? "" : item.schemeReferenceNumber,
        sponserBank: item.sponserBank === null ? "" : item.sponserBank,
        regestrationStatus:
          item.regestrationStatus === null ? "" : item.regestrationStatus,
        totalAmount: item.totalAmount === null ? "" : item.totalAmount,
        umrnNumber: item.umrnNumber === null ? "" : item.umrnNumber,
        untilCancelled: item.untilCancelled === null ? "" : item.untilCancelled,
        mandateCreditTime:
          item.mandateCreditTime === null ? "" : item.mandateCreditTime,
        mandateupdatedon:
          item.mandateupdatedon === null ? "" : item.mandateupdatedon,
        mandateupdatedby:
          item.mandateupdatedby === null ? "" : item.mandateupdatedby,
        regestrationErrorCode:
          item.regestrationErrorCode === null ? "" : item.regestrationErrorCode,
        regestrationErrorDesc:
          item.regestrationErrorDesc === null ? "" : item.regestrationErrorDesc,
        regestrationNpciRefId:
          item.regestrationNpciRefId === null ? "" : item.regestrationNpciRefId,
        accptDetails_CreDtTm:
          item.accptDetails_CreDtTm === null ? "" : item.accptDetails_CreDtTm,
        bankName: item.bankName === null ? "" : item.bankName,
        mandatecategory:
          item.mandatecategory === null ? "" : item.mandatecategory,
        mandatPhysicalPath:
          item.mandatPhysicalPath === null ? "" : item.mandatPhysicalPath,
        isphymndtupdate:
          item.isphymndtupdate === null ? "" : item.isphymndtupdate,
        isphymndtupdatedon:
          item.isphymndtupdatedon === null ? "" : item.isphymndtupdatedon,
        isphymndtupdatedby:
          item.isphymndtupdatedby === null ? "" : item.isphymndtupdatedby,
        isphymndtapprove:
          item.isphymndtapprove === null ? "" : item.isphymndtapprove,
        isphymndtapproveon:
          item.isphymndtapproveon === null ? "" : item.isphymndtapproveon,
        isphymndtapproveby:
          item.isphymndtapproveby === null ? "" : item.isphymndtapproveby,
        userType: item.userType === null ? "" : item.userType,
        mandateImage: item.mandateImage === null ? "" : item.mandateImage,
        emiamount: item.emiamount === null ? "" : item.emiamount,
        mandateCancelled:
          item.mandateCancelled === null ? "" : item.mandateCancelled,
        reqInitPty: item.reqInitPty === null ? "" : item.reqInitPty,
        accptd: item.accptd === null ? "" : item.accptd,
        reasonCode: item.reasonCode === null ? "" : item.reasonCode,
        reasonDesc: item.reasonDesc === null ? "" : item.reasonDesc,
        rejectBy: item.rejectBy === null ? "" : item.rejectBy,
        accptRefNo: item.accptRefNo === null ? "" : item.accptRefNo,
        tableData: item.tableData === null ? "" : item.tableData,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Registered-Mandate-Report";
    exportToSpreadsheet(excelArr, fileName);
  };

  const checkValidation = (fromDate = "", toDate = "") => {
    let flag = true;
    if (fromDate === 0 || toDate === "") {
      alert("Please select the date.");
      flag = false;
    } else if (fromDate !== "" || toDate !== "") {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 1095) {
        flag = false;
        alert("The date range should be under 3 years");
      }
    } else {
      flag = true;
    }
    return flag;
  };

  const debitReportSearch = (e) => {
    setSearchText(e.target.value);
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };



  const submitHandler = (values) => { 
    setDisable(true);

    const {
      fromDate,
      endDate,
      pfrequency,
      status,
      mandatecategorycode
    } = values;
    const dateRangeValid = checkValidation(fromDate, endDate);

    if (dateRangeValid) {
      let paramData = {
        aggregatecode: "",
        merchantcode: "",
        mandatecategorycode: mandatecategorycode,
        pfrequency: pfrequency,
        status: status,
        fromDate: fromDate,
        toDate: endDate,
        m_id: subscription_merchant_id,
        page: currentPage,
        size: pageSize,
      };

      setSaveData(values);



    
    dispatch(fetchFilterForAllMandatesReportsSlice(paramData))
      .then((resp) => {
        const data = resp?.payload?.records;
        const dataCoun = resp?.payload?.count;
        setShowData(true);
        setMandateData(data);
        setDataCount(dataCoun);
        setMandateReport(data);
        setDisable(false);
      })

      .catch((err) => {
        toastConfig.errorToast(err);
        setDisable(false);
      });

    }
  }

return (
    <section className="ant-layout">
    <div>
      
    </div>

    <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
      <div className="gx-main-content-wrapper">
        
          <h5 className="ml-4">Registered Mandate Reports</h5>
       

        <section className="features8 cid-sg6XYTl25a flleft w-100">
          <div className="container-fluid">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submitHandler}
            >
              {(formik) => (
                <Form>
                  <div className="form-row mt-2">
                    <div className="form-group col-md-3 mx-4">
                      <FormikController
                        control="select"
                        label="Registration Status"
                        name="status"
                        className="form-control form-select rounded-0 mt-0"
                        options={options1}
                      />
                    </div>

                    <div className="form-group col-md-3 mx-4">
                      <FormikController
                        control="select"
                        label="Mandate Category"
                        name="mandatecategorycode"
                        className="form-control form-select rounded-0 mt-0"
                        options={tempMandateCategory}
                      />
                    </div>

                    <div className="form-group col-md-3 mx-4">
                      <FormikController
                        control="select"
                        label="Frequency"
                        name="pfrequency"
                        className="form-control form-select rounded-0 mt-0"
                        options={tempFrequency}
                      />
                    </div>

                    <div className="form-group col-md-3 mx-4">
                      <FormikController
                        control="input"
                        type="date"
                        label="From Date"
                        name="fromDate"
                        className="form-control rounded-0"
                      />
                    </div>

                    <div className="form-group col-md-3 mx-4">
                      <FormikController
                        control="input"
                        type="date"
                        label="End Date"
                        name="endDate"
                        className="form-control rounded-0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-1 ml-4">
                      <button
                        type="submit"
                        disabled={disable}
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      >
                        Submit
                      </button>
                    </div>

                    {showData === true  ? mandateData?.length===0 ? "" :  (
                       <div className="container-fluid flleft">
                        <div className="row">
                    <div className="form-group col-md-3 mt-2 ml-3 mt-4">
                      <label>Search</label>
                      <input
                        className="form-control"
                        onChange={debitReportSearch}
                        type="text"
                        placeholder="Search Here"
                      />
                    </div>
                   
                    <div className="form-group col-md-3 mt-4">
                      <CountPerPageFilter
                        pageSize={pageSize}
                        dataCount={dataCount}
                        changePageSize={changePageSize}
                      />
                    </div>

                    <div className="form-group col-md-3 mt-5 ">
                      <button
                        className="btn btn-sm text-white"
                        type="button"
                        disabled={isexcelDataLoaded}
                        onClick={() => exportToExcelFn()}
                        style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                  </div>

                       
                    ) : (
                      <></>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>

        <section className="features8 cid-sg6XYTl25a flleft w-100">
          <div className="container-fluid  p-3 my-3 ">
            {/* To search specific data and count total number of records */}
            

          {showData === true  ? (

            
          <div className="col-md-12 col-md-offset-4">
           
            <p className="font-weight-bold">Total Records: {mandateData?.length}</p>
            
          
            <div className="scroll overflow-auto">
              <Table
                row={rowData}
                data={mandateData}
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
      </div>
    </main>
  </section>
  )
}

export default MandateReport