import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { assignAccountMangerApi, assignManagerDetails, assignmentTypeApi } from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import { assignRoleWiseApi } from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import toastConfig from "../../../utilities/toastTypes";
import { kycUserList } from "../../../slices/kycSlice";

const AssigneAccountManger = () => {
  const [clientCodeList, setClientCodeList] = useState([]);
  const [assignmentType, setAssignmentType] = useState([]);
  const [assignDetails, setAssignDetails] = useState([]);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    react_select: "",
    assigned_login_id: "",
    assignment_type: null,
  };

  const validationSchema = Yup.object().shape({
    assigned_login_id: Yup.string().required("Required"),
    react_select: Yup.object().required("Required").nullable(),
    assignment_type: Yup.object().required("Required").nullable(),
  });

  useEffect(() => {
    dispatch(assignmentTypeApi())
      .then((response) => {
        const data = response?.payload?.assignment_type?.map((item) => ({
          value: item.value, // Value to be sent in payload
          label: item.key, // Key to be displayed in dropdown
          role_id: item.role_id,
        }));
        setAssignmentType(data);
      })
      .catch((error) => console.error("Error fetching assignment types:", error));
  }, []);

  useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setClientCodeList(resp?.payload?.result);
    });
  }, []);

  const fetchAccountManagers = (role_id) => {
    if (role_id) {
      dispatch(assignManagerDetails({ role_id }))
        .then((response) => {
          const data = convertToFormikSelectJson("login_master_id", "name", response?.payload?.result);
          setAssignDetails(data);
        })
        .catch((error) => console.error("Error fetching account managers:", error));
    }
  };

  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      dispatch(assignAccountMangerApi({ client_code: selectedOption.value }));
    }
  };

  const onSubmit = (values) => {
    setDisable(true);

    const postData = {
      assigned_login_id: values.assigned_login_id,
      merchant_login_id: values?.react_select?.value,
      assignment_type: values.assignment_type?.value,
    };

    if (!window.confirm("Are you sure to assign a new account manager?")) {
      setDisable(false);
      return;
    }

    dispatch(assignRoleWiseApi(postData))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toastConfig.successToast(res.payload.message);
          dispatch(kycUserList({ login_id: values?.react_select?.value }));

        } else {
          toastConfig.errorToast(res.payload);
        }
        setDisable(false);
      })
      .catch(() => setDisable(false));
  };

  const clientOptions = clientCodeList.map((data) => ({
    value: data.loginMasterId,
    label: `${data.clientCode} - ${data.name}`,
  }));

  return (
    <section>
      <main>
        <h5>Merchant Assignment</h5>
        <div className="container-fluid p-0">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, setFieldValue }) => (
              <Form className="row mt-5">
                <div className="row">
                  <div className="col-lg-3">
                    <CustomReactSelect
                      name="react_select"
                      options={clientOptions}
                      placeholder="Select Client Code"
                      filterOption={createFilter({ ignoreAccents: false })}
                      label="Client Code"
                      onChange={(selectedOption) => {
                        setFieldValue("react_select", selectedOption);
                        handleClientChange(selectedOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <CustomReactSelect
                      name="assignment_type"
                      options={assignmentType}
                      placeholder="Select Assignment Type"
                      filterOption={createFilter({ ignoreAccents: false })}
                      label="Assignment Type"
                      onChange={(selectedOption) => {
                        setFieldValue("assignment_type", selectedOption);
                        if (selectedOption) {
                          fetchAccountManagers(selectedOption.role_id);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikController control="select" name="assigned_login_id" options={assignDetails} className="form-select" label="Account Manager List" />
                  </div>
                  <div className="col-lg-3 mt-4">
                    <button type="submit" className="btn cob-btn-primary approve text-white" disabled={disable}>
                      {disable && <span className="spinner-border spinner-border-sm mr-1" role="status"></span>} Assign
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </section>
  );
};

export default AssigneAccountManger;