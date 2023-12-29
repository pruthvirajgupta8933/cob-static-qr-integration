import React, { useEffect, useState } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Regex, RegexMsg } from "../_components/formik/ValidationRegex";
import {
  fetchBeneficiaryDetails,
  fetchTransactionModes,
  PaymentRequest,
  fetchClientCode
} from "../slices/payoutSlice";
import { useSelector, useDispatch } from "react-redux";
import { Encrypt, Decrypt } from "../utilities/aes";
import BankResponse from "./BankResponse";
import FormikController from "../_components/formik/FormikController";
import toastConfig from "../utilities/toastTypes";


const MakePayment = (props) => {
  const dispatch = useDispatch();
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  useEffect(() => {
    const data = {
      pageSize: 10,
      pageNumber: 1,
    };
    dispatch(fetchClientCode());
    dispatch(fetchBeneficiaryDetails({ data }));
    dispatch(fetchTransactionModes());
  }, []);

  const fetchBeneficiary = () => {
    const data = {
      pageSize: 10,
      pageNumber: 1,
    };
    dispatch(fetchBeneficiaryDetails({ data })).then((res) => {
      toastConfig.infoToast(res.payload.message)
    })
  };

  const fetchBeneficiaryMode = () => {
    dispatch(fetchTransactionModes());
  };
  const [beneficiary, setbeneficiary] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const payoutBeneficiaryState = useSelector((state) => state.payout);
  const clientState = useSelector((state) => state.payout.clientData);
  const payoutTransactionsState = useSelector((state) => state.payout);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({});
  const [bankdata, setData] = useState([]);
  const [bankRespdetails, setBankRespDetails] = useState(false);
  const [paymentForm, setPaymentForm] = useState(true);
  const beneficiaryData = payoutBeneficiaryState?.beneficiaryList.results;

  const transactionsMode = payoutTransactionsState?.transactionsMode?.data;
  const authKey = clientState?.data?.auth_key;
  const authIv = clientState?.data?.auth_iv;

  let data = beneficiary.toString();
  const FORM_VALIDATION = Yup.object().shape({
    benficiary_name: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .required("Required"),
    beneficiary_account: Yup.string()
      .trim()
      .matches(AccountNoRgex, "Your Account Number is Invalid")
      .required("Required")
      .nullable(),
    ifsc_code: Yup.string()
      .trim()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      // .matches(IFSCRegex, "Your IFSC Number is Invalid")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required"),
    amount: Yup.string()
      //.matches(/^[0-9\b]+$/, "Only numbers are allowed for this field ")
      .required("Required"),
    order_id: Yup.string().required("Required"),
    purpose: Yup.string().required("Required"),
    remarks: Yup.string().required("Required"),
    mcc: Yup.string().required("Required"),
  });

  const handlePaymentRequestSubmit = (values) => {
    const data = JSON.stringify(
      Encrypt(
        `orderId=${values.order_id}&beneficiaryName=${values.benficiary_name}&beneficiaryAccount=${values.beneficiary_account}&beneficiaryIFSC=${values.ifsc_code}&amount=${values.amount}.00&purpose=${values.purpose},&remarks_description=${values.remarks},&mcc_code=${values.mcc}`,
        authKey,
        authIv
      )
    );
    const UpiData = JSON.stringify(
      Encrypt(
        `orderId=${values.order_id}&upiId=${values.benficiary_upi}&amount=${values.amount}&purpose=${values.purpose}&remarks_description=${values.remakrs}&mcc_code=${values.mcc}`,
        authKey,
        authIv
      )
    );
    dispatch(
      PaymentRequest({
        query: values.mode === "UPI" ? UpiData : data,
        mode: paymentMode,
      })
    ).then((res) => {
      if (res) {
        // console.log(res,"--makepayment")
        if (res.meta.requestStatus === "fulfilled") {
          if (res.payload.responseCode === "1") {
            setBankRespDetails(true);
            setPaymentForm(false);
          }
          let text = res.payload.resData;
          if (typeof text !== "undefined") {
            let planText = Decrypt(
              text,
              authKey,
              authIv
            );
            var str = planText.replace(/'/g, '"');
            var tempArr = [str];
            var resObj = JSON.parse(tempArr);
            setData(resObj);
          }
          toastConfig.infoToast(res.payload.message);
        }
      }
    }).catch((err) => {
      console.log(err, 'error');
    })
  }

  const test = (e) => {
    let data = beneficiaryData.filter((data) => data.id == e);
    let obj = Object.assign({}, data);
    setSelectedBeneficiary(obj);
  };
  const showMakePayment = (message) => {
    setBankRespDetails(false);
    setPaymentForm(true);
  };
  return (
    <>
      <section className="ant-layout">
        <div>

        </div>
        <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Payment Procedure</h1>
            </div>
            {paymentForm && (
              <div className="form-group  container ">
                <Formik
                  initialValues={{
                    benficiary_name: "",
                    beneficiary_account: "",
                    benficiary_upi: "",
                    order_id: "",
                    ifsc_code: "",
                    amount: "",
                    purpose: "",
                    remarks: "",
                    mcc: "",
                  }}
                  validationSchema={FORM_VALIDATION}
                  onSubmit={handlePaymentRequestSubmit}
                >
                  {(formik) => (
                    <Form acceptCharset="utf-8" action="#" className="simform">
                      <div className="container">
                        <div className="row">
                          <div className="col-sm-5">
                            <label>Select Beneficiary</label>
                            <select
                              // onChange={(e) => setbeneficiary(e)}
                              className="form-control rounded-0"
                              aria-label=".form-select-sm example"
                              // value={transStatus}
                              onChange={(e) => test(e.target.value)}
                              name="beneficiary"
                              onClick={(e) => {
                                fetchBeneficiary()
                                formik.setFieldValue(
                                  "beneficiary_account",
                                  selectedBeneficiary[0]?.account_number
                                );
                                formik.setFieldValue(
                                  "benficiary_name",
                                  selectedBeneficiary[0]?.full_name
                                );
                                formik.setFieldValue(
                                  "ifsc_code",
                                  selectedBeneficiary[0]?.ifsc_code
                                );
                                formik.setFieldValue(
                                  "benficiary_upi",
                                  selectedBeneficiary[0]?.upi_id
                                );
                              }}
                            >
                              <option selected>Select beneficiary</option>
                              {beneficiaryData?.map((data, key) => {
                                return (
                                  <option value={data.id} id={data.id}>
                                    {data.full_name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="col-sm-5">
                            <label>Mode</label>
                            <select
                              onClick={(e) => {
                                fetchBeneficiaryMode();
                                setPaymentMode(e.target.value);
                                formik.setFieldValue(
                                  "benficiary_name",
                                  selectedBeneficiary[0]?.full_name
                                );
                                formik.setFieldValue(
                                  "benficiary_upi",
                                  selectedBeneficiary[0]?.upi_id
                                );
                              }}
                              // onChange={(e)=>setPaymentMode(e.target.value)}
                              className="form-control rounded-0"
                              aria-label=".form-select-sm example"
                              // value={transStatus}
                              onChange={(e) => {
                                fetchBeneficiaryMode();
                              }}
                            >
                              <option selected>Select mode</option>
                              {transactionsMode?.map((data) => {
                                return (
                                  <option key={data} value={data.mode}>
                                    {data.mode}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-5">
                            {paymentMode == "UPI" ? (
                              <>
                                <label>UPI VPA</label>
                                <FormikController
                                  className="form-control"
                                  type="text"
                                  name="benficiary_upi"
                                  control="input"
                                />
                              </>
                            ) : (
                              <>
                                <label>Beneficiary Name</label>
                                <FormikController
                                  className="form-control"
                                  type="text"
                                  name="benficiary_name"
                                  id="benficiary_name"
                                  control="input"
                                  placeholder="beneficiary name"
                                />
                              </>
                            )}
                          </div>
                          <div className="col-sm-5">
                            <label>Beneficiary A/C No</label>
                            <FormikController
                              className="form-control"
                              type="text"
                              name="beneficiary_account"
                              control="input"
                              placeholder="account number"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-5 ">
                            <label>Order Id</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="order_id"
                              placeholder="order id"
                            />
                            {
                              <ErrorMessage name="order_id">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                      marginTop: "2px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>
                          <div className="col-sm-5 mt-2">
                            <label>Beneficiary IFSC</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="ifsc_code"
                              placeholder="ifsc code"
                            />
                            {
                              <ErrorMessage name="ifsc_code">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                      marginTop: "2px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-5 mt-2">
                            <label>Amount</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="amount"
                              placeholder="amount"
                            />
                            {
                              <ErrorMessage name="amount">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                      marginTop: "2px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>
                          <div className="col-sm-5 mt-2">
                            <label>Purpose</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="purpose"
                              placeholder="purpose"
                            />
                            {
                              <ErrorMessage name="purpose">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                      marginTop: "2px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col-sm-5">
                            <label>Remarks</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="remarks"
                              placeholder="remarks"
                            />
                            {
                              <ErrorMessage name="remarks">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: "999",
                                      marginTop: "2px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>

                          <div className="col-sm-5 ">
                            <label>MCC</label>
                            <Field
                              className="form-control"
                              type="text"
                              name="mcc"
                              placeholder="mcc"
                            />
                            {
                              <ErrorMessage name="mcc">
                                {(msg) => (
                                  <p
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                    }}
                                  >
                                    {msg}
                                  </p>
                                )}
                              </ErrorMessage>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="col-sm mt-4">
                        <button
                          type="submit"
                          className="btn approve text-white  btn-sm"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
            <div>
              {bankRespdetails && (
                <div className="ml-5">
                  {" "}
                  <BankResponse
                    data={bankdata}
                    showMakePayment={showMakePayment}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
export default MakePayment;
