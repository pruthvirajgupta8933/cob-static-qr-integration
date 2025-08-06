import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { assignManagerDetails, assignmentTypeApi, assignRoleWiseApi } from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import toastConfig from "../../../utilities/toastTypes";
import { kycUserList } from "../../../slices/kycSlice";
import CardLayout from "../../../utilities/CardLayout";

const AssigneAccountManger = () => {
  // const [clientCodeList, setClientCodeList] = useState([]);
  const [assignmentType, setAssignmentType] = useState([]);
  const [assignDetails, setAssignDetails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { clientCodeList } = useSelector(
    (state) => state.approverDashboard
  );

  const { kyc } = useSelector((state) => state);
  const KycList = kyc?.kycUserList;
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
    dispatch(assignmentTypeApi()).then((response) => {
      const data = response?.payload?.assignment_type?.map((item) => ({
        value: item.value,
        label: item.key,
        role_id: item.role_id,
      }));
      setAssignmentType(data);
    });
  }, []);

  // useEffect(() => {
  //   dispatch(getAllCLientCodeSlice()).then((resp) => {
  //     // setClientCodeList(resp?.payload?.result);
  //   });
  // }, []);

  // const TEN_MINUTES = 10 * 60 * 1000;

  const FIVE_MINUTES = 5 * 60 * 1000;


  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getAllCLientCodeSlice());
    }, FIVE_MINUTES);
    if (clientCodeList.length === 0) {
      dispatch(getAllCLientCodeSlice());
    }

    return () => clearInterval(interval);
  }, [dispatch]); // 

  const fetchAccountManagers = (role_id) => {
    if (role_id) {
      dispatch(assignManagerDetails({ role_id })).then((response) => {
        const data = convertToFormikSelectJson("login_master_id", "name", response?.payload?.result);
        setAssignDetails(data);
      });
    }
  };

  const handleClientChange = (selectedOption) => {
    if (selectedOption) {
      dispatch(kycUserList({ login_id: selectedOption.value }));
    }
  };

  const onSubmit = (values, { setSubmitting }) => {
    const postData = {
      assigned_login_id: values.assigned_login_id,
      merchant_login_id: values?.react_select?.value,
      assignment_type: values.assignment_type?.value,
    };

    if (!window.confirm("Are you sure to assign a new role?")) {
      setSubmitting(false);
      return;
    }

    dispatch(assignRoleWiseApi(postData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toastConfig.successToast(res.payload.message);
        dispatch(kycUserList({ login_id: values?.react_select?.value }));
      } else {
        toastConfig.errorToast(res.payload);
      }
      setSubmitting(false);
    });
  };

  const clientOptions = clientCodeList.map((data) => ({
    value: data.loginMasterId,
    label: `${data.clientCode} - ${data.name}`,
  }));

  return (
    <CardLayout title="Merchant Assignment">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="row ">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-12">
                <CustomReactSelect
                  name="react_select"
                  options={clientOptions}
                  placeholder="Select Client Code"
                  filterOption={createFilter({ ignoreAccents: false })}
                  label="Client Code"
                  onChange={(selectedOption) => {
                    setSelectedId(selectedOption);
                    setFieldValue("react_select", selectedOption);
                    handleClientChange(selectedOption);
                  }}
                />
              </div>
              <div className="col-lg-3 col-md-6 col-12">
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
              <div className="col-lg-3 col-md-6 col-12">
                <FormikController control="select" name="assigned_login_id" options={assignDetails} className="form-select" label="Manager List" />
              </div>
              <div className="col-lg-3 col-md-6 col-12 mt-4">
                <button type="submit" className="btn cob-btn-primary approve text-white" disabled={isSubmitting}>
                  {isSubmitting && <span className="spinner-border spinner-border-sm mr-1" role="status"></span>} Assign
                </button>
              </div>
            </div>
            <div className="row mt-4">
              {KycList?.result?.loginMasterId && (
                <div className="">
                  <table className="table table-bordered table-responsive-sm">
                    <thead>
                      <tr>
                        <td className="" colSpan="2">Assigned Manager</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Account Manager Name</td>
                        <td>{KycList?.result?.loginMasterId?.account_manager_name || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Assigned BD Name</td>
                        <td>{KycList?.result?.loginMasterId?.assigned_bd_name || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Assigned Zonal Manager</td>
                        <td>{KycList?.result?.loginMasterId?.assigned_zonal_manager_name || "NA"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>


    </CardLayout>
  );
};

export default AssigneAccountManger;
