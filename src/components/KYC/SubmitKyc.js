import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { approvekyc, verifyComplete } from "../../slices/kycSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import FormikController from "../../_components/formik/FormikController";
// import congratsImg from "../../assets/images/congImg.png";
// import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent } from "../../slices/kycSlice";
// import $ from "jquery";
import congImg from "../../assets/images/congImg.png";

function SubmitKyc(props) {
  const history = useHistory();
  const { role, kycid } = props;

  // const [checkboxStatus, setCheckboxStatus] = useState(false);
  // const [modalState, setModalState] = useState(false);

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

  const redirectt = () => {
    history.push("/dashboard");
  };

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

      // const [readOnly, setReadOnly] = useState(false);

      dispatch(verifyComplete(data))
        .then((resp) => {
          resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
        })
        .catch((e) => {
          toast.error("Something went wrong, Please Try Again later")
          // console.log(e);
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
    // $(".cick").click();

    dispatch(
      saveKycConsent({
        term_condition: true,
        login_id: loginId,
        submitted_by: loginId,
      })
    ).then((res) => {
      if ( res?.meta?.requestStatus === "fulfilled" && res?.payload?.status === true) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.detail);
      }
    });
  };

  const redirect = () => {
    history.push("/dashboard/product-catalogue");
  };

  const modalHandler = () => {
    // $(".modalbody1").attr("id","exampleModal");
    // $(".float-lg-right").click()
  };

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

                  I have read and understood the <a href="https://sabpaisa.in/term-conditions/"  rel="noreferrer"  alt="tnz" target="_blank" title="tnc">&nbsp;Term & Condition</a> ,&nbsp;
                    <a  href="https://sabpaisa.in/privacy-policy/" alt="tnz" target="_blank" title="tnc"  rel="noreferrer" > Privacy Policy</a> ,&nbsp;
                    <a href="https://sabpaisa.in/service-agreement" alt="tnz" target="_blank" title="tnc"  rel="noreferrer" > Service Agreement</a>&nbsp;
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
                      className="btn float-lg-right"
                      type="submit"
                      style={{ backgroundColor: "#0156B3" }}
                    
                    >
                      <p className="text-white text-kyc-sumit"> Verifying</p>
                    </button>
                    {/* <button
                        className="btn cick"
                        data-toggle="modal"
                        data-target="#kycSumitModal"
                      >modal button</button> */}
                    </>
                 

                  )}
                </div>

                <div
                  class="modal fade modalbody1"
                  id="kycSumitModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  style={{ marginLeft: "212px", marginTop: "107px" }}
                >
                  <div
                    class="modal-dialog"
                    role="document"
                    style={{ maxWidth: 480 }}
                  >
                    <div class="modal-content">
                      <div class="modal-header modal-header-fignma">
                        <button
                          onClick={() => redirectt()}
                          type="button"
                          class="close"
                          data-dismiss="modal3"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="row">
                          <div class="col-lg-12">
                            <h1
                              className="text-center"
                              style={{
                                color: "#4BB543",
                                fontWeight: "700",
                                fontStyle: "normal",
                                fontSize: "32px",
                              }}
                            >
                              Congratulations!
                            </h1>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                              Your KYC is in-processing!
                            </p>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                              You can start accepting payments now
                            </p>
                            <p className="modalscolrsfortextapprv m-0 text-center">
                              View our product catalogue and choose your plan
                            </p>
                            {/* <p className="modalscolrsfortextapprv m-0 text-center">
                              You can start accepting payments now
                            </p> */}
                            {/* <p className="modalscolrsfortextapprv m-0 text-center">
                            View our product catalogue and choose your plan
                            </p> */}
                          </div>
                        </div>
                        <div class="row">
                          {/* <div class="col-sm">
                            <p className="modalscolrsfortextapprv" style={{display:"contents"}}>
                              Your KYC is Done!
                            </p>
                            <span className="modalscolrsfortextapprv" style={{display:"table-cell"}}>
                              You can start accepting payments now
                            </span>
                            <span
                              className="modalscolrsfortextapprv"
                              style={{
                                display: "table-footer-group",
                                justifyContent: "center",
                                whiteSpace: "nowrap",
                              }}
                            >
                              View our product catalogue and choose your plan
                            </span>
                          </div> */}
                          <div class="col-lg-12 text-center">
                            <img
                              src={congImg}
                              className="modalsimageclass-1"
                              alt="SabPaisa"
                              title="SabPaisa"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer p-2">
                        {/* <Link to={`product-catalogue`} data-dismiss="modal" aria-label="Close" > */}
                        <div className="col-lg-12 p-0 m-0 text-center">
                          <button
                            type="button"
                            className="btn btn-lg text-white mb-0 verfy-btn"
                            onClick={() => redirect()}
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <h4>View Product Catalogue</h4>
                          </button>
                        </div>

                        {/* </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </Form>
          )}
        </Formik>
      )}

      {role.verifier && (
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
      )}
    </div>
  );
}

export default SubmitKyc;
