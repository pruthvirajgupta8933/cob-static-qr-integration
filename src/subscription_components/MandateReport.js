//-------------------This Component controls the Mandate Details form part of the mandate registration process----------------------
import React, { useState, useEffect } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import { Formik, Form } from "formik";
import FormikController from "../_components/formik/FormikController";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { axiosInstance } from "../utilities/axiosInstance";
import API_URL from "../config";
import { exportToSpreadsheet } from "../utilities/exportToSpreadsheet";
import { fetchFilterForAllMandatesReportsSlice } from "../slices/subscription-slice/registeredMandateSlice";
import toastConfig from "../utilities/toastTypes";
import { MandateReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";

const MandateReports = (props) => {
  const dispatch = useDispatch();

  const rowData = MandateReportData;

  const [frequencyList, setFrequencyList] = useState([]);
  const [mandateCategoryList, setMandateCategoryList] = useState([]);
  const [mandateData, setMandateData] = useState([]);


  // For loading
  const [loading, setLoading] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);

  // For loader using redux
  const {isLoadingMandateHistory} = useSelector(state => state.Reports)
  // console.log("isLoadingMandateHistory ::",isLoadingMandateHistory)


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

  const loginId = user.loginId;

  const [todayDate, setTodayDate] = useState(splitDate);

  // Hardcoded value for Registration status dropdown
  const options1 = [
    { key: "ALL", value: "ALL" },
    { key: "FAILED", value: "FAILED" },
    { key: "SUCCESS", value: "SUCCESS" },
    { key: "PROCESSED", value: "PROCESSED" },
  ];

  // 1)
  const initialValues = {
    registration_status: "ALL",
    mandate_category: "ALL",
    mandate_frequency: "ALL",
    fromDate: todayDate,
    endDate: todayDate,
    m_id: "",
    // mandatecategorycode: "ALL"
    mandatecategorycode: "",
  };

  // 2) or,
  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
    registration_status: Yup.string().required("Required"),
    mandate_category: Yup.string().required("Required"),
    mandate_frequency: Yup.string().required("Required"),
  });

  // --------------------------------------------------------------------------API management for Frequency dropdown---------------------->
  // 1.a)For frequency API
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
  // ------------------------------------------------------------------------------------------------------------------------------------||

  // -----------------------------------------------------------------------API management for Mandate Category ------------------------------>
  // 2.a)For Mandate Category
  const tempMandateCategory = [{ key: "All", value: "All" }];
  mandateCategoryList.map((item) => (
    tempMandateCategory.push({ key: item.code, value: item.description })
  ));

  // 2.b)For Mandate Category
  const getMandateCategoryList = async () => {
    await axiosInstance
      .get(API_URL.MANDATE_CATEGORY)
      .then((res) => {
        setMandateCategoryList(res.data);
      })
      .catch((err) => { });
  };
  // ---------------------------------------------------------------------------------------------------------------------------------------||

  // 3)For submit our form
  const submitHandler = (values) => {
    // console.log("Form data ::", values.description);

    setLoading(true);
    isButtonClicked(true);

    const {
      fromDate,
      endDate,
      mandate_frequency,
      registration_status,
    } = values;
    const dateRangeValid = checkValidation(fromDate, endDate);

    if (dateRangeValid) {
      let paramData = {
        aggregatecode: "",
        merchantcode: "",
        // mandatecategorycode: "ALL",
        mandatecategorycode: values.description,
        pfrequency: mandate_frequency,
        status: registration_status,
        fromDate: fromDate,
        toDate: endDate,
        // m_id: loginId ,
        // m_id: 2,,
        m_id: 23,
        length: 1000,
        page: 1,
      };

      dispatch(fetchFilterForAllMandatesReportsSlice(paramData))
        .then((res) => {
          const data = res?.payload?.records;
          setLoading(true);
          setMandateData(data);
          setLoading(false);
          // console.log("This is data ::", data);

          if (data.length !== 0) {
            toastConfig.successToast("Data Loaded");
          } else {
            toastConfig.errorToast("Data not found");
          }
        })
        .catch((err) => {
          toastConfig.errorToast("Data not loaded");
          setLoading(false);
        });
    }
  };
  // ---------------------------------------------------------------------------------------------||

  // Validation for 2 years
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

  // ----------------------------------------------------------------------------------------------||

  // 1,2.c)For frequency API and Mandate Category API(search button API)
  useEffect(() => {
    getMandateCategoryList();
    getfrequencyList();
  }, []);

  // ----------------------------------------------------------------------------------------------------||
  // ----------------------------------------------------------------------------------------------------||
  // Mapping data
  const colData = () => {
    return mandateData?.map((user, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{user?.mandateRegistrationId}</td>
        <td>{user?.clientCode}</td>
        <td>{user?.clientRegistrationId}</td>
        <td>{user?.consumerReferenceNumber}</td>
        <td>{user?.mandatePurpose}</td>
        <td>{user?.payerUtilitityCode}</td>
        <td>{user?.payerName}</td>
        <td>{user?.mandateEndDate}</td>
        <td>{user?.mandateMaxAmount}</td>
        <td>{user?.mandateRegTime}</td>
        <td>{user?.mandateType}</td>
        <td>{user?.merchantId}</td>
        <td>{user?.mandateStartDate}</td>
        <td>{user?.messageId}</td>
        <td>{user?.mandateCollectAmount}</td>
        <td>{user?.panNo}</td>
        <td>{user?.mandateCategoryCode}</td>
        <td>{user?.npciPaymentBankCode}</td>
        <td>{user?.payerAccountNumber}</td>
        <td>{user?.payerAccountType}</td>
        <td>{user?.payerBank}</td>
        <td>{user?.payerEmail}</td>
        <td>{user?.payerMobile}</td>
        <td>{user?.telePhone}</td>
        <td>{user?.payerBankIfscCode}</td>
        <td>{user?.authenticationMode}</td>
        <td>{user?.frequency}</td>
        <td>{user?.requestType}</td>
        <td>{user?.schemeReferenceNumber}</td>
        <td>{user?.sponserBank}</td>
        <td>{user?.regestrationStatus}</td>
        <td>{user?.totalAmount}</td>
        <td>{user?.umrnNumber}</td>
        <td>{user?.untilCancelled}</td>
        <td>{user?.mandateCreditTime}</td>
        <td>{user?.mandateupdatedon}</td>
        <td>{user?.mandateupdatedby}</td>
        <td>{user?.regestrationErrorCode}</td>
        <td>{user?.regestrationErrorDesc}</td>
        <td>{user?.regestrationNpciRefId}</td>
        <td>{user?.accptDetails_CreDtTm}</td>
        <td>{user?.bankName}</td>
        <td>{user?.mandatecategory}</td>
        <td>{user?.mandatPhysicalPath}</td>
        <td>{user?.isphymndtupdate}</td>
        <td>{user?.isphymndtupdatedon}</td>
        <td>{user?.isphymndtupdatedby}</td>
        <td>{user?.isphymndtapprove}</td>
        <td>{user?.isphymndtapproveon}</td>
        <td>{user?.isphymndtapproveby}</td>
        <td>{user?.userType}</td>
        <td>{user?.mandateImage}</td>
        <td>{user?.emiamount}</td>
        <td>{user?.mandateCancelled}</td>
        <td>{user?.reqInitPty}</td>
        <td>{user?.accptd}</td>
        <td>{user?.reasonCode}</td>
        <td>{user?.reasonDesc}</td>
        <td>{user?.rejectBy}</td>
        <td>{user?.accptRefNo}</td>
        <td>{user?.tableData}</td>

      </tr>
    ));
  };
  // ---------------------------------------------------------------------------------------------------------------------------------------||

  // --------------------------------------------------------------------------------For excel file-----------------------------------------||
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
    mandateData.map((item, index) => {
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

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>

      <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Registered Mandate Reports</h1>
          </div>

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
                          name="registration_status"
                          className="form-control rounded-0 mt-0"
                          options={options1}
                        />
                      </div>

                      <div className="form-group col-md-3 mx-4">
                        <FormikController
                          control="select"
                          label="Mandate Category"
                          name="description"
                          className="form-control rounded-0 mt-0"
                          options={tempMandateCategory}
                        />
                      </div>

                      <div className="form-group col-md-3 mx-4">
                        <FormikController
                          control="select"
                          label="Frequency"
                          name="mandate_frequency"
                          className="form-control rounded-0 mt-0"
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
                          className="btn btn-sm text-white"
                          style={{ backgroundColor: "rgb(1, 86, 179)" }}
                        >
                          {loading ? <>Loading...</> : <>Search</>}
                        </button>
                      </div>

                      {mandateData?.length > 0 ? (
                        <>
                          <div className="form-row">
                            <div className="form-group col-md-1">
                              <button
                                type="submit"
                                className="btn btn-success text-white ml-5"
                                onClick={() => exportToExcelFn()}
                              >
                                Export
                              </button>
                            </div>
                          </div>
                        </>
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
              {mandateData.length > 0 ? (
                <>
                  <h4>Total Record : {mandateData.length} </h4>
                  <div className="scroll overflow-auto">
                    <Table row={rowData} col={colData} />
                  </div>
                </>
              ) : (
                <></>
              )}
              

              <div className="container">
                {isLoadingMandateHistory ? (
                  <div className='col-lg-10 col-md-10 mrg-btm- bgcolor' >
                    <div className="text-center">
                        <div className="spinner-border text-success" style={{width: '3rem', height: '3rem'}} >
                          <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                 </div>
                ) : buttonClicked === true && mandateData.length === 0 ? (
                  <div className="showMsg">
                    <h1 className="float-centre mr-5">Data Not Found</h1>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>


            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default MandateReports;
