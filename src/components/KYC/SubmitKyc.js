import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { approvekyc, verifyComplete } from "../../slices/kycSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent,UpdateModalStatus } from "../../slices/kycSlice";
import congImg from "../../assets/images/congImg.png";
import { Link } from "react-router-dom";

function SubmitKyc(props) {
  const history = useHistory();
  const { role, kycid } = props;

  const dispatch = useDispatch();

  const {auth, kyc} =useSelector((state) => state); 
  const { user } = auth
  
  const { loginId } = user;


  const {kycUserList} = kyc
  const merchant_consent = kycUserList?.merchant_consent?.term_condition

  const kyc_status = kycUserList?.status
  const [readOnly, setReadOnly] = useState(false);

  const initialValues = {
    term_condition: merchant_consent,
  };

  // const redirect = () => {
  //   history.push("/dashboard");
  // };

  // if(consent_status === true) {
  //   history.push("/dashboard");
  // } 

  const validationSchema = Yup.object({
    term_condition: Yup.string().oneOf(["true"],"You must accept all the terms & conditions"),
  });

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
    } else if (role.verifier) {
      setReadOnly(true);
    }
  }, [role]);



  const verifyApprove = (val) => {
    if (val === "verify") {
      const data = {
        login_id: kycid,
        verified_by: loginId,
      };

      dispatch(verifyComplete(data))
        .then((resp) => {
          resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
        })
        .catch((e) => {
          toast.error("Something went wrong, Please Try Again later")
        });
    }

    if (val === "approve") {
      const dataAppr = {
        login_id: kycid,
        approved_by: loginId,
      };

      dispatch(approvekyc(dataAppr))
        .then((resp) => {
          resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
        })
        .catch((e) => {
          toast.error("Something went wrong, Please Try Again later")

        });
    }
  };

  const onSubmit = () => {
    dispatch(
      saveKycConsent({
        term_condition: true,
        login_id: loginId,
        submitted_by: loginId,
      })
    ).then((res) => {
      if ( res?.meta?.requestStatus === "fulfilled" && res?.payload?.status === true) {
        toast.success(res?.payload?.message);
        const kyc_consent_status = res?.payload?.status
         dispatch(UpdateModalStatus(true))
          history.push("/dashboard");
      } else {
        toast.error(res?.payload?.detail);
      }
    });
  };


  // useEffect(() => {
  // if(consent_status === true) {
  //   history.push("/dashboard");
  // } 
  // },[consent_status])
  





  return (
    <div className="col-md-12 p-3">
      {role.merchant && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <div class="form-group row">
                <div class="row">
                  <div class="col-lg- checkboxstyle">
                    <Field
                      type="checkbox"
                      name="term_condition"
                      readOnly={readOnly}
                      disabled={(kyc_status === "Verified" || kyc_status === "Approved" )  ? true : false}
                      className="mr-0"
                    />
                  </div>
                  <div class="col-lg-11 para-style text-nowrap">

                  I have read and understood the <a href="https://sabpaisa.in/term-conditions/"  rel="noreferrer"  alt="Term & Conditions" target="_blank" title="Term & Conditions">Term & Condition</a>, <a  href="https://sabpaisa.in/privacy-policy/" alt="Privacy Policy" target="_blank" title="Privacy Policy"  rel="noreferrer" >Privacy Policy</a>, <a href="https://sabpaisa.in/service-agreement" alt="Service Agreement" target="_blank" title="Service Agreement"  rel="noreferrer" >Service Agreement</a>
                  </div>
                  <div class="col-lg-11 para-style2 text-nowrap">
                    By submitting the form, I agree to abide by the rules at all times.
                    </div>
                </div>
              </div>
              {
                <ErrorMessage name="term_condition">
                  {(msg) => (
                    <p
                      className="abhitest"
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
              {/* {formik.setFieldValue("termAndCondition",setChecked(true))} */}
              {/* <div class="form-check form-check-inline">
                <FormikController
                  control="checkbox"
                  name="termAndCondition"
                  options={termAndConditionOption}
                  disabled={kyc_status === "Verified" ? true : false}
                  readOnly={readOnly}
                  checked={readOnly}
                  className="mr-3"
                />
              </div> */}
              {/* <div class="form-check form-check-inline">
                <FormikController
                  control="checkbox"
                  name="serviceAgreement"
                  options={serviceAgreementOption}
                  disabled={kyc_status === "Verified" ? true : false}
                  readOnly={readOnly}
                  checked={readOnly}
                  className="mr-3"
                />
              </div> */}

              <div class="my-5 p-2">
                <hr
                  style={{
                    borderColor: "#D9D9D9",
                    textShadow: "2px 2px 5px grey",
                    width: "100%",
                  }}
                />
                <div class="mt-3">
                  {(kyc_status === "Verified" || kyc_status === "Approved" ) ? null : (
                    <>
                  
                    <button
                     className="btn float-lg-right btnbackground text-white"
                     type="submit"
                     >
                      Submit
                    </button>
                    {/* <button
                        className="btn cick"
                        data-toggle="modal"
                        data-target="#kycSumitModal"
                      >modal button</button> */}
                    </>
                 

                  )}
                </div>

              </div>
            </Form>
          )}
        </Formik>
      )}

      {/* {role.verifier && (
        <div className="row">
          <div className="col-lg-12">
            <p>
              After Verify all the tab's , Kindly click on the{" "}
              <strong> complete verify</strong> button{" "}
            </p>
          </div>

          <div className="col-lg-12">
            <button
              className="btn float-lg-left"
              type="submit"
              style={{ backgroundColor: "#0156B3" }}
              onClick={() => {
                verifyApprove("verify");
              }}
            >
              <h4 className="text-white font-weight-bold">Verify Complete</h4>
            </button>
          </div>
        </div>
      )}
      {role.approver && (
        <div className="row">
          <div className="col-lg-12">
            <p>
              After Verify all the tab's , Kindly click on the{" "}
              <strong> Approve KYC</strong> button{" "}
            </p>
          </div>

          <div className="col-lg-12">
            <button
              className="btn float-lg-left"
              type="submit"
              style={{ backgroundColor: "#0156B3" }}
              onClick={() => {
                verifyApprove("approve");
              }}
            >
              <h4 className="text-white font-weight-bold">Approve KYC</h4>
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default SubmitKyc;
