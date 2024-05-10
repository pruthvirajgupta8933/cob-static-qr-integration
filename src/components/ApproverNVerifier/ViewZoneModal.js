import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
// import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch } from "react-redux";
import { updateZoneData, getZoneInfo, getZoneEmployeName, getMccCodeMaster } from '../../slices/merchantZoneMappingSlice';
import { riskCategory } from '../../slices/rateMappingSlice';
import Yup from "../../_components/formik/Yup";



const validationSchema = Yup.object({
  emp_name: Yup.string().required("Required"),
  riskCategoryCode: Yup.string().required("Required").nullable(),
  mccCode: Yup.string().required("Required").nullable()
})



const ViewZoneModal = (props) => {

  const [riskCategoryCode, setRiskCategoryCode] = useState([])
  const [employeeName, setEmployeeName] = useState([])
  const [mccCode, setMccCode] = useState([])
  const [buttonDisable, setButtonDisable] = useState(false)
  const [zoneInfo, setZoneinfo] = useState([])
  const dispatch = useDispatch();

  const empNameFilterVal = employeeName.filter((item) => {

    if (item.value?.toLowerCase() === zoneInfo.employee_name?.toLowerCase()) {
      return item
    }
  })
  const riskFilterVal = riskCategoryCode.filter((item) => {
    if (item.value?.toLowerCase() === zoneInfo.risk_name?.toLowerCase()) {
      return item
    }
  })
  const mccFilterVal = mccCode.filter((item) => {
    if (item.value?.toLowerCase() === zoneInfo.mcc_elaboration?.toLowerCase()) {
      return item
    }
  })
  const initialValues = {
    emp_name: empNameFilterVal?.length ? empNameFilterVal[0].key : "",
    riskCategoryCode: riskFilterVal?.length ? riskFilterVal[0].key : "",
    mccCode: mccFilterVal?.length ? mccFilterVal[0].key : "",
  }


  useEffect(() => {
    dispatch(riskCategory())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "risk_category_code",
          "risk_category_name",
          resp.payload
        );
        setRiskCategoryCode(data)
      })
      .catch((err) => console.log(err));
  }, [])


  useEffect(() => {

    dispatch(getZoneEmployeName()).then((resp) => {
      const data = convertToFormikSelectJson("empCode", "empName", resp?.payload);
      setEmployeeName(data)
    }).catch(() => {

    })


  }, []);

  useEffect(() => {

    dispatch(getMccCodeMaster()).then((resp) => {
      const data = convertToFormikSelectJson("id", "mcc_ellaboration", resp?.payload);
      setMccCode(data)
    }).catch((err) => {

    })

  }, []);


  const handleSubmit = (values, { resetForm }) => {
    setButtonDisable(true)

    const postData = {
      "client_code": props?.userData?.clientCode,
      "emp_code": values?.emp_name,
      "risk_category_code": values?.riskCategoryCode,
      "mcc_code": values?.mccCode

    };

    dispatch(updateZoneData(postData)).then((resp) => {


      if (resp.meta.requestStatus === "fulfilled") {
        toast.success(resp?.payload?.message)
        resetForm();
        setButtonDisable(false)
        getZoneInfobyClientCode(props?.userData?.clientCode)
        // setShow(true)

      } else {
        toast.error(resp?.payload?.message)
        setButtonDisable(false)
      }

    }).catch((resp) => {

    })
  }



  useEffect(() => {
    if (props?.userData?.clientCode) {
      getZoneInfobyClientCode(props?.userData?.clientCode);
    }



  }, [props])


  const getZoneInfobyClientCode = (clientCode) => {
    const postData = {
      client_code: clientCode,
    };
    dispatch(getZoneInfo(postData)).then((resp) => {
      setZoneinfo(resp?.payload)

    }).catch(() => {

    })

  }


  return (
    <div>
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
              // onSubmit={(values)=>handleSubmit(values)}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values, { resetForm })
              }}
              enableReinitialize={true}
            >
              {(formik, resetForm) => (
                <>
                  <div className="modal-header">
                    <h5 className="modal-title bolding text-black" id="exampleModalLongTitle">Merchant Configuration</h5>

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
                    <div className="mb-3">
                      <p className="m-0">
                        Client Name: {props?.userData?.clientName}
                      </p>
                      <p className="m-0">
                        Client Code: {props?.userData?.clientCode}
                      </p>
                    </div>

                    <div className="container">
                      <Form>
                        <div className="row">

                          <div className="col-lg-4 ">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="emp_name"
                              >
                                Employee Name
                              </label>
                              <FormikController
                                control="select"
                                name="emp_name"
                                options={employeeName}
                                className="form-select"
                              // readOnly={true}
                              />
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="riskCategoryCode"
                              >
                                Risk Category
                              </label>
                              <FormikController
                                control="select"
                                name="riskCategoryCode"
                                options={riskCategoryCode}

                                className="form-select"
                              />

                            </div>

                          </div>

                          <div className="col-lg-4">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="mccCode"
                              >
                                MCC Code
                              </label>
                              <FormikController
                                control="select"
                                name="mccCode"
                                options={mccCode}
                                className="form-select"
                              />

                            </div>
                          </div>

                        </div>
                        <div className="modal-footer">

                          <button
                            type="submit"
                            onClick={resetForm}
                            className="btn cob-btn-primary  text-white" disabled={buttonDisable}>

                            {buttonDisable && (
                              <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                            )} {/* Show spinner if disabled */}
                            Submit</button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </>
              )}
            </Formik>
            <div className="container mr-2">
              <table className="table mr-2">

                <thead>
                  <tr>

                    <th scope="col">Employee Name</th>
                    <th scope="col">Risk Category</th>
                    <th scope="col">MCC Code</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{zoneInfo?.employee_name}</td>
                    <td>{zoneInfo?.risk_name}</td>
                    <td>{zoneInfo?.mcc_elaboration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default ViewZoneModal;
