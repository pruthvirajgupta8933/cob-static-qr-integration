/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import CommentModal from "./Onboarderchant/CommentModal";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import ViewDocumentModal from "./Onboarderchant/ViewDocumentModal";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";


function ApprovedMerchant() {
  const [data, setData] = useState([]);
  const [approvedMerchantData, setApprovedMerchantData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [onboardType, setOnboardType] = useState("")


  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }

  const ApprovedTableData = [
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
      width: "300px",
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
      cell: (row) => covertDate(row.signUpDate),
      sortable: true,
      width: "150px",
    },
    {
      id: "9",
      name: "Submitted Date",
      selector: (row) => row.updated_on,
      sortable: true,
      cell: (row) => <div>{covertDate(row.updated_on)}</div>,
      width: "150px",
    },


    {
      id: "10",
      name: "Verified Date",
      selector: (row) => row?.verified_date,
      cell: (row) => covertDate(row?.verified_date),
      sortable: true,
      width: "150px",
    },
    {
      id: "11",
      name: "Approved Date",
      selector: (row) => row?.approved_date,
      cell: (row) => covertDate(row?.approved_date),
      sortable: true,
      width: "150px",
    },

    {
      id: "12",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "13",
      name: "View Status",
      width:"110px",
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  btn-xs "
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
      name: "Upload Agreement",
      cell: (row) => (
        <div >
          {roles?.verifier === true ||
          roles?.approver === true ||
          roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white  btn-xs "
              data-toggle="modal"
              onClick={() => {
                setCommentId(row);
                setOpenDocumentModal(true);
              }}
              data-target="#exampleModal"
              disabled={row?.clientCode === null ? true : false}
            >
              Upload
            </button>
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      id: "15",
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

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);
  const dispatch = useDispatch();
  const roles = roleBasedAccess();

  const kycSearch = (e, fieldType) => {
    if(fieldType === "text"){
      setSearchByDropDown(false)
      setSearchText(e);
    }
    if(fieldType === "dropdown"){
      setSearchByDropDown(true)
      setOnboardType(e)
    }
  }


  useEffect(() => {
    fetchData();
  }, [currentPage, searchText, pageSize, onboardType]);
  const fetchData = () => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Approved",
        isDirect:onboardType
      })
    )
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setApprovedMerchantData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };

  /////////////////////////////////////Search filter

  // Only used for refreshing the page by passing it to the props
  const approvedTable = () => {
    fetchData();
  };

  const searchByText = () => {
    setData(
      approvedMerchantData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a").toUpperCase();
    return date;
  };

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
    <div className="container-fluid flleft">
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
        
          <CommentModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Approved Tab"}
          />
      

        <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderApprovedTable={approvedTable}
        />
      </div>

      <div>
      
          <ViewDocumentModal
            documentData={commentId}
            isModalOpen={openDocumentModal}
            setModalState={setOpenDocumentModal}
            tabName={"Approved Tab"}
          />
      
        <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderApprovedTable={approvedTable}
        />
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
          notFilledData={approvedMerchantData}
          setData={setData}
          setSearchByDropDown={setSearchByDropDown}
          optionSearchData={optionSearchData}
        />
      </div>
      <div className="mt-1">
      <MerchnatListExportToxl
        URL={
          "export-excel/?search=Approved"
        }
        filename={"Approved"}
      />
      </div>
      <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
        <div className="scroll overflow-auto">
          {!loadingState && data?.length !== 0 && (
            <Table
              row={ApprovedTableData}
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
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
}

export default ApprovedMerchant;
