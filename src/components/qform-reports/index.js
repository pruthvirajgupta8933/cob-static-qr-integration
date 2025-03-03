import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { Formik, Form } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import Yup from "../../_components/formik/Yup";
import { FaCalendarAlt } from "react-icons/fa";
import classes from "../dashboard/AllPages/allpage.module.css";
import FormikController from "../../_components/formik/FormikController";
import { getQformList, getQformTxnList } from "../../slices/qform-reports";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
const QFormReports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [txnList, setTxnList] = useState();
  const [exportReportLoader, setExportReportLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const formList = useSelector((state) => state.qForm.qFormList.result);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getQformList({
        clientCode: "GCED1", //user.clientMerchantDetailsList?.[0]?.clientCode,
      })
    );
  }, []);
  const initialValues = {
    fromDate: startDate,
    endDate: endDate,
    transaction_status: "All",
    payment_mode: "All",
  };

  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required"),
    formId: Yup.string().required("Client code not found"),
    endDate: Yup.date().required("Required"),
  });

  const exportToExcelFn = async () => {};
  const submitHandler = (values) => {
    setLoading(true);
    const payload = {
      clientId: "2326", //user.clientMerchantDetailsList?.[0]?.clientId,
      clientCode: "GCED1", //user.clientMerchantDetailsList?.[0]?.clientCode,
      formId: values.formId,
      formName: formList.find((form) => form.formId == values.formId)?.formName,
      fromDate: moment(values.fromDate).format("DD-MM-YYYY"),
      toDate: moment(values.endDate).format("DD-MM-YYYY"),
      payMode: "",
      transStatus: "",
    };
    try {
      dispatch(getQformTxnList(payload)).then((res) => {
        if (res.payload) {
          setLoading(false);
          setTxnList(res.payload);
        }
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {(formik) => (
          <Form>
            <div className="form-row mt-4">
              <div className="form-group col-md-4 col-lg-2 col-sm-12">
                <FormikController
                  control="select"
                  label="Form Name"
                  name="formId"
                  className="form-select rounded-0"
                  options={convertToFormikSelectJson(
                    "formId",
                    "formName",
                    formList
                  )}
                />
              </div>
              <div className="form-group col-md-6 col-lg-4 col-xl-3 col-sm-12 ">
                <label htmlFor="dateRange" className="form-label">
                  Start Date - End Date
                </label>
                <div
                  className={`input-group mb-3 d-flex justify-content-between bg-white ${classes.calendar_border}`}
                >
                  <DatePicker
                    id="dateRange"
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartDate(start);
                      setEndDate(end);
                      formik.setFieldValue("fromDate", start);
                      formik.setFieldValue("endDate", end);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date Range"
                    className={`form-control rounded-0 p-0 date_picker ${classes.calendar} ${classes.calendar_input_border}`}
                    showPopperArrow={false}
                    popperClassName={classes.custom_datepicker_popper}
                  />
                  <div
                    className="input-group-append"
                    onClick={() => {
                      document.getElementById("dateRange").click();
                    }}
                  >
                    <span
                      className={`input-group-text ${classes.calendar_input_border}`}
                    >
                      {" "}
                      <FaCalendarAlt />
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group col-md-2 col-sm-12 col-lg-3">
                <button
                  disabled={loading}
                  className="btn btn-sm text-white cob-btn-primary mt-4"
                  type="submit"
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                      ariaHidden="true"
                    ></span>
                  )}
                  View
                </button>
              </div>
            </div>
            <div className="row d-flex justify-content-between">
              {/* <div className="form-group col-md-6 col-lg-6">
                {txnList?.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm text-white cob-btn-primary mx-2"
                    onClick={() => exportToExcelFn()}
                    disabled={exportReportLoader}
                  >
                    <i className="fa fa-download"></i>
                    {exportReportLoader ? " Loading..." : " Export"}
                  </button>
                )}
              </div> */}
            </div>
          </Form>
        )}
      </Formik>
      <div className="col-md-12 mt-4 overflow-scroll">
        {txnList?.length > 0 && (
          <table className="table table-bordered">
            <thead className="bg-primary text-white">
              {Object.keys(txnList[0])?.length > 0 &&
                Object.keys(txnList[0])?.map((key) => <th>{key}</th>)}
            </thead>
            {txnList?.map((row) => (
              <tr>
                {Object.values(row).map((col) => (
                  <td>{col}</td>
                ))}
              </tr>
            ))}
          </table>
        )}
      </div>
    </div>
  );
};

export default QFormReports;
