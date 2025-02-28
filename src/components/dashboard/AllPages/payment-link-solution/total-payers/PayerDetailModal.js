import React, { useEffect, useState } from "react";
import Table from "../../../../../_components/table_components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllPayerData, getTxnData } from "../paylink-solution-slice/paylinkSolutionSlice";
import TransactionComponent from "../recent-transaction/TransactionComponent";
import CustomLoader from "../../../../../_components/loader";
// import InfiniteScroll from "react-infinite-scroll-component";
// import classes from "./transaction.module.css";
// import moment from "moment";
// import { dateFormatBasic } from "../../../../utilities/DateConvert";
// import CustomLoader from "../../../../_components/loader";

function PayerDetailModal({ selectedRow, fnSetModalToggle }) {

  const [udfToggle, setUdfToggle] = useState(false);
  const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const [txnData, setTxnData] = useState([]);
  // const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch()
  const { paymentLinkSolutionSliceReducer } = useSelector(state => state)
  const { singlePayerData, txnTableData, txnLoading } = paymentLinkSolutionSliceReducer


  // const fetchData = async () => {
  //   const payload = {
  //     payer_id: selectedRow?.id,
  //     page: page,
  //     page_size: "10",
  //     // client_code: "LPSD1",

  //     order_by: "-id"
  //   }
  //   const newData = await dispatch(getTxnData(payload));
  //   const results = newData?.payload?.results
  //   if (results.length === 0) {
  //     setHasMore(false);
  //   } else {
  //     setTxnData(prevData => [...prevData, ...results]);
  //     setPage(prevPage => prevPage + 1);
  //   }
  // };

  useEffect(() => {
    const payload = {
      payer_id: selectedRow?.id,
      page: currentPage,
      page_size: "10",
      order_by: "-id"
    }
    dispatch(getTxnData(payload));
  }, [currentPage])


  useEffect(() => {

    dispatch(getAllPayerData({ "payer_id": selectedRow?.id }))
    return () => {
      setUdfToggle(false);
    };
  }, []);


  const rowData = [
    {
      id: "0",
      name: "Create Date & Time",
      selector: (row) => row.link_creation_date,
      sortable: true,
      // width: "70px"
    },
    {
      id: "1",
      name: "Amount",
      selector: (row) => row.trans_amount,
    },
    {
      id: "2",
      name: "Status",
      selector: (row) => row.trans_status,
      sortable: true,
      // width: "200px"
    },
    {
      id: "3",
      name: "Mobile No.",
      selector: (row) => row.payer_mobile,
      width: "120px"
    },
    {
      id: "4",
      name: "Payment Mode",
      selector: (row) => row.trans_mode,
      sortable: true,
      width: "180px"
    },
    {
      id: "5",
      name: "Payment Date & Time",
      selector: (row) => row.trans_complete_date,
      sortable: true,
      width: "180px"
    }
  ]

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };


  return (
    <div
      className={`modal fade mymodals show d-flex justify-content-end zindex-modal rounded`}
      data-bs-backdrop="true"
      data-bs-keyboard="true"
      tabIndex="-1"
      onClick={() => fnSetModalToggle(false)}
    >
      <div
        className={`modal-dialog modal-xl m-0 `}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "845px" }}
      >
        <div className="modal-content rounded-0" style={{ height: "800px" }}>
          <div className="d-flex justify-content-start p-3 ">
            {/* <h1 className="modal-title fs-5 border-start border-5 ps-2">
              Sabpaisa Transaction ID :{" "}
              <span className="text-primary">lllllllllllllll</span>
            </h1> */}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => fnSetModalToggle(false)}
            />
          </div>
          <div className="modal-body">
            <h5 className="mb-5">Payer: {singlePayerData?.payer_name}</h5>

            <div className="mb-5">
              <h6>Payer Details</h6>

              <table
                className={`table table-striped-columns table-bordered rounded-3 overflow-hidden`}
              >
                <tbody>
                  <tr>
                    <td>Mobile Number</td>
                    <td>{singlePayerData?.payer_mobile}</td>
                  </tr>
                  <tr>
                    <td>Email ID</td>
                    <td>{singlePayerData?.payer_email}</td>
                  </tr>
                  <tr>
                    <td>Created Date and Time</td>
                    <td>{singlePayerData?.created_on}</td>
                  </tr>
                  <tr>
                    <td>Total Link Created</td>
                    <td>{singlePayerData?.total_links_created}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-5">
              <h6>Transaction History</h6>
              <div className="card-body">
                <div className="scroll overflow-auto">
                  {console.log("txnTableData?.count", txnTableData?.count)}
                  {!txnLoading &&
                    <Table
                      row={rowData}
                      data={txnTableData?.results}
                      dataCount={txnTableData?.count || txnTableData?.count <= 10 ? 0 : 10}
                      pageSize={10}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}
                      fixedHeader={true}
                      fixedHeaderScrollHeight="300px"
                    />}

                </div>
                <CustomLoader loadingState={txnLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayerDetailModal;
