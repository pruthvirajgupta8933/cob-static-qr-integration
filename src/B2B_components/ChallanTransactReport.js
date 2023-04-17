import React, { useState, useEffect } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import { Formik, Form } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../_components/reuseable_components/convertToFormikSelectJson";
import { useHistory } from "react-router-dom";
import {
  challanTransactions,
  exportTransactions,
} from "../slices/backTobusinessSlice";
import toastConfig from "../utilities/toastTypes";
import Blob from "blob";
import { ChallanReportData } from "../utilities/tableData";
import Table from "../_components/table_components/table/Table";
import CountPerPageFilter from "../../src/_components/table_components/filters/CountPerPage";
import CustomLoader from "../_components/loader";

const ChallanTransactReport = () => {
  const dispatch = useDispatch();

  const rowData = ChallanReportData;

  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const loadingState = useSelector((state) => state.challanReducer.isLoading);

  // console.log(loadingState,"loadingState")

  const { user } = auth;
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [showData, setShowData] = useState(false);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [saveData, setSaveData] = useState();
  const [disable, setDisable] = useState(false);
  const [isexcelDataLoaded, setIsexcelDataLoaded] = useState(false);

  const validationSchema = Yup.object({
    from_date: Yup.date()
      .required("Required")
      .nullable(),
    to_date: Yup.date()
      .min(Yup.ref("from_date"), "End date can't be before Start date")
      .required("Required"),
    clientCode: Yup.string().required("Required"),
  });

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  // const [todayDate, setTodayDate] = useState(splitDate);

  let todayDate = splitDate;

  const initialValues = {
    from_date: todayDate,
    to_date: todayDate,
    clientCode: "",
  };

  let clientMerchantDetailsList = [];
  if (
    user &&
    user?.clientMerchantDetailsList === null &&
    user?.roleId !== 3 &&
    user?.roleId !== 13
  ) {
    history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    {},
    false,
    true
  );

  const challanSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    dispatch(
      challanTransactions({
        page: currentPage,
        page_size: pageSize,
        from_date: saveData?.from_date,
        to_date: saveData?.to_date,
      })
    )
      .then((resp) => {
        // resp?.payload?.status_code && toastConfig.errorToast("");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
      })

      .catch((err) => {});
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        verfiedMerchant.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(verfiedMerchant);
    }
  }, [searchText]);

  const colData = () => {
    return data?.map((user, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{user?.client_code}</td>
        <td>{user?.bank_code}</td>
        <td>{user?.amount}</td>
        <td>{user?.bank_reference_number}</td>
        <td>{user?.challan_number}</td>
        <td>{user?.ifsc}</td>
        <td>{user?.gl}</td>
        <td>{user?.sp_igl_ind}</td>
        <td>{user?.type}</td>
        <td>{user?.created_on}</td>
      </tr>
    ));
  };

  

  // console.log(pageSize,"page Size")

  const handleSubmit = (values) => {
    // console.log(values);
    setDisable(true);
    const formData = {
      from_date: values.from_date,
      to_date: values.to_date,
      client_code: values.clientCode,
      page: currentPage,
      page_size: pageSize,
    };

    setSaveData(values);

    dispatch(challanTransactions(formData))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;

        if (data?.length === 0 && data !== null) {
          // Return null value
        } else {
          // toastConfig.successToast("Data loaded");
        }

        setData(data);
        setSpinner(true);
        setDataCount(dataCoun);
        setShowData(true);
        setVerifiedMerchant(data);
        setDisable(false);
      })

      .catch((err) => {
        toastConfig.errorToast(err);
        setDisable(false);
      });
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const exportToExcelFn = () => {  
    setIsexcelDataLoaded(true);
    dispatch(
      exportTransactions({
        page: currentPage,
        page_size: pageSize,
        from_date: saveData?.from_date,
        to_date: saveData?.to_date,
        client_code: saveData?.clientCode,
      })
    ).then((res) => {
      setIsexcelDataLoaded(false);
      const blob = new Blob([res?.payload?.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MIS_REPORT_${saveData?.clientCode}_${splitDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h1 className="m-b-sm gx-float-left mt-3">
            Challan Transactions Report
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          enableReinitialize={true}
        >
          <Form>
            <div className="container">
              <div className="row">
                <div className="form-group col-lg-4">
                  <FormikController
                    control="select"
                    label="Client Code"
                    name="clientCode"
                    className="form-control rounded-0 mt-0"
                    options={clientCodeOption}
                  />
                </div>

                <div className="form-group col-lg-4">
                  <FormikController
                    control="input"
                    type="date"
                    label="From Date"
                    name="from_date"
                    className="form-control rounded-0"
                    // value={startDate}
                    // onChange={(e)=>setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group col-lg-4">
                  <FormikController
                    control="input"
                    type="date"
                    label="End Date"
                    name="to_date"
                    className="form-control rounded-0"
                  />
                </div>

                <div className=" col-lg-4">
                  <button
                    type="subbmit"
                    disabled={disable}
                    className="btn approve text-white  btn-xs"
                  >
                    Submit
                  </button>
                </div>

                {showData === true ? (
                  <div className="container-fluid flleft">
                    <div className="form-group col-lg-4 col-md-12 mt-2">
                      <label>Search</label>
                      <input
                        className="form-control"
                        onChange={challanSearch}
                        type="text"
                        placeholder="Search Here"
                      />
                    </div>
                    <div></div>
                    <div className="form-group col-lg-4 col-md-12 mt-2">
                      <CountPerPageFilter
                        pageSize={pageSize}
                        dataCount={dataCount}
                        changePageSize={changePageSize}
                      />
                    </div>

                    <div className="form-group col-lg-4 col-md-12 mt-5">
                      <button
                        className="btn btn-sm text-white  "
                        type="button"
                        disabled={isexcelDataLoaded}
                        onClick={() => exportToExcelFn()}
                        style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      >
                        Export
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Form>
        </Formik>
        {showData === true ? (
          <div className="col-md-12 col-md-offset-4">
            <h5 className="font-weight-bold">Total Records: {data?.length}</h5>
            <div className="scroll overflow-auto">
              <Table
                row={rowData}
                data={data}
                dataCount={dataCount}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
               
              />
            </div>
            <CustomLoader loadingState={loadingState} />
            {data?.length == 0 && !loadingState && (
              <h2 className="text-center font-weight-bold">No Data Found</h2>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default ChallanTransactReport;
