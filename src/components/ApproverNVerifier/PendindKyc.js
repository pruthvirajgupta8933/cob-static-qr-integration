import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { kycForPendingMerchants } from "../../slices/kycSlice";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import CommentModal from "./Onboarderchant/CommentModal";

import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import MerchnatListExportToxl from "./MerchnatListExportToxl";

// import PaginationForKyc from "../../_components/reuseable_components/PaginationForKyc";

const PendindKyc = () => {
  const roles = roleBasedAccess();

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [pendingKycData, setPendingKycData] = useState([]);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
        setIsLoaded(false);
      })

      .catch((err) => {
        console.log(err);
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize, dispatch]);

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

  // const handleClick = (loginMasterId) => {
  //   dispatch(
  //     GetKycTabsStatus({
  //       login_id: loginMasterId,
  //     })
  //   ).then((res) => {
  //     setStatusData(res?.payload);
  //   });
  // };
  //--------------PENDING Merchants API -----------------//
  // const indexOfLastRecord = currentPage * pageSize;
  // const nPages = Math.ceil(pendingKycData?.length / pageSize);
  const totalPages = Math.ceil(dataCount / pageSize);
  let pageNumbers = [];
  if (!Number.isNaN(totalPages)) {
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }

  // const indexOfFirstRecord = indexOfLastRecord - pageSize;

  const nextPage = () => {
    setIsLoaded(true);
    setData([]);
    if (currentPage < pageNumbers?.length) {
      // console.log("hello", currentPage)

      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    setIsLoaded(true);
    setData([]);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    //  setTimeout(() => {
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
    // }, 5000);
  }, [currentPage, totalPages]);

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
    return date;
  };

  // console.log("Data Loading",isLoaded)

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
          {openCommentModal === true ? (
            <CommentModal
              commentData={commentId}
              isModalOpen={openCommentModal}
              setModalState={setOpenCommentModal}
              tabName={"Pending KYC"}
            />
          ) : (
            <></>
          )}

          <KycDetailsModal
            handleModal={setIsModalOpen}
            kycId={kycIdClick}
            isOpenModal={isOpenModal}
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
        <MerchnatListExportToxl
          URL={"?order_by=-merchantId&search=Pending"}
          filename={"Pending-KYC"}
        />
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
                {roles?.verifier === true ||
                roles?.approver === true ||
                roles?.viewer === true ? (
                  <th>Action</th>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {data === null || data === [] ? (
                <tr>
                  <td colSpan={"11"}>
                    <div className="nodatafound text-center">
                      No data found{" "}
                    </div>
                  </td>
                </tr>
              ) : (
                <></>
              )}

              {/* {spinner && <Spinner />} */}
              {data?.length === 0 ? (
                <tr>
                  <td colSpan={"11"}>
                    <p className="text-center">{spinner && <Spinner />}</p>
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
                        onClick={() => {
                          setKycIdClick(user);
                          setIsModalOpen(!isOpenModal);
                        }}
                        data-toggle="modal"
                        data-target="#kycmodaldetail"
                      >
                        View Status
                      </button>
                    </td>
                    <td>
                      {roles?.verifier === true ||
                      roles?.approver === true ||
                      roles?.viewer === true ? (
                        <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          data-toggle="modal"
                          onClick={() => {
                            setCommentId(user);
                            setOpenCommentModal(true);
                          }}
                          data-target="#exampleModal"
                          disabled={user?.clientCode === null ? true : false}
                        >
                          Add/View Comments
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            {isLoaded === true ? (
              <Spinner />
            ) : (
              <li className="page-item">
                <button className="page-link" onClick={prevPage}>
                  Previous
                </button>
              </li>
            )}

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

            {isLoaded === true ? (
              <Spinner />
            ) : (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={nextPage}
                  disabled={
                    currentPage === pageNumbers[pageNumbers?.length - 1]
                  }
                >
                  Next
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PendindKyc;
