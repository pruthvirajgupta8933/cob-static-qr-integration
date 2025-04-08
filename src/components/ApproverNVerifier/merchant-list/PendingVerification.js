/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPending, kycListByStatus } from "../../../slices/kycSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "../Onboarderchant/CommentModal";
import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
import ListLayout from "./ListLayout";

function PendingVerification({ commonRows }) {
  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const [onboardType, setOnboardType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(100);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [data, setData] = useState([]);

  const [kycIdClick, setKycIdClick] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);
  const PendingVerificationData = [
    ...commonRows,

    {
      id: "16",
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
      id: "17",
      name: "Action",

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

  const roleBasePermissions = roleBasedAccess();
  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingVerification
  );
  const Allow_To_Do_Verify_Kyc_details =
    roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details;

  const pendindVerificationList = useSelector(
    (state) => state.kyc.kycListByStatus?.["Processing"] || {}
  );

  useEffect(() => {
    const pendingVerificationDataList = pendindVerificationList?.results;
    const dataCount = pendindVerificationList?.count;

    if (pendingVerificationDataList) {
      setData(pendingVerificationDataList);
      // setNewRegistrationData(pendingVerificationDataList);
      setKycIdClick(pendingVerificationDataList);
      setDataCount(dataCount);
    }
  }, [pendindVerificationList]); //

  const pendingVerify = () => {
    fetchData();
  };

  const fetchData = useCallback(() => {
    dispatch(
      kycListByStatus({
        orderByField: "-id",
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Processing",
        isDirect: onboardType,
      })
    );
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);

  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div>
          {openCommentModal && (
            <CommentModal
              commentData={commentId}
              isModalOpen={openCommentModal}
              setModalState={setOpenCommentModal}
              tabName={"Pending Verification"}
            />
          )}

          {/* KYC Details Modal */}

          {isOpenModal && (
            <KycDetailsModal
              kycId={kycIdClick}
              handleModal={setIsModalOpen}
              isOpenModal={isOpenModal}
              renderPendingVerification={pendingVerify}
            />
          )}
        </div>
      </div>
      <ListLayout
        loadingState={pendindVerificationList?.loading}
        searchData={pendindVerificationList}
        dataCount={dataCount}
        rowData={PendingVerificationData}
        data={data}
        setData={setData}
        merchantStatus={"Processing"}
        orderByField="-id"
        fetchDataCb={kycListByStatus}
        filterData={{
          setOnboardTypeFn: setOnboardType,
        }}
      />
    </div>
  );
}

export default PendingVerification;
