/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form, } from "formik";
import CustomLoader from "../../../../_components/loader";
import _ from "lodash";
import Yup from "../../../../_components/formik/Yup";
import FormikController from "../../../../_components/formik/FormikController";
import moment from "moment";
import AddSinglePayer from "./AddSinglePayer";
import paymentLinkService from "../../../../services/create-payment-link/paymentLink.service";
import FormPaymentLink from "./FormPaymentLink";
import Table from "../../../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../../_components/table_components/filters/CountPerPage"
import { getPayerApi } from "../../../../slices/paymentLink/paymentLinkSlice";
import { useDispatch } from "react-redux";



const PayerDetails = () => {
  let history = useHistory();
  const dispatch = useDispatch()
  const [editform, setEditForm] = useState({
    myname: "",
    email: "",
    phone: "",
    editCustomerTypeId: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [saveData, setSaveData] = useState()
  const { user } = useSelector((state) => state.auth);
  const [loadingState, setLoadingState] = useState(false)
  const [payerData, setPayerData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [dataCount, setDataCount] = useState('')
  const [filterData, setFilterData] = useState([])


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


  const rowData = [
    {
      id: "2",
      name: "Name of Payer",
      selector: (row) => row.payer_name,
      sortable: true,
      width: "150px"
    },
    {
      id: "3",
      name: "Mobile No.",
      selector: (row) => row.payer_mobile,
      width: "180px"
    },
    {
      id: "4",
      name: "Email ID",
      selector: (row) => row.payer_email,
      width: "200px"
    },
    {
      id: "5",
      name: "Payer Category",
      selector: (row) => row.payer_type_name,
      sortable: true,

    },
    {
      id: "6",
      name: "Edit",
      cell: (row) => (
        <button
          type="button"
          className="btn cob-btn-primary btn-primary text-white btn-sm"
          onClick={() => editHandler(row)}
        >
          <i className="fa fa-pencil-square-o"></i>
        </button>
      ),
      width: "100px",
      ignoreRowClick: true, // Ensures clicking the button won't trigger row click events
      allowOverflow: true
    },
    {
      id: "7",
      name: "Generate Link",
      cell: (row) => (
        <button
          onClick={() => generatelink(row)}
          type="button"
          className="btn cob-btn-primary text-white btn-sm"
        >
          <i className="fa fa-link"></i>
        </button>
      ),
      width: "150px",
      ignoreRowClick: true,
      allowOverflow: true
    },
    {
      id: "8",
      name: "Delete",
      cell: (row) => (
        <button
          className="btn cob-btn-secondary btn-danger text-white btn-sm"
          onClick={() => deleteUser(row.id)}
        >
          <i className="fa fa-trash"></i>
        </button>
      ),
      width: "100px",
      ignoreRowClick: true,
      allowOverflow: true
    }
  ];


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



  const loadUser = async (data) => {
    setLoadingState(true)

    const postData = {
      fromDate: moment(saveData?.fromDate).startOf('day').format('YYYY-MM-DD'),
      toDate: moment(saveData?.toDate).startOf('day').format('YYYY-MM-DD'),
      page: currentPage,
      page_size: pageSize,
      client_code: clientCode
    };

    dispatch(getPayerApi(postData))
      .then((resp) => {
        setPayerData(resp?.payload?.results)
        setDataCount(resp?.payload?.count)
        setFilterData(resp?.payload?.results)
        setLoadingState(false)


      })
      .catch((error) => {
        setLoadingState(false);
        // setDisable(false)

      });

  };

  useEffect(() => {
    loadUser();
    // getDrop();
    // setEditModalToggle(false)
  }, [pageSize, currentPage]);

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };


  const formSubmit = (values) => {



    const postData = {
      fromDate: moment(values.fromDate).startOf('day').format('YYYY-MM-DD'),
      toDate: moment(values.toDate).startOf('day').format('YYYY-MM-DD'),
      page: currentPage,
      page_size: pageSize,
      client_code: clientCode
    };
    setSaveData(values);
    setLoadingState(true)
    dispatch(getPayerApi(postData))
      .then((resp) => {
        setPayerData(resp?.payload?.results)
        setFilterData(resp?.payload?.results)
        setDataCount(resp?.payload?.count)
        isButtonClicked(true)
        setLoadingState(false);
        // setDisable(false)

      })
      .catch((error) => {
        setLoadingState(false);
        // setDisable(false)

      });


  };
  const handleAddPayerButtonClick = () => {
    // getDrop();
    reducerDispatch({ type: "addPayer", payload: true })

  };




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



  const getSearchTerm = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredData = filterData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
      setPayerData(filteredData);
    } else {
      setPayerData(filterData);
    }
  };


  return (
    <React.Fragment>
      {state.paylinkData?.openModal && <FormPaymentLink componentState={state.paylinkData} dispatchFn={reducerDispatch} />}
      {state.addPayerModal && <AddSinglePayer componentState={state} dispatchFn={reducerDispatch} loadDataFn={edit} />}


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
                      disabled={loadingState}
                    >
                      {loadingState && (
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      Submit

                    </button>

                  </div>

                </div>
              </Form>
            )}
          </Formik>

          {filterData?.length !== 0 &&
            <div className="row mt-4">

              <div className="form-group col-lg-3 ml-2">

                {/* <label>Search</label>
              <input
                className="form-control"
                onChange={getSearchTerm}
                type="text"
                placeholder="Search Here"
              /> */}

                <label>Search</label>
                <input
                  className="form-control"
                  onChange={getSearchTerm}
                  value={searchTerm}
                  type="text"
                  placeholder="Search Here"
                />


              </div>


              <div className="form-group col-lg-3">
                <CountPerPageFilter

                  pageSize={pageSize}
                  dataCount={dataCount}

                  currentPage={currentPage}
                  changePageSize={changePageSize}
                  changeCurrentPage={changeCurrentPage}
                />
              </div>
              {/* } */}
            </div>
          }
        </div>
      </section>


      <section className="">

        <div className="container-fluid mt-3">
          <div className="scroll overflow-auto">
            {payerData?.length === 0 ? "" : <h6>Total Count : {dataCount}</h6>}
            {buttonClicked === true && payerData?.length === 0 && <h5 className="text-center font-weight-bold mt-5">
              No Data Found
            </h5>}
            {!loadingState && filterData?.length !== 0 && (
              <Table
                row={rowData}
                data={payerData}
                dataCount={dataCount}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
              />
            )}
          </div>
          <CustomLoader loadingState={loadingState} />
        </div>


      </section>

    </React.Fragment>
  );
};

export default PayerDetails;
