import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
// import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import FormikController from "../../../_components/formik/FormikController";
import { businessCategoryType } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { axiosInstance } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import toastConfig from "../../../utilities/toastTypes";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import { updateRollingReserveApi } from "./UpdateRollingReserveSlice/UpdateRollingReserveSlice";




const UpdateRollingReserve = () => {
    const dispatch = useDispatch();
    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [assignedAccountManger, setAssignedAccountManger] = useState("");
    const [parentClientCode, setParentClientCode] = useState([]);
    const [selectedRefBy, setSelectedRefBy] = useState(null);
    const [rollingResPeriod, setRollingResPeriod] = useState([]);
    const { approverDashboard, kyc, verifierApproverTab } = useSelector((state) => state);
    const currenTab = parseInt(verifierApproverTab?.currenTab);

    useEffect(() => {
        dispatch(businessCategoryType());
        // set parent client code
        // axiosInstance.get(API_URL.fetchParentClientCodes)
        //     .then((resp) => {
        //         setParentClientCode(resp.data);
        //     })
        //     .catch((err) => toastConfig.errorToast("Parent Client Code not found. Please try again after some time"));


        // set rolling reserve period
        axiosInstanceJWT.get(API_URL.rollingReservePeriod).then((resp) => {
            setRollingResPeriod(resp.data)
        }).catch(err => toastConfig.errorToast("Rolling reserve period not found. Please try again after some time"))
    }, [dispatch]);

    const amtTypeOptions = useMemo(() => [
        { key: "", value: "Select" },
        { key: "Percentage", value: "Percentage" },
        { key: "Fixed", value: "Fixed" }
    ], []);

    const initialValues = useMemo(() => ({
        rr_amount: "",
        react_select: "",
        business_cat_type: "",
        rolling_reserve_type: "",
        // parent_client_code: "",
        period_code: ""
    }), []);

    const validationSchema = useMemo(() => Yup.object({

        business_cat_type: Yup.string().required("Required").nullable(),
        react_select: Yup.object().required("Required").nullable(),
        rolling_reserve_type: Yup.string().required("Required").nullable(),
        period_code: Yup.string().required("Required").nullable(),
        rr_amount: Yup.string().required("Required").nullable(),

    }), []);





    // let initialValues = {
    //     react_select: "",
    //     login_master: "",
    // };

    // const validationSchema = Yup.object().shape({

    //     react_select: Yup.object().required("Required").nullable(),
    // });

    const handleChange = (selectedOption) => {
        const clientId = selectedOption ? selectedOption.value : null;
        setSelectedClientId(clientId);


    };


    const businessCategoryOption = useMemo(() =>
        convertToFormikSelectJson("id", "category_name", approverDashboard?.businessCategoryType), [approverDashboard?.businessCategoryType]);

    const rollingReservePeriodOption = useMemo(() =>
        convertToFormikSelectJson("period_code", "period_name", rollingResPeriod), [rollingResPeriod]);

    useEffect(() => {
        dispatch(getAllCLientCodeSlice()).then((resp) => {
            setCliencodeList(resp?.payload?.result);
        });
    }, []);

    const onSubmit = (values) => {
        const postData = {
            "login_id": values?.react_select?.value,
            "rolling_reserve": values.period_code,
            "rolling_reserve_type": values.rolling_reserve_type,
            "period_code": values.period_code,
            "business_category_type": values.business_cat_type
        };

        dispatch(updateRollingReserveApi(postData)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                toastConfig.successToast(res.payload.message);
            } else {
                toastConfig.errorToast("Failed to update Rolling Reserve");
            }
        });
    };


    const options = [
        { value: "", label: "Select Client Code" },
        ...clientCodeList.map((data) => ({
            value: data.loginMasterId,
            label: `${data.clientCode} - ${data.name}`,
        })),
    ];
    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">Update Rolling Reserve</h5>
                    </div>
                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {(formik, isSubmitting) => (


                                < Form >
                                    {console.log(" isSubmitting", formik)}
                                    <div className="row mt-5">
                                        <div className="col-lg-3">
                                            <CustomReactSelect
                                                name="react_select"
                                                options={options}
                                                placeholder="Select Client Code"
                                                filterOption={createFilter({ ignoreAccents: false })}
                                                label="Client Code"
                                                onChange={handleChange}
                                            />
                                            {/* <div className="text-primary mb-3 mt-5 d-flex">
                                                {selectedClientId && (
                                                    <h6 className={``}>Current Account Manager</h6>
                                                )}
                                            </div> */}
                                            {/* {selectedClientId && (
                                                <h6 className="mt-3">
                                                    Name: {assignedAccountManger?.name || "NA"}
                                                </h6>
                                            )}
                                            {selectedClientId && (
                                                <h6 className="">
                                                    {" "}
                                                    Email: {assignedAccountManger?.email || "NA"}
                                                </h6>
                                            )} */}
                                        </div>

                                    </div>


                                    {selectedClientId &&
                                        <div>
                                            <div className='row'>
                                                <div className="col-md-4 g-3">
                                                    <FormikController
                                                        control="select"
                                                        name="period_code"
                                                        options={rollingReservePeriodOption}
                                                        className="form-select"
                                                        label="Rolling Reserve Period"

                                                    />
                                                </div>
                                                <div className="col-md-4 g-3">
                                                    <FormikController
                                                        control="select"
                                                        name="rolling_reserve_type"
                                                        options={amtTypeOptions}
                                                        className="form-select"
                                                        label="RR Amount Type"

                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-4 g-3">
                                                    <FormikController
                                                        control="input"
                                                        type="number"
                                                        name="rr_amount"
                                                        className="form-control"
                                                        label="Rolling Reserve"

                                                        onChange={(e) => {
                                                            formik.setFieldValue("rr_amount", e.target.value);
                                                            formik.setStatus(false);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4 g-3">
                                                    <FormikController
                                                        control="select"
                                                        name="business_cat_type"
                                                        options={businessCategoryOption}
                                                        className="form-select"
                                                        label="Business Category"

                                                        onChange={(e) => {
                                                            formik.setFieldValue("business_cat_type", e.target.value);
                                                            formik.setStatus(false);
                                                        }}
                                                    />
                                                </div>
                                            </div>


                                            <div className='row mt-3'>
                                                <div className="col-md-4">


                                                    <button type="submit" className="btn cob-btn-primary btn-sm" disabled={formik.isSubmitting}>
                                                        {formik?.isSubmitting && (
                                                            <span
                                                                className="spinner-border spinner-border-sm mr-1"
                                                                role="status"
                                                                ariaHidden="true"
                                                            ></span>
                                                        )}

                                                        Save</button>

                                                </div>
                                            </div>
                                        </div>}
                                </Form>
                            )}
                        </Formik>
                    </div>



                </div>
                <div></div>
            </main>
        </section >
    );
};

export default UpdateRollingReserve;
