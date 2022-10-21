import React, {useEffect, useState} from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import { useSelector , useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { saveRegisteredAddress,verifyKycEachTab  } from "../../slices/kycSlice"


const RegisteredAddress = (props) => {
  const dispatch = useDispatch();
  const { role, kycid } = props;
  const KycList = useSelector((state) => state.kyc.kycUserList);
  const VerifyKycStatus = useSelector(
    (state) => state.kyc.KycTabStatusStore.merchant_address_status
  );
  // console.log(KycList.merchant_address_details.pin_code,"<===List==>")
  
  
  const [check,setCheck] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");
  


  const [data, setData] = useState([]);


  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    address: KycList?.merchant_address_details?.address,
    city: KycList?.merchant_address_details?.city,
    state:KycList?.merchant_address_details?.state,
    pincode: KycList?.merchant_address_details?.pin_code,
  
  }
  const validationSchema = Yup.object({
    address: Yup.string().required("Required").nullable(),
    city: Yup.string().required("Required").nullable(),
    state: Yup.string().required("Required").nullable(),
    pincode: Yup.string().required("Required").nullable(),
  })



  const onSubmit =  (values) => {

    // console.log("Form Submitted")
    if (role.merchant) {
    dispatch(
      saveRegisteredAddress({
        address: values.address,
        city: values.city,
        state:values.state,
        pin_code: values.pincode,
        login_id: loginId,
        submit_by: "270",
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
        "merchant_address_verified_by": loginId
      }
      dispatch(verifyKycEachTab(veriferDetails)).then(resp => {
        resp?.payload?.settlement_info_status && toast.success(resp?.payload?.merchant_address_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      }).catch((e) => { toast.error("Try Again Network Error") });

    }
    
  };




  return (
    <div className="col-md-12 col-md-offset-4">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(onSubmit)}
    >
      {formik => (

        <Form>
          {console.log(formik)}

          <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Address<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="address"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                
                />
              </div>
            </div>

       
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  City<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="city"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                 
                />
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  State<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="state"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
          
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Pincode<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="pincode"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
            <p style={{marginLeft:"23px"}}>
            <input class="form-check-input" type="checkbox" value={check} id="flexCheckDefault" />
            Operational address is same as the business address
            </p>
              </div>
            </div>
          

         
            <div class="my-5 p-2">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div class="mt-3">
              <div class="row">
              <div class="col-sm-11 col-md-11 col-lg-11 col-form-label">
                
                  <button
                    type="submit"
                    className="btn float-lg-right"
                    style={{ backgroundColor: "#0156B3" }}
                  >
                    <h4 className="text-white text-kyc-sumit"> {buttonText}</h4>
                  </button>
              
              </div>
              </div>
              </div>
            </div>
        </Form>
        
      )}
    </Formik>

  </div>
 )
}

export default RegisteredAddress