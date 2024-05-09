import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import * as Yup from "yup";
import Yup from "../../../_components/formik/Yup";
import { Formik, Form } from "formik";
import API_URL from "../../../config";
import FormikController from "../../../_components/formik/FormikController";
import PrintDocument from "../../../_components/reuseable_components/PrintDocument";
import moment from "moment";
import CustomLoader from "../../../_components/loader";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import { fetchChiledDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";

function TransactionEnquirey() {
  const dispatch = useDispatch();
  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector((state) => state);
  const { refrerChiledList } = merchantReferralOnboardReducer
  const clientCodeData = refrerChiledList?.resp?.results ?? []
  const roles = roleBasedAccess();
  const { user } = auth;

  const validationSchema = Yup.object({

    transaction_id: Yup.string().max(110, "Transaction ID length exceed").required("Required").allowOneSpace(),
    transaction_from: Yup.string().nullable().required("Required").allowOneSpace(),
    clientCode: Yup.string().nullable().required("Required").allowOneSpace(),

  });


  const fetchData = () => {
    const roleType = roles
    const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
    if (type !== "default") {
      let postObj = {
        type: type,  // Set the type based on roleType
        login_id: auth?.user?.loginId
      }
      dispatch(fetchChiledDataList(postObj));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  let clientMerchantDetailsList = [];
  if (
    user &&
    user?.clientMerchantDetailsList === null &&
    user?.roleId !== 3 &&
    user?.roleId !== 13
  ) {
    // history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  let fnKey, fnVal = ""
  let clientCodeListArr = []
  if (roles?.merchant === true) {
    fnKey = "clientCode"
    fnVal = "clientName"
    clientCodeListArr = clientMerchantDetailsList
  } else {
    fnKey = "client_code"
    fnVal = "name"
    clientCodeListArr = clientCodeData
  }


  const clientCodeOption = convertToFormikSelectJson(
    fnKey,
    fnVal,
    clientCodeListArr,
    {},
    false,
    true
  );


  let initialValues = {
    clientCode: "",
    transaction_id: "",
    transaction_from: "1"
  };

  if (roles.merchant === true && clientCodeListArr && clientCodeListArr.length > 0 && clientCodeListArr[0] && clientCodeListArr[0][fnKey]) {
    initialValues.clientCode = clientCodeListArr[0][fnKey];
  }


  const [show, setIsShow] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [data, setData] = useState({});
  const [printData, setPrintData] = useState([]);
  const [disable, setIsDisable] = useState(false)
  const [loadingState, setLoadingState] = useState(false)


  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };

  const onSubmit = async (input) => {
    setLoadingState(true);
    setData({});
    setIsDisable(true);

    let spTxnId = 0;
    let clientTxnId = 0;

    if (input.transaction_from === "1") {
      spTxnId = input.transaction_id;
    } else {
      clientTxnId = input.transaction_id;
    }
    let endPoint = `/${spTxnId}/${clientTxnId}/${input.clientCode}`;

    try {
      const response = await axios.get(API_URL.VIEW_TXN + endPoint);

      if (response?.data?.length > 0) {
        setLoadingState(false);
        setIsShow(true);
        setData(response?.data[0]);
        setErrMessage(false);
      } else {
        setLoadingState(false);
        setIsShow(false);
        setErrMessage(true);
      }
    } catch (e) {
      setLoadingState(false);
      setIsShow(false);
      setErrMessage(true);
    }

    setIsDisable(false);
  };



  useEffect(() => {
    const tempArr = [
      { key: "Txn Id", value: data.txn_id },
      { key: "Payment Mode", value: data.payment_mode },
      { key: "Payee Name", value: data.payee_name },
      { key: "Payee Mobile", value: data.payee_mob },
      { key: "Payee Email", value: data.payee_email },
      { key: "Status ", value: data.status },
      { key: "Bank Txn Id", value: data.bank_txn_id },
      { key: "Client Name", value: data.client_name },
      { key: "Client Id", value: data.client_id },
      { key: "Payee Amount", value: data.payee_amount },
      { key: "Paid Amount", value: data.paid_amount },
      { key: "Transaction Date", value: convertDate(data.trans_date) },

      { key: "Client Code ", value: data.client_code },
      { key: "Client Txn Id", value: data.client_txn_Id },

      { key: "Settlement Status", value: data.udf1 },
      { key: "Chargeback ", value: data.udf2 },
      { key: "Refund ", value: data.udf3 },
      { key: "Refund Track Id ", value: data.udf4 },
    ];
    setPrintData(tempArr);

  }, [data]);


  const onClick = async () => {
    setLoadingState(false)
    let tableContents = document.getElementById("print_docuement").innerHTML;
    let a = window.open("", "", "height=900, width=900");
    a.document.write(tableContents);
    a.document.close();
    await a.print();
  };


  const txnOption = [
    { key: "Sabpaisa Transaction ID", value: "1" },
    { key: "Client Transaction ID", value: "2" }
  ];


  return (
    <section className="">
      
      <main className="">
        <div className="">
         
          <h5 className="">Transaction Enquiry</h5>
          {/* </div> */}
          <section className="">
            <div className="container-fluid p-0">
            
              <div className="row">

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => (
                    <Form className="col-lg-12">

                      <div className="form-row mt-4 ml-1">
                        <div className="col-lg-12">
                          <div className="form-group col-lg-3">
                            <FormikController
                              control="select"
                              label="Client Code"
                              name="clientCode"
                              className="form-select rounded-0 mt-0"
                              options={clientCodeOption}
                            />
                          </div>
                          <div className="form-group col-md-12 col-sm-12 p-0 col-lg-5 d-flex justify-content-between">
                            <FormikController
                              control="radio"
                              className="form-check-input"
                              options={txnOption}
                              name="transaction_from"
                            />
                          </div>
                        </div>

                        <div className="form-group col-md-12 col-sm-12 col-lg-5">
                          <FormikController
                            control="input"
                            // label="Transaction ID  *"
                            lableClassName="font-weight-bold"
                            name="transaction_id"
                            placeholder="Enter Transaction ID"
                            className="form-control"
                          />

                          <button
                            disabled={disable}
                            className="btn btn-sm text-white cob-btn-primary mt-4"
                            type="submit"
                          >
                            {disable && (
                            <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                          )} {/* Show spinner if disabled */}
                          View
                          </button>
                          {(show && printData?.length > 0) && <button
                            Value="click"
                            onClick={onClick}
                            className="btn btn-secondary text-white mt-4 ml-3 btn-sm"
                          >
                            <i className="fa fa-print" ariaHidden="true"></i> Print
                          </button>}

                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>


                <CustomLoader loadingState={loadingState} />

                {!loadingState && show && printData?.length > 0 && (
                  <div className="overflow-auto col-lg-12 mb-5 border">
                    <div className="container-fluid">
                      <div className="row">
                        {printData?.map((datas, key) =>
                          (<div className="col-4 p-2" key={datas.key.toString()}><p><span className="font-weight-bold"> {datas.key} :</span> {datas.value} </p></div>)
                        )}
                      </div>
                    </div>

                    {/* Print Data  */}
                    <PrintDocument data={printData} />
                  </div>
                )}

                {errMessage && (
                  <div className="col">
                    <h5 className="text-danger text-center">
                      Record Not Found!
                    </h5>
                  </div>

                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default TransactionEnquirey;
