import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { clearFetchAllByKycStatus, onboardedReport } from "../../slices/kycSlice";
import moment from "moment";
// import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../src/_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";
import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED } from "../../utilities/enums";
import { exportToExcelOnboard } from "../../services/kyc/export-data.service";
import Yup from "../../_components/formik/Yup";

const OnboardedReport = () => {
  const [searchingData, setSearchingData] = useState([]);
  // const [dataCount, setDataCount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardValue, setOnboradValue] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedvalue, setSelectedvalue] = useState(KYC_STATUS_APPROVED);
  const [disabled, setDisabled] = useState(false);
  const [exportDisable, setExportDisable] = useState(false)
  // const [dataClick, setDataClick] = useState(false);

  const dispatch = useDispatch();
  const { kyc } = useSelector(state => state)
  const { allKycData } = kyc
  const { result, loading, count } = allKycData

  useEffect(() => {
    setSearchingData(result)
  }, [result])

  const rowSignUpData = [
    {
      id: "1", name: "S. No.",
      selector: (row) => row.sno,
      sortable: true,
      width: "80px",
    },
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
      selector: (row) => DateFormatter(row.signUpDate, false),
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
    if (searchText?.length !== 0) {
      setSearchingData(
        searchingData?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setSearchingData(result)
    }

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

  const initialValues = {
    from_date: splitDate,
    to_date: splitDate,
    status: KYC_STATUS_APPROVED,
  };

  const validationSchema = Yup.object({
    from_date: Yup.date().required("Required").nullable(),
    to_date: Yup.date()
      .min(Yup.ref("from_date"), "End date can't be before Start date")
      .required("Required"),
    status: Yup.string().required("Required").nullable(),
  });


  const handleSubmit = (values) => {
    setDisabled(true)
    setOnboradValue(values);
    dispatch(
      onboardedReport({
        page: currentPage,
        page_size: pageSize,
        kyc_status: values.status
      })
    ).then((res) => {
      setDisabled(false)
    })
  };

  useEffect(() => {

    return () => {
      dispatch(clearFetchAllByKycStatus())
    }
  }, [])

  // only two date coloum is available in the db, 
  const selectStatus = [
    { key: KYC_STATUS_VERIFIED, value: KYC_STATUS_VERIFIED },
    { key: KYC_STATUS_APPROVED, value: KYC_STATUS_APPROVED }
  ];

  const exportToExcelFn = () => {
    setExportDisable(true)
    exportToExcelOnboard({
      status: onboardValue.status,
      from_date: moment(onboardValue.from_date).startOf('day').format('YYYY-MM-DD'),
      to_date: moment(onboardValue.to_date).startOf('day').format('YYYY-MM-DD'),
    }).then((res) => {
      setExportDisable(false)

    })
  };

  return (

    <section className="">
      <div className="">
        <div className="">
          <h5 className="">
            Onboarded Report
          </h5>
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
            <Form className="row mt-5">
              <div className="form-group col-md-3">
                <FormikController
                  control="select"
                  label="Merchant KYC Status"
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
                <button
                  type="submit"
                  className="btn cob-btn-primary mt-4 approve text-white btn-sm"
                  disabled={disabled}
                >
                  {disabled && (
                    <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                  )} {/* Show spinner if disabled */}
                  Search
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {!searchingData?.length === 0 && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )}

        {!loading && result?.length !== 0 && (
          <>
            <div className="row">
              <div className="form-group col-lg-3">
                <SearchFilter
                  kycSearch={kycSearch}
                  searchText={searchText}
                  searchByText={searchByText}
                  setSearchByDropDown={setSearchByDropDown}
                  searchTextByApiCall={false}
                />
              </div>

              <div className="form-group col-lg-3">
                <CountPerPageFilter
                  pageSize={pageSize}
                  dataCount={count}
                  currentPage={currentPage}
                  changePageSize={changePageSize}
                  changeCurrentPage={changeCurrentPage}
                />
              </div>
              <div className="form-group col-lg-3">
                <button
                  className="btn btn-sm text-white mt-4 cob-btn-primary "
                  type="button"
                  onClick={() => exportToExcelFn()}
                  disabled={exportDisable}
                >
                  {exportDisable && (
                    <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                  )}
                  Export
                </button>
              </div>
            </div>

            <div className="container p-0">
              <div className="scroll overflow-auto">
                <h6>Total Count : {count}</h6>
                {!loading && searchingData?.length !== 0 && (
                  <Table
                    row={rowSignUpData}
                    data={searchingData}
                    dataCount={count}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    changeCurrentPage={changeCurrentPage}
                  />
                )}
              </div>
              <CustomLoader loadingState={loading} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OnboardedReport;



