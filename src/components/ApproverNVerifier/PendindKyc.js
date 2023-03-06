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
import { PendindKycData } from "../../utilities/tableData";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";

const PendindKyc = () => {
  const rowData = PendindKycData;
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

  const colData = () => {
    return (
      <>
        {data == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No data found </div>
          </td>
        ) : (
          data?.map((user, i) => (
            <tr>
              <td>{i + 1}</td>
              <td>{user.clientCode}</td>
              <td>{user.companyName}</td>
              <td>{user.name}</td>
              <td>{user.emailId}</td>
              <td>{user.contactNumber}</td>
              <td>{user.status}</td>
              <td>{covertDate(user.signUpDate)}</td>
              <td>{user?.isDirect}</td>
              <td>
                <button
                  type="button"
                  className="btn approve text-white  btn-xs"
                  onClick={() => {
                    setKycIdClick(user);
                    setIsModalOpen(!isOpenModal);
                  }}
                  data-toggle="modal"
                  data-target="#kycmodaldetail"
                >
                  View Status
                </button>
              </td>
              <td>
                {roles?.verifier === true ||
                roles?.approver === true ||
                roles?.viewer === true ? (
                  <button
                    type="button"
                    className="btn approve text-white  btn-xs"
                    data-toggle="modal"
                    onClick={() => {
                      setCommentId(user);
                      setOpenCommentModal(true);
                    }}
                    data-target="#exampleModal"
                    disabled={user?.clientCode === null ? true : false}
                  >
                    Comments
                  </button>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          ))
        )}
      </>
    );
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
              row={rowData}
              col={colData}
              dataCount={dataCount}
              pageSize={pageSize}
              currentPage={currentPage}
              changeCurrentPage={changeCurrentPage}
            />
          )}
        </div>
        {loadingState && (
          <p className="text-center spinner-roll">{<Spinner />}</p>
        )}
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center font-weight-bold">No Data Found</h2>
        )}
      </div>
    </div>
  );
};

export default PendindKyc;
