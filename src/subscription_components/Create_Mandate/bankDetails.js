import React , {useState} from "react";
import { Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
import * as Yup from "yup";
import { bankAccountVerification } from "../../slices/kycSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const BankDetails = ({ backToPersonalScreen, bankNameOptions,showbankData }) => {

  const dispatch = useDispatch();

  const [verifiedStatus,setVerifiedStatus] = useState(false)
  const [validStatus,setValidStatus] = useState(false)

  let authModeOptions = [
    { key: "Select", value: "" },
    { key: "Netbanking", value: "Netbanking" },
    { key: "Debit Card", value: "Debitcard" },
  ];
  let accuntTypeOptions = [
    { key: "Select", value: "" },
    { key: "Savings", value: "Savings" },
    { key: "Current", value: "Current" },
  ];
  const FORM_VALIDATION = Yup.object().shape({
    authenticationMode: Yup.string()
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .required("Required"),
    payerBank: Yup.string().required("Required"),
    payerAccountNumber: Yup.string().required("Required"),
    payerAccountType: Yup.string().required("Required"),
  });
  const handleSubmit = (values) => {
    console.log(values,"=====================>");
    showbankData(values,validStatus,verifiedStatus);


    dispatch(
      bankAccountVerification({
        account_number: values?.payerAccountNumber,
        ifsc: values?.payerBankIfscCode,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        toast.success(res?.payload?.message);
        setValidStatus(true)
        setVerifiedStatus(true)
       
      }if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === false
      ) {
        toast.error(res?.payload?.message)
      }
      else {
        toast.error(res?.payload?.detail);
      }
    });




  };
  return (
    <div>
      {" "}
      <Formik
        initialValues={{
          authenticationMode: "",
          payerBank: "",
          payerBankIfscCode: "",
          payerAccountNumber: "",
          payerAccountType: "",
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="select"
                label="Authentication Mode"
                name="authenticationMode"
                className="form-control rounded-0 mt-0"
                options={authModeOptions}
              />
            </div>
            <div className="col-lg-4 form-group">
              <FormikController
                control="select"
                label="Bank Name"
                name="payerBank"
                className="form-control rounded-0 mt-0"
                options={bankNameOptions}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="IFSC Code"
                name="payerBankIfscCode"
                className="form-control rounded-0 mt-0"
              />
            </div>
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Account Number"
                name="payerAccountNumber"
                className="form-control rounded-0 mt-0"
                // options={frequencyOptionsData}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="select"
                label="Account Type"
                name="payerAccountType"
                className="form-control rounded-0 mt-0"
                options={accuntTypeOptions}
              />
            </div>
          </div>
          <button
            type="button"
            class="btn btn-light"
            onClick={() => backToPersonalScreen("personalScreen")}
          >
            Back
          </button>
          <button class="btn btn-primary" type="submit">
            Next
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default BankDetails;
