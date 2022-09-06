import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { kycBankNames, saveMerchantBankDetais, verifyKycEachTab } from "../../slices/kycSlice";

function BankDetails(props) {
  const { role, kycid } = props;
  const dispatch = useDispatch();

  const KycList = useSelector((state) => state.kyc.kycUserList);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.settlement_info_status
  );

  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");
  // console.log(VerifyKycStatus,"<==STATUS==>")

  //  console.log(KycList ,"====================>")

  const [data, setData] = useState([]);

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    account_holder_name: KycList?.accountHolderName,
    account_number: KycList?.accountNumber,
    confirm_account_number: KycList?.accountNumber,
    ifsc_code: KycList?.ifscCode,
    bank_id:  KycList?.merchant_account_details?.bankId,
    account_type: KycList?.bankName,
    branch:  KycList?.merchant_account_details?.branch,
  };
  const validationSchema = Yup.object({
    account_holder_name: Yup.string().required("Required").nullable(),
    account_number: Yup.string().required("Required").nullable(),
    confirm_account_number: Yup.string()
      .oneOf([Yup.ref("account_number"), null], "Account Number  must match")
      .required("Confirm Account Number Required").nullable(),
    ifsc_code: Yup.string().required("Required").nullable(),
    account_type: Yup.string().required("Required").nullable(),
    branch: Yup.string().required("Required").nullable(),
    bank_id: Yup.string().required("Required").nullable(),
  });

  //---------------GET ALL BANK NAMES DROPDOWN--------------------

  useEffect(() => {
    dispatch(kycBankNames())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "bankId",
          "bankName",
          resp.payload
        );
        setData(data);
      })

      .catch((err) => console.log(err));
  }, []);

  // ------------------------------------------

  const onSubmit = (values) => {

    if (role.merchant) {

      dispatch(
        saveMerchantBankDetais({
          account_holder_name: values.account_holder_name,
          account_number: values.account_number,
          ifsc_code: values.ifsc_code,
          bank_id: values.bank_id,
          account_type: values.account_type,
          branch: values.branch,
          login_id: loginId,
          modified_by: "270",
        })
      ).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          // console.log(res)
          // console.log("This is the response", res);
          toast.success(res.payload.message);
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      });
      
    } else if (role.verifier) {
      const veriferDetails = {
        "login_id": kycid,
        "settlement_info_verified_by": loginId
      }
      dispatch(verifyKycEachTab(veriferDetails)).then(resp => {
        resp?.payload?.settlement_info_status && toast.success(resp?.payload?.settlement_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      }).catch((e) => { toast.error("Try Again Network Error") });

    }
    
  };


  useEffect(() => {
    if (role.approver) {
      setReadOnly(true)
      setButtonText("Approve and Next") 
    }else if(role.verifier){
      setReadOnly(true)
      setButtonText("Verify and Next")
    }
  }, [role])

  return (
    <div className="col-md-12 col-md-offset-4">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {formik => (

        <Form>
          {console.log(formik)}
          <div className="form-row align-items-centre">
            <div className="col-lg-10">
            <label><h4 class ="font-weight-bold">Account Holder Name<span style={{color:"red"}}>*</span></h4></label>
            <FormikController
                        control="input"
                        type="text"
                        name="account_holder_name"
                        className="form-control"
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />
            </div>

            
              <div className="col-lg-10">
              <label><h4 class ="font-weight-bold">Account Type<span style={{color:"red"}}>*</span></h4></label>
              <FormikController
                        control="input"
                        type="text"
                        name="account_type"
                        className="form-control"
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />
              </div>

              <div className="col-lg-10">
              <label><h4 class ="font-weight-bold">IFSC Code<span style={{color:"red"}}>*</span></h4></label>
              <FormikController
                        control="input"
                        type="text"
                        name="ifsc_code"
                        className="form-control"
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />
              </div>
          



          </div>

          <div className="form-row">
            <div className="col-lg-10">
            <label><h4 class ="font-weight-bold">Bank Name<span style={{color:"red"}}>*</span></h4></label>
                       <FormikController
                          control="select"                          
                          name="bank_id"
                          className="form-control"
                          options={data}
                          disabled={VerifyKycStatus === "Verified" ? true : false}
                          readOnly={readOnly}
                        />
                    
            </div>


            <div className="col-lg-10">
            <label><h4 class ="font-weight-bold">Account Number<span style={{color:"red"}}>*</span></h4></label>
            <FormikController
                          control="input"
                          type="text"
                          name="account_number"
                          className="form-control"
                          disabled={VerifyKycStatus === "Verified" ? true : false}
                          readOnly={readOnly}
                        />
            </div>

           
          </div>
          
          <div class="mt-lg-2">
          {VerifyKycStatus === "Verified" ? null : (
         <button className="btn float-lg-right" type="submit" style={{backgroundColor:"#0156B3"}}>
               <h4 className="text-white"> {buttonText}</h4>
              </button>
            )}
          </div>
         
        </Form>
      )}
    </Formik>

  </div>
)
}
export default BankDetails
