import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { approvekyc, verifyComplete } from "../../slices/kycSlice";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import congratsImg from "../../assets/images/congImg.png"
import { Link } from "react-router-dom";


function SubmitKyc(props) {
  const { role, kycid } = props;

  const [check, setCheck] = useState(false);
  const [modalState, setModalState] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loginId } = user;
  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.merchant_info_status
  );

  const [readOnly, setReadOnly] = useState(false);

  const initialValues = {
    checkBoxChoice: "",
    privacyPolicy: "",
    termAndCondition: "",
    serviceAgreement: "",
  };

  const validationSchema = Yup.object({
    checkBoxChoice: Yup.array().nullable(),
    privacyPolicy: Yup.array().nullable(),
    termAndCondition: Yup.array().nullable(),
    serviceAgreement: Yup.array().nullable(),
  });

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
    } else if (role.verifier) {
      setReadOnly(true);
    }
  }, [role]);

  const privacyPolicyOption = [
    {
      key: "",
      value: "yes",
    },
  ];

  const termAndConditionOption = [
    {
      key: "Term & Conditions",
      value: "yes",
      isHyperLink: true,
      hyperLink: "https://sabpaisa.in/term-conditions/",
    },
  ];

  const serviceAgreementOption = [
    {
      key: "Service Agreement",
      value: "yes",
      isHyperLink: true,
      hyperLink: "https://sabpaisa.in/service-agreement",
    },
  ];

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

  const modalclose = () => {
    document.getElementById('exampleModal').modal('hide');  
  }
  const onSubmit = () => {};

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
            
                <FormikController
                  control="checkbox"
                  name="privacyPolicy"
                  options={privacyPolicyOption}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  checked={readOnly}
                  className="mr-3"
                />
                  I have accepted the <a href="https://sabpaisa.in/term-conditions/" alt="tnz" target="_blank" title="tnc"> Term & Condition</a> , 
                  <a href="https://sabpaisa.in/privacy-policy/" alt="tnz" target="_blank" title="tnc"> Privacy Policy</a> , 
                  <a href="https://sabpaisa.in/service-agreement" alt="tnz" target="_blank" title="tnc"> Service Agreement</a>  
              </div>
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
                      data-toggle="modal" data-target="#exampleModal"
                    >
                      <h4 className="text-white font-weight-bold"> Submit</h4>
                    </button>
                  )}
                </div>



<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    style={{ color: "#4BB543",fontWeight:"700", fontStyle:"normal", fontSize:"32px",justifyContent:"center",display:"flex"}}
                  >
                    Congratulations!
                  </h1>
    <p className="modalscolrsfortextapprv" style={{justifyContent:"center",display:"flex"}}>
                    Your KYC is Done!
                    
                    </p>
                    <span className="modalscolrsfortextapprv text-center"style={{display:"table-footer-group",justifyContent:"center",whiteSpace:"nowrap"}}>
                    You can start accepting payments now 
                  </span>
                  <span className="modalscolrsfortextapprv text-center"style={{display:"table-footer-group",justifyContent:"center",whiteSpace:"nowrap"}}>
                  View our product catalogue and choose your plan
                  </span>
                  
                   
                  </ul>
                  
    </div>
    
   
                  
    
  </div>
  
</div>

      </div>
      <div class="modal-footer">
      <Link to={`product-catalogue`}>
                    <button type="button" className="ColrsforredirectProdct text-white mt-5" onClick={() => document.getElementById('exampleModal').modal('hide') }>
                      View Product Catalogue
                    </button>
                    </Link>
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
