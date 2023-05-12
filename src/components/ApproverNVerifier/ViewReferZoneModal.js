import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
// import { saveReferingMerchant } from "../../slices/kycSlice";
import { saveReferingMerchant } from "../../slices/referralAndMidOperationSlice";

const ViewReferZoneModal = (props) => {
  const [selectedValue, setSelectedvalue] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  


  const { user } = useSelector((state) => state.auth);
  const loginId = user?.loginId;


  const initialValues = {
    sourcing_code: "",
  };

  const validationSchema = Yup.object({
    sourcing_code: Yup.string()
      .required("Required")
      .nullable(),
  });

  const referingMode = [
    { key: "For Bank", value: "For Bank" },
    { key: "For Referral", value: "For Referral" },
    { key: "For Employee", value: "For Employee" },
  ];


  const handleSubmit = (values) => {
   

    const saveRefData = {
      login_id: props.userData.loginMasterId,
      approver_id: loginId,
      sourcing_point: selectedValue,
      sourcing_code: values.sourcing_code,
    };
    dispatch(saveReferingMerchant(saveRefData))
      .then((resp) => {
        // console.log("API RESPONSE : :", resp);
        toastConfig.successToast(resp.payload.message);
        props.setOpenModal(false)
        return props.refreshAfterRefer()
      })

      .catch((err) => {
        toastConfig.errorToast(err);
      });
  };


  return (
    <div>
      <div
        className="modal fade mymodals"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              // onSubmit={(values)=>handleSubmit(values)}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {(formik) => (
                <>
                  <div className="modal-header">
                    <h5
                      className="modal-title bolding text-black"
                      id="exampleModalLongTitle"
                    >
                       Update Source
                    </h5>

                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => 
                      {
                      setSelectedvalue(false)
                      setShow(false);
                    }
                    }
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h5 className="font-weight-bold">
                      Name: {props?.userData?.clientName}
                    </h5>
                    <h5 className="font-weight-bold">
                      ClientCode: {props?.userData?.clientCode}
                    </h5>
                    <div className="container">
                      <Form>
                        <div class="container show-zone">
                          <div class="row">
                            
                            <label
                              class="form-check- font-weight-bold"
                              for="flexRadioDefault1"
                            >
                              Select Referring Source
                            </label>

                            <div class="col-lg-10">
                              <FormikController
                                control="radio"
                                onChange={(e) => {
                                  setSelectedvalue(e.target.value);
                                  setShow(true);
                                  formik.setFieldValue(
                                    "sourcing_point",
                                    e.target.value
                                  );
                                }}
                                checked=""
                                name="sourcing_point"
                                options={referingMode}
                                className="form-check-input"
                                placeholder="Enter Source Code"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="modal-footer"
                          style={{ display: "contents" }}
                        >
                          {show ? (
                            <div class="col-lg-5">
                              <FormikController
                                control="input"
                                type="text"
                                name="sourcing_code"
                                className="form-control"
                                placeHolder="Enter Source Code"
                              />
                              <button
                                type="subbmit"
                                className="submit-btn btnbackground btn-primary  text-white"
                              >
                                
                                Refer Merchant
                              </button>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </Form>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReferZoneModal;
