import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { kycForRejectedMerchants } from "../../slices/kycSlice";
import API_URL from "../../config";
import { Link, useRouteMatch } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";

const RejectedKYC = () => {
  const { url } = useRouteMatch();
  const roles = roleBasedAccess();

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [rejectedMerchants, setRejectedMerchants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  let page_size = pageSize;
  let page = currentPage;

  // console.log(setPageSize,"wewewewewewewewewewewew")
  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const rejectedMerchantsList = async () => {
    await axiosInstanceAuth
      .get(`${API_URL.KYC_FOR_REJECTED_MERCHANTS}`)
      .then((res) => {
        const data = res.data.results;
        // console.log("<====  Rejected Merchants List ======>")
        setRejectedMerchants(data);
      });
  };

  useEffect(() => {
    rejectedMerchantsList();
    dispatch(
      kycForRejectedMerchants({ page: currentPage, page_size: pageSize })
    )
      .then((resp) => {
        toastConfig.successToast("Rejected Merchant List Loaded");
        setSpinner(false);

        const data = resp?.payload.results;

        setData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        data.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      dispatch(kycForRejectedMerchants({ page, page_size })).then((resp) => {
        const data = resp?.payload.results;

        setData(data);
      });
    }
  }, [searchText]);

  const indexOfLastRecord = currentPage * pageSize;
  const nPages = Math.ceil(rejectedMerchants.length / pageSize);

  const pageNumbers = [
    ...Array(nPages + rejectedMerchants.length).keys(),
  ].slice(1);

  // console.log(pageNumbers, "pageNumbers ===>");
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  // const currentRecords = pendingKycData.slice(
  //   indexOfFirstRecord,
  //   indexOfLastRecord
  // );

  const nextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Search</label>
          <input
            className="form-control"
            onChange={kycSearch}
            type="text"
            placeholder="Search Here"
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Count Per Page</label>
          <select
            value={pageSize}
            rel={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Serial.No</th>
                <th>Merchant Id</th>
                <th>Contact Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Bank</th>
                <th>PAN No.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
              {data?.length === 0 ? (
                <tr>
                  {" "}
                  <td colSpan={"8"}>
                    <h1 className="nodatafound">No data found</h1>
                  </td>
                </tr>
              ) : (
                data?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.merchantId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.bankName}</td>
                    <td>{user.panCard}</td>
                    <td>{user.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" onClick={prevPage}>
                Previous
              </a>
            </li>
            {pageNumbers.map((pgNumber, i) => (
              <li
                key={i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span onClick={() => setCurrentPage(pgNumber)}>
                    {pgNumber}
                  </span>
                </a>
              </li>
            ))}

            <li class="page-item">
              <button
                class="page-link"
                onClick={nextPage}
                disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RejectedKYC;
