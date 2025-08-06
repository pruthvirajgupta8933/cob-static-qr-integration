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
// import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { fetchChildDataList } from "../../../slices/persist-slice/persistSlice";
import { transactionEnquireyApi } from "../../../services/transaction-enquirey/transactionEnquirey.service";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import CardLayout from "../../../utilities/CardLayout"

const TransactionEnquirey = React.memo(() => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    show: false,
    errMessage: "",
    data: {},
    printData: [],
    disable: false,
    loadingState: false,
  });

  const { auth, commonPersistReducer } = useSelector(
    (state) => state
  );
  const { refrerChiledList } = commonPersistReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];
  const roles = roleBasedAccess();
  const { user } = auth;
  const [placeholder, setPlaceholder] = useState(
    "Enter SabPaisa Transaction ID"
  );

  const validationSchema = Yup.object().shape({
    transaction_id: Yup.string()
      .max(110, "Transaction ID length exceed")
      .required("Required")
      .allowOneSpace(),
    transaction_from: Yup.string()
      .nullable()
      .required("Required")
      .allowOneSpace(),
    clientCode: Yup.string().nullable().required("Required").allowOneSpace(),
  });
  const handleSearchByChange = (formik) => (e) => {
    const value = e.target.value;
    formik.setFieldValue("transaction_from", value);
    formik.setFieldValue("transaction_id", "");

    // Update placeholder dynamically
    if (value === "1") {
      setPlaceholder("Enter SabPaisa Transaction ID");
    } else if (value === "2") {
      setPlaceholder("Enter Client Transaction ID");
    } else {
      setPlaceholder("Enter SabPaisa Transaction ID");
    }
  };

  useEffect(() => {
    const roleType = roles;
    const type = roleType.bank
      ? "bank"
      : roleType.referral
        ? "referrer"
        : "default";
    if (type !== "default") {
      const postObj = {
        type: type,
        login_id: auth?.user?.loginId,
      };
      dispatch(fetchChildDataList(postObj));
    }
  }, []);

  const clientMerchantDetailsList = user?.clientMerchantDetailsList ?? [];
  const fnKey = roles?.merchant ? "clientCode" : "client_code";
  const fnVal = roles?.merchant ? "clientName" : "name";
  const clientCodeListArr = roles?.merchant
    ? clientMerchantDetailsList
    : clientCodeData;

  const clientCodeOption = useMemo(
    () =>
      convertToFormikSelectJson(
        fnKey,
        fnVal,
        clientCodeListArr,
        {},
        false,
        true
      ),
    [fnKey, fnVal, clientCodeListArr]
  );

  const initialValues = useMemo(
    () => ({
      clientCode:
        roles.merchant && clientCodeListArr.length > 0
          ? clientCodeListArr[0][fnKey]
          : "",
      transaction_id: "",
      transaction_from: "1",
    }),
    [roles.merchant, clientCodeListArr, fnKey]
  );

  const convertDate = useCallback(
    (dateValue) => moment(dateValue).format("DD/MM/YYYY hh:mm a"),
    []
  );

  const onSubmit = useCallback(async (input) => {
    setState((prev) => ({
      ...prev,
      loadingState: true,
      data: {},
      disable: true,
    }));

    const spTxnId = input.transaction_from === "1" ? input.transaction_id : 0;
    const clientTxnId =
      input.transaction_from === "2" ? input.transaction_id : 0;

    const postData = {
      clientCode: input.clientCode,
    };

    if (input.transaction_from === "1") {
      postData.sabpaisaTxnId = spTxnId;
    } else if (input.transaction_from === "2") {
      postData.clientTxnId = clientTxnId;
    }

    try {
      const response = await transactionEnquireyApi(postData);
      if (response?.data?.result) {
        setState((prev) => ({
          ...prev,
          loadingState: false,
          show: true,
          data: response?.data?.result,
          errMessage: "",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loadingState: false,
          show: false,
          errMessage: "No ",
        }));
      }
    } catch (e) {
      setState((prev) => ({
        ...prev,
        loadingState: false,
        show: false,
        errMessage: "No data found",
      }));
    } finally {
      setState((prev) => ({ ...prev, disable: false }));
    }
  }, []);

  useEffect(() => {
    const tempArr = [
      { key: "Txn Id", value: state.data.sabpaisaTxnId },
      { key: "Payment Mode", value: state.data.paymentMode },
      { key: "Payer Name", value: state.data.payerName },
      { key: "Payer Mobile", value: state.data.payerMobile },
      { key: "Payer Email", value: state.data.payerEmail },
      { key: "Status ", value: state.data.status },
      { key: "Bank Txn Id", value: state.data.bankTxnId },
      { key: "Payer Amount", value: state.data.amount },
      { key: "Paid Amount", value: state.data.paidAmount },
      { key: "Transaction Date", value: dateFormatBasic(state.data.transDate) },
      { key: "Client Code ", value: state.data.clientCode },
      { key: "Client Txn Id", value: state.data.clientTxnId },
      { key: "Chargeback Status ", value: state.data.chargeBackStatus },
      { key: "Refund Status", value: state.data.refundStatusCode },
      { key: "Settlement Status", value: state.data.settlementStatus },
    ];
    setState((prev) => ({ ...prev, printData: tempArr }));
  }, [state.data, convertDate]);

  const onClick = useCallback(async () => {
    let tableContents = document.getElementById("print_docuement").innerHTML;
    let a = window.open("", "", "height=900, width=900");
    a.document.write(tableContents);
    a.document.close();
    await a.print();
  }, []);

  const txnOption = useMemo(
    () => [
      { key: "1", value: "Sabpaisa Transaction ID" },
      { key: "2", value: "Client Transaction ID" },
    ],
    []
  );

  return (
    <CardLayout title={"Transaction Enquiry"} >
      <div className="row">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <div className="form-row mt-4">
                <div className="form-group col-lg-3">
                  <FormikController
                    control="select"
                    label="Client Code"
                    name="clientCode"
                    className="form-select  mt-0"
                    options={clientCodeOption}
                  />
                </div>
                <div className="form-group col-lg-3">
                  <FormikController
                    control="select"
                    label="Search By"
                    name="transaction_from"
                    className="form-select  mt-0"
                    onChange={handleSearchByChange(formik)}
                    options={txnOption}
                  />
                </div>
                <div className="form-group col-md-12 col-sm-12 col-lg-3">
                  <FormikController
                    control="input"
                    label="Transaction ID"
                    name="transaction_id"
                    placeholder={placeholder}
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-12 col-sm-12 col-lg-3">
                  <button
                    disabled={state.disable}
                    className="btn btn-sm text-white cob-btn-primary mt-4"
                    type="submit"
                  >
                    {state.disable && (
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
              {state.show && state.printData.length > 0 && (
                <div className=" row ">
                  {/* <hr></hr> */}
                  <div className="border-bottom mt-2"></div>

                  <div className="col-auto ms-auto">
                    <button
                      Value="click"
                      onClick={onClick}
                      className="btn cob-btn-primary text-white mt-4 ml-3 btn-sm"
                    >
                      <i className="fa fa-print" ariaHidden="true"></i>{" "}
                      Print
                    </button>
                  </div>
                </div>
              )}


            </Form>
          )}
        </Formik>
        <CustomLoader loadingState={state.loadingState} />
        {!state.loadingState &&
          state.show &&
          state.printData.length > 0 && (
            <div
              className="mt-4 table_scrollar"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div className="table-responsive">
                <table className="table ">
                  <tbody>
                    {state?.printData.map((item, idx) => (
                      <tr key={idx}>
                        <th className="table-striped background_color">
                          {item.key}
                        </th>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PrintDocument data={state.printData} />
              </div>
            </div>
          )}
        {state.errMessage && (
          <div className="col">

            <div style={{ padding: '24px', color: '#999', fontSize: '16px', textAlign: 'center' }}>{state.errMessage}</div>
          </div>
        )}
      </div>
    </CardLayout>


  );
});

export default TransactionEnquirey;
