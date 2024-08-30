import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
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

function VerifiedMerchant() {
  const dispatch = useDispatch();
  const verifiedList = useSelector(
    (state) => state.kyc.kycVerifiedList
  );

  const [data, setData] = useState([]);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("")


  useEffect(() => {
    const verifiedDataList = verifiedList?.results;
    const dataCount = verifiedList?.count;

    if (verifiedDataList) {
      setData(verifiedDataList);
      setVerifiedMerchant(verifiedDataList);
      setKycIdClick(verifiedDataList);
      setDataCount(dataCount)
    }
  }, [verifiedList]); //


  function capitalizeFirstLetter(param) {
    // console.log(param,"param")
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }

  const PendingApprovalData = [
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
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      sortable: true,
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
      cell: (row) => DateFormatter(row.signUpDate),
      sortable: true,
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
      name: "Verified Date",
      selector: (row) => row.verified_date,
      cell: (row) => DateFormatter(row.verified_date),
      sortable: true,
      width: "150px",
    },
    {
      id: "11",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "12",
      name: "Emp. Code",
      selector: (row) => row.emp_code,
    },
    {
      id: "13",
      name: "Zone Name",
      selector: (row) => row.zoneName,
    },
    {
      id: "13r",
      name: "Risk Category",
      selector: (row) => row.risk_category_name,
      width: "150px",
    },
    {
      id: "14",
      name: "View Status",
      width: "120px",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  btn-sm  cob-btn-primary  mr-3"
            onClick={() => {
              setKycIdClick(row);
              setIsModalOpen(true);
            }}
            data-toggle="modal"
            data-target="#kycmodaldetail"
          >
            {roles?.approver === true && currenTab === 4
              ? "Approve KYC"
              : "View Status"}
          </button>
        </div>
      ),
    },
    {
      id: "15",
      name: "Action",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  cob-btn-primary  btn-sm"
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
        </div>
      ),
    },
  ];

  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingApproval
  );
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);


  const roles = roleBasedAccess();

  const kycSearch = (e, fieldType) => {
    if (fieldType === "text") {
      setSearchByDropDown(false)
      setSearchText(e);
    }
    if (fieldType === "dropdown") {
      setSearchByDropDown(true)
      setOnboardType(e)
    }
  }



  const verifyMerchant = () => {
    fetchData()

  };

  const searchByText = () => {
    setData(
      verfiedMerchant?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  const fetchData = useCallback((startingSerialNumber) => {
    dispatch(
      kycForVerified({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Verified",
        isDirect: onboardType
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

    <div className="container-fluid">

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

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            currentPage={currentPage}
            changePageSize={changePageSize}
            changeCurrentPage={changeCurrentPage}
          />
        </div>
        {/* <KycDetailsModal kycId={kycIdClick} /> */}
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={verfiedMerchant}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <div className="">
          {!loadingState && dataCount === 0 ? "" :
            <MerchnatListExportToxl
              URL={`export-excel/?search=Verified&isDirect=${onboardType}`}
              filename={"Pending-Approval"}
            />
          }
        </div>
        <div>
        </div>

        {openCommentModal && <CommentModal
          commentData={commentId}
          isModalOpen={openCommentModal}
          setModalState={setOpenCommentModal}
          tabName={"Pending Approval"}
        />}



        {isOpenModal && <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderPendingApproval={verifyMerchant}
        />}


      </div>
      <div className="">
        <div className="scroll overflow-auto">
          <h6>Total Count : {dataCount}</h6>
          {!loadingState && data?.length !== 0 && (
            <Table
              row={PendingApprovalData}
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

export default VerifiedMerchant;
