import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    businessCategoryType,
    generalFormData,
    // getAllCLientCodeSlice
} from '../../../../slices/approver-dashboard/approverDashboardSlice';
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson';
import { Form, Formik } from 'formik';
import FormikController from '../../../../_components/formik/FormikController';
import Yup from '../../../../_components/formik/Yup';
import { toast } from 'react-toastify';
import { axiosInstance, axiosInstanceJWT } from '../../../../utilities/axiosInstance';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
import CustomReactSelect from '../../../../_components/formik/components/CustomReactSelect';
import { createFilter } from 'react-select';

const GeneralForm = ({ role }) => {
    const dispatch = useDispatch();
    const [parentClientCode, setParentClientCode] = useState([]);
    const [selectedRefBy, setSelectedRefBy] = useState(null);
    const [rollingResPeriod, setRollingResPeriod] = useState([]);
    const { approverDashboard, kyc, verifierApproverTab } = useSelector((state) => state);
    const currenTab = parseInt(verifierApproverTab?.currenTab);

    useEffect(() => {

        if (approverDashboard?.businessCategoryType?.length === 0) {
            dispatch(businessCategoryType());
        }
        // set parent client code
        axiosInstanceJWT.get(API_URL.fetchParentClientCodes)
            .then((resp) => {
                setParentClientCode(resp.data);
            })
            .catch((err) => toastConfig.errorToast("Parent Client Code not found. Please try again after some time"));


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
        rr_amount: kyc.kycUserList?.rolling_reserve ?? 0,
        business_cat_type: kyc.kycUserList?.business_category_type,
        rolling_reserve_type: kyc.kycUserList?.rolling_reserve_type,
        parent_client_code: "",
        period_code: kyc.kycUserList?.period_code
    }), [kyc.kycUserList]);

    const validationSchema = useMemo(() => Yup.object({
        rr_amount: Yup.string().nullable(),
        business_cat_type: Yup.string().required("Required").nullable(),
        parent_client_code: Yup.string().required("Required").nullable(),
        period_code: Yup.string().required("Required").nullable(),
        rolling_reserve_type: Yup.string().required("Required").nullable(),
        refer_by: Yup.string().nullable()
    }), []);

    const handleSubmit = useCallback((val) => {
        const saveGenData = {
            rr_amount: val.rr_amount === '' ? 0 : val.rr_amount,
            business_cat_type: val.business_cat_type,
            parent_client_code: val?.parent_client_code ?? 'COBED', // if not selected
            refer_by: selectedRefBy,
            rolling_reserve_type: val?.rolling_reserve_type,
            period_code: parseInt(val?.period_code),
            isFinalSubmit: true
        };
        dispatch(generalFormData(saveGenData));
        toast.success("Successfully updated");
    }, [dispatch, selectedRefBy]);

    const businessCategoryOption = useMemo(() =>
        convertToFormikSelectJson("id", "category_name", approverDashboard?.businessCategoryType), [approverDashboard?.businessCategoryType]);

    const parentClientCodeOption = useMemo(() =>
        convertToFormikSelectJson("clientCode", "clientName", parentClientCode), [parentClientCode]);

    // console.log("parentClientCodeOption", parentClientCodeOption)
    const rollingReservePeriodOption = useMemo(() =>
        convertToFormikSelectJson("period_code", "period_name", rollingResPeriod), [rollingResPeriod]);

    const clientCodeOption = useMemo(() => [
        { value: '', label: 'Select Client Code' },
        ...approverDashboard?.clientCodeList.map((data) => ({
            value: data.loginMasterId,
            label: `${data.clientCode} - ${data.name}`
        }))
    ], [approverDashboard?.clientCodeList]);

    const handleSelectChange = useCallback((selectedOption) => {
        setSelectedRefBy(selectedOption ? selectedOption.value : null);
    }, []);

    return (
        <div className="row mb-4 border p-1">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setStatus }) => {
                    setStatus(true);
                    handleSubmit(values);
                }}
                enableReinitialize
            >
                {(formik) => (
                    <div>
                        <Form>
                            <div className='row'>
                                <div className="col-md-4 g-3">
                                    <FormikController
                                        control="select"
                                        name="period_code"
                                        options={rollingReservePeriodOption}
                                        className="form-select"
                                        label="Rolling Reserve Period"
                                        disabled={!role?.approver}
                                    />
                                </div>
                                <div className="col-md-4 g-3">
                                    <FormikController
                                        control="select"
                                        name="rolling_reserve_type"
                                        options={amtTypeOptions}
                                        className="form-select"
                                        label="RR Amount Type"
                                        disabled={!role?.approver}
                                    />
                                </div>
                                <div className="col-md-4 g-3">
                                    <FormikController
                                        control="input"
                                        type="number"
                                        name="rr_amount"
                                        className="form-control"
                                        label="Rolling Reserve"
                                        disabled={!role?.approver}
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
                                        disabled={!role?.approver}
                                        onChange={(e) => {
                                            formik.setFieldValue("business_cat_type", e.target.value);
                                            formik.setStatus(false);
                                        }}
                                    />
                                </div>
                                <div className="col-md-4 g-3">
                                    <CustomReactSelect
                                        name="react_select"
                                        options={clientCodeOption}
                                        placeholder="Select Client Code"
                                        filterOption={createFilter({ ignoreAccents: false })}
                                        label="Refer by (if any)"
                                        onChange={handleSelectChange}
                                    />
                                </div>
                                <div className="col-md-4 g-3">
                                    <FormikController
                                        control="select"
                                        name="parent_client_code"
                                        options={parentClientCodeOption}
                                        className="form-select"
                                        label="Rate Mapping Client Code"
                                        disabled={!role?.approver}
                                        onChange={(e) => {
                                            formik.setFieldValue("parent_client_code", e.target.value);
                                            formik.setStatus(false);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className="col-md-4">
                                    {role?.approver && currenTab === 4 && !formik.status && (
                                        <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    );
};

export default GeneralForm;
