import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from 'react-select';
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import assignAccountMangerService from "../../../services/assign-account-manager/assign-account-manager.service";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import toastConfig from "../../../utilities/toastTypes";
import { assignAccountMangerApi, assignManagerDetails } from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import classes from "./assign-accountManger.module.css"
const AssigneAccountManger = () => {
  const [clientCodeList, setCliencodeList] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [assignedAccountManger, setAssignedAccountManger] = useState("")
  const [assignDetails, setAssignDetails] = useState([]);
  const [disable, setDisable] = useState(false)
  const dispatch = useDispatch()

  let initialValues = {
    react_select: "",
    login_master: ""

  };


  const validationSchema = Yup.object().shape({
    login_master: Yup.string()
      .required("Required"),
    react_select: Yup.object().required("Required").nullable(),

  });

  

  const handleChange = (selectedOption) => {
    const clientId = selectedOption ? selectedOption.value : null;
    setSelectedClientId(clientId);

    if (clientId) {
      const postData = {
        "client_code": clientId
      };

      dispatch(assignAccountMangerApi(postData))
        .then((res) => {
          console.log("res", res)
          setAssignedAccountManger(res?.payload?.result)
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  };

  useEffect(() => {
    const postData = {
      "role_id": "101"
    }
    dispatch(assignManagerDetails(postData))
      .then(response => {

        const data = convertToFormikSelectJson(
          "login_master_id",
          "name",

          response?.payload?.result
        )
        setAssignDetails(data);
      })
      .catch(error => {
        console.error('Error fetching merchant data:', error);
      });
  }, []);

useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setCliencodeList(resp?.payload?.result)
    })
  }, [])

  // const onSubmit = (values) => {
  //   setDisable(true)
  //   const postData = {
  //     "client_code": values?.react_select?.value,
  //     "login_master_id": values.login_master
  //   }
  //   assignAccountMangerService.assignClient(postData).then((res) => {
  //     if (res?.data?.status === true) {
  //       toastConfig.successToast(res?.data?.message)
  //       dispatch(assignAccountMangerApi({ "client_code": selectedClientId }))
  //       setDisable(false)
  //     } else {
  //       toastConfig.errorToast(res?.data?.message)
  //       setDisable(false)
  //     }

  //   })
  // }

  const onSubmit = (values) => {
    setDisable(true);
    const postData = {
      "client_code": values?.react_select?.value,
      "login_master_id": values.login_master
    };
  
    assignAccountMangerService.assignClient(postData).then((res) => {
      if (res?.data?.status === true) {
        toastConfig.successToast(res?.data?.message);
        dispatch(assignAccountMangerApi({ "client_code": selectedClientId }))
          .then((res) => {
            setAssignedAccountManger(res?.payload?.result);
            setDisable(false);
          })
         
      } else {
        toastConfig.errorToast(res?.data?.message);
        setDisable(false);
      }
    }).catch((err)=>{
      setDisable(false)
    })
  };

  const options = [
    { value: '', label: 'Select Client Code' },
    ...clientCodeList.map((data) => ({
      value: data.clientCode,
      label: `${data.clientCode} - ${data.name}`
    }))
  ]
  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="ml-3">Merchant Assignment</h5>
          </div>
          <div className="container-fluid mt-5">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="">
                  <div className="row">
                    <div className="col-lg-3">
                       <CustomReactSelect
                        name="react_select"
                        options={options}
                        placeholder="Select Client Code"
                        filterOption={createFilter({ ignoreAccents: false })}
                        label="Client Code"
                        onChange={handleChange}

                      />
                      {selectedClientId &&<h6  className={` ${classes.background_box} `}>Current Assigned Account Manager</h6>}
                      {selectedClientId && <p className="mt-2">Name: {assignedAccountManger?.name || "NA"}</p>}
                      {selectedClientId && <p className=""> Email: {assignedAccountManger?.email || "NA"}</p>}
                    </div>
                    <div className="col-lg-3">
                      <FormikController
                        control="select"
                        name="login_master"
                        options={assignDetails}
                        className="form-select"
                        label="Account Manager List"
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <button
                        type="submit"
                        className="btn cob-btn-primary approve text-white"
                        disabled={disable}
                      >
                        {disable && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )}
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div>
        </div>
      </main>
    </section>
  )
}

export default AssigneAccountManger
