import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import toastConfig from "../../utilities/toastTypes";
import { onboardedReport } from "../../slices/kycSlice";
import moment from "moment";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { onboardedReportExport } from "../../slices/kycSlice";
import ReactDatePicker from "../../_components/formik/components/ReactDatePicker";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../src/_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";

const validationSchema = Yup.object({
  from_date: Yup.date().required("Required").nullable(),
  to_date: Yup.date()
    .min(Yup.ref("from_date"), "End date can't be before Start date")
    .required("Required"),
  status: Yup.string().required("Required").nullable(),
});

const OnboardedReport = () => {
  const [data, setData] = useState([]);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [dataCount, setDataCount] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loadingState, setLoadingState] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [onboardValue, setOnboradValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showData, setShowData] = useState(false);
  const [selectedvalue, setSelectedvalue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [dataClick, setDataClick] = useState(false);

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };

  let noResultsFound = data;

  // console.log(noResultsFound, "noResultsFound");

  const rowSignUpData = [
    { id: "1", name: "S. No.", selector: (row) => row.sno, sortable: true },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      sortable: true,
    },
    {
      id: "3",
      name: "Company Name",
      selector: (row) => row.companyName,
    },
    {
      id: "4",
      name: "Merchant Name",
      selector: (row) => row.name,
    },

    {
      id: "5",
      name: "Email",
      selector: (row) => row.emailId,
    },

    {
      id: "6",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
    },
    {
      id: "7",
      name: "Kyc Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      id: "8",
      name: "Registered Date",
      selector: (row) => covertDate(row.signUpDate),
      sortable: true,
    },

    {
      id: "9",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
  ];

  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = (text) => {
    setData(
      verfiedMerchant?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
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

  // eslint-disable-next-line no-unused-vars
  const [todayDate, setTodayDate] = useState(splitDate);

  const initialValues = {
    from_date: todayDate,
    to_date: todayDate,
    status: "",
  };

  const dispatch = useDispatch();

  // console.log(loadingState, "loadingState");

  let selectedChoice =
    selectedvalue === "1"
      ? "Verified"
      : selectedvalue === "2"
      ? "Approved"
      : "";

  const handleSubmit = (values) => {
    setOnboradValue(values);
    setDisabled(true);
    dispatch(
      onboardedReport({
        page: currentPage,
        page_size: pageSize,
        selectedChoice,
        from_date: moment(values.from_date).startOf('day').format('YYYY-MM-DD'),
        to_date: moment(values.to_date).startOf('day').format('YYYY-MM-DD'),
      })
    )
      .then((resp) => {
        const data = resp?.payload?.results;

        const dataCoun = resp?.payload?.count;
        // setKycIdClick(data);
        setData(data);
        setDataClick(true);
        setDataCount(dataCoun);
        setShowData(true);
        setVerifiedMerchant(data);
        setDisabled(false);

        // setIsLoaded(false)
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
        setDisabled(false);
      });
  };

  
 useEffect(() => {
    dispatch(
      onboardedReport({
        page: currentPage,
        page_size: pageSize,
        selectedChoice,
        from_date: onboardValue.from_date,
        to_date: onboardValue.to_date,
      })
    )
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setKycIdClick(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
        setIsLoaded(false);
      })

      .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  
  const selectStatus = [
    { key: "0", value: "Select"},
    { key: "1", value: "Verified" },
    { key: "2", value: "Approved" },
  ];

  const exportToExcelFn = () => {
    dispatch(
      onboardedReportExport({
        selectedChoice,
        from_date: onboardValue.from_date,
        to_date: onboardValue.to_date,
      })
    ).then((res) => {
      const blob = new Blob([res?.payload], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ONBOARDED_REPORT_.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  
  return (
    <section className="">

      <div className="">
        <div className="">
          <h5 className="">
            Verified and Approved Merchant
          </h5>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          // onSubmit={(values)=>handleSubmit(values)}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
          }}
          enableReinitialize={true}
        >
          {(formik, resetForm) => (
            <Form className="row">
                  <div className="form-group col-md-3">
                  <label htmlFor="fromDate" className="ml-3">From Date:</label>
                        <ReactDatePicker
                          id="fromDate"
                          name="from_date"
                          selected={formik.values.from_date ? new Date(formik.values.from_date) : null}
                          onChange={date => formik.setFieldValue('from_date', date)}
                           dateFormat="dd/MM/yyyy"
                          className="form-control rounded-0"
                          errorMsg={formik.errors["from_date"]}
                          required={true}
                        />
                     
                    
                    {/* <FormikController
                      control="input"
                      type="date"
                      label="From Date"
                      name="from_date"
                      className="form-control"
                      // value={startDate}
                      // onChange={(e)=>setStartDate(e.target.value)}
                    /> */}
                  </div>

                  <div className="form-group col-md-3 ">
                  <label htmlFor="endDate">End Date:</label>
                        <ReactDatePicker
                          id="endDate"
                          name="to_date"
                          selected={formik.values.to_date ? new Date(formik.values.to_date) : null}
                          onChange={date => formik.setFieldValue('to_date', date)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control rounded-0"
                          errorMsg={formik.errors["to_date"]}
                        />
                    {/* <FormikController
                      control="input"
                      type="date"
                      label="End Date"
                      name="to_date"
                      className="form-control"
                    /> */}
                  </div>
                  <div className="form-group col-md-3">
                    <FormikController
                      control="select"
                      type="date"
                      label="Select your choice"
                      name="status"
                      options={selectStatus}
                      className="form-select"
                    />
                    {formik.handleChange(
                      "status",
                      setSelectedvalue(formik?.values?.status)
                    )}
                  </div>

                  <div className="form-group col-md-3">
                  <label></label>
                    <button
                      type="subbmit"
                      className="btn cob-btn-primary mt-4 approve text-white btn-sm"
                      disabled={disabled}
                    >
                      Submit
                    </button>
                </div>
            </Form>
          )}
        </Formik>
        {dataClick === true && noResultsFound?.length === 0 ? (
          <h5 className="text-center font-weight-bold">No Data Found</h5>
        ) : (
          <></>
        )}

{!loadingState && data?.length !== 0 && (
          <>
          <div className="row">
          <div className="form-group col-lg-3 ml-3 ">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
                searchTextByApiCall={true}
              />
            </div>

            <div className="form-group col-lg-3">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={dataCount}
                changePageSize={changePageSize}
              />
            </div>
            <div className="form-group col-lg-3">
              <button
                className="btn btn-sm text-white mt-4 cob-btn-primary "
                type="button"
                onClick={() => exportToExcelFn()}
              >
                Export
              </button>
            </div>
          </div>

            <div className="container-fluid ">
              <div className="scroll overflow-auto ml-4">
                {!loadingState && data?.length !== 0 && (
                  <Table
                    row={rowSignUpData}
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
          </>
        )}
      </div>
    </section>
  );
};

export default OnboardedReport;
