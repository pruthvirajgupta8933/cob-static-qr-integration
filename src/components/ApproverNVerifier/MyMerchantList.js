import React, { useEffect, useState,useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyMerchantListData } from "../../slices/kycSlice";
import Table from "../../_components/table_components/table/Table";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import { KYC_STATUS_APPROVED, KYC_STATUS_NOT_FILLED, KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_REJECTED, KYC_STATUS_VERIFIED } from "../../utilities/enums";
// import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown"


const MyMerchantList = () => {
    const roles = roleBasedAccess();
    const loadingState = useSelector((state) => state.kyc.isLoading);
    const [searchText, setSearchText] = useState("");
    const [isOpenModal, setIsModalOpen] = useState(false);
    const [commentId, setCommentId] = useState({});
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);
    const [onboardType, setOnboardType] = useState("")
    const [kycSearchStatus, setKycSearchStatus] = useState("All")

    const dispatch = useDispatch();

    const myMerchantListData = useSelector(
        (state) => state.kyc.myMerchnatUserList
    );
    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;
    const [notFilledData, setNotFilledData] = useState([]);
    const [data, setData] = useState([]);
    const [dataCount, setDataCount] = useState("")
    const [kycIdClick, setKycIdClick] = useState([]);

    // console.log("kycIdClick", kycIdClick)


    // const viewStatusbyId=kycIdClick?.master_client_id
     useEffect(() => {
        const myAllMerchantDataList = myMerchantListData?.results;
        const dataCount = myMerchantListData?.count;
        if (myAllMerchantDataList) {
            setData(myAllMerchantDataList);
            setNotFilledData(myAllMerchantDataList);
            setDataCount(dataCount)
        }
    }, [myMerchantListData]); //


const kycSearch = (e, fieldType) => {
        if (fieldType === "text") {
            setSearchByDropDown(false)
            setSearchText(e);
        }
        if (fieldType === "dropdown") {
            setSearchByDropDown(true)
            setOnboardType(e)
        }


    };

    const kycStatus = [
        { key: 'All', values: 'ALL' },
        { key: KYC_STATUS_NOT_FILLED, values: KYC_STATUS_NOT_FILLED },
        { key: KYC_STATUS_PENDING, values: KYC_STATUS_PENDING },
        { key: KYC_STATUS_PROCESSING, values: 'Pending Verification' },
        { key: KYC_STATUS_VERIFIED, values: 'Pending Approval' },
        { key: KYC_STATUS_APPROVED, values: KYC_STATUS_APPROVED },
        { key: KYC_STATUS_REJECTED, values: KYC_STATUS_REJECTED }
      ];
      



    const searchByText = (text) => {
        setData(
            notFilledData?.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText?.toLocaleLowerCase())
            )

        );

    };

    // const fetchData = (startingSerialNumber) => {
    //     dispatch(
    //         MyMerchantListData({
    //             page: currentPage,
    //             page_size: pageSize,
    //             created_by: loginId,
    //             searchquery: searchText,
    //             kyc_status: kycSearchStatus
    //         })
    //     )

    // };


    const fetchData = useCallback((startingSerialNumber) => {
        dispatch(
            MyMerchantListData({
                            page: currentPage,
                            page_size: pageSize,
                            created_by: loginId,
                            searchquery: searchText,
                            kyc_status: kycSearchStatus
                        })
        );
      }, [currentPage, pageSize, searchText, dispatch, onboardType, kycSearchStatus]);

      useEffect(() => {
        fetchData();
      }, [fetchData]);


    //function for change current page
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };
    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };
    //options for search dropdown filter

    const myMerchantListDataa = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row?.s_no,
            sortable: true,

            // width: "100px",
        },
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row?.login_id?.master_client_id?.clientCode,
            sortable: true,
            cell: (row) => <div>{row?.login_id?.master_client_id?.clientCode}</div>,
        },
        {
            id: "3",
            name: "Name",
            selector: (row) => row?.login_id.name,
            cell: (row) => <div className="removeWhiteSpace">{row?.login_id?.name}</div>,
            width: "200px",
        },

       
        {
            id: "4",
            name: "Email",
            selector: (row) => row.email,
            cell: (row) => <div className="removeWhiteSpace">{row?.login_id?.email}</div>,
            width: "200px",
        },
        {
            id: "5",
            name: "Contact Number",
            selector: (row) => row.mobileNumber,
            cell: (row) => <div className="removeWhiteSpace"> {row?.login_id?.mobileNumber}</div>,
            // width: "200px",
        },
        {
            id: "6",
            name: "Account Status",
            selector: (row) => row.status,
            cell: (row) => <div className="removeWhiteSpace">{row?.login_id?.status}</div>,
            // width: "200px",
        },
       

