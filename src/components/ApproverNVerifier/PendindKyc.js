/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPendingMerchants } from "../../slices/kycSlice";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import CommentModal from "./Onboarderchant/CommentModal";
import moment from "moment";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";

const PendindKyc = () => {
  const roles = roleBasedAccess();

  const loadingState = useSelector((state) => state.kyc.isLoadingForPending);

  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [pendingKycData, setPendingKycData] = useState([]);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);


  const PendindKycRowData = [
    { id: "1", name: "S. No.",selector:(row)=>row.sno,sortable:true },
    { id: "2", name: "Client Code",selector:(row)=>row.clientCode },
    { id: "3", name: "Company Name",selector:(row)=>row.companyName },
    {
      id: "4",
      name: "Merchant Name",
      selector:(row)=>row.name
    },
    {
      id: "5",
      name: "Email",
      selector:(row)=>row.emailId
    },
    {
      id: "6",
      name: "Contact Number",
      selector:(row)=>row.contactNumber
    },
    {
      id: "7",
      name: "KYC Status",
      selector:(row)=>row.status
    },
    {
      id: "8",
      name: "Registered Date",
      selector:(row)=>covertDate(row.signUpDate)
    },
    {
      id: "9",
      name: "Onboard Type",
      selector:(row)=>row.isDirect
    },
    {
      id: "10",
      name: "View Status",
      selector: (row) => row.viewStatus,
      cell: (row) => (
        <button
        type="button"
        className="btn approve text-white  btn-xs mt-2"
        onClick={() => {
          setKycIdClick(row);
          setIsModalOpen(!isOpenModal);
        }}
        data-toggle="modal"
        data-target="#kycmodaldetail"
      >
       
        View Status
      </button>
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
                    className="btn approve text-white  btn-xs mt-2"
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


  const dispatch = useDispatch();

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
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
    dispatch(kycForPendingMerchants({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setPendingKycData(data);
      })

      .catch((err) => {
        console.log(err);
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize, dispatch]);

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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };



  // console.log("Data Loading",isLoaded)

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
              tabName={"Pending KYC"}
            />
          ) : (
            <></>
          )}
          <KycDetailsModal
            handleModal={setIsModalOpen}
            kycId={kycIdClick}
            isOpenModal={isOpenModal}
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
            notFilledData={pendingKycData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>
        <MerchnatListExportToxl
          URL={"?order_by=-id&search=Pending"}
          filename={"Pending-KYC"}
        />
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
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
        <CustomLoader loadingState={loadingState} />
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
};

export default PendindKyc;
