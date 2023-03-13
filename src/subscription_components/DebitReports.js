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
import { filterForAllDebitReportsSlice } from "../slices/subscription-slice/debitSlice";
import toastConfig from "../utilities/toastTypes";
import { DebitReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";

const DebitReports = (props) => {
    const dispatch = useDispatch();

    const rowData = DebitReportData;
    const [mandateData, setMandateData] = useState([]);


    // For loading
    const [loading, setLoading] = useState(false);
    const [buttonClicked, isButtonClicked] = useState(false);

    // For loader using redux
    const { isLoadingDebitHistory } = useSelector(state => state.DebitReports)
    // console.log("anand>>>>>>>>>>>>>>>>>>>>>>>>>",isLoadingDebitHistory);


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
        { key: "RETURNED", value: "RETURNED" },
        { key: "REALISED", value: "REALISED" },
    ];

    // 1)
    const initialValues = {
        registration_status: "ALL",
        fromDate: todayDate,
        endDate: todayDate,
    };

    // 2) or,
    const validationSchema = Yup.object({
        fromDate: Yup.date().required("Required"),
        endDate: Yup.date()
            .min(Yup.ref("fromDate"), "End date can't be before Start date")
            .required("Required"),
        registration_status: Yup.string().required("Required"),
    });


    // 3)For submit our form
    const submitHandler = (values) => {
        // console.log("Form data ::", values.description);

        setLoading(true);
        isButtonClicked(true);

        const {
            fromDate,
            endDate,
            registration_status,
        } = values;
        const dateRangeValid = checkValidation(fromDate, endDate);

        if (dateRangeValid) {
            let paramData = {
                fromDate: fromDate,
                length: 1000,
                // m_id: loginId ,
                m_id: 23,
                page: 1,
                status: registration_status,
                toDate: endDate,
            };

            dispatch(filterForAllDebitReportsSlice(paramData))
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
    
    // ----------------------------------------------------------------------------------------------------||
    // Mapping data
    const colData = () => {
        return mandateData?.map((user, i) => (
            <tr key={i}>
                <td>{i + 1}</td>
                <td>{user?.transId}</td>
                <td>{user?.umrn}</td>
                <td>{user?.paymentStatus}</td>
                <td>{user?.statusreasoncode}</td>
                <td>{user?.settlementamount}</td>
                <td>{user?.settlementstatus}</td>
                <td>{user?.merchantname}</td>
                <td>{user?.bankMessage}</td>
                <td>{user?.bankReferenceNo}</td>
                <td>{user?.batchRefNumber}</td>
                <td>{user?.transInitDate}</td>
                <td>{user?.transCompleteDate}</td>
                <td>{user?.nextDueDate}</td>
                <td>{user?.statusreasoncode}</td>
                <td>{user?.divisioncode}</td>
                <td>{user?.additionalInfo}</td>
                <td>{user?.remarks}</td>
                <td>{user?.remarks1}</td>
                <td>{user?.remarks2}</td>
                <td>{user?.remarks3}</td>
                <td>{user?.remarks4}</td>
                <td>{user?.remarks5}</td>
                <td>{user?.customertxnrefnumber}</td>
                
                {/* Additional data */}
                <td>{user?.bankId}</td>
                <td>{user?.bankResponseCode}</td>
                <td>{user?.bankname}</td>
                <td>{user?.issettled}</td>
                <td>{user?.issettledsponcer}</td>
                <td>{user?.pAmount}</td>
                <td>{user?.settlementamountsponcer}</td>
                <td>{user?.settlementbankref}</td>
                <td>{user?.settlementbankrefsponcer}</td>
                <td>{user?.settlementby}</td>
                <td>{user?.settlementbysponcer}</td>
                <td>{user?.settlementdate}</td>
                <td>{user?.settlementdatesponcer}</td>
                <td>{user?.settlementremarks}</td>
                <td>{user?.settlementremarkssponcer}</td>
                <td>{user?.settlementstatussponcer}</td>
                <td>{user?.settlementutr}</td>
                <td>{user?.settlementutrsponcer}</td>                
                <td>{user?.transactionAmount}</td>



            </tr>
        ));
    };
    // ---------------------------------------------------------------------------------------------------------------------------------------||

    // --------------------------------------------------------------------------------For excel file-----------------------------------------||
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
        mandateData.map((item, index) => {
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
                <NavBar />
            </div>

            <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
                <div className="gx-main-content-wrapper">
                    <div className="right_layout my_account_wrapper right_side_heading">
                        <h1 className="m-b-sm gx-float-left">Debit Reports</h1>
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
                                {isLoadingDebitHistory ? (
                                    <div className='col-lg-10 col-md-10 mrg-btm- bgcolor' >
                                        <div className="text-center">
                                            <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} >
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

export default DebitReports;
