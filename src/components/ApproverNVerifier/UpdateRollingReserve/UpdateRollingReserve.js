import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import FormikController from "../../../_components/formik/FormikController";
import { businessCategoryType } from "../../../slices/approver-dashboard/approverDashboardSlice";
import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import toastConfig from "../../../utilities/toastTypes";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import { updateRollingReserveApi } from "./UpdateRollingReserveSlice/UpdateRollingReserveSlice";
import { kycUserList, clearKycState } from "../../../slices/kycSlice";
import CustomLoader from "../../../_components/loader";




const UpdateRollingReserve = () => {
    const dispatch = useDispatch();
    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [rollingResPeriod, setRollingResPeriod] = useState([]);
    const { approverDashboard } = useSelector((state) => state);
    const { kyc } = useSelector((state) => state);
    const KycList = kyc?.kycUserList;
    const loadingState = useSelector((state) => state.kyc.isLoadingState)



    const initialValues = useMemo(() => ({
        rr_amount: "",
        react_select: "",
        business_cat_type: "",
        rolling_reserve_type: "",

        period_code: "",

    }), []);

    const validationSchema = useMemo(() => Yup.object({

        business_cat_type: Yup.string().required("Required").nullable(),
        react_select: Yup.object().required("Required").nullable(),
        rolling_reserve_type: Yup.string().required("Required").nullable(),
        period_code: Yup.string().required("Required").nullable(),
        rr_amount: Yup.string().required("Required").nullable(),

    }), []);


    useEffect(() => {
        dispatch(businessCategoryType());

        axiosInstanceJWT.get(API_URL.rollingReservePeriod).then((resp) => {
            setRollingResPeriod(resp.data)
        }).catch(err => toastConfig.errorToast("Rolling reserve period not found. Please try again after some time"))
    }, [dispatch]);

    const amtTypeOptions = useMemo(() => [
        { key: "", value: "Select" },
        { key: "Percentage", value: "Percentage" },
        { key: "Fixed", value: "Fixed" }
    ], []);


    useEffect(() => {
        dispatch(clearKycState()); // Clear KYC data when the component mounts
        setSelectedClientId(null); // Reset selected client
    }, [dispatch]);




    const handleChange = (selectedOption) => {

        const clientId = selectedOption ? selectedOption.value : null;
        setSelectedClientId(clientId);
        dispatch(kycUserList({ login_id: clientId }));



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

    const onSubmit = (values, { setSubmitting }) => {
        const postData = {
            "login_id": values?.react_select?.value,
            "rolling_reserve": values.rr_amount,
            "rolling_reserve_type": values.rolling_reserve_type,
            "period_code": values.period_code,
            "business_category_type": values.business_cat_type
        };

        dispatch(updateRollingReserveApi(postData)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                toastConfig.successToast(res.payload.message);
                dispatch(kycUserList({ login_id: values?.react_select?.value }));
                setSubmitting(false);
            } else {
                toastConfig.errorToast("Failed to update Rolling Reserve");
                setSubmitting(false);
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
                    <div className="container-fluid p-0 mt-4">
                        <div className="card">

                            <div className="card-body">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {(formik) => (
                                        <Form>
                                            <div className="row mt-3">
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
                                            </div>

                                            {selectedClientId && (
                                                <div>
                                                    <div className="row">
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
                                                    <div className="row">
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

                                                    <div className="row mt-3">
                                                        <div className="col-md-4">
                                                            <button type="submit" className="btn cob-btn-primary approve text-white" disabled={formik.isSubmitting}>
                                                                {formik?.isSubmitting && (
                                                                    <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                                                )}
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Form>
                                    )}


                                </Formik>

                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <CustomLoader loadingState={loadingState} />
                        {KycList?.result?.loginMasterId && (

                            <div className="col-md-12">


                                <div className="card">


                                    <div className="card-body">
                                        <table className="table table-bordered table-responsive-sm mb-0">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Rolling Reserve</strong></td>
                                                    <td>{KycList?.rolling_reserve || "NA"}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Rolling Reserve Type</strong></td>
                                                    <td>{KycList?.
                                                        rolling_reserve_type || "NA"}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>




                </div>
                <div></div>
            </main>
        </section >
    );
};

export default UpdateRollingReserve;
