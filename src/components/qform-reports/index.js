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

  const { user } = useSelector((state) => state.auth);
  const formList = useSelector((state) => state.qForm.qFormList.result);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getQformList({
        clientCode: user.clientMerchantDetailsList?.[0]?.clientCode,
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
    formId: Yup.string().required("Form not found"),
    endDate: Yup.date().required("Required"),
  });

  const exportToExcelFn = async () => {};
  const submitHandler = (values, { setSubmitting }) => {
    setTxnList([]);
    const payload = {
      clientId: user.clientMerchantDetailsList?.[0]?.clientId,
      clientCode: user.clientMerchantDetailsList?.[0]?.clientCode,
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
          if (res.payload === "Network Error") {
            alert("Network Error");
            return;
          }
          setTxnList(res.payload);
          setSubmitting(false);
        }
      });
    } catch (e) {
      console.log(e);
      setSubmitting(false);
    }
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, errors, isSubmitting }) => (
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
                    formList,
                    false,
                    false,
                    true
                  )}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="start_date" className="form-label">
                  Start Date
                </label>

                <FormikController
                  control="date"
                  id="from_date"
                  name="fromDate"
                  value={values.fromDate ? new Date(values.fromDate) : null}
                  onChange={(date) => setFieldValue("fromDate", date)}
                  format="dd-MM-y"
                  clearIcon={null}
                  className="form-control rounded-datepicker p-2 zindex_DateCalender"
                  required={true}
                  popperPlacement="top-end"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="end_date" className="form-label">
                  End Date
                </label>

                <FormikController
                  control="date"
                  id="end_date"
                  name="endDate"
                  value={values.endDate ? new Date(values.endDate) : null}
                  onChange={(date) => setFieldValue("endDate", date)}
                  format="dd-MM-y"
                  clearIcon={null}
                  className="form-control rounded-datepicker p-2 zindex_DateCalender"
                  required={true}
                  errorMsg={errors["end_date"]}
                />
              </div>
              <div className="form-group col-md-2 col-sm-12 col-lg-3">
                <button
                  disabled={isSubmitting}
                  className="btn btn-sm text-white cob-btn-primary mt-4"
                  type="submit"
                >
                  {isSubmitting && (
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
          <table className="table table-bordered bg-white">
            <thead>
              <tr className="">
                {Object.keys(txnList[0])?.length > 0 &&
                  Object.keys(txnList[0])?.map((key) => (
                    <th className="px-2 border-1 fw-bold text-black-50">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {txnList?.map((row, i) => (
                <tr className="text-black" key={`${row}-${i}`}>
                  {Object.values(row).map((col) => (
                    <td>{col}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default QFormReports;
