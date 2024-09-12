import axios from "axios";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../../_components/formik/Yup";
import { Formik, Form } from "formik";
import FormikController from "../../../_components/formik/FormikController";
import PrintDocument from "../../../_components/reuseable_components/PrintDocument";
import moment from "moment";
import CustomLoader from "../../../_components/loader";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import { fetchChiledDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { transactionEnquireyApi } from "../../../services/transaction-enquirey/transactionEnquirey.service";

const TransactionEnquirey = React.memo(() => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    show: false,
    errMessage: "",
    data: {},
    printData: [],
    disable: false,
    loadingState: false
  });
  const { auth, merchantReferralOnboardReducer } = useSelector((state) => state);
  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];
  const roles = roleBasedAccess();
  const { user } = auth;

  const validationSchema = Yup.object().shape({
    transaction_id: Yup.string().max(110, "Transaction ID length exceed").required("Required").allowOneSpace(),
    transaction_from: Yup.string().nullable().required("Required").allowOneSpace(),
    clientCode: Yup.string().nullable().required("Required").allowOneSpace(),
  });

  const fetchData = useCallback(() => {
    const roleType = roles;
    const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
    if (type !== "default") {
      const postObj = {
        type: type,
        login_id: auth?.user?.loginId
      };
      dispatch(fetchChiledDataList(postObj));
    }
  }, [roles, auth, dispatch]);

  useEffect(() => {
    const roleType = roles;
    const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
    if (type !== "default") {
      const postObj = {
        type: type,
        login_id: auth?.user?.loginId
      };
      dispatch(fetchChiledDataList(postObj));
    }
  }, []);

  const clientMerchantDetailsList = user?.clientMerchantDetailsList ?? [];
  const fnKey = roles?.merchant ? "clientCode" : "client_code";
  const fnVal = roles?.merchant ? "clientName" : "name";
  const clientCodeListArr = roles?.merchant ? clientMerchantDetailsList : clientCodeData;

  const clientCodeOption = useMemo(() =>
    convertToFormikSelectJson(fnKey, fnVal, clientCodeListArr, {}, false, true),
    [fnKey, fnVal, clientCodeListArr]
  );

  const initialValues = useMemo(() => ({
    clientCode: roles.merchant && clientCodeListArr.length > 0 ? clientCodeListArr[0][fnKey] : "",
    transaction_id: "",
    transaction_from: "1"
  }), [roles.merchant, clientCodeListArr, fnKey]);

  const convertDate = useCallback((yourDate) => moment(yourDate).format("DD/MM/YYYY hh:mm a"), []);

  const onSubmit = useCallback(async (input) => {
    setState(prev => ({ ...prev, loadingState: true, data: {}, disable: true }));

    const spTxnId = input.transaction_from === "1" ? input.transaction_id : 0;
    const clientTxnId = input.transaction_from === "2" ? input.transaction_id : 0;
    const endPoint = `/${spTxnId}/${clientTxnId}/${input.clientCode}`;

    try {
      const response = await transactionEnquireyApi(endPoint)
      if (response?.data?.length > 0) {
        setState(prev => ({
          ...prev,
          loadingState: false,
          show: true,
          data: response.data[0],
          errMessage: ""
        }));
      } else {
        setState(prev => ({
          ...prev,
          loadingState: false,
          show: false,
          errMessage: "Data Not Found"
        }));
      }
    } catch (e) {
      setState(prev => ({
        ...prev,
        loadingState: false,
        show: false,
        errMessage: "Data Not Found"
      }));
    } finally {
      setState(prev => ({ ...prev, disable: false }));
    }
  }, []);

  useEffect(() => {
    const tempArr = [
      { key: "Txn Id", value: state.data.txn_id },
      { key: "Payment Mode", value: state.data.payment_mode },
      { key: "Payer Name", value: state.data.payee_name },
      { key: "Payer Mobile", value: state.data.payee_mob },
      { key: "Payer Email", value: state.data.payee_email },
      { key: "Status ", value: state.data.status },
      { key: "Bank Txn Id", value: state.data.bank_txn_id },
      { key: "Client Name", value: state.data.client_name },
      { key: "Client Id", value: state.data.client_id },
      { key: "Payer Amount", value: state.data.payee_amount },
      { key: "Paid Amount", value: state.data.paid_amount },
      { key: "Transaction Date", value: convertDate(state.data.trans_date) },
      { key: "Client Code ", value: state.data.client_code },
      { key: "Client Txn Id", value: state.data.client_txn_Id },
      { key: "Refund Track Id ", value: state.data.udf4 },
      { key: "Chargeback ", value: state.data.udf2 },
      { key: "Refund ", value: state.data.udf3 },
      { key: "Settlement Status", value: state.data.udf1 },
      
    ];
    setState(prev => ({ ...prev, printData: tempArr }));
  }, [state.data, convertDate]);

  const onClick = useCallback(async () => {
    let tableContents = document.getElementById("print_docuement").innerHTML;
    let a = window.open("", "", "height=900, width=900");
    a.document.write(tableContents);
    a.document.close();
    await a.print();
  }, []);

  const txnOption = useMemo(() => [
    { key: "1", value: "Sabpaisa Transaction ID" },
    { key: "2", value: "Client Transaction ID" }
  ], []);

  return (
    <section className="">
      <main className="">
        <h5 className="">Transaction Enquiry</h5>
        <section className="">
          <div className="container-fluid p-0">
            <div className="row">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(formik) => (
                  <Form>
                    <div className="form-row mt-4">
                      <div className="form-group col-lg-2">
                        <FormikController
                          control="select"
                          label="Client Code"
                          name="clientCode"
                          className="form-select rounded-0 mt-0"
                          options={clientCodeOption}
                        />
                      </div>
                      <div className="form-group col-lg-3">
                        <FormikController
                          control="select"
                          label="Search By"
                          name="transaction_from"
                          className="form-select rounded-0 mt-0"
                          onChange={(e) => {
                            formik.setFieldValue("transaction_from", e.target.value);
                            formik.setFieldValue("transaction_id", "");
                          }}
                          options={txnOption}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-3">
                      <div className="form-group col-md-12 col-sm-12 col-lg-5">
                        <FormikController
                          control="input"
                          label="Transaction ID"
                          lableClassName="font-weight-bold"
                          name="transaction_id"
                          placeholder="Enter Transaction ID"
                          className="form-control"
                        />
                        <button
                          disabled={state.disable}
                          className="btn btn-sm text-white cob-btn-primary mt-4"
                          type="submit"
                        >
                          {state.disable && (
                            <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                          )}
                          View
                        </button>
                        {state.show && state.printData.length > 0 && (
                          <button
                            Value="click"
                            onClick={onClick}
                            className="btn btn-secondary text-white mt-4 ml-3 btn-sm"
                          >
                            <i className="fa fa-print" ariaHidden="true"></i> Print
                          </button>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <CustomLoader loadingState={state.loadingState} />
              {!state.loadingState && state.show && state.printData.length > 0 && (
                <div className="overflow-auto col-lg-12 mb-5 border">
                  <div className="container-fluid">
                    <div className="row">
                      {state.printData.map((datas, key) => (
                        <div className="col-4 p-2" key={datas.key.toString()}>
                          <p>
                            <span className="font-weight-bold"> {datas.key} :</span>
                            <span className= "large_content_wrap">
                              {datas.value}
                            </span>
                          </p>
                        </div>
                      ))}

                    </div>
                  </div>
                  <PrintDocument data={state.printData} />
                </div>
              )}
              {state.errMessage && (
                <div className="col">
                  <h5 className=" text-center">
                    {state.errMessage}
                  </h5>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </section>
  );
});

export default TransactionEnquirey;
