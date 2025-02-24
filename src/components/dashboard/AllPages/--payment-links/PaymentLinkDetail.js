/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import _ from "lodash";
import FormPaymentLink from "./FormPaymentLink";
import CustomLoader from "../../../../_components/loader";
import moment from "moment";
import FormikController from "../../../../_components/formik/FormikController";
import Table from "../../../../_components/table_components/table/Table";
import Yup from "../../../../_components/formik/Yup";
import { dateFormatBasic } from "../../../../utilities/DateConvert";
import { getPayMentLink } from "../../../../slices/paymentLink/paymentLinkSlice";
import { useDispatch } from "react-redux";
import CountPerPageFilter from "../../../../_components/table_components/filters/CountPerPage"
import toast from "react-hot-toast";





const PaymentLinkDetail = () => {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveData, setSaveData] = useState()

  const [displayList, setDisplayList] = useState([]);
  const [filterData, setFilterData] = useState([])
  const [loadingState, setLoadingState] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [buttonClicked, isButtonClicked] = useState(false);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];


  const [copied, setCopied] = useState(false);

  const [disable, setDisable] = useState(false);
  const [dataCount, setDataCount] = useState('')
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required").nullable(),
    toDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });

  const handleCopyToClipboard = (link) => {
    if (!link) {
      toast.error("Link not generated");
      return;
    }

    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Copied!");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
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







  const initialState = {
    paylinkData: {
      openModal: false
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'generatePaymentLink':
        return {
          ...state,
          paylinkData: action.payload
        }
      case 'reset':
        return {
          ...state,
          paylinkData: {}
        }
      default:
        return state
    }
  }

  const [state, reducerDispatch] = useReducer(reducer, initialState)




  const rowData = [
    {
      id: "2",
      name: "Payer Name",
      selector: (row) => row.payer_name,
      sortable: true,
      width: "150px"
    },
    {
      id: "3",
      name: "Phone No.",
      selector: (row) => row.payer_mobile,
      width: "180px"
    },
    {
      id: "4",
      name: "Amount",
      selector: (row) => row.total_amount,
      width: "200px"
    },
    {
      id: "5",
      name: "Payer Email",
      selector: (row) => row.payer_email,
      sortable: true,
      width: "200px"

    },

    {
      id: "6",
      name: "Created At",
      selector: (row) => dateFormatBasic(row?.created_on),
      sortable: true,

    },
    {
      id: "6",
      name: "Purpose",
      selector: (row) => row?.purpose
      ,
      sortable: true,

    },
    {
      id: "8",
      name: "Payment Link",
      selector: (row) => (
        <div id={`link_${row.id}`} className="d-flex align-items-center">
          <span className="p-2 d-inline-block cursor_pointer copy_clipboard" title={row?.shorted_url}>
            {/* {row?.shorted_url} */}
          </span>
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={() => handleCopyToClipboard(row?.link)}
            data-tip={copied ? "Copied!" : "Copy"}
            data-for={`tooltip-${row.id}`}
          >
            <i className="fa fa-copy ml-2 text-primary align-middle"></i>
          </span>
        </div>
      ),
      width: "250px",
    },

  ];



  const loadUser = async (data) => {
    setLoadingState(true)

    const fromDate = moment(saveData?.fromDate).format("YYYY-MM-DD");
    const toDate = moment(saveData?.toDate).format("YYYY-MM-DD");

    const postData = {
      client_code: clientCode,
      start_date: fromDate,
      end_date: toDate,
      order_by: "-id",
      page: currentPage,
      page_size: pageSize

    };

    dispatch(getPayMentLink(postData))
      .then((resp) => {
        setData(resp?.payload?.results)
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





  const handleSubmit = async (values) => {

    setLoadingState(true);
    setData([]);
    setDisplayList([]);


    const fromDate = moment(values?.fromDate).format("YYYY-MM-DD");
    const toDate = moment(values?.toDate).format("YYYY-MM-DD");
    const dateRangeValid = checkValidation(fromDate, toDate);

    if (dateRangeValid) {

      const postData = {
        client_code: clientCode,
        start_date: fromDate,
        end_date: toDate,
        order_by: "-id",
        page: currentPage,
        page_size: pageSize



      }
      setSaveData(values);

      setLoadingState(true)
      dispatch(getPayMentLink(postData))
        .then((resp) => {
          // setPayerData(resp?.payload?.results)
          setData(resp?.payload?.results)
          setDataCount(resp?.payload?.count)
          setFilterData(resp?.payload?.results)
          isButtonClicked(true)

          setLoadingState(false);
          // setDisable(false)

        })
        .catch((error) => {
          setLoadingState(false);
          // setDisable(false)

        });
    };

  }


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



  const getSearchTerm = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filteredData = filterData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
      setData(filteredData);
    } else {
      setData(filterData);
    }
  };



  const generatePaylinkHandler = () => {
    reducerDispatch({
      type: "generatePaymentLink", payload: {
        ...data,
        openModal: true
      }
    })
  }

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };


  // console.log(state)
  return (
    <React.Fragment>
      {/* filter area */}
      {state?.paylinkData?.openModal && <FormPaymentLink componentState={state.paylinkData} dispatchFn={reducerDispatch} />}

      <section className="">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <button
                type="button"
                className="btn cob-btn-primary btn-primary text-white btn-sm"
                onClick={generatePaylinkHandler}
              >
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
                  <div className="form-group col-lg-3 col-md-4 col-sm-12 ">
                    <FormikController
                      control="date"
                      label="From Date"
                      id="fromDate"
                      name="fromDate"
                      value={
                        formik.values.fromDate
                          ? new Date(formik.values.fromDate)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue("fromDate", date)
                      }
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["fromDate"]}
                    />
                  </div>
                  <div className="form-group col-lg-3 col-md-4 col-sm-12 ">
                    <FormikController
                      control="date"
                      label="End Date"
                      id="to_date"
                      name="toDate"
                      value={
                        formik.values.toDate
                          ? new Date(formik.values.toDate)
                          : null
                      }
                      onChange={(date) => formik.setFieldValue("toDate", date)}
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-0 p-0"
                      required={true}
                      errorMsg={formik.errors["toDate"]}
                    />
                  </div>

                  <div className="col-lg-3 col-md-4 col-sm-12 mt-4">
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
          {filterData?.length !== 0 && (
            <div className="row">
              <div className={`col-lg-3 mt-3`}>

                <label>Search</label>
                <input
                  className="form-control"
                  onChange={getSearchTerm}
                  value={searchTerm}
                  type="text"
                  placeholder="Search Here"
                />
              </div>
              <div className={`col-lg-3 mt-3`}>
                <CountPerPageFilter
                  pageSize={pageSize}
                  dataCount={dataCount}
                  changePageSize={changePageSize}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="">

        <div className="container-fluid  mt-3">
          <div className="scroll overflow-auto">
            {data?.length === 0 ? "" : <h6 className="mt-3">Total Count : {dataCount}</h6>}
            {data?.length === 0 && <h5 className="text-center font-weight-bold mt-5">
              No Data Found
            </h5>}
            {!loadingState && filterData?.length !== 0 && (
              <Table
                row={rowData}
                data={data}
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

export default PaymentLinkDetail;
