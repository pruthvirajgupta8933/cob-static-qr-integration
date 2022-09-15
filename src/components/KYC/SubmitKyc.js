import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { approvekyc, verifyComplete } from "../../slices/kycSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import congratsImg from "../../assets/images/congImg.png"
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { saveKycConsent } from "../../slices/kycSlice"
import $ from 'jquery'


function SubmitKyc(props) {


  const history = useHistory()
  const { role, kycid } = props;

  const [checkboxStatus, setCheckboxStatus] = useState(false)
  const [modalState, setModalState] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loginId } = user;
  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.merchant_info_status
  );

  const [readOnly, setReadOnly] = useState(false);

  const initialValues = {
    // checkBoxChoice: "",
    // privacyPolicy: "",
    term_condition: false,
    // serviceAgreement: "",
  };

  const validationSchema = Yup.object({
    // checkBoxChoice: Yup.array().nullable(),
    // privacyPolicy: Yup.array().nullable(),
    term_condition: Yup.string().oneOf(["true"], "You must accept all the specified terms & conditions")
    // serviceAgreement: Yup.array().nullable(),
  });

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
    } else if (role.verifier) {
      setReadOnly(true);
    }
  }, [role]);

  // const termAndConditionOption = [
  //   {
  //     key: "",
  //     value: "false",
  //   },
  // ];


  const [checked, setChecked] = useState(false);




  // const termAndConditionOption = [
  //   {
  //     key: "Term & Conditions",
  //     value: "yes",
  //     isHyperLink: true,
  //     hyperLink: "https://sabpaisa.in/term-conditions/",
  //   },
  // ];

  // const serviceAgreementOption = [
  //   {
  //     key: "Service Agreement",
  //     value: "yes",
  //     isHyperLink: true,
  //     hyperLink: "https://sabpaisa.in/service-agreement",
  //   },
  // ];

  const verifyApprove = (val) => {
    if (val === "verify") {
      const data = {
        login_id: kycid,
        verified_by: loginId,
      };

      // const [readOnly, setReadOnly] = useState(false);

      dispatch(verifyComplete(data))
        .then((resp) => {
          resp?.payload?.status_code === 401 ||
            resp?.payload?.status_code === 404
            ? toast.error(resp?.payload?.message)
            : toast.success(resp?.payload?.message);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (val === "approve") {
      const dataAppr = {
        login_id: kycid,
        approved_by: loginId,
      };

      dispatch(approvekyc(dataAppr))
        .then((resp) => {
          resp?.payload?.status_code === 401 ||
            resp?.payload?.status_code === 404
            ? toast.error(resp?.payload?.message)
            : toast.success(resp?.payload?.message);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };


  const onSubmit = () => {
    $(".cick").click()

    dispatch(saveKycConsent({
      term_condition: true,
      login_id: loginId,
      submitted_by: "270",
    })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        toast.success(res.payload.message);
        
      } else {
        toast.error("Something Went Wrong! Please try again.");
      }
    });
  };


  const redirect = () => {
    history.push("/dashboard/product-catalogue");
  };


  const modalHandler = () => {

    // $(".modalbody1").attr("id","exampleModal");
    // $(".float-lg-right").click()
  }

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
              {console.log(formik)}

              <div class="form-check form-check-inline">

                <Field
                  type="checkbox"
                  name="term_condition"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
                  // checked={readOnly}
                  className="mr-3"
                />


                I have accepted the<a href="https://sabpaisa.in/term-conditions/"  alt="tnz" target="_blank" title="tnc">&nbsp;Term & Condition</a> ,&nbsp;
                <a href="https://sabpaisa.in/privacy-policy/" alt="tnz" target="_blank" title="tnc"> Privacy Policy</a> ,&nbsp;
                <a href="https://sabpaisa.in/service-agreement" alt="tnz" target="_blank" title="tnc"> Service Agreement</a>&nbsp;
              </div>

              {
                <ErrorMessage name="term_condition">
                  {(msg) => (
                    <p
                      className="abhitest ml-4"
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
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
                  {VerifyKycStatus === "Verified" ? null : (

                    <button
                      className="btn float-lg-right"
                      type="submit"
                      style={{ backgroundColor: "#0156B3" }}
                      // data-toggle="modal"
                      // data-target="#exampleModal"

                    >
                     <button className="btn cick d-none" data-toggle="modal"
                      data-target="#exampleModal"></button>
                      <h4 className="text-white font-weight-bold"> Verifying</h4>
                    </button>
                  )}
                </div>



                <div class="modal fade modalbody1" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">

                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">

                        <div class="container">
                          <div class="row justify-content-md-center">

                            <div class="col-md-auto">
                              <ul>

                                <h1
                                  className="text-centre"
                                  style={{ color: "#4BB543", fontWeight: "700", fontStyle: "normal", fontSize: "32px", justifyContent: "center", display: "flex" }}
                                >
                                  Congratulations!
                                </h1>
                                <p className="modalscolrsfortextapprv" style={{ justifyContent: "center", display: "flex" }}>
                                  Your KYC is Done!

                                </p>
                                <span className="modalscolrsfortextapprv text-center" style={{ display: "table-footer-group", justifyContent: "center", whiteSpace: "nowrap" }}>
                                  You can start accepting payments now
                                </span>
                                <span className="modalscolrsfortextapprv text-center" style={{ display: "table-footer-group", justifyContent: "center", whiteSpace: "nowrap" }}>
                                  View our product catalogue and choose your plan
                                </span>


                              </ul>

                            </div>




                          </div>

                        </div>

                      </div>
                      <div class="modal-footer">
                        {/* <Link to={`product-catalogue`} data-dismiss="modal" aria-label="Close" > */}
                        <button
                          type="button"
                          className="btn btn-lg text-white mt-5 verfy-btn"
                          onClick={() => redirect()}
                          data-dismiss="modal" aria-label="Close"

                        >
                          <h4>View Product Catalogue</h4>
                        </button>
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
