import React, { useEffect, useState } from "react";
import { fetchBeneficiaryDetails } from "../slices/payoutSlice";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "../components/dashboard/NavBar/NavBar";
import Spinner from "../_components/reuseable_components/ProgressBar";
import DropDownCountPerPage from "../_components/reuseable_components/DropDownCountPerPage";

const Beneficiary = () => {
  const dispatch = useDispatch();
  const payoutBeneficiaryState = useSelector((state) => state.payout);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);

  const TotalData = payoutBeneficiaryState?.beneficiaryList?.count;
  const beneficiaryData = payoutBeneficiaryState?.beneficiaryList.results;

  useEffect(() => {
    fetchBeneficiaryList();
  }, [currentPage, pageSize]);

  const fetchBeneficiaryList = () => {
    const data = {
      pageSize: pageSize,
      pageNumber: currentPage,
    };
    dispatch(fetchBeneficiaryDetails({ data }));
  };
  const makeFirstLetterCapital = (str) => {
    let resultString = str.charAt(0).toUpperCase() + str.substring(1);
    return resultString;
  };
  //Pagination
  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const totalPages = Math.ceil(TotalData / pageSize);
  let pageNumbers = [];
  if (!Number.isNaN(totalPages)) {
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }
  useEffect(() => {
    let lastSevenPage = totalPages - 7;
    if (pageNumbers?.length > 0) {
      let start = 0;
      let end = currentPage + 6;
      if (totalPages > 6) {
        start = currentPage - 1;

        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage;
        }
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      });
      setDisplayPageNumber(pageNumber);
    }
  }, [currentPage, totalPages]);
  return (
    <>
      <section className="ant-layout">
        <div>
          <NavBar />
        </div>
        {payoutBeneficiaryState.isLoading && <Spinner />}
        <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Beneficiary Details</h1>
            </div>
            <div class="table-responsive">
              <table
                cellspaccing={0}
                cellPadding={10}
                border={0}
                width="100%"
                className="tables ml-4 table-bordered"
              >
                <tbody>
                  <tr>
                    <th>Full Name</th>
                    <th>A/C No</th>
                    <th>IFSC Code</th>
                    <th>UPI ID</th>
                  </tr>
                  {beneficiaryData?.length == 0 ? (
                    <tr>
                      <td colSpan={"11"}>
                        <div className="nodatafound text-center">
                          No data found{" "}
                        </div>
                        <br />
                        <br />
                        {/* <p className="text-center">{spinner && <Spinner />}</p> */}
                      </td>
                    </tr>
                  ) : (
                    beneficiaryData?.map((data) => {
                      return (
                        <tr>
                          <td>{makeFirstLetterCapital(data.full_name)}</td>
                          <td>{data.account_number}</td>
                          <td>{data.ifsc_code}</td>
                          <td>{data.upi_id}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ul className="pagination justify-content-center mt-2">
            <div className="form-group mr-2 ">
              {/* <label>Count Per Page</label> */}
              <select
                value={pageSize}
                rel={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="ant-input"
              >
                <DropDownCountPerPage datalength={TotalData} />
              </select>
            </div>
            <li className="page-item">
              <button className="page-link" onClick={prevPage}>
                Previous
              </button>
            </li>

            {displayPageNumber?.map((pgNumber, i) => (
              <li
                key={i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }
                onClick={() => setCurrentPage(pgNumber)}
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span>{pgNumber}</span>
                </a>
              </li>
            ))}

            <li className="page-item">
              <button
                className="page-link"
                onClick={nextPage}
                disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
              >
                Next
              </button>
            </li>
          </ul>
        </main>
      </section>
    </>
  );
};
export default Beneficiary;
