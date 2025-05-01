/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved, kycListByStatus } from "../../../slices/kycSlice";
import KycDetailsModal from "../Onboarderchant/ViewKycDetails/KycDetailsModal";
import ListLayout from "./ListLayout";
import CommentModal from "../Onboarderchant/CommentModal";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import DateFormatter from "../../../utilities/DateConvert";
import { KYC_STATUS_APPROVED } from "../../../utilities/enums";
import AgreementUploadTab from "../Onboarderchant/AgreementUploadTab";
import CkycrModal from "../backend-kyc/ckycr/CkycrModal";

function ApprovedMerchant({ commonRows }) {
  const [searchText, setSearchText] = useState("");
  const [commentId, setCommentId] = useState({});
  const [ckycrData, setCkycrData] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openCkycrModal, setOpenCkycrModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [onboardType, setOnboardType] = useState("");

  const approvedMerchantList = useSelector(
    (state) => state.kyc.kycListByStatus?.[KYC_STATUS_APPROVED] || {}
  );
  const [data, setData] = useState([]);
  const [approvedMerchantData, setApprovedMerchantData] = useState([]);
  const [dataCount, setDataCount] = useState("");

  useEffect(() => {
    const approvedList = approvedMerchantList?.results;
    const dataCount = approvedMerchantList?.count;

    if (approvedList) {
      setData(approvedList);
      setApprovedMerchantData(approvedList);
      setKycIdClick(approvedList);
      setDataCount(dataCount);
    }
  }, [approvedMerchantList]); //

  const ApprovedTableData = [
    ...commonRows,

    {
      id: "19",
      name: "Verified Date",
      selector: (row) => row?.verified_date,
      cell: (row) => DateFormatter(row?.verified_date),
      sortable: true,
      width: "150px",
    },
    {
      id: "20",
      name: "Approved Date",
      selector: (row) => row?.approved_date,
      cell: (row) => DateFormatter(row?.approved_date),
      sortable: true,
      width: "150px",
    },

    {
      id: "16",
      name: "View Status",
      width: "110px",
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
            View Status
          </button>
        </div>
      ),
    },
    {
      id: "18",
      name: "Upload Agreement",
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
      id: "17",
      name: "Action",
      width: "200px",
      selector: (row) => row.actionStatus,
      cell: (row) => (
        <div className="d-flex">
          {roles?.verifier === true ||
            roles?.approver === true ||
            roles?.viewer === true ? (
            <button
              type="button"
              className="approve text-white m-1"
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

          {(roles?.verifier === true || roles?.approver === true) && (
            <button
              type="button"
              className="approve text-white m-1"
              onClick={() => {
                setOpenCkycrModal(true);
                setCkycrData(row);
              }}
              disabled={row?.clientCode === null ? true : false}
            >
              CKYCR
            </button>
          )}
        </div>
      ),
    },
  ];

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);
  const dispatch = useDispatch();
  const roles = roleBasedAccess();

  const fetchData = useCallback(
    (startingSerialNumber) => {
      dispatch(
        kycListByStatus({
          orderByField: "-approved_date",
          page: currentPage,
          page_size: pageSize,
          searchquery: searchText,
          merchantStatus: "Approved",
          isDirect: onboardType,
        })
      );
    },
    [currentPage, pageSize, searchText, dispatch, onboardType]
  );

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  /////////////////////////////////////Search filter

  // Only used for refreshing the page by passing it to the props
  const approvedTable = () => {
    fetchData();
  };

  return (
    <div className="container-fluid">
      <ListLayout
        loadingState={approvedMerchantList?.loading}
        searchData={approvedMerchantData}
        dataCount={dataCount}
        rowData={ApprovedTableData}
        data={data}
        setData={setData}
        fetchDataCb={kycListByStatus}
        merchantStatus={KYC_STATUS_APPROVED}
        orderByField="-approved_date"
        filterData={{
          setOnboardTypeFn: setOnboardType,
        }}
      />
      <div>
        {openDocumentModal && (
          <AgreementUploadTab
            documentData={commentId}
            isModalOpen={openDocumentModal}
            setModalState={setOpenDocumentModal}
            tabName={"Approved Tab"}
          />
        )}

        {isOpenModal && (
          <KycDetailsModal
            kycId={kycIdClick}
            handleModal={setIsModalOpen}
            isOpenModal={isOpenModal}
            renderApprovedTable={approvedTable}
          />
        )}
      </div>
      <div>
        {openCommentModal && (
          <CommentModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Approved Tab"}
          />
        )}
        {openCkycrModal && (
          <CkycrModal
            rowData={ckycrData}
            isModalOpen={openCkycrModal}
            setModalState={setOpenCkycrModal}
          />
        )}
      </div>
    </div>
  );
}

export default ApprovedMerchant;
