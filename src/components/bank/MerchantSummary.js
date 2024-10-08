import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
import { exportToSpreadsheet } from "../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
import { fetchChildDataList } from "../../slices/approver-dashboard/merchantReferralOnboardSlice";
import Yup from "../../_components/formik/Yup";
import toastConfig from "../../utilities/toastTypes";
import { fetchBankMerchantSummary } from "../../slices/bank-dashboard-slice/bankDashboardSlice";
import Table from "../../_components/table_components/table/Table";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";

function MerchantSummary() {

    const dispatch = useDispatch();
    const [txnList, SetTxnList] = useState([]);
    const [searchText, SetSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showData, setShowData] = useState([]);
    const [updateTxnList, setUpdateTxnList] = useState([]);
    const [formValues, setFormValues] = useState({})


    const { auth, bankDashboardReducer, merchantReferralOnboardReducer } = useSelector((state) => state);

    const { user } = auth;
    const { refrerChiledList } = merchantReferralOnboardReducer
    const { merchantSummary, reportLoading } = bankDashboardReducer
    const clientCodeData = refrerChiledList?.resp?.results ?? []

    let now = moment().format("YYYY-M-D");
    let todayDate = now.split("-");
    if (todayDate[1].length === 1) {
        todayDate[1] = "0" + todayDate[1];
    }
    if (todayDate[2].length === 1) {
        todayDate[2] = "0" + todayDate[2];
    }
    todayDate = todayDate.join("-");


    const validationSchema = Yup.object({
        clientCode: Yup.string().required("Required"),
        fromDate: Yup.date().required("Required"),
        endDate: Yup.date()
            .min(Yup.ref("fromDate"), "End date can't be before Start date")
            .required("Required"),
    });


    let isExtraDataRequired = false;
    let extraDataObj = {};
    if (user.roleId === 3 || user.roleId === 13) {
        isExtraDataRequired = true;
        extraDataObj = { key: "All", value: "All" };
    }

    const forClientCode = true;


    let fnKey, fnVal = ""
    let clientCodeListArr = []


    fnKey = "client_code"
    fnVal = "name"
    clientCodeListArr = clientCodeData

    const clientCodeOption = convertToFormikSelectJson(
        fnKey,
        fnVal,
        clientCodeListArr,
        extraDataObj,
        isExtraDataRequired,
        forClientCode
    );


    const initialValues = {
        clientCode: "",
        fromDate: todayDate,
        endDate: todayDate,
        paymentStatus: "all",
        length: 10,
        page: 1

    };


    // fetch the bank child data for the dropdown
    useEffect(() => {
        let postObj = {
            type: 'bank',  // Set the type based on roleType
            login_id: auth?.user?.loginId
        }
        dispatch(fetchChildDataList(postObj));
    }, []);


    const fetchReportData = async (objData) => {

        let strClientCode = "";
        if (objData.clientCode === "All") {
            const allClientCode = [];
            clientCodeListArr?.map((item) => {
                if (item.client_code) {
                    allClientCode.push(item.client_code);
                }

            });
            strClientCode = allClientCode.join().toString();
        } else {
            strClientCode = objData.clientCode;
        }

        const paramData = {
            clientCode: strClientCode,
            fromDate: moment(objData.fromDate).startOf('day').format('YYYY-MM-DD'),
            endDate: moment(objData.endDate).startOf('day').format('YYYY-MM-DD'),
            paymentStatus: objData.paymentStatus,
            page: currentPage,
            length: pageSize,
        };
        dispatch(fetchBankMerchantSummary(paramData))
    }



    const onSubmitHandler = async (values) => {
        try {
            setFormValues(values)
            await fetchReportData(values)
        } catch (error) {
            toastConfig.errorToast("An error occurred");
        }
    };


    useEffect(() => {
        if (formValues?.fromDate && formValues?.endDate) {
            fetchReportData(formValues)
        }
    }, [pageSize, currentPage])



    useEffect(() => {
        setUpdateTxnList(merchantSummary.results || []);
        setShowData(merchantSummary.results || []);
        SetTxnList(merchantSummary.results || []);

    }, [merchantSummary]);




    useEffect(() => {
        if (searchText !== "") {
            setShowData(
                updateTxnList.filter((txnItme) =>
                    Object.values(txnItme)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                )
            );
        } else {
            setShowData(updateTxnList);
        }
    }, [searchText]);



    const exportToExcelFn = () => {
        const excelHeaderRow = [
            "Merchant ID",
            "Merchant Name",
            "Transaction Date",
            "Payment Mode",
            "No. of Txns",
            "GMV Processed",
            "Settlement Date",
            "Settlement Amount"
        ];
        const excelArr = [excelHeaderRow];
        // eslint-disable-next-line array-callback-return
        txnList.map((item) => {
            const allowDataToShow = {
                client_id: item.client_id || "",
                client_name: item.client_name || "",
                transaction_date: item.transaction_date || "",
                payment_mode: item.payment_mode || "",
                number_of_txns: item.number_of_txns || "",
                gmv_processed: item.gmv_processed || "",
                settlement_date: item.settlement_date || "",
                settlement_amount: item.settlement_amount || "",
            };

            excelArr.push(Object.values(allowDataToShow));
        });
        const fileName = "Bank-Merchant-Summary";
        let handleExportLoading = (state) => {
            if (state) {
                alert("Exporting Excel File, Please wait...")
            }
            return state
        }
        exportToSpreadsheet(excelArr, fileName, handleExportLoading);
    };

    const countPageHandler = (val) => {
        setPageSize(val)
    }

    //function for change current page
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };
    const tableRow = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row.id,
            sortable: true
        },
        {
            id: "2",
            name: "Merchant ID",
            selector: (row) => row.client_id,
            sortable: true
        },
        {
            id: "3",
            name: "Merchant Name",
            selector: (row) => row.client_name,
            cell: (row) => <div className="removeWhiteSpace">{row?.client_name}</div>,
        },
        {
            id: "4",
            name: "Transaction Date",
            selector: (row) => row.transaction_date
        },
        {
            id: "5",
            name: "Payment Mode",
            selector: (row) => row.payment_mode,
        },
        {
            id: "6",
            name: "No. of Txns",
            selector: (row) => row.number_of_txns
        },
        {
            id: "7",
            name: "GMV Processed",
            selector: (row) => row.gmv_processed,
        },
        {
            id: "8",
            name: "Settlement Date",
            selector: (row) => row.settlement_date,
            sortable: true
        },

        {
            id: "9",
            name: "Settlement Amount",
            selector: (row) => row.settlement_amount
        },
    ]



    return (
        <section>
            <main>
                <h5>Merchant Summary</h5>
                <section>
                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmitHandler}
                        >
                            {(formik) => (
                                <Form>
                                    <div className="form-row mt-4">
                                        <div className="form-group col-md-3">
                                            <FormikController
                                                control="select"
                                                label="Client Code"
                                                name="clientCode"
                                                className="form-select rounded-0 mt-0"
                                                options={clientCodeOption}
                                            />
                                        </div>

                                        <div className="form-group col-md-3">
                                            <FormikController
                                                control="date"
                                                label="From Date"
                                                id="fromDate"
                                                name="fromDate"
                                                value={formik.values.fromDate ? new Date(formik.values.fromDate) : null}
                                                onChange={date => formik.setFieldValue('fromDate', date)}
                                                format="dd-MM-y"
                                                clearIcon={null}
                                                className="form-control rounded-0 p-0"
                                                required={true}
                                                errorMsg={formik.errors["fromDate"]}
                                            />
                                        </div>

                                        <div className="form-group col-md-3">
                                            <FormikController
                                                control="date"
                                                label="End Date"
                                                id="endDate"
                                                name="endDate"
                                                value={formik.values.endDate ? new Date(formik.values.endDate) : null}
                                                onChange={date => formik.setFieldValue('endDate', date)}
                                                format="dd-MM-y"
                                                clearIcon={null}
                                                className="form-control rounded-0 p-0"
                                                required={true}
                                                errorMsg={formik.errors["endDate"]}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-lg-1">
                                            <button
                                                disabled={reportLoading}
                                                className="btn cob-btn-primary text-white btn-sm"
                                                type="submit"
                                            >Search
                                            </button>
                                        </div>
                                        {txnList?.length > 0 && (
                                            <div className="form-group col-lg-1">
                                                <button
                                                    className="btn btn-sm text-white cob-btn-primary"
                                                    type=""
                                                    onClick={() => {
                                                        exportToExcelFn();
                                                    }}
                                                >
                                                    <i className="fa fa-download"></i> Export
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <hr className="hr" />
                        {txnList?.length > 0 ? (
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label>Search</label>
                                    <input
                                        type="text"
                                        label="Search"
                                        name="search"
                                        placeholder="Search Here"
                                        className="form-control rounded-0"
                                        onChange={(e) => {
                                            SetSearchText(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>Count Per Page</label>
                                    <select
                                        value={pageSize}
                                        rel={pageSize}
                                        className="form-select"
                                        onChange={(e) => countPageHandler(parseInt(e.target.value))}
                                    >
                                        <DropDownCountPerPage datalength={merchantSummary?.count} />
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <> </>
                        )}
                    </div>
                </section>


                <section className="">
                    <div className="scroll overflow-auto">
                        {!reportLoading && txnList?.length !== 0 && (
                            <React.Fragment>
                                <h6>Total Count : {merchantSummary?.count}</h6>
                                <Table
                                    row={tableRow}
                                    data={showData}
                                    dataCount={merchantSummary?.count}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    changeCurrentPage={changeCurrentPage}
                                />
                            </React.Fragment>

                        )}
                    </div>
                    {reportLoading && <SkeletonTable />}
                    {txnList?.length == 0 && !reportLoading && (
                        <h6 className="text-center font-weight-bold">No Data Found</h6>
                    )}
                </section>
            </main>
        </section>
    )
}

export default MerchantSummary