/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPending } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import CommentModal from "./Onboarderchant/CommentModal";
import moment from "moment";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";

function PendingVerification() {
  const roles = roleBasedAccess();
  const [data, setData] = useState([]);
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const PendingVerificationData = [
    { id: "1", name: "S.No", selector: (row) => row.sno, sortable: true, width:"86px" },
    { id: "2", name: "Client Code", selector: (row) => row.clientCode,
    cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>, width:"130px" },
    { id: "3", name: "Company Name", selector: (row) => row.companyName,
    cell: (row) => <div className="removeWhiteSpace">{row?.companyName}</div>,width:"300px" },
    {
      id: "4",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <div className="removeWhiteSpace">{capitalizeFirstLetter(row?.name ? row?.name : "NA")}</div>,
      width:"180px"
    },
    {
      id: "5",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width:"220px"
    },
    {
      id: "6",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => <div className="removeWhiteSpace">{row?.contactNumber}</div>,
      width:"150px"
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
      cell:(row)=><div>{covertDate(row.signUpDate)}</div>,
      width:"150px"
    },
    {
      id: "9",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "10",
      name: "View Status",
      // selector: (row) => row.viewStatus,
      cell: (row) => (
        <div className="mt-2">
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
          {(roles?.verifier === true && currenTab === 3) ||
          Allow_To_Do_Verify_Kyc_details === true
            ? "Verify KYC "
            : "View Status"}
        </button>
        </div>
      ),
    },
    {
      id: "11",
      name: "Action",
      // selector: (row) => row.actionStatus,
      cell: (row) => (
        <div>
          {roles?.verifier === true ||
          roles?.approver === true ||
          roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white  btn-xs"
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

  const rowData = PendingVerificationData;
  //  const { user } = useSelector((state) => state.auth);
  const roleBasePermissions = roleBasedAccess();
  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingVerification
  );
  const Allow_To_Do_Verify_Kyc_details =
    roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details;

  //  const { loginId } = user;
  //  const id =loginId

  const [dataCount, setDataCount] = useState("");
  const [newRegistrationData, setNewRegistrationData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  const dispatch = useDispatch();

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const pendingVerify = () => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setNewRegistrationData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };

  //---------------GET Api for KycPending-------------------

  useEffect(() => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setKycIdClick(data);
        setData(data);
        setDataCount(dataCoun);
        setNewRegistrationData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
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
          />
        </div>
        <div>
          {openCommentModal === true ? (
            <CommentModal
              commentData={commentId}
              isModalOpen={openCommentModal}
              setModalState={setOpenCommentModal}
              tabName={"Pending Verification"}
            />
          ) : (
            <></>
          )}

          {/* KYC Details Modal */}

          {isOpenModal === true ? (
            <KycDetailsModal
              kycId={kycIdClick}
              handleModal={setIsModalOpen}
              isOpenModal={isOpenModal}
              renderPendingVerification={pendingVerify}
            />
          ) : (
            <></>
          )}
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
        <MerchnatListExportToxl
          URL={"?order_by=-id&search=processing"}
          filename={"Pending-Verification"}
        />
      </div>

      <div className="col-md-12 col-md-offset-4">
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
        <CustomLoader loadingState={loadingState} />
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
}

export default PendingVerification;
