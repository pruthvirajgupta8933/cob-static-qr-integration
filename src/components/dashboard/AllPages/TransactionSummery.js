/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { successTxnSummary } from "../../../slices/dashboardSlice";
import ProgressBar from "../../../_components/reuseable_components/ProgressBar";
import { useRouteMatch, Redirect } from "react-router-dom";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { fetchChiledDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { v4 as uuidv4 } from 'uuid';

function TransactionSummery() {

    const dispatch = useDispatch();
    const { path } = useRouteMatch();
    const userRole = roleBasedAccess()

    let currentDate = new Date().toJSON().slice(0, 10);
    let fromDate = currentDate;
    let toDate = currentDate;

    const [dttype, setDttype] = useState("1");
    const [search, SetSearch] = useState("");
    const [txnList, SetTxnList] = useState([]);
    const [showData, SetShowData] = useState([]);

    const { dashboard, auth, merchantReferralOnboardReducer } = useSelector((state) => state);

    const { refrerChiledList } = merchantReferralOnboardReducer
    const clientCodeData = refrerChiledList?.resp?.results ?? []
    const { isLoading, successTxnsumry } = dashboard;
    const { user } = auth;

    var clientCodeArr = [];
    var totalSuccessTxn = 0;
    var totalAmt = 0;

    // dispatch action when client code change
    useEffect(() => {
        // console.log("user", user)
        let strClientCode, clientCodeArrLength = "";

        if (userRole.merchant !== true) {
            const allClientCode = [];
            // console.log("clientCodeData",clientCodeData)
            clientCodeData?.map((item) => {
                allClientCode.push(item.client_code);
            });

            clientCodeArrLength = allClientCode.length.toString();
            strClientCode = allClientCode.join().toString();
        } else {
            strClientCode = user?.clientMerchantDetailsList[0]?.clientCode;
            clientCodeArrLength = "1";
        }

        const objParam = {
            fromdate: fromDate,
            todate: toDate,
            dttype,
            clientcodelst: strClientCode,
            clientNo: clientCodeArrLength
        };
        var DefaulttxnList = [];

        SetTxnList(DefaulttxnList);
        SetShowData(DefaulttxnList);
        dispatch(successTxnSummary(objParam));
    }, [dttype, merchantReferralOnboardReducer]);

    //make client code array
    if (
        clientCodeData !== null &&
        clientCodeData?.length > 0
    ) {
        clientCodeArr = clientCodeData.map((item) => {
            return item.client_code;
        });
    } else {
        clientCodeArr = [user?.clientMerchantDetailsList[0]?.clientCode];
    }


    const fetchData = () => {
        // const roleType = roles
        const type = userRole.bank ? "bank" : userRole.referral ? "referrer" : "default";
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

    // filter api response data with client code
    useEffect(() => {
        if (successTxnsumry?.length > 0) {
            // console.log("clientCodeArr", clientCodeArr)
            // console.log("successTxnsumry", successTxnsumry)
            var filterData = successTxnsumry?.filter((txnsummery) => {
                if (clientCodeArr.includes(txnsummery.clientCode)) {
                    return clientCodeArr.includes(txnsummery.clientCode);
                }
            });
            SetTxnList(filterData);
            SetShowData(filterData);
        }
    }, [successTxnsumry]);

    useEffect(() => {
        search !== ""
            ? SetShowData(
                txnList.filter((txnItme) =>
                    Object.values(txnItme)
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLocaleLowerCase())
                )
            )
            : SetShowData(txnList);
    }, [search]);

    const handleChange = (e) => {
        SetSearch(e);
    };

    if (user.roleId !== 3 && user.roleId !== 13) {
        if (user.clientMerchantDetailsList === null) {
            return <Redirect to={`${path}/profile`} />;
        }
    }

    showData.map((item) => {
        totalSuccessTxn += item.noOfTransaction;
        totalAmt += item.payeeamount;
    });

    // console.log("showData",showData)
    // console.log("txnList",txnList)

    return (
        <section className="">
            <main>
                <div>

                    <h5 className="mb-5">Transaction Summary</h5>

                    <section className="">
                        <div className="container-fluid p-0">
                            <div className="row">
                                <div className="form-group col-md-3">
                                    <select
                                        className="form-select"
                                        value={dttype}
                                        onChange={(e) => setDttype(e.currentTarget.value)}
                                    >
                                        <option defaultValue="selected" value="1">
                                            Today
                                        </option>
                                        <option value="2">Yesterday</option>
                                        <option value="3">Last 7 Days</option>
                                        <option value="4">Current Month</option>
                                        <option value="5">Last Month</option>
                                    </select>
                                </div>

                                {txnList.length > 0 ? (
                                    <div className="col-lg-3">
                                        {/* <label>Search</label> */}
                                        <input
                                            type="text"
                                            className="form-control "
                                            onChange={(e) => {
                                                handleChange(e.currentTarget.value);
                                            }}
                                            placeholder="Search from here"
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div className="">
                                    {(showData.length !== 0) &&
                                        <p className="m-0">
                                            Total Successful Transactions: {totalSuccessTxn} | Total
                                            Amount {`(INR)`}: {totalAmt}{" "}
                                        </p>
                                    }
                                </div>
                                <table
                                    cellPadding={10}
                                    border={0}
                                    width="100%"
                                    className="tables"
                                >
                                    <tbody>
                                        {(showData.length !== 0 && isLoading === false) &&
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Client's Name</th>
                                                <th>Transactions</th>
                                                <th>Amount</th>
                                            </tr>
                                        }
                                        {showData &&
                                            !isLoading &&
                                            showData.map((item, i) => {
                                                return (
                                                    <tr key={uuidv4()}>
                                                        <td>{i + 1}</td>
                                                        <td>{item.clientName}</td>
                                                        <td>{item.noOfTransaction}</td>
                                                        <td>Rs {item.payeeamount}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>

                                {(showData.length <= 0 && isLoading === false) && (
                                    <div className="text-center p-4 m-4">
                                        <h6>I can't find the result for you with the given search, I'm sorry, could you
                                            try it once again.</h6>
                                    </div>
                                )}

                                {isLoading ? <ProgressBar /> : <></>}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </section>
    );
}

export default TransactionSummery;
