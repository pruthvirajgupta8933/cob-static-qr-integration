/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import Yup from "../../../../_components/formik/Yup";

import FormikController from "../../../../_components/formik/FormikController";
import _ from "lodash";
import {
    clearTransactionHistory,
    exportTxnHistory,
    exportTxnLoadingState,
    fetchTransactionHistorySlice
} from "../../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import API_URL from "../../../../config";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import Notification from "../../../../_components/reuseable_components/Notification";
import moment from "moment";

import { v4 as uuidv4 } from 'uuid';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import classes from "../allpage.module.css"
import { fetchChiledDataList } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import TransactionRefund from "./TransactionRefund";
import CustomModal from "../../../../_components/custom_modal";
import Blob from "blob";
import { saveAs } from "file-saver";
import toastConfig from "../../../../utilities/toastTypes";



const TransactionHistory = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const roles = roleBasedAccess();
    const { auth, dashboard, merchantReferralOnboardReducer } = useSelector((state) => state);
    const { user } = auth;
    const { refrerChiledList } = merchantReferralOnboardReducer
    const clientCodeData = refrerChiledList?.resp?.results ?? []
    const { isLoadingTxnHistory, isExportData } = dashboard;
    const [paymentStatusList, SetPaymentStatusList] = useState([]);
    const [paymentModeList, SetPaymentModeList] = useState([]);
    const [txnList, SetTxnList] = useState([]);
    const [searchText, SetSearchText] = useState("");
    const [show, setShow] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [paginatedata, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showData, setShowData] = useState([]);
    const [updateTxnList, setUpdateTxnList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [clientCodeList, setClientCodeList] = useState([]);
    const [buttonClicked, isButtonClicked] = useState(false);
    const [disable, setDisable] = useState(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [radioInputVal, setRadioInputVal] = useState({})
    const [refundModal, setRefundModal] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const[downloadData,setDownloadData]=useState({})
const initialValuess={
    password:""
}
const validationSchemaa=Yup.object().shape({
    password:Yup.string().required("Required")
})


    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");

    const convertDate = (yourDate) => {
        let date;
        if (yourDate === null) {
            date = "N/A"
        } else {
            date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
        }
        return date;
    };


    const fetchData = () => {
        const roleType = roles
        const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
        if (type !== "default") {
            let postObj = {
                type: type,  // Set the type based on roleType
                login_id: auth?.user?.loginId
            }
            dispatch(fetchChiledDataList(postObj));
        }

    };
    useEffect(() => {
        fetchData();
    }, []);


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

    const clientcode_rolebased = roles.bank
        ? "All"
        : roles.merchant
            ? clientMerchantDetailsList[0]?.clientCode
            : "";

    const clientCode = clientcode_rolebased;
    const todayDate = splitDate;


    const indexMemo = useMemo(() => (currentPage - 1) * pageSize, [pageSize, currentPage])


    const initialValues = {
        clientCode: clientCode,
        fromDate: todayDate,
        endDate: todayDate,
        transaction_status: "All",
        payment_mode: "All",
    };

    const validationSchema = Yup.object({
        fromDate: Yup.date().required("Required"),
        clientCode: Yup.string().required("Client code not found").nullable(),
        endDate: Yup.date()
            .min(Yup.ref("fromDate"), "End date can't be before Start date")
            .required("Required"),
        transaction_status: Yup.string().required("Required"),
        payment_mode: Yup.string().required("Required"),
    });

    const getPaymentStatusList = async () => {
        await axiosInstance
            .get(API_URL.GET_PAYMENT_STATUS_LIST)
            .then((res) => {

                SetPaymentStatusList(res.data);
            })
            .catch((err) => {

            });
    };

    const paymodeList = async () => {
        await axiosInstance
            .get(API_URL.PAY_MODE_LIST)
            .then((res) => {

                SetPaymentModeList(res.data);
            })
            .catch((err) => {

            });
    };


    let isExtraDataRequired = false;
    let extraDataObj = {};
    if (user.roleId === 3 || user.roleId === 13) {
        isExtraDataRequired = true;
        extraDataObj = { key: "All", value: "All" };
    }

    const forClientCode = true;

    let fnKey, fnVal = ""
    let clientCodeListArr = []
    if (roles?.merchant === true) {
        fnKey = "clientCode"
        fnVal = "clientName"
        clientCodeListArr = clientMerchantDetailsList
    } else {
        fnKey = "client_code"
        fnVal = "name"
        clientCodeListArr = clientCodeData
    }
    const clientCodeOption = convertToFormikSelectJson(
        fnKey,
        fnVal,
        clientCodeListArr,
        extraDataObj,
        isExtraDataRequired,
        forClientCode
    );

    useEffect(() => {
        setClientCodeList(clientCodeListArr)
    }, [clientCodeListArr]);

    const tempPayStatus = [{ key: "All", value: "All" }];

    paymentStatusList.map((item) => {
        if (item !== "CHALLAN_ENQUIRED" && item !== "INITIATED") {
            tempPayStatus.push({ key: item, value: item });
        }
    });

    const tempPaymode = [{ key: "All", value: "All" }];
    paymentModeList.map((item) => {
        tempPaymode.push({ key: item.paymodeId, value: item.paymodeName });
    });

    // const pagination = (pageNo) => {
    //     setCurrentPage(pageNo);
    // };


    const submitHandler = (values) => {
        setDownloadData(values)

        setRefundModal(false)
        setRadioInputVal({})

        isButtonClicked(true);
        setDisable(true)
        const { fromDate, endDate, transaction_status, payment_mode } = values;
        console.log("transaction",transaction_status)
        const dateRangeValid = checkValidation(fromDate, endDate);
        if (dateRangeValid) {
            let strClientCode, clientCodeArrLength = "";
            if (values.clientCode === "All") {
                const allClientCode = [];
                clientCodeListArr?.map((item) => {
                    allClientCode.push(item.client_code);
                });
                clientCodeArrLength = allClientCode.length.toString();
                strClientCode = allClientCode.join().toString();
            } else {
                strClientCode = values.clientCode;
                clientCodeArrLength = "1";
            }


            let paramData = {
                clientCode: strClientCode,
                paymentStatus: transaction_status,
                paymentMode: payment_mode,
                fromDate: moment(fromDate).startOf('day').format('YYYY-MM-DD'),
                endDate: moment(endDate).startOf('day').format('YYYY-MM-DD'),
                length: "0",
                page: "0",
                noOfClient: clientCodeArrLength,
            };

            // console.log(paramData,"this is paramdata value")

            dispatch(fetchTransactionHistorySlice(paramData)).then((res) => {
                setDisable(false)
            });
        }
    };
    const checkValidation = (fromDate, toDate) => {
        let flag = true;

        if (!fromDate || !toDate) {
            alert("Please select both start and end dates.");
            flag = false;
        } else {
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);

            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let allowedTxnViewDays = 31;
            let monthAllowed = 1;

            if (user?.roleId === 3) {
                allowedTxnViewDays = 92;
                monthAllowed = 3;
            }

            if (diffDays < 0 || diffDays > allowedTxnViewDays) {
                flag = false;
                alert(`Please choose a ${monthAllowed}-month date range.`);
                setDisable(false)
            }
        }

        return flag;
    };


    useEffect(() => {
        // Remove initiated from transaction history response
        let TxnListArrUpdated = dashboard.transactionHistory;
        setUpdateTxnList(TxnListArrUpdated);
        setShowData(TxnListArrUpdated);
        SetTxnList(TxnListArrUpdated);
        setPaginatedData(
            _(TxnListArrUpdated)
                .slice(0)
                .take(pageSize)
                .value()
        );
    }, [dashboard]);


    useEffect(() => {
        setPaginatedData(
            _(showData)
                .slice(0)
                .take(pageSize)
                .value()
        );
        setPageCount(
            showData.length > 0 ? Math.ceil(showData.length / pageSize) : 0
        );
    }, [pageSize, showData]);


    useEffect(() => {

        const startIndex = (currentPage - 1) * pageSize;
        const paginatedPost = _(showData)
            .slice(startIndex)
            .take(pageSize)
            .value();
        setPaginatedData(paginatedPost);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);




    useEffect(() => {
        getPaymentStatusList();
        paymodeList();
        SetTxnList([]);
        setRadioInputVal({})
        return () => {

            dispatch(clearTransactionHistory());
        };
    }, []);

    useEffect(() => {
        txnList.length > 0 ? setShow(true) : setShow(false);
    }, [txnList]);

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


    const getSearchTerm = (e) => {
        SetSearchText(e.target.value);
    };



   


    const today = new Date();
    const lastThreeMonth = new Date(today);
    lastThreeMonth.setDate(lastThreeMonth.getDate() - 90);
    lastThreeMonth.toLocaleDateString("en-IN");




    const refundModalHandler = () => {
        // console.log("radioInputVal", radioInputVal)
        setRefundModal(true)

    }


    const handleSubmit = (values) => {
        const dateRangeValid = checkValidation(downloadData?.fromDate, downloadData?.endDate);
        
        if (dateRangeValid) {
            let strClientCode = '';
            let clientCodeArrLength = '';
    
            if (values.clientCode === "All") {
                const allClientCode = clientCodeListArr?.map((item) => item.client_code);
                clientCodeArrLength = allClientCode.length.toString();
                strClientCode = allClientCode.join();
            } else {
                strClientCode = values.clientCode;
                clientCodeArrLength = "1";
            }
    
            dispatch(
                exportTxnHistory({
                    clientCode: downloadData?.clientCode,
                    paymentStatus: downloadData?.transaction_status,
                    paymentMode: downloadData?.payment_mode,
                    fromDate: moment(downloadData?.fromDate).startOf('day').format('YYYY-MM-DD'),
                    endDate: moment(downloadData?.endDate).startOf('day').format('YYYY-MM-DD'),
                    length: "0",
                    page: "0",
                    noOfClient: clientCodeArrLength,
                    profile_password: values.password,
                })
            ).then((res) => {
                console.log("res",res)
                if (res.meta.requestStatus === "fulfilled") {
                    const blob = new Blob([res?.payload?.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    saveAs(blob, 'transaction_history.xlsx');
                } else {
                    toastConfig.errorToast(res?.payload);
                }
            });
        }
    };
    

    const modalBody = () => {
        return (
          <div className="container-fluid">
            <Formik
               initialValues={initialValuess}
              validationSchema={validationSchemaa}
    
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
              }}
            >
              {({ resetForm }) => (
                <>
    
                  <div className="modal-body">
    
                   
                    <div className="container">
                      <Form>
                        <div className="row">
                          <div className="col-lg-6">
                            <label className="col-form-label mt-0 p-2">
                              Password<span style={{ color: "red" }}>*</span>
                            </label>
                            <FormikController
                              control="input"
                              type="password"
                              name="password"
                              placeholder="Enter Password"
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-3 mt-3">
                         
                         <button
                           type="submit"
                           className="submit-btn cob-btn-primary text-white btn btn-sm mt-3"
                         //   disabled={disable}
                         >
                           {/* {disable && ( */}
                             {/* <span
                               className="spinner-border spinner-border-sm mr-1"
                               role="status"
                               ariaHidden="true"
                             ></span> */}
                           {/* )} */}
                           Submit
                         </button>
                       
                     </div>
                        
                        </div>
                       
    
    
    
                      </Form>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          
           </div>
    
        )
    
    
      }


    return (
        <section className="">
            <div className="profileBarStatus">
                <Notification />
                {/* refundModal, setRefundModal */}
                {refundModal && <TransactionRefund refundModal={refundModal} setRefundModal={setRefundModal} radioInputVal={radioInputVal} />}

            </div>
            <main>
               
                    <h5 className="">Transaction History</h5>
                    <section>
                        <div className="container-fluid p-0">

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={submitHandler}
                            >
                                {(formik) => (
                                    <Form>
                                        <div className="form-row mt-4">
                                            {(roles?.bank || roles?.referral) && (
                                                <div className="form-group col-lg-2">
                                                    <FormikController
                                                        control="select"
                                                        label="Client Code"
                                                        name="clientCode"
                                                        className="form-select rounded-0"
                                                        options={clientCodeOption}
                                                    />
                                                </div>
                                            )}

                                            <div className="form-group col-lg-3 ">
                                                <label htmlFor="dateRange" className="form-label">Start Date - End Date</label>
                                                <div className={`input-group mb-3 d-flex justify-content-between bg-white ${classes.calendar_border}`}>
                                                    <DatePicker
                                                        id="dateRange"
                                                        selectsRange={true}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        onChange={(update) => {
                                                            const [start, end] = update;
                                                            setStartDate(start);
                                                            setEndDate(end);
                                                            formik.setFieldValue('fromDate', start);
                                                            formik.setFieldValue('endDate', end);
                                                        }}
                                                        dateFormat="dd-MM-yyyy"
                                                        placeholderText="Select Date Range"
                                                        className={`form-control rounded-0 p-0 date_picker ${classes.calendar} ${classes.calendar_input_border}`}
                                                        showPopperArrow={false}
                                                        popperClassName={classes.custom_datepicker_popper}
                                                    />
                                                    <div className="input-group-append" onClick={() => {
                                                        document.getElementById('dateRange').click();
                                                    }}>
                                                        <span className={`input-group-text ${classes.calendar_input_border}`}>  <FaCalendarAlt /></span>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="form-group col-lg-2">
                                                <FormikController
                                                    control="select"
                                                    label="Transactions Status"
                                                    name="transaction_status"
                                                    className="form-select rounded-0 mt-0"
                                                    options={tempPayStatus}
                                                />
                                            </div>

                                            <div className="form-group col-lg-2">
                                                <FormikController
                                                    control="select"
                                                    label="Payment Mode"
                                                    name="payment_mode"
                                                    className="form-select rounded-0 mt-0"
                                                    options={tempPaymode}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-lg-1">
                                                <button
                                                    className="btn btn-sm cob-btn-primary text-white"
                                                    type="submit"
                                                    disabled={disable}
                                                >
                                                    {disable && (
                                                        <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                                                    )}
                                                    Search
                                                </button>
                                            </div>

                                            {txnList?.length > 0 && (
                                                <div className="form-group col-lg-1">
                                                    {/* {
                                                        isExportData === true ?
                                                            <span className="sr-only">Loading...</span> : <></>
                                                    } */}
                                                    <button
                                                         type="button"

                                                         className="approve cob-btn-primary "
                                                         data-toggle="modal"
                                                         data-target="#exampleModalCenter"
                                                         onClick={() => setOpenModal(true)}
                                                    >
                                                        Export
                                                    </button>
                                                </div>

                                            )}

                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </section>


                    <section className="">
                        <div className="container-fluid p-0">
                            {txnList.length > 0 ? (
                                <>
                                    <div className="d-flex">
                                        <div className="form-group col-md-3 mt-2 pl-0">
                                            <label>Search Transaction ID</label>
                                            <input
                                                className="form-control mt-0"
                                                onChange={getSearchTerm}
                                                type="text"
                                                placeholder="Search Here"
                                            />
                                        </div>

                                        <div className="form-group col-md-3  mt-2">
                                            <label>Count Per Page</label>
                                            <select
                                                value={pageSize}
                                                rel={pageSize}
                                                className="form-select"
                                                onChange={(e) => {
                                                    setPageSize(parseInt(e.target.value))
                                                    setCurrentPage(1)
                                                }}
                                            >
                                                <DropDownCountPerPage datalength={txnList.length} />
                                            </select>
                                        </div>

                                        {/* do not remove the comment code */}
                                        <div className="form-group col-md-6  mt-2 d-flex justify-content-end">
                                            <div>
                                                <button
                                                    className="btn cob-btn-primary btn-sm mt-4"
                                                    onClick={() => refundModalHandler()}
                                                    disabled={(radioInputVal?.status?.toLocaleLowerCase() !== "success" && radioInputVal?.status?.toLocaleLowerCase() !== "settled")}
                                                >Refund</button>
                                            </div>
                                        </div>
                                    </div>
                                    <h6>Total Record : {txnList.length} </h6>
                                </>
                            ) : (
                                <></>
                            )}

                            <div className="overflow-auto">
                                <table className="table table-bordered">
                                    <thead>
                                        {txnList.length > 0 ? (
                                            <tr>
                                                <th> {radioInputVal?.status ? <p className="text-primary m-0 user_info" onClick={() => setRadioInputVal({})}> Unselect </p> : "Select"}</th>
                                                <th> S.No</th>
                                                <th> Trans ID</th>
                                                <th> Client Trans ID</th>
                                                <th> Challan Number / VAN</th>
                                                <th> Amount</th>
                                                <th> Transaction Date</th>
                                                <th> Payment Status</th>
                                                <th> Payer First Name</th>
                                                <th> Payer Last Name</th>
                                                <th> Payer Mob number</th>
                                                <th> Payer Email</th>
                                                <th> Client Code</th>
                                                <th> Payment Mode</th>
                                                <th> Payer Address</th>
                                                <th> Encrypted PAN</th>
                                                <th> Udf1</th>
                                                <th> Udf2</th>
                                                <th> Udf3</th>
                                                <th> Udf4</th>
                                                <th> Udf5</th>
                                                <th> Udf6</th>
                                                <th> Udf7</th>
                                                <th> Udf8</th>
                                                <th> Udf9</th>
                                                <th> Udf10</th>
                                                <th> Udf11</th>
                                                <th> Udf12</th>
                                                <th> Udf13</th>
                                                <th> Udf14</th>
                                                <th> Udf15</th>
                                                <th> Udf16</th>
                                                <th> Udf17</th>
                                                <th> Udf18</th>
                                                <th> Udf19</th>
                                                <th> Udf20</th>
                                                <th> Gr.No</th>
                                                <th> Bank Response</th>
                                                <th> IFSC Code</th>
                                                <th> Payer Account No</th>
                                                <th> Bank Txn Id</th>
                                            </tr>
                                        ) : (
                                            <></>
                                        )}
                                    </thead>
                                    <tbody>
                                        {txnList.length > 0 &&
                                            paginatedata.map((item, i) => {
                                                return (
                                                    <tr key={uuidv4()}>
                                                        <td className="text-center">
                                                            {(item?.status?.toLocaleLowerCase() === "success" || item?.status?.toLocaleLowerCase() === "settled") && <input
                                                                name="refund_request"
                                                                value={item.txn_id}
                                                                type="radio"
                                                                onClick={(e) => setRadioInputVal(item)}
                                                                checked={item.txn_id === radioInputVal?.txn_id}
                                                            />}

                                                        </td>
                                                        <td>{indexMemo + (i + 1)}</td>
                                                        <td>{item.txn_id}</td>
                                                        <td>{item.client_txn_id}</td>
                                                        <td>{item.challan_no}</td>
                                                        <td>
                                                            {Number.parseFloat(item.payee_amount).toFixed(2)}
                                                        </td>
                                                        <td>{convertDate(item.trans_date)}</td>
                                                        <td>{item.status}</td>
                                                        <td>{item.payee_first_name}</td>
                                                        <td>{item.payee_lst_name}</td>
                                                        <td>{item.payee_mob}</td>
                                                        <td>{item.payee_email}</td>
                                                        <td>{item.client_code}</td>
                                                        <td>{item.payment_mode}</td>
                                                        <td>{item.payee_address}</td>
                                                        <td>{item.encrypted_pan}</td>
                                                        <td>{item.udf1}</td>
                                                        <td>{item.udf2}</td>
                                                        <td>{item.udf3}</td>
                                                        <td>{item.udf4}</td>
                                                        <td>{item.udf5}</td>
                                                        <td>{item.udf6}</td>
                                                        <td>{item.udf7}</td>
                                                        <td>{item.udf8}</td>
                                                        <td>{item.udf9}</td>
                                                        <td>{item.udf10}</td>
                                                        <td>{item.udf11}</td>
                                                        <td>{item.udf12}</td>
                                                        <td>{item.udf13}</td>
                                                        <td>{item.udf14}</td>
                                                        <td>{item.udf15}</td>
                                                        <td>{item.udf16}</td>
                                                        <td>{item.udf17}</td>
                                                        <td>{item.udf18}</td>
                                                        <td>{item.udf19}</td>
                                                        <td>{item.udf20}</td>
                                                        <td>{item.gr_number}</td>
                                                        <td>{item.bank_message}</td>
                                                        <td>{item.ifsc_code}</td>
                                                        <td>{item.payer_acount_number}</td>
                                                        <td>{item.bank_txn_id}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>

                            <div>

                                {txnList.length > 0 ? (
                                    <div className="d-flex justify-content-center mt-2">
                                        <ReactPaginate
                                            previousLabel={'Previous'}
                                            nextLabel={'Next'}
                                            breakLabel={'...'}
                                            pageCount={pageCount}
                                            marginPagesDisplayed={2} // using this we can set how many number we can show after ...
                                            pageRangeDisplayed={5}
                                            onPageChange={(selectedItem) => {
                                                setCurrentPage(selectedItem.selected + 1)
                                                setRadioInputVal({})

                                            }}
                                            containerClassName={'pagination justify-content-center'}
                                            activeClassName={'active'}
                                            previousLinkClassName={'page-link'}
                                            nextLinkClassName={'page-link'}
                                            disabledClassName={'disabled'}
                                            breakClassName={'page-item'}
                                            breakLinkClassName={'page-link'}
                                            pageClassName={'page-item'}
                                            pageLinkClassName={'page-link'}
                                        />
                                    </div>

                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="container">
                                {isLoadingTxnHistory ? (
                                    <div className="col-lg-12 col-md-12">
                                        <div className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : buttonClicked === true && txnList.length === 0 ? (
                                    <div>
                                        <h5 className="d-flex justify-content-center align-items-center">Data Not
                                            Found</h5>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    </section>
                
            </main>
            <CustomModal modalBody={modalBody} headerTitle={""} modalSize={"modal-md"} modalToggle={openModal}
        fnSetModalToggle={setOpenModal} />
        </section>
    );
}

export default TransactionHistory;
