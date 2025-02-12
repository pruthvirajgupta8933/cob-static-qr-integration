import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import FormikController from "../../../../_components/formik/FormikController";
import CustomModal from "../../../../_components/custom_modal";
import Yup from "../../../../_components/formik/Yup";
import { fetchCkycr, saveCkycr } from "../slice/ckycr.slice";
import toastConfig from "../../../../utilities/toastTypes";

const CkycrModal = (props) => {

  const dispatch = useDispatch();
  const { ckycrReducer } = useSelector(state => state)

  const initialValues = {
    login_id: props?.rowData?.loginMasterId,
    description: "",
    ckycr_portal_update_date: "",
    sabpaisa_kyc_update_date: ""
  };

  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    ckycr_portal_update_date: Yup.date().required("CKYCR Portal Date is required"),
    sabpaisa_kyc_update_date: Yup.date().required("Sabpaisa KYC Date is required")
  });




  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true)

    try {
      const response = await dispatch(saveCkycr(values));
      if (response?.payload?.status !== true) {
        toastConfig.errorToast(response?.payload)
      }
      await dispatch(fetchCkycr({ login_id: props?.rowData?.loginMasterId }))
      resetForm()
    }
    catch (error) {
      console.log(error)
      toastConfig.errorToast("Something went wrong")
    }

    setSubmitting(false)
  };


  useEffect(() => {
    dispatch(fetchCkycr({ login_id: props?.rowData?.loginMasterId }))
  }, [])


  const modalbody = () => {

    return (
      <div className="container-fluid">
        <div className="row mb-4 d-flex">
          <p className="m-auto">
            Merchant Name: {props?.rowData?.clientName}
          </p>
          <p className="m-auto">
            Client Code: {props?.rowData?.clientCode}
          </p>
        </div>

        <div className="row">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, formikFn) => {
              handleSubmit(values, { ...formikFn })
            }}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <>
                <Form>
                  <div className="form-row mb-3">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <label>CKYCR Portal Date</label>
                      <FormikController
                        control="input"
                        type="date"
                        name="ckycr_portal_update_date"
                        className="form-control"

                      />

                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <label>Sabpaisa KYC Date</label>
                      <FormikController
                        control="input"
                        type="date"
                        name="sabpaisa_kyc_update_date"
                        className="form-control"

                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <FormikController
                      control="input"
                      type="text"
                      name="description"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn cob-btn-primary text-white btn-sm"
                    >
                      {isSubmitting && (
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      {isSubmitting ? "Submiting..." : "Submit"}

                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>

        <div className="row mt-3">
          {ckycrReducer?.loading ? <>Loading...</> :

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>CKCYR Portal Date</th>
                  <th>Sabpaisa KYC Date</th>
                  <th>Updated By</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {ckycrReducer?.data?.data?.id > 0 ? [ckycrReducer?.data?.data]?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.ckycr_portal_update_date}</td>
                    <td>{item.sabpaisa_kyc_update_date}</td>
                    <td>{item.updated_by_name}</td>
                    <td>{item.created_by_name}</td>
                  </tr>
                ))
                  :
                  <tr >
                    <td colspan="5" className="text-center">Data not available</td>
                  </tr>
                }
              </tbody>
            </table>

          }

        </div>
      </div>


    )
  };

  const modalFooter = () => {
    return (
      <button
        type="button"
        className="btn btn-secondary text-white btn-sm"
        data-dismiss="modal"
        onClick={() => {
          props?.setModalState(false);
        }}
      >
        Close
      </button>

    );
  };





  return (
    <>
      <CustomModal modalBody={modalbody} headerTitle={"Update CKCYR"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default CkycrModal;
