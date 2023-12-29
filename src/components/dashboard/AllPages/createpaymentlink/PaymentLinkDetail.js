/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from 'lodash';
import FormPaymentLink from "./FormPaymentLink";
import API_URL from "../../../../config";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import CustomLoader from "../../../../_components/loader";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

const PaymentLinkDetail = () => {

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [displayList, setDisplayList] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const [pageCount, setPageCount] = useState(data ? Math.ceil(data.length / pageSize) : 0);


  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };

  const loaduser = () => {
    // toastConfig.infoToast("Loading")
    axiosInstance.get(`${API_URL.GET_LINKS}${clientCode}`)
      .then((res) => {
        //  toastConfig.successToast("Payment Link Data Loaded")
        setData(res.data);
        setLoadingState(false)
        setDisplayList(res.data);
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        //  toastConfig.errorToast("Data not loaded")
      });

  }
  useEffect(() => {
    loaduser()
  }, []);




  useEffect(() => {

    if (searchText !== '') {
      setDisplayList(data.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    }
    else {
      setDisplayList(data)
    }
  }, [searchText])



  const getSearchTerm = (e) => {
    setSearchText(e.target.value);

  }

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }

  useEffect(() => {
    setPaginatedData(_(displayList).slice(0).take(pageSize).value())
    setPageCount(displayList.length > 0 ? Math.ceil(displayList.length / pageSize) : 0)
  }, [pageSize, displayList]);

  useEffect(() => {
    // console.log("page chagne no")
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(displayList).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);

  }, [currentPage])



  // if ( pageCount === 1) return null;

  const pages = _.range(1, pageCount + 1)
  return (

    <React.Fragment>
      {/* filter area */}
      <FormPaymentLink loaduser={loaduser} />

      <section className="" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <button
                type="button"
                className="btn cob-btn-primary btn-primary text-white btn-sm"
                data-toggle="modal"
                data-target="#exampleModal"
                data-whatever="@getbootstrap">
                Create Payment Link
              </button>
            </div>
          </div>

          <div className="row">
            <div className={`col-lg-3 mt-3`}>
              {/* <div className="col-lg-4 mrg-btm- bgcolor"> */}
              <label>Search</label>
              <input
                className="form-control"
                onChange={getSearchTerm}
                type="text"
                placeholder="Search Here"
              />
            </div>
            <div className={`col-lg-3 mt-3`}>
              <label>Count Per Page</label>
              <select
                value={pageSize}
                rel={pageSize}
                className="form-control"
                onChange={(e) => setPageSize(parseInt(e.target.value))}
              >
                <DropDownCountPerPage datalength={data.length} />
              </select>
            </div>
          </div>
        </div>
      </section>


      <section className="">
        <div className="container-fluid p-3 my-3">
          <h6>Total Records:{data.length}</h6>

          {!paginatedata ? (<h3> No Data Found</h3>) : (<React.Fragment>  <div className="scroll" style={{ overflow: "auto" }}>
            <table className="table table-bordered nowrap">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Phone No.</th>
                  <th>Amount</th>
                  <th>Customer Type</th>
                  <th> Customer Email</th>
                  <th>Created At</th>
                  <th>Remarks</th>
                  <th>Customer Name</th>
                  <th>Full Link</th>
                </tr>

              </thead>


              {!loadingState && paginatedata?.length !== 0 &&

                <tbody>

                  {paginatedata.map((user, i) => (
                    <tr key={uuidv4()}>
                      <td>{i + 1}</td>
                      <td>{user?.customer_phoneNumber}</td>
                      <td>{user?.amount}</td>
                      <td>{user?.customer_type}</td>
                      <td>{user?.customer_email}</td>
                      <td>{convertDate(user?.created_at)}</td>
                      <td>{user?.remarks}</td>
                      {/* <td>{user.customer_id}</td> */}
                      <td>{user?.customer_name}</td>
                      <td>{user?.full_link}</td>
                    </tr>
                  ))}

                </tbody>
              }

            </table>
            <div className="d-flex justify-content-center align-items-center loader-container">
              <CustomLoader loadingState={loadingState} />
            </div>

            {data?.length == 0 && !loadingState && (
              <h2 className="text-center">No data Found</h2>
            )}
          </div>
            <div>
              {pages.length > 1 ?
                <nav aria-label="Page navigation example"  >
                  <ul className="pagination">
                    <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1)} href={() => false}>Previous</a>
                    {
                      pages.slice(currentPage - 1, currentPage + 6).map((page, i) => (
                        <li key={uuidv4()} className={
                          page === currentPage ? " page-item active" : "page-item"
                        }>
                          <a className={`page-link data_${i}`} href={() => false}>
                            <p onClick={() => pagination(page)}>
                              {page}
                            </p>
                          </a>
                        </li>

                      ))
                    }
                    {pages.length !== currentPage ? <a className="page-link" onClick={(nex) => setCurrentPage((nex) => nex === (pages.length > 9) ? nex : nex + 1)} href={() => false}>
                      Next</a> : <></>}
                  </ul>
                </nav>
                : <></>}
            </div>
          </React.Fragment>
          )}
        </div>
      </section>
    </React.Fragment>


  );
};

export default PaymentLinkDetail;
