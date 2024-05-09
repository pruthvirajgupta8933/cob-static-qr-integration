/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import _ from 'lodash';
import FormPaymentLink from "./FormPaymentLink";
import API_URL from "../../../../config";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import CustomLoader from "../../../../_components/loader";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import ReactPaginate from 'react-paginate';
import FormikController from "../../../../_components/formik/FormikController";
import * as Yup from "yup";
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
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false)
  const[disable,setDisable]=useState(false)


  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required").nullable(),
    toDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });


  const handleCopyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000); // Reset copied state after 1.5 seconds
  };


  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const initialValues = {
    fromDate: splitDate,
    toDate: splitDate,
  };

  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };

  const loaduser = () => {
    // toastConfig.infoToast("Loading")
    axiosInstance.get(`${API_URL.GET_LINKS}${clientCode}/${splitDate}/${splitDate}`)
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


  const handleSubmit = (values) => {
    setDisable(true)

    const fromDate = moment(values.fromDate).format('YYYY-MM-DD');
    const toDate = moment(values.toDate).format('YYYY-MM-DD');
    const dateRangeValid = checkValidation(fromDate, toDate);
    if (dateRangeValid) {
    axiosInstance.get(`${API_URL.GET_LINKS}${clientCode}/${fromDate}/${toDate}`)
      .then((res) => {
        // toastConfig.successToast("Payment Link Data Loaded");
        setData(res.data);
        setLoadingState(false);
        setDisplayList(res.data);
        setPaginatedData(_(res.data).slice(0).take(pageSize).value());
        setShow(true)
        setDisable(false)

      })
    
      .catch((err) => {
        console.error("Error loading data:", err);
        setShow(false)
        setDisable(false)
        // toastConfig.errorToast("Data not loaded");
      });
    }
  };


  const checkValidation = (fromDate, toDate) => {
    let flag = true;

    if (!fromDate || !toDate) {
        alert("Please select both start and end dates.");
        flag = false;
    } else {
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);

        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let allowedTxnViewDays = 60; // Two months * 31 days per month
        let monthAllowed = 2; // Two months

        if (diffDays < 0 || diffDays > allowedTxnViewDays) {
            flag = false;
            alert(`Please choose a ${monthAllowed}-month date range.`);
            setDisable(false);
        }
    }

    return flag;
};





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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
            }}
            enableReinitialize={true}
          >
            {(formik) => (
              <Form>
                <div className="row mt-4">
                  <div className="form-group  col-md-3 ">
                    <FormikController
                      control="date"
                      label="From Date"
                      id="fromDate"
                      name="fromDate"
                      value={formik.values.fromDate ? new Date(formik.values.fromDate) : null}
                      onChange={date => formik.setFieldValue('fromDate', date)}
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["fromDate"]}
                    />
                  </div>
                  <div className="form-group col-md-3 ml-3">
                    <FormikController
                      control="date"
                      label="End Date"
                      id="to_date"
                      name="toDate"
                      value={formik.values.toDate ? new Date(formik.values.toDate) : null}
                      onChange={date => formik.setFieldValue('toDate', date)}
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["toDate"]}
                    />
                  </div>

                  <div className="col-md-3 mt-4">
                    <button
                      type="submit"
                      className="btn cob-btn-primary approve text-white"
                     disabled={disable}
                    >
                      {disable && (
                       <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span> 
                       )}
                      Submit
                    </button>

                  </div>

                </div>
              </Form>
            )}
          </Formik>
         {data?.length !== 0  &&
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
          </div>}
        </div>
      </section>


      <section className="">
        <div className="container-fluid p-3 my-3">
          {data?.length !== 0 && <h6>Total Records:{data.length}</h6>}

          {show && data?.length !== 0 ? (
            <React.Fragment>
              <div className="scroll" style={{ overflow: "auto" }}>
                <table className="table table-bordered nowrap">
                  <thead>
                    <tr>
                      <th>Serial No.</th>
                      <th>Phone No.</th>
                      <th>Amount</th>
                      <th>Customer Type</th>
                      <th>Customer Email</th>
                      <th>Created At</th>
                      <th>Remarks</th>
                      <th>Customer Name</th>
                      <th>Full Link</th>
                    </tr>
                  </thead>

                  {!loadingState && paginatedata?.length !== 0 && (
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
                          <td>{user?.customer_name}</td>
                          <td>
                            <div id={`link_${i}`} className="d-flex align-items-center">
                              <span
                                className="p-2 d-inline-block cursor_pointer copy_clipboard"
                                title={user?.full_link}
                              >
                                {user?.full_link}
                              </span>
                              <span
                                className="input-group-text"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCopyToClipboard(user?.full_link)}
                                data-tip={copied ? "Copied!" : "Copy"}
                              >
                                <i className="fa fa-copy ml-2 text-primary align-middle"></i>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
                <div className="d-flex justify-content-center align-items-center loader-container">
                  <CustomLoader loadingState={loadingState} />
                </div>
               
              </div>
              {!loadingState && (
                <div className="d-flex justify-content-center mt-2">
                  <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(selectedItem) => setCurrentPage(selectedItem.selected + 1)}
                    containerClassName={'pagination justify-content-center'}
                    activeClassName={'active'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                    disabledClassName={'disabled'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                  />
                </div>
              )}
            </React.Fragment>
          ) :  
            <h6 className="text-center font-weight-bold mt-5">No data Found</h6>
          }

        </div>
      </section>
    </React.Fragment>


  );
};

export default PaymentLinkDetail;
