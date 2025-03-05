import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../_components/formik/FormikController";
import toastConfig from "../../../utilities/toastTypes";
import { updateMfaStatus } from "./MfaSlice";
import {
    assignAccountMangerApi,
    assignManagerDetails,
} from "../../../slices/assign-accountmanager-slice/assignAccountMangerSlice";

const Mfa = () => {
    const [clientCodeList, setCliencodeList] = useState([]);

    const [disable, setDisable] = useState(false);
    const dispatch = useDispatch();
    let initialValues = {
        react_select: "",
        mfa: "",
    };

    const validationSchema = Yup.object().shape({
        mfa: Yup.string().required("Required"),
        react_select: Yup.object().required("Required").nullable(),
    });

    const handleChange = (selectedOption) => {
        const clientId = selectedOption ? selectedOption.value : null;


        if (clientId) {
            const postData = {
                client_code: clientId,
            };

            dispatch(assignAccountMangerApi(postData))

                .catch((err) => {
                    console.error("Error:", err);
                });
        }
    };



    useEffect(() => {
        dispatch(getAllCLientCodeSlice()).then((resp) => {
            setCliencodeList(resp?.payload?.result);
        });
    }, []);

    const onSubmit = (values) => {
        setDisable(true);

        dispatch(updateMfaStatus({
            client_code: values?.react_select?.value,
            mfa_status: values.mfa === "true",
        }))
            .then((res) => {
                console.log("res", res)
                if (res?.meta.requestStatus === "fulfilled") {
                    toastConfig.successToast(res?.payload?.message);
                } else {
                    toastConfig.errorToast(res?.payload?.message);
                }
            })
            .catch((err) => {
                toastConfig.errorToast("An error occurred while updating MFA status");
            })
            .finally(() => {
                setDisable(false);
            });
    };




    const options = [
        { value: "", label: "Select Client Code" },
        ...clientCodeList.map((data) => ({
            value: data.clientCode,
            label: `${data.clientCode} - ${data.name}`,
        })),
    ];

    const mfaAssign = [{ key: "", value: "Select" },
    { key: "true", value: "True" },
    { key: "false", value: "False" }
    ]
    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">MFA</h5>
                    </div>
                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
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

                                        </div>
                                        <div className="col-lg-3">
                                            <FormikController
                                                control="select"
                                                name="mfa"
                                                options={mfaAssign}
                                                className="form-select"
                                                label="MFA Status"
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
                                                        ariaHidden="true"
                                                    ></span>
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
                <div></div>
            </main>
        </section>
    );
};

export default Mfa;
