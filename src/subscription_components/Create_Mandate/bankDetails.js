import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { bankAccountVerification } from "../../slices/kycValidatorSlice";
import {
  fetchMandateBankName,
  saveFormThirdData,
} from "../../slices/subscription-slice/createMandateSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import Yup from "../../_components/formik/Yup";
import FormikController from "../../_components/formik/FormikController";

const BankDetails = ({
  backToPersonalScreen,
  setProgressBar,
  setMandateSubmission,
  setBankScreen,
  showbankData,
}) => {
  const [bankName, setBankName] = useState([]);
  // useSelector((state) => {

  //   const { createMandate } = state;

  //   if (createMandate && createMandate.formData) {
  //     const { firstForm, secondForm, thirdForm } = createMandate.formData;

  //     // Evaluate the values of firstForm, secondForm, and thirdForm
  //     // Perform any desired operations or checks here

  //     console.log(firstForm,"first form");
  //     console.log(secondForm,"second form");
  //     console.log(thirdForm,"thirdform");
  //   }
  // });

  const { createMandate } = useSelector((state) => state);
  // console.log(createMandate.createMandate
  //   ?.formData?.firstForm ,"this is createmen")

  // console.log("firstForm",firstForm)
  // console.log("secondForm",secondForm)
  // console.log("thirdForm",thirdForm)

  const { firstForm, secondForm, thirdForm } =
    createMandate.createMandate.formData;
  const mergedForm = {
    ...firstForm,
    ...secondForm,
    ...thirdForm,
  };

  const initialValues = {
    authenticationMode: thirdForm.authenticationMode
      ? thirdForm.authenticationMode
      : "",
    payerBank: thirdForm.payerBank ? thirdForm.payerBank : "",
    payerBankIfscCode: thirdForm.payerBankIfscCode
      ? thirdForm.payerBankIfscCode
      : "",
    payerAccountNumber: thirdForm.payerAccountNumber
      ? thirdForm.payerAccountNumber
      : "",
    payerAccountType: thirdForm.payerAccountType
      ? thirdForm.payerAccountType
      : "",
  };

  const dispatch = useDispatch();

  useEffect(() => {
    fetchBankName();
  }, []);

  const fetchBankName = async () => {
    try {
      const resp = await dispatch(fetchMandateBankName());

      const data = convertToFormikSelectJson(
        "code",
        "description",
        resp.payload.data
      );
      setBankName(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [validStatus, setValidStatus] = useState(false);

  let authModeOptions = [
    { key: "Select", value: "Select" },
    { key: "Netbanking", value: "Netbanking" },
    { key: "Debit Card", value: "Debitcard" },
  ];
  let accuntTypeOptions = [
    { key: "Select", value: "Select" },
    { key: "Savings", value: "Savings" },
    { key: "Current", value: "Current" },
  ];
  const FORM_VALIDATION = Yup.object().shape({
    authenticationMode: Yup.string()
      .test("isRequired", "Required", function (value) {
        return value !== "Select";
      })
      .nullable(),
    payerBank: Yup.string().required("Required").nullable(),
    payerAccountNumber: Yup.string()
      .required("Required")
      .matches(/^[0-9]+$/, "Only numbers are allowed"),

    payerAccountType: Yup.string()
      .test("isRequired", "Required", function (value) {
        return value !== "Select";
      })
      .nullable(),
  });
  const handleSubmit = (values) => {
    // setMandateSubmission(true)
    // setBankScreen(false)
    // setProgressBar(false)
    showbankData(values, validStatus, verifiedStatus);
    dispatch(saveFormThirdData({ values }));

    // console.log(values,"=====================>");

    const verifyBankAccount = async () => {
      const res = await dispatch(
        bankAccountVerification({
          account_number: values?.payerAccountNumber,
          ifsc: values?.payerBankIfscCode,
        })
      );

      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        // toast.success(res?.payload?.message);
        setBankScreen(false);
        setMandateSubmission(true);
        setValidStatus(true);
        setVerifiedStatus(true);
        setProgressBar(false);
      } else if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === false
      ) {
        toast.error(res?.payload?.message);
      } else if (res?.payload?.detail) {
        toast.error(res?.payload?.detail);
      }
    };
    verifyBankAccount();
  };
  return (
    <div className="col-lg-8">
      {" "}
      <Formik
        initialValues={initialValues}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        <Form>
          <div className="row">
            <div className="col-lg-6 form-group">
              <FormikController
                control="select"
                label="Authentication Mode"
                name="authenticationMode"
                className="form-control rounded-0 mt-0"
                options={authModeOptions}
              />
            </div>
            <div className="col-lg-6 form-group">
              <FormikController
                control="select"
                label="Bank Name"
                name="payerBank"
                className="form-control rounded-0 mt-0"
                options={bankName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                label="IFSC Code"
                name="payerBankIfscCode"
                className="form-control rounded-0 mt-0"
              />
            </div>
            <div className="col-lg-6 form-group">
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
            <div className="col-lg-6 form-group">
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
            className="btn btn-light"
            onClick={() => backToPersonalScreen("personalScreen")}
          >
            Back
          </button>
          <button className="btn bttn cob-btn-primary ml-2" type="submit">
            Next
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default BankDetails;
