import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent, UpdateModalStatus } from "../../slices/kycSlice";
import { referralOnboardSlice } from "../../slices/approver-dashboard/referral-onboard-slice";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import { generateWord } from "../../utilities/generateClientCode";
import API_URL from "../../config";
import authService from "../../services/auth.service";
import {
  KYC_STATUS_APPROVED,
  KYC_STATUS_REJECTED,
  KYC_STATUS_VERIFIED,
} from "../../utilities/enums";
import { toLower } from "lodash";
import toastConfig from "../../utilities/toastTypes";
import Yup from "../../_components/formik/Yup";

function SubmitKyc(props) {
  // const { role } = props;
  const merchantloginMasterId = props.merchantloginMasterId;

  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;

  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const { kycUserList, compareDocListArray, KycDocUpload } = kyc;
  const { isRequireDataUploaded } = compareDocListArray;
  const merchant_consent = kycUserList?.merchant_consent?.term_condition;
  const kyc_status = kycUserList?.status;
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

  const rejectedDocList =
    KycDocUpload &&
    KycDocUpload?.filter(
      (item) => toLower(item.status) === toLower(KYC_STATUS_REJECTED)
    );
  const createClientCode = async () => {
    const clientFullName =
      basicDetailsResponse?.data?.name ?? kycUserList?.name;
    const clientMobileNo =
      basicDetailsResponse?.data?.mobileNumber ?? kycUserList?.contactNumber;
    const arrayOfClientCode = generateWord(clientFullName, clientMobileNo);

    // check client code is existing
    let newClientCode;
    const checkClientCode = await authService.checkClintCode({
      client_code: arrayOfClientCode,
    });
    if (
      checkClientCode?.data?.clientCode !== "" &&
      checkClientCode?.data?.status === true
    ) {
      newClientCode = checkClientCode?.data?.clientCode;
    } else {
      newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
    }

    const data = {
      loginId:
        basicDetailsResponse.data?.loginMasterId ?? kycUserList?.loginMasterId,
      clientName: clientFullName,
      clientCode: newClientCode,
    };

    try {
      const clientCreated = await axiosInstanceJWT.post(
        API_URL.AUTH_CLIENT_CREATE,
        data
      );
      if (clientCreated.status === 200) {
        toastConfig.successToast("Client code created");
        return true;
      }
    } catch (error) {
      // console.log("console is here")
      setIsDisable(false);
      toastConfig.errorToast(
        error?.message?.details ||
          "An error occurred while creating the Client Code. Please try again."
      );
      return false;
    }
  };
  const onSubmit = (value) => {
    setIsDisable(true);
    if (rejectedDocList?.length > 0) {
      toast.error(
        "Kindly Remove / Update the rejected document from the document list."
      );
      setIsDisable(false);
    } else {
      if (isRequireDataUploaded) {
        const isClientCodeCreated =
          Boolean(kycUserList?.clientCode) || createClientCode();
        if (isClientCodeCreated)
          dispatch(
            saveKycConsent({
              term_condition: value.term_condition,
              login_id: merchantloginMasterId,
              submitted_by: loginId,
            })
          ).then((res) => {
            if (
              res?.meta?.requestStatus === "fulfilled" &&
              res?.payload?.status === true
            ) {
              toast.success(res?.payload?.message);
              dispatch(referralOnboardSlice.actions.resetBasicDetails());
              setIsDisable(false);
              dispatch(UpdateModalStatus(true));
              history.push("/dashboard");
            } else {
              toast.error(res?.payload?.detail);
              setIsDisable(false);
            }
          });
      } else {
        toastConfig.errorToast(
          "Required Document is missing. Kindly Upload the required documents"
        );
        setIsDisable(false);
      }
    }
  };

  return (
    <div className="col-md-12 p-3 NunitoSans-Regular">
      {
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
                      disabled={
                        kyc_status.toLowerCase() ===
                          KYC_STATUS_VERIFIED.toLowerCase() ||
                        kyc_status.toLowerCase() ===
                          KYC_STATUS_APPROVED.toLowerCase()
                          ? true
                          : false
                      }
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
                      &nbsp;By submitting the form, I agree to abide by the
                      rules at all times.
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
                  {kyc_status.toLowerCase() ===
                    KYC_STATUS_VERIFIED.toLowerCase() ||
                  kyc_status.toLowerCase() ===
                    KYC_STATUS_APPROVED.toLowerCase() ? (
                    <></>
                  ) : (
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
      }
    </div>
  );
}

export default SubmitKyc;
