/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roleBasedAccess } from "../../../../../_components/reuseable_components/roleBasedAccess";
import Table from "../../../../../_components/table_components/table/Table";
import SearchFilter from "../../../../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../../../../_components/loader"
import {
    fetchMerchantProductSubscribeList
} from "../../../../../slices/approver-dashboard/productSubscriptionServiceAdminSlice";
import { axiosInstance, axiosInstanceJWT } from "../../../../../utilities/axiosInstance";
import toastConfig from "../../../../../utilities/toastTypes";
import SkeletonTable from "../../../../../_components/table_components/table/skeleton-table";
import API_URL from "../../../../../config";
import { kycUserList } from "../../../../../slices/kycSlice";

function BankRefMerchantList() {
    const roles = roleBasedAccess();
    const dispatch = useDispatch();

    const [onboardType, setOnboardType] = useState("");
    const [onboardLoding, setOnboardLoading] = useState(false)
    const { user } = useSelector((state) => state.auth);


    const { productSubscriptionServiceAdminReducer } = useSelector((state) => state);
    const { merchantProductSubscribeList, isLoading } = productSubscriptionServiceAdminReducer

    const loginId = user?.loginId;

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }

    const clientProductList = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row.s_no,
            sortable: true,
            width: "100px",
        },
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row.client_code,
            cell: (row) => <div className="removeWhiteSpace">{row?.client_code}</div>,
            width: "130px",
        },
        {
            id: "4",
            name: "Client Name",
            selector: (row) => row.client_name,
            sortable: true,
            cell: (row) => (
                <div className="removeWhiteSpace">
                    {capitalizeFirstLetter(row?.client_name ? row?.client_name : "NA")}
                </div>
            ),
            width: "230px",
        },
        {
            id: "5",
            name: "Email",
            selector: (row) => row.email,
            cell: (row) => <div className="removeWhiteSpace">{row?.email}</div>,
            width: "220px",
        },
        {
            id: "6",
            name: "Payment Gateway (Enterprise)",
            width: "220px",
            cell: (row) => (
                <div>
                    <button
                        type="button"
                        onClick={() => productSubscriptionHandler(row, "pg")}
                        className={`btn-sm ${row?.payment_gateway?.subscription_status === "Subscribed"
                            ? "btn-outline-secondary"
                            : "cob-btn-primary text-white"
                            } ${row.client_code === null ? "client_code_not_available" : ""}`}
                        disabled={row.client_code === null || row?.payment_gateway?.subscription_status === "Subscribed"}
                    >
                        {row.client_code === null ? 'Client code not available' : row?.payment_gateway?.subscription_status === "Subscribed" ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
            ),
        },
        {
            id: "7",
            name: "QwikForm (Enterprise)",
            cell: (row) => (
                <div className="d-flex justify-content-between w-100">
                    <button
                        type="button"
                        onClick={() => {
                            if (row?.payment_gateway?.subscription_status !== "Subscribed") {
                                // Display an alert or toaster message indicating that Payment Gateway needs to be subscribed first.
                                alert("Please subscribe to Payment Gateway before subscribing to QwikForm.");
                                return;
                            }
                            productSubscriptionHandler(row, "qf");
                        }}
                        disabled={row.client_code === null || row?.qwik_form?.subscription_status === "Subscribed"}
                        // className={`btn-sm mx-1 ${row?.qwik_form?.subscription_status === "Subscribed" ? "btn-outline-secondary" : "cob-btn-primary text-white"}`}
                        className={`btn-sm mx-1 ${row?.qwik_form?.subscription_status === "Subscribed"
                            ? "btn-outline-secondary"
                            : "cob-btn-primary text-white"
                            } ${row.client_code === null ? "client_code_not_available" : ""}`}

                    >
                        {/* {(row?.qwik_form?.subscription_status === "Subscribed") ? "Subscribed" : "Subscribe"} */}
                        {row.client_code === null ? 'Client code not available' : row?.qwik_form?.subscription_status === "Subscribed" ? "Subscribed" : "Subscribe"}

                    </button>
                    {(row?.qwik_form?.subscription_status === "Subscribed") &&
                        <button
                            type="button"
                            className="btn-sm mx-1 btn-secondary"
                            disabled={onboardLoding}
                            onClick={() => {

                                qwikFormOnboardHandler(row)
                            }}
                        >
                            Config
                        </button>
                    }
                </div>
            )
        }


    ];

    const productSubscriptionHandler = async (data, appBtn) => {
        let subscribeReqData = {
            clientId: data.client_id
        }

        if (appBtn === "pg") {
            subscribeReqData.applicationId = 10
            subscribeReqData.applicationName = "Payment Gateway"
            subscribeReqData.planId = 47
            subscribeReqData.planName = "Enterprise"
        }
        if (appBtn === "qf") {
            subscribeReqData.applicationId = 15
            subscribeReqData.applicationName = "QwikForm"
            subscribeReqData.planId = 43
            subscribeReqData.planName = "Enterprise"
        }

        axiosInstanceJWT.post(
            API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
            subscribeReqData
        ).then(res => {
            if (res?.status === 200) {
                toastConfig.successToast("Subscribed Successfully")
                fetchData()
            }
        }).catch(error => toastConfig.errorToast(error.response?.data?.detail))
    };


    const qwikFormOnboardHandler = async (data) => {
        try {
            setOnboardLoading(true)
            // fetch data of client
            const respData = await axiosInstanceJWT.get(`${API_URL.clientDataById}?clientId=${data?.client_id}`)
            const postData = respData?.data

            // post data for onboarding in qwik form
            const qwikFormResp = await axiosInstance.post(API_URL.qwickFormOnboard, postData)
            toastConfig.successToast(qwikFormResp?.data?.message)
            setOnboardLoading(false)

        } catch (error) {
            setOnboardLoading(false)
            toastConfig.errorToast(error?.response?.data?.message)
        }
    }







    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);
    // const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
    // const currenTab = parseInt(verifierApproverTab?.currenTab);



    const [data, setData] = useState([]);
    // const [newRegistrationData, setNewRegistrationData] = useState([]);
    // const [kycIdClick, setKycIdClick] = useState([]);
    const [dataCount, setDataCount] = useState(0)


    useEffect(() => {
        const merchantProductSubscribeDataList = merchantProductSubscribeList?.results;
        const dataCount = merchantProductSubscribeList?.count;

        if (merchantProductSubscribeDataList) {
            setData(merchantProductSubscribeDataList);
            // setNewRegistrationData(merchantProductSubscribeDataList);
            // setKycIdClick(merchantProductSubscribeDataList);
            setDataCount(dataCount)
        }
    }, [merchantProductSubscribeList]); //


    const kycSearch = (e, fieldType) => {
        if (fieldType === "text") {
            setSearchByDropDown(false);
            setSearchText(e);
        }
        if (fieldType === "dropdown") {
            setSearchByDropDown(true);
            setOnboardType(e);
        }
    };
    //---------------GET Api for KycPending-------------------
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, onboardType, searchText]);

    const fetchData = () => {
        dispatch(
            fetchMerchantProductSubscribeList({
                page: currentPage,
                page_size: pageSize,
                created_by: loginId,
                roleBased: roles?.accountManager,
                search: searchText
            })
        )
    };


    //function for change current page
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };

    const searchByText = () => {
        changeCurrentPage(1)
    };


    return (
        <div className="container-fluid flleft">
            <div className="form-row">
                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <SearchFilter
                        kycSearch={kycSearch}
                        searchText={searchText}
                        searchByText={searchByText}
                        setSearchByDropDown={setSearchByDropDown}
                        searchTextByApiCall={true}
                    />
                </div>
                <div>

                </div>

                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <CountPerPageFilter
                        pageSize={pageSize}
                        dataCount={dataCount}
                        changePageSize={changePageSize}
                    />
                </div>
            </div>

            <div>
                <div className="scroll overflow-auto">
                    <h6>Total Count : {dataCount}</h6>

                    {!isLoading && data?.length !== 0 && (
                        <Table
                            row={clientProductList}
                            data={data}
                            dataCount={dataCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            changeCurrentPage={changeCurrentPage}
                        />
                    )}
                </div>

                {isLoading && <SkeletonTable />}
                <CustomLoader loadingState={isLoading} />
                {data?.length === 0 && !isLoading && (
                    <h6 className="text-center font-weight-bold">No Data Found</h6>
                )}

            </div>
        </div>
    );
}

export default BankRefMerchantList;