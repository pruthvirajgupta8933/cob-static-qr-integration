import React, { useEffect, useMemo, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../../_components/formik/FormikController";
import "./kyc-style.css";
import OtpInput from "react-otp-input";
import { updateContactInfoEditDetails } from "../../../slices/editKycSlice";
import { kycUserList } from "../../../slices/kycSlice";
import { toast } from "react-toastify";




function ContactInfoEdtkyc(props) {
  const setTitle=props.title
  const setTab=props.tab
 
  const selectedId=props.selectedId
  const { auth,kyc} = useSelector((state) => state);
 const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const dispatch=useDispatch()

  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
  aadhar_number: KycList?.aadharNumber,
    
    
  };




  const handleSubmitContact = (values) => {
    console.log("values",values)
    // setIsDisable(true);
    dispatch(
      updateContactInfoEditDetails({
        login_id: selectedId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        modified_by: loginId,
        aadhar_number: values.aadhar_number,
        is_email_verified: false,
        is_contact_number_verified: false
      })
    ).then((res) => {
      console.log("res",res?.meta?.requestStatus)
      console.log("status",res?.payload?.status)
      

      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res.payload?.status === true
      ) {
        setTab(2);
        setTitle("BUSINESS OVERVIEW");
        // setIsDisable(false);
        toast.success(res.payload?.message);
        dispatch(kycUserList({ login_id: selectedId }));
        // dispatch(GetKycTabsStatus({ login_id: loginId }));
      } else {
        toast.error(res.payload);
        toast.error(res.payload?.message);
        toast.error(res.payload?.detail);
        // setIsDisable(false);
      }
    })
    // .catch((error) => {

    //   toast.error("Something went wrong");
    // })


  };


 const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
  }

  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          setFieldError,
          setFieldValue
        }) => (
          <Form>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Contact Person Name<span className="text-danger"> *</span>
                </label>

                <FormikController
                  control="input"
                  type="text"
                  name="name"
                  className="form-control"
                  
                />
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6" >
                <label className="col-form-label mt-0 p-2 " >
                  Aadhaar Number<span className="text-danger"> *</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="aadhar_number"
                  className="form-control maskedInput"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_phone}>
                  Contact Number<span className="text-danger"> *</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="contact_number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("contact_number", e.target.value)
                      // setFieldValue("isContactNumberVerified", 0)
                    }}
                    
                  />

                </div>


               
                
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 ">
                <label className="col-form-label mt-0 p-2">
                  Email Id<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="email_id"
                    className="form-control"
                    
                   
                     />
                 
                </div>

               
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {/* {VerifyKycStatus === KYC_STATUS_VERIFIED ? (
                  <></>
                ) : ( */}
                  <button
                    // disabled={disable}
                    type="submit"
                    className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                  >
                    {/* {disable &&
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    } */}
                    {"Save and Next"}
                  </button>
                {/* )} */}
              </div>
            </div>


            
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfoEdtkyc;

