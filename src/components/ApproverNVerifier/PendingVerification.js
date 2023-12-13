/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState,useMemo,useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPending } from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";

function PendingVerification() {
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
      name: "Company Name",
      selector: (row) => row.companyName,
      cell: (row) => <div className="removeWhiteSpace">{row?.companyName}</div>,
       width: "150px",
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
      width: "180px",
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
      name: "Submitted Date",
      selector: (row) => row.updated_on,
      sortable: true,
      cell: (row) => <div>{DateFormatter(row.updated_on)}</div>,
      width: "150px",
    },
    {
      id: "10",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "11",
      name: "Emp. Code",
      selector: (row) => row.emp_code,
    },
    {
      id: "12",
      name: "Zone Name",
      selector: (row) => row.zoneName,
    },
    {
      id: "13",
      name: "View Status",

      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white cob-btn-primary btn-sm "
            onClick={() => {
              setKycIdClick(row);
              setIsModalOpen(true);
            }}
            data-toggle="modal"
            data-target="#kycmodaldetail"
          >
            {(roles?.verifier === true && currenTab === 3) ||
              Allow_To_Do_Verify_Kyc_details === true
              ? "Verify KYC "
              : "View Status"}
          </button>
        </div>
      ),
    },
    {
      id: "14",
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


  //  const { user } = useSelector((state) => state.auth);
  const roleBasePermissions = roleBasedAccess();
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


  const pendindVerificationList = useSelector(
    (state) => state.kyc.pendingVerificationKycList
  );



  const [data, setData] = useState([]);
  const [newRegistrationData, setNewRegistrationData] = useState([]);
  const [kycIdClick, setKycIdClick] = useState([]);
  const [dataCount, setDataCount] = useState("")



  useEffect(() => {
    const pendingVerificationDataList = pendindVerificationList?.results;
    const dataCount = pendindVerificationList?.count;

    if (pendingVerificationDataList) {
      setData(pendingVerificationDataList);
      setNewRegistrationData(pendingVerificationDataList);
      setKycIdClick(pendingVerificationDataList);
      setDataCount(dataCount)
    }
  }, [pendindVerificationList]); //




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

  const pendingVerify = () => {
    fetchData();

  };

  //---------------GET Api for KycPending-------------------

  // useEffect(() => {
  //   fetchData();
  // }, [currentPage, searchText, searchText, pageSize, onboardType]);

  // const fetchData = () => {
  //   dispatch(
  //     kycForPending({
  //       page: currentPage,
  //       page_size: pageSize,
  //       searchquery: searchText,
  //       merchantStatus: "Processing",
  //       isDirect: onboardType,
  //     })
  //   )

  // };


  const fetchData = useCallback((startingSerialNumber) => {
    dispatch(
          kycForPending({
            page: currentPage,
            page_size: pageSize,
            searchquery: searchText,
            merchantStatus: "Processing",
            isDirect: onboardType,
          })
    );
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);

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

  
const filteredData = useMemo(() => {
    return newRegistrationData?.filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchText?.toLocaleLowerCase())
    );
  }, [newRegistrationData, searchText]);

  

  const searchByText = () => {
    // Set data with the memoized filteredData
    setData(filteredData);
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

          {openCommentModal && <CommentModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Pending Verification"}
          />}



          {/* KYC Details Modal */}

          {isOpenModal && <KycDetailsModal
            kycId={kycIdClick}
            handleModal={setIsModalOpen}
            isOpenModal={isOpenModal}
            renderPendingVerification={pendingVerify}
          />}

        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
        </div>
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={newRegistrationData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <div className="">
          {!loadingState &&
            <MerchnatListExportToxl
              URL={"export-excel/?search=processing"}
              filename={"Pending-Verification"}
            />
          }
        </div>
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
        {/* <CustomLoader loadingState={loadingState} /> */}
        {loadingState && <SkeletonTable />}
        {data?.length == 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )}
      </div>
    </div>
  );
}

export default PendingVerification;
