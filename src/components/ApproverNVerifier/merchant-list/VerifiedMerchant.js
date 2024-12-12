import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForVerified } from "../../../slices/kycSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "../Onboarderchant/CommentModal";
import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
import ListLayout from "./ListLayout";
import DateFormatter from "../../../utilities/DateConvert";

function VerifiedMerchant({ commonRows }) {
  const dispatch = useDispatch();
  const verifiedList = useSelector((state) => state.kyc.kycVerifiedList);

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
  const [onboardType, setOnboardType] = useState("");

  useEffect(() => {
    const verifiedDataList = verifiedList?.results;
    const dataCount = verifiedList?.count;

    if (verifiedDataList) {
      setData(verifiedDataList);
      setVerifiedMerchant(verifiedDataList);
      setKycIdClick(verifiedDataList);
      setDataCount(dataCount);
    }
  }, [verifiedList]); //

  const PendingApprovalData = [
    ...commonRows,

    {
      id: "18",
      name: "Verified Date",
      selector: (row) => row.verified_date,
      cell: (row) => DateFormatter(row.verified_date),
      sortable: true,
      width: "150px",
    },

    {
      id: "16",
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
      id: "17",
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

  const verifyMerchant = () => {
    fetchData();
  };

  const fetchData = useCallback(
    (startingSerialNumber) => {
      dispatch(
        kycForVerified({
          page: currentPage,
          page_size: pageSize,
          searchquery: searchText,
          merchantStatus: "Verified",
          isDirect: onboardType,
        })
      );
    },
    [currentPage, pageSize, searchText, dispatch, onboardType]
  );

  return (
    <div className="container-fluid">
      <ListLayout
        loadingState={loadingState}
        searchData={verfiedMerchant}
        dataCount={dataCount}
        rowData={PendingApprovalData}
        data={data}
        setData={setData}
        fetchDataCb={kycForVerified}
        merchantStatus={"Verified"}
      />
      {openCommentModal && (
        <CommentModal
          commentData={commentId}
          isModalOpen={openCommentModal}
          setModalState={setOpenCommentModal}
          tabName={"Pending Approval"}
        />
      )}

      {isOpenModal && (
        <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderPendingApproval={verifyMerchant}
        />
      )}
    </div>
  );
}

export default VerifiedMerchant;
