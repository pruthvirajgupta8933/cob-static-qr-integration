/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {kycForPending} from "../../../../../slices/kycSlice";
import {roleBasedAccess} from "../../../../../_components/reuseable_components/roleBasedAccess";

import Table from "../../../../../_components/table_components/table/Table";
import SearchFilter from "../../../../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../../../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../../../../utilities/DateConvert";
import {
    fetchMerchantProductSubscribeList
} from "../../../../../slices/approver-dashboard/productSubscriptionServiceAdminSlice";
import {axiosInstanceJWT} from "../../../../../utilities/axiosInstance";
import API_URL from "../../../../../config";
import toastConfig from "../../../../../utilities/toastTypes";

function BankRefMerchantList() {
    const roles = roleBasedAccess();
    const [onboardType, setOnboardType] = useState("");

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }

    const PendingVerificationData = [
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
            name: "Payment Gateway",

            cell: (row) => (
                <div>
                    {/*{JSON.stringify(row?.subscribed_plans[0])}*/}
                    <button
                        type="button"
                        onClick={() => productSubscriptionHandler(row, "pg")}
                        className={`btn-sm ${row?.subscribed_plans[0]?.Payment_Gateway?.subscription_status === "Subscribed" ? "btn-secondary" : "cob-btn-primary text-white"}`}
                    >
                        {(row?.subscribed_plans[0]?.Payment_Gateway?.subscription_status==="Subscribed") ? "Subscribed" : "Subscribe" }
                    </button>
                </div>
            ),
        },
        {
            id: "7",
            name: "Quick Form",

            cell: (row) => (
                <div>
                    <button
                        type="button"
                        onClick={() => productSubscriptionHandler(row, "qf")}
                        className={`btn-sm ${row?.subscribed_plans[1]?.QwikForm?.subscription_status === "Subscribed" ? "btn-secondary" : "cob-btn-primary text-white"}`}
                    >
                        {(row?.subscribed_plans[1]?.QwikForm?.subscription_status==="Subscribed") ? "Subscribed" : "Subscribe" }
                    </button>
                </div>
            ),
        },

    ];

    const productSubscriptionHandler = async (data, appBtn) => {
        // payment gateway = pg
        // Qwik form = qf

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





            console.log("subscribeReqData",subscribeReqData)
            console.log("appBtn",appBtn)
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


    //  const { user } = useSelector((state) => state.auth);
    const roleBasePermissions = roleBasedAccess();

    const dispatch = useDispatch();
    const loadingState = useSelector(
        (state) => state.kyc.isLoadingForPendingVerification
    );
    const Allow_To_Do_Verify_Kyc_details =
        roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details;

    //  const [dataCount, setDataCount] = useState("");

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [commentId, setCommentId] = useState({});
    const [pageSize, setPageSize] = useState(100);

    const [isOpenModal, setIsModalOpen] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);
    const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
    const currenTab = parseInt(verifierApproverTab?.currenTab);


    const {productSubscriptionServiceAdminReducer} = useSelector((state) => state);
    const {merchantProductSubscribeList} = productSubscriptionServiceAdminReducer


    const [data, setData] = useState([]);
    const [newRegistrationData, setNewRegistrationData] = useState([]);
    const [kycIdClick, setKycIdClick] = useState([]);
    const [dataCount, setDataCount] = useState("")


    useEffect(() => {
        const merchantProductSubscribeDataList = merchantProductSubscribeList?.results;
        const dataCount = merchantProductSubscribeList?.count;

        if (merchantProductSubscribeDataList) {
            setData(merchantProductSubscribeDataList);
            setNewRegistrationData(merchantProductSubscribeDataList);
            setKycIdClick(merchantProductSubscribeDataList);
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

    const pendingVerify = () => {
        fetchData();

    };

    //---------------GET Api for KycPending-------------------

    useEffect(() => {
        fetchData();
    }, [currentPage, searchText, searchText, pageSize, onboardType]);

    const fetchData = () => {
        dispatch(
            fetchMerchantProductSubscribeList({
                page: currentPage,
                page_size: pageSize,
                // searchquery: searchText,
                // merchantStatus: "Processing",
                // isDirect: "offline",
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
        setData(
            newRegistrationData?.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText?.toLocaleLowerCase())
            )
        );
    };

    const optionSearchData = [
        {
            name: "Select Onboard Type",
            value: "",
        },
        {
            name: "All",
            value: "",
        },
        {
            name: "Online",
            value: "online",
        },
        {
            name: "Offline",
            value: "offline",
        },
    ];

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
                    {!loadingState && data?.length !== 0 && (
                        <Table
                            row={PendingVerificationData}
                            data={data}
                            dataCount={dataCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            changeCurrentPage={changeCurrentPage}
                        />
                    )}
                </div>
                {/* <CustomLoader loadingState={loadingState} /> */}
                {loadingState && <SkeletonTable/>}
                {data?.length == 0 && !loadingState && (
                    <h6 className="text-center font-weight-bold">No Data Found</h6>
                )}
            </div>
        </div>
    );
}

export default BankRefMerchantList;

// export default BankRefMerchantList