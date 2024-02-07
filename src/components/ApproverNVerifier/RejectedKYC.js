import React, { useEffect, useState,useMemo,useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForRejectedMerchants } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import CommentModal from "./Onboarderchant/CommentModal";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import Table from "../../_components/table_components/table/Table";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";

const RejectedKYC = () => {
  const roles = roleBasedAccess();
  const loadingState = useSelector((state) => state.kyc.isLoadingForRejected);


  // const [dataCount, setDataCount] = useState("");


  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("");

  const rejectedKycList = useSelector((state) => state.kyc.rejectedKycList);

  // Initialize data state with an empty array
  const [data, setData] = useState([]);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);
  const [kycIdClick, setKycIdClick] = useState([]);
  const [dataCount, setDataCount] = useState("")

  // Watch for changes in rejectedKycList and update the state when data is available
  useEffect(() => {
    const rejectedDataList = rejectedKycList?.results;
    const dataCount = rejectedKycList?.count;

    if (rejectedDataList) {
      setData(rejectedDataList);
      setRejectedMerchants(rejectedDataList);
      setKycIdClick(rejectedDataList);
      setDataCount(dataCount)
    }
  }, [rejectedKycList]); //


  const dispatch = useDispatch();

  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }

  const RejectedTableData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "95px",
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
      width: "230px",
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
      width: "300px",
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
      selector: (row) => row.viewStatus,
      width: "110px",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  cob-btn-primary  btn-sm"
            onClick={() => {
              setKycIdClick(row);
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
      id: "14",
      name: "Action",
      selector: (row) => row.actionStatus,
      cell: (row) => (
        <div>
          {roles?.verifier === true ||
            roles?.approver === true ||
            roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white  cob-btn-primary  btn-sm "
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


  const fetchData = useCallback((startingSerialNumber) => {
    dispatch(
      kycForRejectedMerchants({
              page: currentPage,
              page_size: pageSize,
              searchquery: searchText,
              merchantStatus: "Rejected",
              isDirect: onboardType,
            })
    );
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return rejectedMerchants?.filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchText?.toLocaleLowerCase())
    );
  }, [rejectedMerchants, searchText]);

  

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
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            setSearchByDropDown={setSearchByDropDown}
            searchTextByApiCall={true}
          />
        </div>
        {openCommentModal && <CommentModal
          commentData={commentId}
          isModalOpen={openCommentModal}
          setModalState={setOpenCommentModal}
          tabName={"Rejected Tab"}
        />}



        {isOpenModal && <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderToPendingKyc={fetchData}
        />}


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
            notFilledData={rejectedMerchants}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <div className="">
          {!loadingState &&
            <MerchnatListExportToxl
              URL={"export-excel/?search=Rejected"}
              filename={"Rejected"}
            />
          }
        </div>
      </div>

      <div className="">
        <div className="scroll overflow-auto">
          <h6>Total Count : {dataCount}</h6>
          {!loadingState && data?.length !== 0 && (
            <Table
              row={RejectedTableData}
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

        {data?.length === 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )}
      </div>
    </div>
  );
};

export default RejectedKYC;
