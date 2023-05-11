import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { approvekyc, verifyComplete } from "../../slices/kycSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent, UpdateModalStatus } from "../../slices/kycSlice";
import congImg from "../../assets/images/congImg.png";
import { Link } from "react-router-dom";
import { axiosInstanceAuth, axiosInstanceJWT } from "../../utilities/axiosInstance";
import API_URL from "../../config";
import { getRefferal } from "../../services/kyc/merchant-kyc";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";

function SubmitKyc(props) {
  const history = useHistory();
  const { role, kycid } = props;

  const dispatch = useDispatch();

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;

  const { loginId } = user;

  const { kycUserList } = kyc;
  const merchant_consent = kycUserList?.merchant_consent?.term_condition;

  const kyc_status = kycUserList?.status;
  const [readOnly, setReadOnly] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [refferalList, setRefferalList] =  useState([])
  const [refferalListSelectOption, setRefferalListSelectOption] =  useState([])

  const initialValues = {
    term_condition: merchant_consent,
    referal_code : ""
  };

  const validationSchema = Yup.object({
    referal_code: Yup.string(),
    term_condition: Yup.string().oneOf(
      ["true"],
      "You must accept all the terms & conditions"
    ),
  });



  useEffect(() => {
    getRefferal().then(res=>{
      setRefferalList(res?.data?.message)
     const data =  convertToFormikSelectJson(
        "emp_code",
        "referral_code",
        res?.data?.message
      )
      setRefferalListSelectOption(data)

    
    }).catch(err=>console.log(err))


    
  }, []);



  const onSubmit = (value) => {
    console.log("value",value)
    setIsDisable(true);
    dispatch( 
      saveKycConsent({
        term_condition: value.term_condition,
        login_id: loginId,
        submitted_by: loginId,
        emp_code : value.referal_code
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true
      ) {
        toast.success(res?.payload?.message);
        setIsDisable(false);
        const kyc_consent_status = res?.payload?.status;
        dispatch(UpdateModalStatus(true));
        history.push("/dashboard");
      } else {
        toast.error(res?.payload?.detail);
        setIsDisable(false);
      }
    });
  };



  // useEffect(() => {
  // if(consent_status === true) {
  //   history.push("/dashboard");
  // }
  // },[consent_status])

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
              <div className="form-group row">
                <div className="row">
                  <div className="col-4">
                  
                  <FormikController
                  control="select"
                  name="referal_code"
                  options={refferalListSelectOption}
                  className="form-control "
                  label="Referal Code (Optional)"
                />
                  </div>
                  <div className="col-12  checkboxstyle">
                    <div>
                      <div className="para-style">
                        <Field
                          type="checkbox"
                          name="term_condition"
                          readOnly={readOnly}
                          disabled={
                            kyc_status === "Verified" ||
                            kyc_status === "Approved"
                              ? true
                              : false
                          }
                          className="mr-2 mt-1"
                        />
                        I have read and understood the{" "}
                        <a
                          href="https://sabpaisa.in/term-conditions/"
                          className="text-decoration-underline text-primary"
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
                          className="text-decoration-underline text-primary"
                        >
                          Privacy Policy
                        </a>
                        ,{" "}
                        <a
                          href="https://sabpaisa.in/service-agreement"
                          alt="Service Agreement"
                          target="_blank"
                          title="Service Agreement"
                          rel="noreferrer"
                          className="text-decoration-underline text-primary"
                        >
                          Service Agreement
                        </a>
                      </div>
                      <div className="col-lg-11 para-style2 ">
                        By submitting the form, I agree to abide by the rules at
                        all times.
                      </div>
                    </div>
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
              <div className="my-5 p-2">
                <hr
                  style={{
                    borderColor: "#D9D9D9",
                    textShadow: "2px 2px 5px grey",
                    width: "100%",
                  }}
                />
                <div className="mt-3">
                  {kyc_status === "Verified" ||
                  kyc_status === "Approved" ? null : (
                    <button
                      disabled={disable}
                      className="save-next-btn float-lg-right btnbackground text-white"
                      type="submit"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default SubmitKyc;
