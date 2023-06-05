import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
import { kycBankNames,kycpaymentModeType } from "../../slices/kycSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { forGeneratingMid } from "../../slices/referralAndMidOperationSlice";
import { getallGenrateMidData } from "../../slices/referralAndMidOperationSlice";
import moment from "moment";
const ViewGenerateMidModal = (props) => {
  const [show, setShow] = useState(false);
  const [bankData, setBankData] = useState([]);
  const[paymentMode,setPaymentMode]=useState([])
  const [loading, setLoading] = useState(false);
 const[genrateMidData,setGenrateMidData]=useState([])
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    bank_id: "",
    payment_mode:""
  };

  const validationSchema = Yup.object({
    bank_id: Yup.string()
      .required("Required")
      .nullable(),
      payment_mode:Yup.string()
      .required("Required")
      .nullable(),
  });

  useEffect(() => {
    dispatch(kycBankNames())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "bankId",
          "bankName",
          resp.payload
        );
        setBankData(data);
      })

      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    dispatch(kycpaymentModeType())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "payment_id",
          "payment_mode",
          resp.payload.PaymentModeData
        );
        setPaymentMode(data);
      })

      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    dispatch(getallGenrateMidData({clientCode:props?.userData?.clientCode}))
        .then((resp) => {
        const data = resp?.payload?.MidData;
        setGenrateMidData(data)
            
            // setData(data);
            
        })

        .catch((err) => {

        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [props?.userData?.clientCode]);

  const handleSubmit = (values, resetForm) => {
   
    setLoading(true);
    // setDisable(true)

    const midData = {
      clientCode: props?.userData?.clientCode,
      bankName: values?.bank_id,
      payment_mode:values?.payment_mode
    };
    dispatch(forGeneratingMid(midData))
      .then((resp) => {
        setData(resp.payload.ResponseData);
        resp?.payload?.status_code === 200 ? toastConfig.successToast(resp?.payload?.message) :toastConfig.errorToast(resp?.payload)

       
        // toastConfig.successToast(resp.payload.message);

        // setDisable(false)
        
        setLoading(false);
        resetForm();
        return props.afterGeneratingMid()
      })

      .catch((err) => {

        
        toastConfig.errorToast(err);
       
      });
  };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
      return date
    }

  

  return (

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
              // onSubmit={handleSubmit}
              // enableReinitialize={true}
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
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h6 className="">
                      Client Name: {props?.userData?.clientName}
                    </h6>
                    <h6 className="">
                      Client Code: {props?.userData?.clientCode}
                    </h6>
                    <div className="container">
                      <Form>
                        <div className="row">
                          <div className="col-lg-6">
                            <label className="col-form-label mt-0 p-2">
                              Bank Name<span style={{ color: "red" }}>*</span>
                            </label>
                            <FormikController
                              control="select"
                              name="bank_id"
                              className="form-control"
                              options={bankData}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label className="col-form-label mt-0 p-2">
                              Mode<span style={{ color: "red" }}>*</span>
                            </label>
                            <FormikController
                              control="select"
                              name="payment_mode"
                              className="form-control"
                              options={paymentMode}
                            />
                          </div>
                        </div>
                        <div className="">
                          <button
                            type="subbmit"
                            className="submit-btn cob-btn-primary text-white mb-2"
                            // disabled={disable}
                          >
                            {loading ? "Loading..." : "Generate MID"}
                          </button>
                        </div>
                       
                          <div
                            className="modal-footer">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Client Code</th>
                                  <th>Payment Mode</th>
                                  <th>Bank Name</th>
                                  <th>Sub Merchant Id</th>
                                  <th>Created Date</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                 {genrateMidData?.map((data, i) => (
                                <tr key={i}>
                                  <td>{data?.client_code}</td>
                                  <td>{data?.PaymentMode}</td>
                                  <td>{data?.BankName}</td>
                                  <td>{data?.sub_merchant_id}</td>
                                  <td>{covertDate(data?.created_date)}</td>
                                  
                                </tr>
                                 ))}
                              </tbody>
                            </table>

                            {/* <button type="button" class="btn btn-secondary text-white" data-dismiss="modal" onClick={setShow(false)}>Close</button> */}
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
