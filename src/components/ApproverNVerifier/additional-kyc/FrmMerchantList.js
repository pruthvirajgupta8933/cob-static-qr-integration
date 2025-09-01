/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import Table from "../../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../../_components/table_components/table/skeleton-table";
import FrmStatusModal from "./FrmStatusModal";
import { frmMerchantList } from "../../../services/approver-dashboard/frm/frm.service";

function FrmMerchantList() {
  const roles = roleBasedAccess();
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const PendingVerificationData = [
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
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "180px",
    },
    {
      id: "4",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "5",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "6",
      name: "Factum Range",
      selector: (row) => row.factum_range,
    },
    {
      id: "7",
      name: "FRM Message",
      selector: (row) => row.frm_message,
      sortable: true,
      cell: (row) => <div>{row.frm_message}</div>,
      width: "150px",
    },

    {
      id: "8",
      name: "FRM Status",
      selector: (row) => row.frm_status,
      sortable: true,
      cell: (row) => <div>{row.frm_status}</div>,
      width: "150px",
    },
    {
      id: "9",
      name: "FRM Valid",
      selector: (row) => row.is_frm_valid === true ? "Yes" : "NO",
    },
    {
      id: "10",
      name: "Action",

      cell: (row) => (
        <div>
          {(roles?.verifier === true ||
            roles?.approver === true) && (
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
                FRM Score
              </button>
            )}
        </div>
      ),
    },
  ];

  const loadingState = useSelector(
    (state) => state.kyc.isLoadingForPendingVerification
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(100);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [data, setData] = useState([]);


  const [dataCount, setDataCount] = useState("")
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    frmMerchantList(
      {
        page: currentPage,
        page_size: pageSize,
      }).then((res) => {
        const data = res?.data?.results
        const count = res?.data?.count
        setData(data)
        setDataCount(count)
      })


  }, [currentPage, pageSize, dispatch,]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };


  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div>

          {openCommentModal && <FrmStatusModal
            commentData={commentId}
            isModalOpen={openCommentModal}
            setModalState={setOpenCommentModal}
            tabName={"Pending Verification"}
          />}
        </div>

        <div className="form-group col-lg-3 col-md-6 col-sm-12 mt-2">
          <CountPerPageFilter
            pageSize={pageSize}
            dataCount={dataCount}
            changePageSize={changePageSize}
          />
        </div>
      </div>

      <div>
        <div className="scroll overflow-auto">
          <h6>Total Count : {dataCount}</h6>
          {!loadingState && (
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
        {loadingState && <SkeletonTable />}
        {/* {data?.length == 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )} */}
      </div>
    </div>
  );
}

export default FrmMerchantList;
