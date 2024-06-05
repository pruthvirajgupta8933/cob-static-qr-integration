/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPending } from "../../../slices/kycSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "../Onboarderchant/CommentModal";
// import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
// import MerchnatListExportToxl from "../MerchnatListExportToxl";
import Table from "../../../_components/table_components/table/Table";
import SearchFilter from "../../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../../utilities/DateConvert";
import FrmStatusModal from "./FrmStatusModal";
import { frmMerchantList } from "../../../services/approver-dashboard/frm/frm.service";

function FrmMerchantList() {
  const roles = roleBasedAccess();
  const [onboardType, setOnboardType] = useState("");
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const PendingVerificationData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "90px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
      width: "130px",
    },
    {
      id: "3",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "180px",
    },
    {
      id: "4",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "5",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "6",
      name: "Factum Range",
      selector: (row) => row.factum_range,
    },
    {
      id: "7",
      name: "FRM Message",
      selector: (row) => row. frm_message,
      sortable: true,
      cell: (row) => <div>{row.frm_message}</div>,
      width: "150px",
    },

    {
      id: "8",
      name: "FRM Status",
      selector: (row) => row.frm_status,
      sortable: true,
      cell: (row) => <div>{row.frm_status}</div>,
      width: "150px",
    },
    {
      id: "9",
      name: "FRM Valid",
      selector: (row) => row.is_frm_valid===true ? "Yes" : "NO",
    },
    {
      id: "10",
      name: "Action",

      cell: (row) => (
        <div>
          {(roles?.verifier === true ||
            roles?.approver === true) && (
              <button
                type="button"
                className="approve text-white"
                data-toggle="modal"
                onClick={() => {
                  setCommentId(row);
                  setOpenCommentModal(true);
                }}
                data-target="#exampleModal"
                disabled={row?.clientCode === null ? true : false}
              >
                FRM Score
              </button>
            )}
        </div>
      ),
    },
  ];

  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingVerification
  );

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(100);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);


  const pendindVerificationList = useSelector(
    (state) => state.kyc.pendingVerificationKycList
  );

  const [data, setData] = useState([]);
  const [newRegistrationData, setNewRegistrationData] = useState([]);
  const [kycIdClick, setKycIdClick] = useState([]);
  const [dataCount, setDataCount] = useState("")



  // useEffect(() => {
  //   const pendingVerificationDataList = pendindVerificationList?.results;
  //   const dataCount = pendindVerificationList?.count;

  //   if (pendingVerificationDataList) {
  //     setData(pendingVerificationDataList);
  //     setNewRegistrationData(pendingVerificationDataList);
  //     setKycIdClick(pendingVerificationDataList);
  //     setDataCount(dataCount)
  //   }
  // }, [pendindVerificationList]); //




  const dispatch = useDispatch();

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

  

  const fetchData = useCallback(() => {
    frmMerchantList(
     {
        page: currentPage,
        page_size: pageSize,
      }).then((res)=>{
        const data=res?.data?.results
        const count=res?.data?.count
        setData(data)
        setDataCount(count)
      })
    
    
  }, [currentPage, pageSize, dispatch, ]);

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


   return (
    <div className="container-fluid flleft">
      <div className="form-row">
        {/* <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            setSearchByDropDown={setSearchByDropDown}
            searchTextByApiCall={true}
          />
        </div> */}
        <div>

          {openCommentModal && <FrmStatusModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Pending Verification"}
          />}




        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
        </div>
        {/* <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={newRegistrationData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div> */}
      </div>

      <div>
        <div className="scroll overflow-auto">
          <h6>Total Count : {dataCount}</h6>
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
        {loadingState && <SkeletonTable />}
        {data?.length == 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )}
      </div>
    </div>
  );
}

export default FrmMerchantList;
