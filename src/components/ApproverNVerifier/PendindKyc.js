import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  kycForPendingMerchants,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import API_URL from "../../config";
import { Link, useRouteMatch } from "react-router-dom";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import ViewStatusModal from "./ViewStatusModal";
import { useSelector } from "react-redux";
import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";

// import PaginationForKyc from "../../_components/reuseable_components/PaginationForKyc";

const PendindKyc = () => {
  const { url } = useRouteMatch();
  const roles = roleBasedAccess();

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [pendingKycData, setPendingKycData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusData, setStatusData] = useState([]);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [kycIdClick, setKycIdClick] = useState(null);

  const { auth } = useSelector((state) => state);
  const { user } = auth;

  const { loginId } = user;

  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    dispatch(kycForPendingMerchants({ page: currentPage, page_size: pageSize }))
      .then((resp) => {

        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setSpinner(false);
        setData(data);
        setDataCount(dataCoun);
        setPendingKycData(data);
      })

      .catch((err) => {
        console.log(err);
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText?.length > 0) {
      setData(
        pendingKycData?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(pendingKycData);
    }
  }, [searchText]);

  const handleClick = (loginMasterId) => {
    dispatch(
      GetKycTabsStatus({
        login_id: loginMasterId,
      })
    ).then((res) => {
      setStatusData(res?.payload);
    });
  };
  //--------------PENDING Merchants API -----------------//
  const indexOfLastRecord = currentPage * pageSize;
  const nPages = Math.ceil(pendingKycData?.length / pageSize);
  const totalPages = Math.ceil(dataCount / pageSize);
  let pageNumbers = []
  if(!Number.isNaN(totalPages)){
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }

  const indexOfFirstRecord = indexOfLastRecord - pageSize;

  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      // console.log("hello", currentPage)
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
    return date;
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
        <div>
          {" "}
          <KycDetailsModal kycId={kycIdClick} />
        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Count Per Page</label>
          <select
            value={pageSize}
            rel={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
            <DropDownCountPerPage datalength={dataCount} />
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Onboard Type</label>
          <select onChange={kycSearch} className="ant-input">
            <option value="Select Role Type">Select Onboard Type</option>
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Client Code</th>
                <th>Company Name</th>
                <th>Merchant Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                <th>View Status</th>
                {/* <th>View</th> */}
              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
              {data?.length === 0 ? (
                <tr>
                  <td colSpan={"8"}>
                    <h1 className="nodatafound">No data found</h1>
                  </td>
                </tr>
              ) : (
                data?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.clientCode}</td>
                    <td>{user.companyName}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{covertDate(user.signUpDate)}</td>
                    <td>{user?.isDirect}</td>
                    {/* <td>{user.status}</td> */}

                    <td>
                      <button
                        type="button"
                        className="btn approve text-white  btn-xs"
                        onClick={() => setKycIdClick(user)}
                        data-toggle="modal"
                        data-target="#kycmodaldetail"
                      >
                        View Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
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
};

export default PendindKyc;
