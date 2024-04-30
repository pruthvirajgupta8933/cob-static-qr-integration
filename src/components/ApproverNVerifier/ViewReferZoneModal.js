import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
import { saveReferingMerchant } from "../../slices/referralAndMidOperationSlice";
import { getRefferal } from "../../services/kyc/merchant-kyc";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";

const ViewReferZoneModal = (props) => {
  const [selectedValue, setSelectedvalue] = useState("");
  const [refferalList, setRefferalList] = useState([])
  const [disable, setDisable] = useState(false)
  console.log("disable",disable);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const loginId = user?.loginId;
  const initialValues = {
    sourcing_point: "",
    sourcing_code: ""
  };

  const validationSchema = Yup.object({
    sourcing_point: Yup.string().required("Required").nullable(),
    sourcing_code: Yup.string().required("Required").nullable()
  });

  useEffect(() => {

    getRefferal().then(res => {
      const data = convertToFormikSelectJson(
        "emp_code",
        "referral_code",
        res?.data?.message
      )
      setRefferalList(data)


    }).catch(err => toastConfig.errorToast(err))
    props.refreshAfterRefer(false)

  }, []);


  const referingMode = [
    { key: "For Bank", value: "For Bank" },
    { key: "For Referral", value: "For Referral" },
    { key: "For Employee", value: "For Employee" },
    { key: "For Zone", value: "For Zone" }
  ];


  const handleSubmit = (values) => {
    
    let saveRefData = {
      login_id: props.userData.loginMasterId,
      approver_id: loginId,
      sourcing_point: selectedValue,
      sourcing_code: values.sourcing_code,
      emp_code: values.sourcing_code
    };
    setDisable(true)
    dispatch(saveReferingMerchant(saveRefData))
      .then((resp) => {

        toastConfig.successToast(resp.payload.message);
        props.setOpenModal(false)
        setDisable(false)

        props.refreshAfterRefer(true)
      })
      .catch((err) => {
        toastConfig.errorToast(err);
        setDisable(false)
      });
  };


  return (

    <div
      className="modal fade mymodals abhishek"
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
                    onClick={() => {
                      setSelectedvalue(false)

                    }
                    }
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row mb-1">
                    <p className="m-1">Name: {props?.userData?.clientName}</p>
                    <p className="m-1">ClientCode: {props?.userData?.clientCode}</p>
                  </div>

                  <Form>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-12">
                          <FormikController
                            control="radio"
                            onChange={(e) => {
                              setSelectedvalue(e.target.value);
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


                        {formik.values.sourcing_point === "For Zone" &&
                          <div className="col-lg-12">
                            <FormikController
                              control="select"
                              name="sourcing_code"
                              options={refferalList}
                              className="form-select"
                              label=""
                            />
                          </div>}

                        {formik.values.sourcing_point !== "For Zone" &&
                          <div className="col-lg-12">
                            <FormikController
                              control="input"
                              type="text"
                              name="sourcing_code"
                              className="form-control"
                              placeHolder="Enter Source Code"
                            />
                          </div>}
                      </div>
                    </div>
                    <div className="modal-footer">

                      <div className="col-lg-12">

                        <button
                          type="submit"
                          className="btn cob-btn-primary mt-4 approve text-white btn-sm"
                          disabled={disable}
                        >
                          {disable && (
                            <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                          )} {/* Show spinner if disabled */}
                          Refer Merchant
                        </button>
                      </div>

                    </div>
                  </Form>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>

  );
};

export default ViewReferZoneModal;
