import React, { useEffect, useState } from "react";
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
import { kycUserList } from "../../slices/kycSlice";



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
   

    const masterClientCode= commentId?.master_client_id

    const [onboardType, setOnboardType] = useState("")

    const dispatch = useDispatch();



    const myMerchantListData = useSelector(
        (state) => state.kyc.myMerchnatUserList
    );

    const myKycAllData=useSelector(
        (state) =>state.kyc.kycUserList
    );

    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;
    const [notFilledData, setNotFilledData] = useState([]);
    const [data, setData] = useState([]);
    const [dataCount, setDataCount] = useState("")
    const [kycIdClick, setKycIdClick] = useState(myKycAllData);

  

    
    // const viewStatusbyId=kycIdClick?.master_client_id

    

    useEffect(() => {
        const myAllMerchantDataList = myMerchantListData?.results;
        const dataCount = myMerchantListData?.count;

        if (myAllMerchantDataList) {
            setData(myAllMerchantDataList);
            setNotFilledData(myAllMerchantDataList);
            // setKycIdClick(myAllMerchantDataList);

            setDataCount(dataCount)
        }
    }, [myMerchantListData]); //


   

    // console.log(loadingState,"my loading")

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

    useEffect(() => {
        dispatch(kycUserList({ login_id: user?.loginId }));
        return () => {
        //   dispatch(clearSuccessTxnsummary());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);



    useEffect(() => {

        fetchData();
    }, [currentPage, pageSize]);

   
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

    const fetchData = (startingSerialNumber) => {
        dispatch(
            MyMerchantListData({
                page: currentPage,
                page_size: pageSize,
                created_by: loginId
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
    //options for search dropdown filter

    const myMerchantListDataa = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row.s_no,
            sortable: true,
            width: "100px",
        },
        {
            id: "2",
            name: "Name",
            selector: (row) => row.name,
            cell: (row) => <div className="removeWhiteSpace">{row?.name}</div>,
            width: "200px",
        },
        {
            id: "3",
            name: "Email",
            selector: (row) => row.email,
            cell: (row) => <div className="removeWhiteSpace">{row?.email}</div>,
            width: "200px",
        },
        {
            id: "4",
            name: "Contact Number",
            selector: (row) => row.mobileNumber,
            cell: (row) => <div className="removeWhiteSpace">{row?.mobileNumber}</div>,
            width: "200px",
        },
        {
            id: "5",
            name: "Status",
            selector: (row) => row.status,
            cell: (row) => <div className="removeWhiteSpace">{row?.status}</div>,
            width: "200px",
        },

        {
            id: "6",
            name: "Created Date",
            selector: (row) => row.createdDate,
            sortable: true,
            cell: (row) => <div>{DateFormatter(row.createdDate)}</div>,
            width: "180px",
            
        },
        


        // {
        //     id: "13",
        //     name: "View Status",
      
        //     cell: (row) => (
        //       <div>
        //         <button
        //           type="button"
        //           className="approve text-white cob-btn-primary btn-sm "
        //           onClick={() => {
        //             setKycIdClick(row);
        //             setIsModalOpen(true);
        //           }}
        //           data-toggle="modal"
        //           data-target="#kycmodaldetail"
        //         >
                 
                   
        //             View Status
        //         </button>
        //       </div>
        //     ),
        //   },
          {
            id: "7",
            name: "Action",
      
            cell: (row) => (
              <div>
                {roles?.verifier === true ||
                  roles?.approver === true ||
                  roles?.viewer === true ? (
                  <button
                    type="button"
                    className="approve text-white  cob-btn-primary   btn-sm"
                    data-toggle="modal"
                    onClick={() => {
                      setCommentId(row);
                      setOpenCommentModal(true);
                    }}
                    data-target="#exampleModal"
                    disabled={row?.clientCode === null ? true : false}
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

            {openCommentModal && <CommentModal
            commentData={masterClientCode}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"My Merchant List"}
          />}



          {/* KYC Details Modal */}

          {isOpenModal && <KycDetailsModal
            kycId={kycIdClick}
            handleModal={setIsModalOpen}
            isOpenModal={isOpenModal}
            // renderPendingVerification={pendingVerify}
          />}
                <div className="form-group col-lg-3 col-md-12 mt-2">
                    <SearchFilter
                        kycSearch={kycSearch}
                        searchText={searchText}
                        searchByText={searchByText}
                        setSearchByDropDown={setSearchByDropDown}
                        searchTextByApiCall={false}
                    />
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
                    <h6>Total Count : {dataCount}</h6>
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
                {data?.length == 0 && !loadingState && (
                    <h6 className="text-center">No data Found</h6>
                )}
            </div>
        </div>
    )
}

export default MyMerchantList