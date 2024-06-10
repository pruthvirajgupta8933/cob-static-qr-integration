/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import _ from 'lodash';
import DropDownCountPerPage from '../../../../_components/reuseable_components/DropDownCountPerPage';
import CustomLoader from '../../../../_components/loader';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ReactPaginate from 'react-paginate';
import FormikController from '../../../../_components/formik/FormikController';
import createPaymentLinkService from '../../../../services/create-payment-link/payment-link.service';
import { Formik, Form } from "formik";
import toastConfig from '../../../../utilities/toastTypes';
import Yup from '../../../../_components/formik/Yup';

const Reports = () => {
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingState, setLoadingState] = useState(true)
  const [data, setData] = useState([]);
  const [displayList, setDisplayList] = useState([])
  const [searchText, setSearchText] = useState('');
  const { user } = useSelector((state) => state.auth);
  const clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const [pageCount, setPageCount] = useState(data ? Math.ceil(data.length / pageSize) : 0);
  const [disable, setDisable] = useState(false)


  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");


  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required").nullable(),
    toDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });



  const initialValues = {
    fromDate: splitDate,
    toDate: splitDate,
  };

  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };

  useEffect(() => {
    // toastConfig.infoToast("Report Loading")
   createPaymentLinkService.getReports(clientCode,splitDate,splitDate)
      .then(res => {
        // toastConfig.successToast("Report Data loaded")
        setData(res.data);
        setDisplayList(res.data)
        setLoadingState(false)
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        // toastConfig.errorToast("Report Data not loaded !")  
      });

  }, []);



  const getSearchTerm = (e) => {
    setSearchText(e.target.value);
  }


  useEffect(() => {
    if (searchText.length > 0) {
      // setPaginatedData(data.filter((item) => 
      // Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
      setDisplayList(data.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      setDisplayList(data)
      // setPaginatedData(data)
    }
  }, [searchText])

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }

  useEffect(() => {
    setPaginatedData(_(displayList).slice(0).take(pageSize).value());
    setPageCount(displayList.length > 0 ? Math.ceil(displayList.length / pageSize) : 0);
  }, [pageSize, displayList]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(displayList).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);
  }, [currentPage]);

  const handleSubmit = (values) => {
    setDisable(true)
    setLoadingState(true)
    setData([]);
    setDisplayList([]);
    setPaginatedData([]);

    const fromDate = moment(values.fromDate).format('YYYY-MM-DD');
    const toDate = moment(values.toDate).format('YYYY-MM-DD');
    const dateRangeValid = checkValidation(fromDate, toDate);
    if (dateRangeValid) {
      createPaymentLinkService.getReports(clientCode,fromDate,toDate)
        .then((res) => {
          if (res?.data?.length === 0) {
            toastConfig.errorToast("No Data Found")
          } else {
            // toastConfig.successToast("Payment Link Data Loaded");
            setData(res.data);
            setLoadingState(false);
            setDisplayList(res.data);
            setPaginatedData(_(res.data).slice(0).take(pageSize).value());
            
          }
          setDisable(false)
          setLoadingState(false)

        })
        .catch((err) => {
          console.error("Error loading data:", err);
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





  return (

    <React.Fragment>
      {/* filter area */}
      <section className="" id="">
        <div className="container-fluid">
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
          {data?.length !== 0 &&
            <div className="row">
              <div className="col-lg-3">
                <label>Search</label>
                <input className="form-control" type="text" placeholder="Search Here" value={searchText} onChange={getSearchTerm} />
              </div>

              <div className="col-lg-3">
                <label>Count Per Page</label>
                <select value={pageSize} rel={pageSize} className="form-select" onChange={(e) => setPageSize(parseInt(e.target.value))} >
                  <DropDownCountPerPage datalength={data.length} />
                </select>
              </div>
            </div>
          }

        </div>
      </section>

      <section className="">
      <div className="container-fluid p-3 my-3">
  {data?.length !== 0 && <h6>Total Records: {data.length}</h6>}

  {loadingState ? (
    <div className="d-flex justify-content-center align-items-center loader-container">
      <CustomLoader loadingState={loadingState} />
    </div>
  ) : data?.length === 0 ? (
    <h6 className="text-center font-weight-bold mt-5">No Data Found</h6>
  ) : (
    <>
      <div className="scroll" style={{ overflow: "auto" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Action</th>
              <th>Status</th>
              <th>Client Txn Id</th>
              <th>Link Id</th>
              <th colSpan={1}>Link Valid Date</th>
              <th>Created At</th>
              <th>Payment Collected</th>
              <th>Numeric Link Id</th>
            </tr>
          </thead>
          <tbody>
            {paginatedata.map((report, i) => (
              <tr key={uuidv4()}>
                <td>{i + 1}</td>
                <td>{report.customer_name}</td>
                <td>{report.customer_email}</td>
                <td>{report.customer_phone_number}</td>
                <td>{report.type}</td>
                <td>{report.transaction_status}</td>
                <td>{report.client_transaction_id}</td>
                <td>{report.link_id}</td>
                <td>{convertDate(report?.link_valid_date?.replace("T", " "))}</td>
                <td>{report.created_at}</td>
                <td>{report.payment_collected}</td>
                <td>{report.numeric_link_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </>
  )}
</div>

      </section>
    </React.Fragment>

  )

};

export default Reports;
