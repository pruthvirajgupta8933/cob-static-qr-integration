import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent, UpdateModalStatus } from "../../slices/kycSlice";

import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED } from "../../utilities/enums";

function SubmitKyc(props) {
  const history = useHistory();
  const { role } = props;

  const dispatch = useDispatch();

  const { auth, kyc } = useSelector((state) => state);
const { dropDownDocList, finalArray } = kyc?.compareDocListArray

const { user } = auth;

  const { loginId } = user;

  const { kycUserList } = kyc;


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

 



 const onSubmit = (value) => {
    setIsDisable(true);
    if (dropDownDocList.length === finalArray.length) {
      dispatch(
        saveKycConsent({
          term_condition: value.term_condition,
          login_id: loginId,
          submitted_by: loginId,
        })
      ).then((res) => {
        if (
          res?.meta?.requestStatus === "fulfilled" &&
          res?.payload?.status === true
        ) {
          toast.success(res?.payload?.message);
          setIsDisable(false);
          dispatch(UpdateModalStatus(true));
          history.push("/dashboard");
        } else {
          toast.error(res?.payload?.detail);
          setIsDisable(false);
        }
      });

    } else {
      alert("Kindly remove the extra document which are not required!");
    }


  };

return (
    <div className="col-md-12 p-3 NunitoSans-Regular">
      {role.merchant && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <div className="row">
              </div>

              <div className="row">
                <div className="col-lg-12 checkboxstyle">
                  <div className="para-style">
                    <Field
                      type="checkbox"
                      name="term_condition"
                      disabled={
                        kyc_status.toLowerCase() === KYC_STATUS_VERIFIED.toLowerCase() ||
                          kyc_status.toLowerCase() === KYC_STATUS_APPROVED.toLowerCase()
                          ? true
                          : false
                      }
                      className="mr-2 mt-1"
                    />
                    <span>I have read and understood the&nbsp;
                      <a
                        href="https://sabpaisa.in/term-conditions/"
                        className="text-decoration-none text-primary"
                        rel="noreferrer"
                        alt="Term & Conditions"
                        target="_blank"
                        title="Term & Conditions"
                      >
                        Terms & Conditions
                      </a>,{" "}
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
                      >&nbsp;Service Agreement
                      </a>&nbsp;By submitting the form, I agree to abide by the rules at
                      all times.
                    </span>
                  </div>
                  <div className="col-lg-11 para-style2 ">

                  </div>
                  {
                    <ErrorMessage name="term_condition">
                      {(msg) => (<p className="text-danger">{msg}</p>)}
                    </ErrorMessage>
                  }
                </div>
              </div>


              <br />
              <br />
              <div className="row">
                <div className="col-12">
                  {(kyc_status.toLowerCase() === KYC_STATUS_VERIFIED.toLowerCase() ||
                    kyc_status.toLowerCase() === KYC_STATUS_APPROVED.toLowerCase()) ? <></> : (
                    <button
                      disabled={disable}
                      className="save-next-btn float-lg-right cob-btn-primary text-white"
                      type="submit"

                    >
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
      )}
    </div>
  );
}

export default SubmitKyc;
