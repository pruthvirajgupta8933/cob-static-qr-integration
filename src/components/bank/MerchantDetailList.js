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
import { fetchBankMerchantDetailList } from "../../slices/bank-dashboard-slice/bankDashboardSlice";
import Table from "../../_components/table_components/table/Table";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";

function MerchantDetailList() {

    const dispatch = useDispatch();
    const [txnList, SetTxnList] = useState([]);
    const [searchText, SetSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showData, setShowData] = useState([]);
    const [updateTxnList, setUpdateTxnList] = useState([]);
    const [formValues, setFormValues] = useState({})


    const { auth, bankDashboardReducer, merchantReferralOnboardReducer } = useSelector((state) => state);

    // const { user } = auth;
    const { refrerChiledList, isLoading } = merchantReferralOnboardReducer
    const { merhcantDetailsList, reportLoading } = bankDashboardReducer
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


    let isExtraDataRequired = true;
    let extraDataObj = {};
    extraDataObj = { key: "All", value: "All" };

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
        const paramData = {
            clientCode: objData.clientCode === 'All' ? '' : objData.clientCode,
            fromDate: moment(objData.fromDate).startOf('day').format('YYYY-MM-DD'),
            endDate: moment(objData.endDate).startOf('day').format('YYYY-MM-DD'),
            paymentStatus: objData.paymentStatus,
            page: currentPage,
            length: pageSize,
        };
        dispatch(fetchBankMerchantDetailList(paramData))
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
        // setUpdateTxnList(merhcantDetailsList.results || []);
        setShowData(merhcantDetailsList.results || []);
        // SetTxnList(merhcantDetailsList.results || []);

    }, [merhcantDetailsList]);




    useEffect(() => {
        if (searchText !== "") {
            setShowData(
                merhcantDetailsList?.results?.filter((txnItme) =>
                    Object.values(txnItme)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                )
            );
        } else {
            setShowData(merhcantDetailsList?.results);
        }
    }, [searchText]);



    const exportToExcelFn = () => {
        const excelHeaderRow = [
            "Merchant ID",
            "Merchant Name",
            "Settlement Account",
            "Date Of Onboarding"
        ];
        const excelArr = [excelHeaderRow];
        // eslint-disable-next-line array-callback-return
        merhcantDetailsList?.results?.map((item) => {
            const allowDataToShow = {
                client_name: item.sub_merchant_id || "",
                transaction_date: item.merchant_name || "",
                payment_mode: item.settlement_account || "",
                number_of_txns: DateFormatter(item?.date_of_onboarding, false) || ""
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
            selector: (row) => row.sno,
            sortable: true,
            width: "100px"
        },
        {
            id: "2",
            name: "Merchant ID",
            selector: (row) => row.sub_merchant_id,
            sortable: true
        },
        {
            id: "3",
            name: "Merchant Name",
            selector: (row) => row.merchant_name,
            cell: (row) => <div className="removeWhiteSpace">{row?.merchant_name}</div>,
        },
        {
            id: "4",
            name: "Settlement Account",
            selector: (row) => row.settlement_account
        },
        {
            id: "5",
            name: "Date Of Onboarding",
            selector: (row) => DateFormatter(row.date_of_onboarding, false),
        }
    ]



    return (
        <section>
            <main>
                <h5>Merchant Detail List</h5>
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
                                            {!isLoading ?
                                                <FormikController
                                                    control="select"
                                                    label="Client Code"
                                                    name="clientCode"
                                                    className="form-select rounded-0 mt-0"
                                                    options={clientCodeOption}
                                                />
                                                : <p>Loading...</p>
                                            }
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
                                        {merhcantDetailsList?.count > 0 && (
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
                        {merhcantDetailsList?.count > 0 ? (
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
                                        <DropDownCountPerPage datalength={merhcantDetailsList?.count} />
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
                        {!reportLoading && merhcantDetailsList?.count > 0 && (
                            <>
                                <h6>Total Count : {merhcantDetailsList?.count}</h6>
                                <Table
                                    row={tableRow}
                                    data={showData}
                                    dataCount={merhcantDetailsList?.count}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    changeCurrentPage={changeCurrentPage}
                                />
                            </>

                        )}
                    </div>
                    {reportLoading && <SkeletonTable />}
                    {merhcantDetailsList?.count === 0 && !reportLoading && (
                        <h6 className="text-center font-weight-bold">No Data Found</h6>
                    )}

                </section>
            </main>
        </section>
    )
}

export default MerchantDetailList