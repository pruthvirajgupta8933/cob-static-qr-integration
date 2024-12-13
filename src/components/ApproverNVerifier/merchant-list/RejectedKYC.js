import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForRejectedMerchants } from "../../../slices/kycSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
import ListLayout from "./ListLayout";
import CommentModal from "../Onboarderchant/CommentModal";

const RejectedKYC = ({ commonRows }) => {
  const roles = roleBasedAccess();
  const loadingState = useSelector((state) => state.kyc.isLoadingForRejected);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [onboardType, setOnboardType] = useState("");

  const rejectedKycList = useSelector((state) => state.kyc.rejectedKycList);

  // Initialize data state with an empty array
  const [data, setData] = useState([]);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);
  const [kycIdClick, setKycIdClick] = useState([]);
  const [dataCount, setDataCount] = useState("");

  // Watch for changes in rejectedKycList and update the state when data is available
  useEffect(() => {
    const rejectedDataList = rejectedKycList?.results;
    const dataCount = rejectedKycList?.count;

    if (rejectedDataList) {
      setData(rejectedDataList);
      setRejectedMerchants(rejectedDataList);
      setKycIdClick(rejectedDataList);
      setDataCount(dataCount);
    }
  }, [rejectedKycList]); //

  const dispatch = useDispatch();

  const RejectedTableData = [
    ...commonRows,

    {
      id: "16",
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

  const fetchData = useCallback(
    (startingSerialNumber) => {
      dispatch(
        kycForRejectedMerchants({
          page: currentPage,
          page_size: pageSize,
          searchquery: searchText,
          merchantStatus: "Rejected",
          isDirect: onboardType,
        })
      );
    },
    [currentPage, pageSize, searchText, dispatch, onboardType]
  );

  return (
    <div className="container-fluid flleft">
      {openCommentModal && (
        <CommentModal
          commentData={commentId}
          isModalOpen={openCommentModal}
          setModalState={setOpenCommentModal}
          tabName={"Rejected Tab"}
        />
      )}

      {isOpenModal && (
        <KycDetailsModal
          kycId={kycIdClick}
          handleModal={setIsModalOpen}
          isOpenModal={isOpenModal}
          renderToPendingKyc={fetchData}
        />
      )}

      <ListLayout
        loadingState={loadingState}
        searchData={rejectedMerchants}
        dataCount={dataCount}
        rowData={RejectedTableData}
        data={data}
        setData={setData}
        fetchDataCb={kycForRejectedMerchants}
        merchantStatus={"Rejected"}
      />
    </div>
  );
};

export default RejectedKYC;
