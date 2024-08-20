import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { useDispatch } from "react-redux";
import { updateZoneData, getZoneInfo, getZoneEmployeName, getMccCodeMaster } from '../../slices/merchantZoneMappingSlice';
import { riskCategory } from '../../slices/rateMappingSlice';
import Yup from "../../_components/formik/Yup";
import CustomModal from "../../_components/custom_modal";



const validationSchema = Yup.object({
  // emp_name: Yup.string().required("Required"),
  riskCategoryCode: Yup.string().required("Required").nullable(),
  mccCode: Yup.string().required("Required").nullable()
})



const ViewZoneModal = ({ openZoneModal, setOpenZoneModal, userData }) => {

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
      "client_code": userData?.clientCode,
      "emp_code": values?.emp_name,
      "risk_category_code": values?.riskCategoryCode,
      "mcc_code": values?.mccCode

    };
    dispatch(updateZoneData(postData)).then((resp) => {
      if (resp.meta.requestStatus === "fulfilled") {
        toast.success(resp?.payload?.message)
        resetForm();
        setButtonDisable(false)
        getZoneInfobyClientCode(userData?.clientCode)
        // setShow(true)

      } else {
        toast.error(resp?.payload?.message)
        setButtonDisable(false)
      }

    }).catch((resp) => {

    })
  }



  useEffect(() => {
    if (userData?.clientCode) {
      getZoneInfobyClientCode(userData?.clientCode);
    }



  }, [userData])


  const getZoneInfobyClientCode = (clientCode) => {
    const postData = {
      client_code: clientCode,
    };
    dispatch(getZoneInfo(postData)).then((resp) => {
      setZoneinfo(resp?.payload)

    }).catch(() => {

    })

  }

  const renderModalBody = () => (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
      enableReinitialize={true}
    >
      {({ resetForm }) => (
        <Form>
          <div className="mb-3">
            <p className="m-0">
              Client Name: {userData?.clientName}
            </p>
            <p className="m-0">
              Client Code: {userData?.clientCode}
            </p>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="input full- optional">
                  <label className="string optional" htmlFor="emp_name">
                    Employee Name
                  </label>
                  <FormikController
                    control="select"
                    name="emp_name"
                    options={employeeName}
                    className="form-select"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="input full- optional">
                  <label className="string optional" htmlFor="riskCategoryCode">
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
                  <label className="string optional" htmlFor="mccCode">
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
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn cob-btn-primary text-white btn-sm"
              disabled={buttonDisable}
            >
              {buttonDisable && (
                 <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
              )}
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );

  const renderTable = () => (
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
  );



  return (
    <>
      <CustomModal
        headerTitle="Merchant Configuration"
        modalBody={() => (
          <>
            {renderModalBody()}
            {renderTable()}
          </>
        )}
        modalToggle={openZoneModal}
        fnSetModalToggle={setOpenZoneModal}
        modalSize="modal-md"
      />

    </>
  );
};

export default ViewZoneModal;
