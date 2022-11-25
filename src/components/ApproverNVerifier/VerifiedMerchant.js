import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
import API_URL from "../../config";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { Link } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";

function VerifiedMerchant() {
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [merchantData, setMerchantData] = useState([]);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  let page_size = pageSize;
  let page = currentPage;
  const roles = roleBasedAccess();

  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const allVerifiedMerchants = async () => {
    await axiosInstanceAuth.get(`${API_URL.KYC_FOR_VERIFIED}`).then((res) => {
      const data = res?.data?.results;
      setMerchantData(data);
      const dataCoun = res?.data?.count;
      setDataCount(dataCoun);
    });
  };

  useEffect(() => {
    // handleFetchData();
    allVerifiedMerchants();
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Approved Data Loaded");
        setSpinner(false);
        const data = resp?.payload?.results;

        setVerifiedMerchant(data);
      })

      .catch((err) => toastConfig.errorToast("Data not loaded"));
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setVerifiedMerchant(
        verfiedMerchant?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      dispatch(kycForVerified({ page, page_size })).then((resp) => {
        const data = resp?.payload?.results;
        setVerifiedMerchant(data.slice(indexOfFirstRecord, indexOfLastRecord));
      });
    }
  }, [searchText]);
  const indexOfLastRecord = currentPage * pageSize;
  // const nPages = Math.ceil(notFilledData.length / pageSize);

  // console.log(notFilledData.length, "Data =======>");

  const totalPages = Math.ceil(dataCount / pageSize);
  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);
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
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Search</label>
        <input
          className="form-control"
          onChange={kycSearch}
          type="text"
          placeholder="Search Here"
        />
      </div>

      <div className="col-lg-4 mrg-btm- bgcolor">
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
      <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Onboard Type</label>
          <select
            // value={pageSize}
            // rel={pageSize}
            // onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
             <option value="Select Role Type">Select Onboard Type</option>
            <option value="all">All</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
           
          </select>
        </div>
      <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Client Code</th>
                <th>Name</th>
                <th> Email</th>
                <th>Contact Number</th> 
                <th>KYC Status</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                {roles.approver === true ? <th>Approve KYC</th> : <></>}
              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
              {verfiedMerchant?.length === 0 ? (
                <tr>
                  {" "}
                  <td colSpan={"9"}>
                    <h1 className="nodatafound">No data found</h1>
                  </td>
                </tr>
              ) : (
                verfiedMerchant?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.clientCode}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.status}</td>
                    <td>{user.signUpDate}</td>
                    <td>{user?.isDirect}</td>
                    {roles.approver === true ? (
                      <td>
                        <Link
                          to={`/dashboard/kyc/?kycid=${user.loginMasterId}`}
                          className="btn approve text-white btn-xs"
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          Approve KYC
                        </Link>
                      </td>
                    ) : (
                      <></>
                    )}
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
            {pageNumbers && pageNumbers.slice(currentPage - 1, currentPage + 6)?.map((pgNumber, i) => (
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
                disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default VerifiedMerchant;
