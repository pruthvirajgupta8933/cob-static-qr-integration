import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
import { kycBankNames, kycpaymentModeType } from "../../slices/kycSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { forGeneratingMid } from "../../slices/referralAndMidOperationSlice";
import { getallGenrateMidData } from "../../slices/referralAndMidOperationSlice";
import DateFormatter from "../../utilities/DateConvert";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../_components/formik/Yup";


const ViewGenerateMidModal = (props) => {
  const [bankData, setBankData] = useState([]);
  const [paymentMode, setPaymentMode] = useState([])
  const [loading, setLoading] = useState(false);
  const [genrateMidData, setGenrateMidData] = useState([])
  const [data, setData] = useState([]);
  const dispatch = useDispatch();



  const initialValues = {
    name: "",
    email: ""
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Required")
      .nullable(),
    email: Yup.string()
      .required("Required")
      .nullable(),
  });

  // useEffect(() => {
  //   dispatch(kycBankNames())
  //     .then((resp) => {
  //       const data = convertToFormikSelectJson(
  //         "bankId",
  //         "bankName",
  //         resp.payload
  //       );
  //       setBankData(data);
  //     })

  //     .catch((err) => console.log(err));
  // }, []);


  // useEffect(() => {
  //   dispatch(kycpaymentModeType())
  //     .then((resp) => {
  //       const data = convertToFormikSelectJson(
  //         "payment_id",
  //         "payment_mode",
  //         resp.payload.PaymentModeData
  //       );
  //       setPaymentMode(data);
  //     })

  //     .catch((err) => console.log(err));
  // }, []);


  // useEffect(() => {
  //   dispatch(getallGenrateMidData({ clientCode: props?.userData?.clientCode }))
  //     .then((resp) => {
  //       const data = resp?.payload?.MidData;
  //       setGenrateMidData(data)

  //     })

  //     .catch((err) => {

  //     });
  // }, [props?.userData?.clientCode]);

  const handleSubmit = (values, resetForm) => {
    setLoading(true);
    // setDisable(true)
    const midData = {
      clientCode: props?.userData?.clientCode,
      bankName: values?.bank_id,
      payment_mode: values?.payment_mode
    };
    dispatch(forGeneratingMid(midData))
      .then((resp) => {
        setData(resp.payload.ResponseData);
        resp?.payload?.status_code === 200 ? toastConfig.successToast(resp?.payload?.message) : toastConfig.errorToast(resp?.payload)
        setLoading(false);
        resetForm();
        return props.afterGeneratingMid()
      })
      .catch((err) => {


        toastConfig.errorToast(err);

      });
  };

  return (

    <div
      className="modal fade mymodals"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      ariaHidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}

            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
          >
            {({ resetForm }) => (
              <>
                <div className="modal-header">
                  <h5
                    className="modal-title bolding text-black"
                    id="exampleModalLongTitle"
                  >
                    Generation of MID
                  </h5>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span ariaHidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/* <p className="">
                    Client Name: {props?.userData?.clientName}
                  </p> */}
                  <p className="">
                    Client Code: {props?.selectedClientId}
                  </p>
                  <div className="container">
                    <Form>
                      <div className="row">
                        <div className="col-lg-6">
                          <label className="col-form-label mt-0 p-2">
                             Name<span style={{ color: "red" }}>*</span>
                          </label>
                          <FormikController
                            control="input"
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            className="form-control"
                          />
                        </div>
                        <div className="col-lg-6">
                          <label className="col-form-label mt-0 p-2">
                            Email<span style={{ color: "red" }}>*</span>
                          </label>
                          <FormikController
                            control="input"
                            type="text"
                            name="email"
                            placeholder="Enter Email"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="">
                        <button
                          type="subbmit"
                          className="submit-btn cob-btn-primary text-white mt-3"
                        >
                          Confirm
                        </button>
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
  );
};

export default ViewGenerateMidModal;
