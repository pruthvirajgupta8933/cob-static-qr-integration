/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form, } from "formik";
import CustomLoader from "../../../../_components/loader";
import _ from "lodash";
import Yup from "../../../../_components/formik/Yup";
import Genratelink from "./Genratelink";
import { Edituser } from "./Edituser";
// import API_URL from "../../../../config";
import toastConfig from "../../../../utilities/toastTypes";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
// import { axiosInstance } from "../../../../utilities/axiosInstance";
import FormikController from "../../../../_components/formik/FormikController";
// import "./index.css";
import { v4 as uuidv4 } from 'uuid';
import ReactPaginate from 'react-paginate';
import moment from "moment";
import createPaymentLinkService from "../../../../services/create-payment-link/payment-link.service";
import AddSinglePayer from "./AddSinglePayer";
import paymentLinkService from "../../../../services/create-payment-link/paymentLink.service";
import FormPaymentLink from "./FormPaymentLink";



const PayerDetails = () => {
  let history = useHistory();
  const [editform, setEditForm] = useState({
    myname: "",
    email: "",
    phone: "",
    editCustomerTypeId: "",
    id: "",
  });
  const [genrateform, setGenrateForm] = useState({
    customer_id: "",
  });
  const [searchText, setSearchText] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [displayList, setDisplayList] = useState([]);
  const [loadingState, setLoadingState] = useState(true)
  const [data, setData] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalToggle, setEditModalToggle] = useState(false);
  const [disable, setDisable] = useState(false)
  const [submitted, setSubmitted] = useState(false);
  const [pageCount, setPageCount] = useState(
    data ? Math.ceil(data?.length ?? 0 / pageSize) : 0
  );

  const initialState = {
    addPayerModal: false,
    editPayerModal: {
      isEditable: false
    },
    paylinkData: {
      openModal: false
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'addPayer':
        return {
          ...state,
          addPayerModal: action.payload
        };
      case 'editPayer':
        return {
          ...state,
          addPayerModal: true,
          editPayerModal: action.payload
        }
      case 'generatePaymentLink':
        return {
          ...state,
          paylinkData: action.payload
        }
      case 'reset':
        return {
          ...state,
          addPayerModal: false,
          generatePaylinkModal: false,
          paylinkData: {}
        }
      default:
        return state
    }
  }

  const [state, reducerDispatch] = useReducer(reducer, initialState)



  const validationSchemaa = Yup.object({
    fromDate: Yup.date().required("Required").nullable(),
    toDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1]?.length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2]?.length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");
  const initialValues = {
    fromDate: splitDate,
    toDate: splitDate,
  };

  let clientMerchantDetailsList = [];
  let clientCode = "";

  clientMerchantDetailsList = user.clientMerchantDetailsList;
  clientCode = clientMerchantDetailsList[0].clientCode;


  // Alluser data API INTEGRATION
  const loadUser = async (data) => {
    try {
      const getPayerResponse = await paymentLinkService.getPayer({ client_code: clientCode, start_date: data.fromDate, end_date: data.toDate, order_by: "-id" })
      setData(getPayerResponse.data?.results)
      setDisplayList(getPayerResponse.data?.results);
      setPaginatedData(_(getPayerResponse.data?.results).slice(0).take(pageSize).value());
      setLoadingState(false)
      setSubmitted(false);
    } catch (error) {
      toastConfig.errorToast(error.response.message)
      setLoadingState(false)
      setSubmitted(false);
    }

  };

  useEffect(() => {
    loadUser(initialValues);
    // getDrop();
    // setEditModalToggle(false)
  }, []);


  const formSubmit = (values) => {
    // setDisable(true);
    setSubmitted(true);
    // setLoadingState(true);

    // // Clear setData state
    // setData([]);
    // setDisplayList([]);
    // setPaginatedData([]);

    const fromDate = moment(values.fromDate).format('YYYY-MM-DD');
    const toDate = moment(values.toDate).format('YYYY-MM-DD');

    loadUser({ fromDate: fromDate, toDate: toDate })
    // createPaymentLinkService.getCustomerDetails(fromDate, toDate, clientCode)
    //   .then((res) => {
    //     if (res.data?.length === 0) {
    //       toastConfig.errorToast("No Data Found");
    //     } else {
    //       setData(res.data);
    //       setDisplayList(res.data);
    //       setPaginatedData(_(res.data).slice(0).take(pageSize).value());
    //     }
    //     setLoadingState(false);
    //     setSubmitted(false);
    //     setDisable(false);
    //   })
    //   .catch((err) => {
    //     setLoadingState(false);
    //     setDisable(false);
    //     setSubmitted(false);
    //   });
  };


  // SEARCH FILTER

  useEffect(() => {
    if (searchText?.length > 0) {
      setDisplayList(
        data.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      setDisplayList(data);
    }
  }, [searchText]);

  const getSearchTerm = (e) => {
    setSearchText(e.target.value);
  };



  useEffect(() => {
    setPaginatedData(_(displayList).slice(0).take(pageSize).value());
    setPageCount(displayList?.length > 0 ? Math.ceil(displayList?.length / pageSize) : 0);
  }, [pageSize, displayList]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(displayList).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);
  }, [currentPage]);



  // ADD User Dropdown api integration

  // const getDrop = async (e) => {
  //   await createPaymentLinkService.getCustomerType()
  //     .then((res) => {

  //       setCustomerType(res.data);
  //     })
  //     .catch((err) => {
  //       // console.log(err)
  //     });
  // };

  const handleAddPayerButtonClick = () => {
    // getDrop();
    reducerDispatch({ type: "addPayer", payload: true })
    // Optionally, you can open the modal here if needed
  };


  //ADD user API Integration



  // USE FOR EDIT FORM
  const editHandler = (data) => {
    reducerDispatch({
      type: "editPayer", payload: { ...data, isEditable: true }
    })
  };

  // USE FOR GENERETE LINK
  const generatelink = (data) => {
    reducerDispatch({
      type: "generatePaymentLink", payload: {
        ...data,
        openModal: true
      }
    })
  };

  const deleteUser = async (id) => {
    let iscConfirm = window.confirm("Are you sure you want to delete it ?");
    if (iscConfirm) {
      await paymentLinkService.deletePayer({ id: id })
      loadUser(initialValues);
    }
  };



  const edit = () => {
    loadUser(initialValues);
  };


  return (
    <React.Fragment>
      {state.paylinkData?.openModal && <FormPaymentLink componentState={state.paylinkData} dispatchFn={reducerDispatch} />}
      {state.addPayerModal && <AddSinglePayer componentState={state} dispatchFn={reducerDispatch} loadUserFn={edit} />}


      <section >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <button
                type="button"
                className="btn cob-btn-primary btn-primary text-white btn-sm"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={handleAddPayerButtonClick}
              >
                Add Single Payer
              </button>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaa}
            onSubmit={(values, { resetForm }) => {
              formSubmit(values);
            }}
            enableReinitialize={true}
          >
            {(formik) => (
              <Form>
                <div className="row mt-4">
                  <div className="form-group col-md-4 col-lg-3 col-sm-12">
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
                  <div className="form-group col-md-4 col-lg-3 col-sm-12">
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

                  <div className="col-md-4 col-lg-3 col-sm-12 mt-4">
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
              <div className={`col-lg-3 mt-3`}>
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
                  className="form-select"
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                >
                  <DropDownCountPerPage datalength={data?.length ?? 0} />
                </select>
              </div>
            </div>}
        </div>
      </section>


      <section className="">
        <div className="container-fluid p-3 my-3">
          {data?.length !== 0 && <h6>Total Records: {data?.length ?? 0}</h6>}

          {loadingState ? (
            <div className="d-flex justify-content-center align-items-center loader-container">
              <CustomLoader loadingState={loadingState} />
            </div>
          ) : data?.length === 0 ? (
            <h6 className="text-center font-weight-bold mt-5">No Data Found</h6>
          ) : (
            <>
              <div className="scroll overflow-auto">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Name of Payer</th>
                      <th scope="col">Mobile No.</th>
                      <th scope="col">Email ID</th>
                      <th scope="col">Payer Category</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Generate Link</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedata.map((user, i) => (
                      <tr key={uuidv4()}>
                        <td>{i + 1}</td>
                        <td>{user.payer_name}</td>
                        <td>{user.payer_mobile}</td>
                        <td>{user.payer_email}</td>
                        <td>{user.payer_type_name}</td>
                        <td>
                          <button
                            type="button"
                            className="btn cob-btn-primary btn-primary text-white btn-sm"
                            onClick={(e) => editHandler(user)}
                          >
                            <i className="fa fa-pencil-square-o"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={(e) => generatelink(user)}
                            type="button"
                            className="btn cob-btn-primary text-white btn-sm"
                          >
                            <i className="fa fa-link"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn cob-btn-secondary btn-danger text-white btn-sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
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
  );
};

export default PayerDetails;
