import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import assignAccountMangerService from "../../../services/assign-account-manager/assign-account-manager.service";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import toastConfig from "../../../utilities/toastTypes";
import {
    assignAccountMangerApi,
    assignManagerDetails,
} from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import { assignBd } from "./bdSlice.js/bdSlice";

const AssigneBusinessDevelopment = () => {
    const { clientCodeList } = useSelector(
        (state) => state.approverDashboard
    );
    // const [clientCodeList, setClientCodeList] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [assignedAccountManger, setAssignedAccountManger] = useState("");
    const [assignDetails, setAssignDetails] = useState([]);
    const [disable, setDisable] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const roleId = user?.roleId;

    const dispatch = useDispatch();

    const initialValues = {
        react_select: "",
        login_master: "",
    };

    const validationSchema = Yup.object().shape({
        login_master: Yup.string().required("Required"),
        react_select: Yup.object().required("Required").nullable(),
    });

    const handleChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedClient(selectedOption); // Store the whole object
            const postData = {
                client_code: selectedOption.value, // Sending clientCode in API call
            };

            dispatch(assignAccountMangerApi(postData))
                .then((res) => {
                    setAssignedAccountManger(res?.payload?.result);
                })
                .catch((err) => {
                    console.error("Error:", err);
                });
        }
    };

    useEffect(() => {
        const postData = {
            role_id: "102",
        };
        dispatch(assignManagerDetails(postData))
            .then((response) => {
                const data = convertToFormikSelectJson(
                    "login_master_id",
                    "name",
                    response?.payload?.result
                );
                setAssignDetails(data);
            })
            .catch((error) => {
                console.error("Error fetching merchant data:", error);
            });
    }, []);


    const FIVE_MINUTES = 5 * 60 * 1000;
    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(getAllCLientCodeSlice());
        }, FIVE_MINUTES);
        if (clientCodeList.length === 0) {
            dispatch(getAllCLientCodeSlice());
        }

        return () => clearInterval(interval);
    }, [dispatch]);

    const onSubmit = (values) => {
        setDisable(true);

        dispatch(assignBd({
            "bd_login_id": values.login_master,
            "merchant_login_id": selectedClient?.loginMasterId, // Sending loginMasterId in payload
        }))
            .then((res) => {
                if (res?.meta.requestStatus === "fulfilled") {
                    toastConfig.successToast(res?.payload?.message);
                } else {
                    toastConfig.errorToast(res?.payload?.message);
                }
            })
            .catch(() => {
                toastConfig.errorToast("An error occurred while updating MFA status");
            })
            .finally(() => {
                setDisable(false);
            });
    };

    const options = [
        { value: "", label: "Select Client Code" },
        ...clientCodeList.map((data) => ({
            value: data.clientCode, // Display clientCode in dropdown
            label: `${data.clientCode} - ${data.name}`,
            loginMasterId: data.loginMasterId, // Storing loginMasterId for submission
        })),
    ];

    return (
        <section>
            <main>
                <div>
                    <div>
                        <h5>Business Development Assignment</h5>
                    </div>
                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {(formik) => (
                                <Form className="row mt-5">
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
                                            <div className="text-primary mb-3 mt-5 d-flex">
                                                {selectedClient && (
                                                    <h6>Current Account Manager</h6>
                                                )}
                                            </div>
                                            {selectedClient && (
                                                <h6 className="mt-3">
                                                    Name: {assignedAccountManger?.name || "NA"}
                                                </h6>
                                            )}
                                            {selectedClient && (
                                                <h6>Email: {assignedAccountManger?.email || "NA"}</h6>
                                            )}
                                        </div>
                                        <div className="col-lg-3">
                                            <FormikController
                                                control="select"
                                                name="login_master"
                                                options={assignDetails}
                                                className="form-select"
                                                label="Business Development List"
                                            />
                                        </div>
                                        <div className="col-lg-3 mt-4">
                                            <button
                                                type="submit"
                                                className="btn cob-btn-primary approve text-white"
                                                disabled={disable}
                                            >
                                                {disable && (
                                                    <span
                                                        className="spinner-border spinner-border-sm mr-1"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                )}
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </main>
        </section>
    );
};

export default AssigneBusinessDevelopment;
