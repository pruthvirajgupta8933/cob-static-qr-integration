import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
import {
  clearKycDetailsByMerchantLoginId,
  saveKycConsent,
} from "../../../../../../slices/kycSlice";
import { generateWord } from "../../../../../../utilities/generateClientCode";
import { resetFormState } from "../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { axiosInstanceJWT } from "../../../../../../utilities/axiosInstance";
import API_URL from "../../../../../../config";
import authService from "../../../../../../services/auth.service";
import Yup from "../../../../../../_components/formik/Yup";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function SubmitKyc({ setCurrentTab, isEditableInput, editKyc }) {
  const dispatch = useDispatch();
  const { auth, kyc, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { merchantKycData, kycUserList: kycData } = kyc;
  const merchantLoginId =
    merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId;

  const { user } = auth;
  const { loginId } = user;
  const merchant_consent = merchantKycData?.merchant_consent?.term_condition;

  const [disable, setIsDisable] = useState(false);

  const initialValues = {
    term_condition: merchant_consent,
  };

  const validationSchema = Yup.object({
    term_condition: Yup.string().oneOf(
      ["true"],
      "You must accept all the terms & conditions"
    ),
  });


  const onSubmit = async (value) => {
    setIsDisable(true);
    if (merchantKycData?.clientCode === null && !editKyc) {
      const clientFullName = merchantKycData?.name;
      const clientMobileNo = merchantKycData?.contactNumber;
      const arrayOfClientCode = generateWord(clientFullName, clientMobileNo);

      // check client code is existing
      const stepRespOne = await authService.checkClintCode({
        client_code: arrayOfClientCode,
      });
      // console.log("stepRespOne", stepRespOne)
      let newClientCode;
      // if client code available return status true, then make request with the given client
      if (
        stepRespOne?.data?.clientCode !== "" &&
        stepRespOne?.data?.status === true
      ) {
        newClientCode = stepRespOne?.data?.clientCode;
      } else {
        newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
      }

      // update new client code in db
      const data = {
        loginId: merchantKycData?.loginMasterId,
        clientName: merchantKycData?.name,
        clientCode: newClientCode,
      };
      // await axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, data);
      try {
        await axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, data);
      } catch (error) {
        // console.log("console is here")
        // console.error('Error creating client:', error);
        setIsDisable(false);
        // toast.error('An error occurred while creating the Client Code. Please try again.');
        return;
      }
    }

    dispatch(
      saveKycConsent({
        term_condition: value.term_condition,
        login_id: kycData?.loginMasterId ?? merchantLoginId,
        submitted_by: loginId,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true
      ) {
        toast.success(res?.payload?.message);
        setIsDisable(false);

        setTimeout(() => backToFirstScreen(), 1000);
      } else {
        toast.error(res?.payload?.detail);
        setIsDisable(false);
      }
    });
  };
  const backToFirstScreen = () => {
    localStorage.removeItem("onboardingStatusByAdmin");
    dispatch(resetFormState());
    dispatch(clearKycDetailsByMerchantLoginId());
    // setCurrentTab(1)
    if (user.roleName === "Bank") history.push("/dashboard/client-list");
    else history.push("my-merchant");
  };
  const history = useHistory();
  return (
    <div className="col-md-12 p-3 NunitoSans-Regular">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <div className="row"></div>

            <div className="row">
              <div className="col-lg-12 checkboxstyle">
                <div className="para-style">
                  <Field
                    type="checkbox"
                    name="term_condition"
                    className="mr-2 mt-1"
                  />
                  <span>
                    I have read and understood the&nbsp;
                    <a
                      href="https://sabpaisa.in/term-conditions/"
                      className="text-decoration-none text-primary"
                      rel="noreferrer"
                      alt="Term & Conditions"
                      target="_blank"
                      title="Term & Conditions"
                    >
                      Terms & Conditions
                    </a>
                    ,{" "}
                    <a
                      href="https://sabpaisa.in/privacy-policy/"
                      alt="Privacy Policy"
                      target="_blank"
                      title="Privacy Policy"
                      rel="noreferrer"
                      className="text-decoration-none text-primary"
                    >
                      Privacy Policy
                    </a>
                    ,
                    <a
                      href="https://sabpaisa.in/service-agreement"
                      alt="Service Agreement"
                      target="_blank"
                      title="Service Agreement"
                      rel="noreferrer"
                      className="text-decoration-none text-primary"
                    >
                      &nbsp;Service Agreement.
                    </a>
                    &nbsp;By submitting the form, I agree to abide by the rules
                    at all times.
                  </span>
                </div>
                <div className="col-lg-11 para-style2 "></div>
                {
                  <ErrorMessage name="term_condition">
                    {(msg) => <p className="text-danger">{msg}</p>}
                  </ErrorMessage>
                }
              </div>
            </div>

            <br />
            <br />
            <div className="row">
              <div className="col-12">
                {!isEditableInput && (
                  <button
                    disabled={disable}
                    className="btn btn-sm float-lg-right cob-btn-primary text-white"
                    type="submit"
                  >
                    {disable && (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          ariaHidden="true"
                        />
                        <span className="sr-only">Loading...</span>
                      </>
                    )}
                    Submit
                  </button>
                )}
              </div>
            </div>
            <br />
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SubmitKyc;
