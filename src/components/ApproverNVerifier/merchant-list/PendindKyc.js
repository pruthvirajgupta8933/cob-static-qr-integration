/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForPendingMerchants } from "../../../slices/kycSlice";
import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import CommentModal from "../Onboarderchant/CommentModal";
import ListLayout from "./ListLayout";

const PendindKyc = ({ commonRows }) => {
  const roles = roleBasedAccess();
  const loadingState = useSelector((state) => state.kyc.isLoadingForPending);

  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isOpenModal, setIsModalOpen] = useState(false);

  const pendindKycList = useSelector((state) => state.kyc.pendingKycuserList);

  const [data, setData] = useState([]);
  const [pendingKycData, setPendingKycData] = useState([]);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [dataCount, setDataCount] = useState("");

  useEffect(() => {
    const pendingKycDataList = pendindKycList?.results;
    const dataCount = pendindKycList?.count;

    if (pendingKycDataList) {
      setData(pendingKycDataList);
      setPendingKycData(pendingKycDataList);
      setKycIdClick(pendingKycDataList);
      setDataCount(dataCount);
    }
  }, [pendindKycList]); //

  const PendindKycRowData = [
    ...commonRows,
    {
      id: "16",
      name: "View Status",
      selector: (row) => row.viewStatus,
      cell: (row) => (
        <div>
          <button
            type="button"
            className="approve text-white  cob-btn-primary   btn-sm "
            onClick={() => {
              setKycIdClick(row);
              setIsModalOpen(!isOpenModal);
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
      id: "17",
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

  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div>
          {openCommentModal && (
            <CommentModal
              commentData={commentId}
              isModalOpen={openCommentModal}
              setModalState={setOpenCommentModal}
              tabName={"Pending KYC"}
            />
          )}
          {isOpenModal && (
            <KycDetailsModal
              handleModal={setIsModalOpen}
              kycId={kycIdClick}
              isOpenModal={isOpenModal}
            />
          )}
        </div>
      </div>
      <ListLayout
        loadingState={loadingState}
        searchData={pendingKycData}
        dataCount={dataCount}
        rowData={PendindKycRowData}
        data={data}
        setData={setData}
        merchantStatus={"Pending"}
        fetchDataCb={kycForPendingMerchants}
      />
    </div>
  );
};

export default PendindKyc;
