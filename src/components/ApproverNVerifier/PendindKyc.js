/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPendingMerchants } from "../../slices/kycSlice";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "./Onboarderchant/CommentModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";

const PendindKyc = () => {
  const roles = roleBasedAccess();

  const loadingState = useSelector((state) => state.kyc.isLoadingForPending);
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  
  
const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("");

  


  const pendindKycList = useSelector(
    (state) => state.kyc.pendingKycuserList 
  );

 

 
  // );
  const [data, setData] = useState([]);
  const [pendingKycData, setPendingKycData] = useState([]);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [dataCount,setDataCount]=useState("")

  useEffect(() => {
    const pendingKycDataList=pendindKycList?.results
  const dataCount=pendindKycList?.count

    if (pendingKycDataList) {
      setData(pendingKycDataList);
      setPendingKycData(pendingKycDataList);
      setKycIdClick(pendingKycDataList);
      setDataCount(dataCount)
    }
  }, [pendindKycList]); //







  
  const PendindKycRowData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "86px",
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
      name: "Company Name",
      selector: (row) => row.companyName,
      cell: (row) => <div className="removeWhiteSpace">{row?.companyName}</div>,
      width: "300px",
    },

    {
      id: "4",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "200px",
    },
    {
      id: "5",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "6",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "7",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "8",
      name: "Registered Date",
      selector: (row) => row.signUpDate,
      sortable: true,
      cell: (row) => <div>{DateFormatter(row.signUpDate)}</div>,
      width: "150px",
    },
    {
      id: "9",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "10",
      name: "View Status",
      selector: (row) => row.viewStatus,
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  cob-btn-primary   btn-sm "
            onClick={() => {
              setKycIdClick(row);
              setIsModalOpen(!isOpenModal);
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
      id: "11",
      name: "Action",
      selector: (row) => row.actionStatus,
      cell: (row) => (
        <div>
          {roles?.verifier === true ||
          roles?.approver === true ||
          roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white"
              data-toggle="modal"
              onClick={() => {
                setCommentId(row);
                setOpenCommentModal(true);
              }}
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

  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);

  const fetchData = () => {
    dispatch(
      kycForPendingMerchants({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Pending",
        isDirect: onboardType,
      })
    )
      
  };

  const searchByText = () => {
    setData(
      pendingKycData?.filter((item) =>
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
            searchTextByApiCall={true}
            setSearchByDropDown={setSearchByDropDown}
          />
        </div>
        <div>
            {openCommentModal && <CommentModal
              commentData={commentId}
              isModalOpen={openCommentModal}
              setModalState={setOpenCommentModal}
              tabName={"Pending KYC"}
            /> } 
            {isOpenModal && <KycDetailsModal
            handleModal={setIsModalOpen}
            kycId={kycIdClick}
            isOpenModal={isOpenModal}
          />}
          
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
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={pendingKycData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <div className="">
        {!loadingState &&
          <MerchnatListExportToxl
            URL={"export-excel/?search=Pending"}
            filename={"Pending-KYC"}
          />
        }
        </div>
      </div>

      <div>
        <div className="scroll overflow-auto">
        <h6>Total Count : {dataCount}</h6>
          {!loadingState && data?.length !== 0 && (
            <Table
              row={PendindKycRowData}
              data={data}
              dataCount={dataCount}
              pageSize={pageSize}
              currentPage={currentPage}
              changeCurrentPage={changeCurrentPage}
            />
          )}
        </div>
        {/* <CustomLoader loadingState={loadingState} /> */}
        {loadingState && <SkeletonTable />}
        {data?.length == 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )}
      </div>
    </div>
  );
};

export default PendindKyc;
