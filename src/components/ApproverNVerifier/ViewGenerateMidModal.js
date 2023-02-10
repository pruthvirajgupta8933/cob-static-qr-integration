import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
import { kycBankNames } from "../../slices/kycSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { forGeneratingMid } from "../../slices/referralAndMidOperationSlice";

const ViewGenerateMidModal = (props) => {
  const [show, setShow] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    bank_id: "",
  };

  const validationSchema = Yup.object({
    bank_id: Yup.string()
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

  const handleSubmit = (values, resetForm) => {
    setLoading(true);
    // setDisable(true)

    const midData = {
      clientCode: props?.userData?.clientCode,
      bankName: values.bank_id,
    };
    dispatch(forGeneratingMid(midData))
      .then((resp) => {
        setData(resp.payload.ResponseData);
        // console.log("API RESPONSE : :", resp);
        toastConfig.successToast(resp.payload.message);

        // setDisable(false)
        setShow(true);
        setLoading(false);
        resetForm();
      })

      .catch((err) => {
        toastConfig.errorToast(err);
        // setDisable(false);
      });
  };

  // props.setOpenModal(false);

  // const propertyNames = Object.keys(data);
  // console.log("propertyNames",propertyNames)
  // console.log()

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
                    <h5 className="font-weight-bold">
                      Name: {props?.userData?.clientName}
                    </h5>
                    <h5 className="font-weight-bold">
                      ClientCode: {props?.userData?.clientCode}
                    </h5>
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
                        </div>
                        <div className="col-lg-6-">
                          <button
                            type="subbmit"
                            className="btn btnbackground text-white"
                            // disabled={disable}
                          >
                            {loading ? "Loading..." : "Generate MID"}
                          </button>
                        </div>
                        {show ? (
                          <div
                            className="modal-footer"
                            style={{ display: "contents" }}
                          >
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Client Code</th>
                                  <th>Client Sub Merchant Id</th>
                                  <th>Bank Request ID</th>
                                  <th>Onboard Status</th>
                                  <th>Client Name</th>
                                  <th>Client Address</th>
                                  <th>Client GST</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{data?.clientCode}</td>
                                  <td>{data?.subMerchantId}</td>
                                  <td>{data?.bankrequestId}</td>
                                  <td>{data?.onboardStatus}</td>
                                  <td>{data?.clientName}</td>
                                  <td>{data?.clientAddress}</td>
                                  <td>{data?.clientGstNo}</td>
                                </tr>
                              </tbody>
                            </table>

                            {/* <button type="button" class="btn btn-secondary text-white" data-dismiss="modal" onClick={setShow(false)}>Close</button> */}
                          </div>
                        ) : (
                          <></>
                        )}
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

export default ViewGenerateMidModal;