{
            id: "7",
            name: "Created Date",
            selector: (row) => row.createdDate,
            sortable: true,
            cell: (row) => <div>{DateFormatter(row?.login_id.createdDate)}</div>,
            width: "170px",

        },


        {
            id: "8",
            name: "View Status",

            cell: (row) => (
                <div>
                    <button
                        type="button"
                        className="approve text-white cob-btn-primary btn-sm "
                        onClick={() => {
                            setKycIdClick(row?.login_id);
                            setIsModalOpen(true);
                        }}
                        data-toggle="modal"
                        data-target="#kycmodaldetail"
                    >


                        View Status
                    </button>
                </div>
            ),
        },
        {
            id: "9",
            name: "Action",

            cell: (row) => (
                <div>
                    {
                        roles?.viewer === true || roles?.accountManager === true && row?.login_id?.master_client_id?.clientCode !== undefined ? (
                            <button
                                type="button"
                                className="approve text-white  cob-btn-primary   btn-sm"
                                data-toggle="modal"
                                onClick={() => {
                                    setCommentId(row?.login_id?.master_client_id);
                                    setOpenCommentModal(true);
                                }}
                                data-target="#exampleModal"
                            >
                                Comments
                            </button>
                        ) : (
                            <></>
                        )}
                </div>
            ),
        },

    ];





    return (
        <div className="container-fluid flleft">
            <div className="mb-5">
                <h5 className="">My Merchant List</h5>
            </div>
            <div className="form-row">

                {openCommentModal &&
                    <CommentModal
                        commentData={{ clientCode: commentId?.clientCode, clientName: commentId?.clientName }}
                        isModalOpen={openCommentModal}
                        setModalState={setOpenCommentModal}
                        tabName={"My Merchant List"}
                    />}




                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <SearchFilter
                        kycSearch={kycSearch}
                        searchText={searchText}
                        searchByText={searchByText}
                        setSearchByDropDown={setSearchByDropDown}
                        searchTextByApiCall={true}
                    />
                </div>

                {/* {console.log(kycStatus)} */}
                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <label>Select KYC Status</label>
                    <select class="form-select" onChange={(e) => setKycSearchStatus(e.currentTarget.value)}>
                        {kycStatus?.map((d, i) => (
                            <option value={d?.key} key={i}>{d.values}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <CountPerPageFilter
                        pageSize={pageSize}
                        dataCount={dataCount}
                        currentPage={currentPage}
                        changePageSize={changePageSize}
                        changeCurrentPage={changeCurrentPage}
                    />
                </div>


            </div>

            <div>

                <div className="scroll overflow-auto">
                    {/* here i compare the kycSearchstatus value with kycStatus dropdown using find which return true and false */}
                    <h6>Total Count ({kycSearchStatus ? kycStatus.find(item => item.key === kycSearchStatus)?.values : ''}) : {dataCount}</h6>
                    {!loadingState && data?.length !== 0 && (
                        <Table
                            row={myMerchantListDataa}
                            dataCount={dataCount}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            changeCurrentPage={changeCurrentPage}
                            data={data}
                        />
                    )}
                </div>
                {/* <CustomLoader loadingState={loadingState} /> */}
                {loadingState &&
                    <SkeletonTable />
                }

                {isOpenModal && <KycDetailsModal
                    kycId={kycIdClick}
                    handleModal={setIsModalOpen}
                    isOpenModal={isOpenModal}
                />}


                {data?.length == 0 && !loadingState && (
                    <h6 className="text-center">No data Found</h6>
                )}
            </div>
        </div>
    )
}

export default MyMerchantList