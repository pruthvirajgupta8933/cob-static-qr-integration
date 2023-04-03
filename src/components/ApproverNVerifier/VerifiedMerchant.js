import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import toastConfig from "../../utilities/toastTypes";
import moment from "moment";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";

function VerifiedMerchant() {

  const dispatch = useDispatch();

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
      width: "400px",
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
      name: "Verified Date",
      selector: (row) => row.verified_date,
      cell: (row) => covertDate(row.verified_date),
      sortable: true,
      width: "150px",
    },
    {
      id: "10",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "11",
      name: "View Status",
      cell: (row) => (
        <div className="mt-2">
          <button
            type="button"
            className="approve text-white  btn-xs"
            onClick={() => {
              setKycIdClick(row);
              setIsModalOpen(true);
            }}
            data-toggle="modal"
            data-target="#kycmodaldetail"
          >
            {roles?.approver === true && currenTab === 4
              ? "Approve KYC "
              : "View Status"}
          </button>
        </div>
      ),
    },
    {
      id: "12",
      name: "Action",
      cell: (row) => (
        <div className="mt-2">
          {roles?.verifier === true ||
          roles?.approver === true ||
          roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white  btn-xs "
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

  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingApproval
  );
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  // console.log(currenTab," Current Tab")
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



  const verifyMerchant = () => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchText, pageSize, onboardType]);

  const fetchData = () => {
    dispatch(
      kycForVerified({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Verified",
        isDirect:onboardType
      })
    )
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setKycIdClick(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };


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

      <div className="form-group col-lg-3 col-md-12 mt-2">
        <CountPerPageFilter
          pageSize={pageSize}
          dataCount={dataCount}
          changePageSize={changePageSize}
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
      <MerchnatListExportToxl
        URL={
          "?search=Verified&order_by=-verified_date&search_map=verified_date"
        }
        filename={"Pending-Approval"}
      />
      <div>
        {openCommentModal === true ? (
          <CommentModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Pending Approval"}
          />
        ) : (
          <></>
        )}

        {isOpenModal ? (
          <KycDetailsModal
            kycId={kycIdClick}
            handleModal={setIsModalOpen}
            isOpenModal={isOpenModal}
            renderPendingApproval={verifyMerchant}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="container-fluid pull-left p-3- my-3- col-md-12- col-md-offset-4">
        <div className="scroll overflow-auto">
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
        <CustomLoader loadingState={loadingState} />
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
}

export default VerifiedMerchant;
