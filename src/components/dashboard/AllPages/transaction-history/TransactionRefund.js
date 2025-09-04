import React, { useState } from "react";
import Yup from "../../../../_components/formik/Yup";
import { Form, Formik } from "formik";
import FormikController from "../../../../_components/formik/FormikController";
// import { v4 as uuidv4 } from 'uuid';
import CustomModal from "../../../../_components/custom_modal";
import {
  Decrypt,
  Encrypt,
  encryptPHP7,
  decryptPHP7,
  encryptAES256HEX,
  decryptAES256HEX,
} from "../../../../utilities/aes";
import {
  axiosInstance,
  axiosInstanceAuth,
} from "../../../../utilities/axiosInstance";
import API_URL from "../../../../config";
import toastConfig from "../../../../utilities/toastTypes";
import { decrypt, encrypt } from "@cto_sabpaisa/sabpaisa-aes-256-encryption";
function TransactionRefund(props) {
  const { radioInputVal, refundModal, setRefundModal } = props;
  const [submitLoader, setSubmitLoader] = useState(false);

  const initialValues = {
    refund_type: "1",
    refund_amt: radioInputVal?.payee_amount,
    refund_reason: "",
    clientCode: radioInputVal?.client_code,
    client_txn_id: radioInputVal?.client_txn_id,
    txn_id: radioInputVal?.txn_id,
    payee_amount: radioInputVal?.payee_amount,
  };

  const validationSchema = Yup.object().shape({
    refund_type: Yup.string().required("Select the refund type").nullable(),
    refund_amt: Yup.string()
      .allowOneSpace()
      .when("refund_type", (val, schema) => {
        if (parseInt(val) === 2) {
          return Yup.number()
            .min(1, "Enter the minimun amount")
            .max(
              parseFloat(radioInputVal?.payee_amount),
              "Amount should be equal to and less the the payee amount"
            )
            .required("Required");
        } else {
          return Yup.number()
            .min(
              parseFloat(radioInputVal?.payee_amount),
              "Amount should be same as full requesting amount"
            )
            .max(
              parseFloat(radioInputVal?.payee_amount),
              "Amount should be equal to and less the the payee amount"
            )
            .required("Required");
        }
      }),
    refund_reason: Yup.string()
      .min(10, "Minimun 10 character")
      .max(500, "Please do not  enter more than 500 characters")
      .allowOneSpace()
      .required("Required")
      .nullable(),
    payee_amount: Yup.number().required("Required"),
  });

  const handleSubmit = async (values) => {
    setSubmitLoader(true);
    const clientCode = values.clientCode;
    const amount = values.refund_amt;
    const spTxnId = values.txn_id;
    const clientTxnId = values.client_txn_id;
    const message = values.refund_reason;

    try {
      const response = await axiosInstanceAuth.post(API_URL.CLIENT_DETAIL, {
        clientCode: values.clientCode,
      });

      const authIV = response.data?.ClientData?.authIV;
      const authKey = response.data?.ClientData?.authKey;
      const authType = response?.data?.ClientData?.authType;
      if (authIV && authKey && authType) {
        const str = `clientCode=${clientCode}&amount=${amount}&spTxnId=${spTxnId}&clientTxnId=${clientTxnId}&message=${message}`;
        let enc;
        let dc;

        // Dynamically encrypt and decrypt based on authType
        switch (authType) {
          case "Encryption":
            enc = Encrypt(str, authKey, authIV);
            // enc = encryptPHP7(str, authKey, authIV);
            break;
          case "PHP7":
            enc = encryptPHP7(str, authKey, authIV);
            break;
          case "AES256HEX":
            enc = encryptAES256HEX(str, authKey, authIV);
            break;
          case "AES256HMACSHA384HEX":
            // new encrption logic
            enc = await encrypt(str, authKey, authIV);
            break;
          default:
            toastConfig.errorToast("Encryption type not supported");
            setSubmitLoader(false);
            return;
        }

        enc = enc.replace(/\+/g, "%2B");
        const reqBody = {
          clientCode: clientCode,
          refundQuery: enc,
        };

        const refundResponse = await axiosInstance.post(
          API_URL.refundTxn,
          reqBody
        );
        switch (authType) {
          case "Encryption":
            dc = Decrypt(refundResponse.data.refundResponse, authKey, authIV);
            // dc = decryptPHP7(refundResponse?.data?.refundResponse, authKey);
            break;
          case "PHP7":
            dc = decryptPHP7(
              refundResponse.data.refundResponse,
              authKey,
              authIV
            );
            break;
          case "AES256HEX":
            dc = decryptAES256HEX(refundResponse.data.refundResponse, authKey);
            break;
          case "AES256HMACSHA384HEX":
            dc = await decrypt(refundResponse.data.refundResponse, authKey, authIV);
            break;
          default:
            toastConfig.errorToast("Unsupported decryption type ");
            setSubmitLoader(false);
            return;
        }

        const jsonRsp = JSON.parse(dc);

        refundResponse?.data?.apiStatusCode === "00"
          ? toastConfig.successToast(
            jsonRsp.message || "Refund Request Initiated"
          )
          : toastConfig.warningToast(jsonRsp.message);

        setSubmitLoader(false);
        //  props.setRefundModal(false);
      }
    } catch (error) {
      toastConfig.errorToast(error.message);
      setSubmitLoader(false);
    }
  };

  const headerTitle = "Refund Payment";

  const modalbody = () => {
    const refundTypeOption = [
      { value: "1", key: "Full Refund" },
      { value: "2", key: "Partial Refund" },
    ];

    return (
      <div className="container-fluid">
        <h6 className="mb-4">
          Refunds take 5-10 days to appear on a customer's statement.
        </h6>
        <div className="row">
          <ul className="list-group list-group-horizontal mb-1">
            <li className="list-group-item">
              Transaction ID: <b>{radioInputVal?.txn_id}</b>
            </li>
            <li className="list-group-item">
              Payee Amount (INR) : <b>{radioInputVal?.payee_amount}</b>
            </li>
          </ul>
        </div>

        <div className="row">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="col-lg-12 d-flex justify-content-between my-2">
                  <FormikController
                    control="radio"
                    name="refund_type"
                    className="form-check-input radio-input"
                    options={refundTypeOption}
                    value={values.refund_type}
                    onChange={(e) => {
                      setFieldValue("refund_type", e.target.value);
                      setFieldValue("refund_amt", radioInputVal?.payee_amount);
                    }}
                  />
                </div>
                <div className="col-lg-12 my-2">
                  <FormikController
                    control="input"
                    label="Refund Amount"
                    name="refund_amt"
                    className="form-control"
                    placeholder="Refund Amount"
                    readOnly={values.refund_type === "1"}
                  />
                </div>

                <div className="col-lg-12 my-2">
                  <FormikController
                    control="textArea"
                    label="Refund Reason"
                    name="refund_reason"
                    className="form-control"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="mt-2">
                    <button
                      type="submit"
                      className="text-white btn-sm cob-btn-primary"
                      disabled={submitLoader}
                    >
                      {submitLoader && (
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          ariaHidden="true"
                        ></span>
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  };

  return (
    <CustomModal
      headerTitle={headerTitle}
      modalBody={modalbody}
      modalToggle={refundModal}
      fnSetModalToggle={setRefundModal}
      modalSize={"modal-md"}
    />
  );
}

export default TransactionRefund;
