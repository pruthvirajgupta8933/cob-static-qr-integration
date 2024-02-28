import React, { useEffect, useState } from 'react'
import { Formik, Field, Form } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { useDispatch, useSelector } from 'react-redux';
import { businessDetailsSlice } from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import verifiedIcon from "../../../../../../assets/images/verified.png"
import { kycDetailsByMerchantLoginId, panValidation, platformType, } from '../../../../../../slices/kycSlice';
import { isNull } from 'lodash';
import { toast } from 'react-toastify';
import toastConfig from "../../../../../../utilities/toastTypes";
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import kycOperationService from '../../../../../../services/kycOperation.service';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex'
function BusinessDetailsOps({ setCurrentTab, isEditableInput }) {
    const dispatch = useDispatch()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [avgTicketAmount, setAvgTicketAmount] = useState([]);
    const [transactionRangeOption, setTransactionRangeOption] = useState([]);
    const [platform, setPlatform] = useState([]);
    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const { businessDetails } = merchantReferralOnboardReducer
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId
    const { merchantKycData } = kyc

    // console.log("merchantKycData", merchantKycData)
    const initialValues = {
        pan_card: merchantKycData?.signatoryPAN ?? "",
        is_pan_verified: merchantKycData?.signatoryPAN ?? "",
        website: merchantKycData?.website_app_url ?? "",
        name_on_pancard: merchantKycData?.nameOnPanCard ?? "",
        platform_id: merchantKycData?.platformId ?? "",
        avg_ticket_size: merchantKycData?.avg_ticket_size ?? "",
        expected_transactions: merchantKycData?.expectedTransactions ?? "",
    }


    const tooltipData = {
        "expected_transaction_yr": "Expected transaction/year refers to the estimated number of transactions that are anticipated to occur within a specific time frame, typically a year",
        "avg_ticket_amount": "Average ticket amount refers to the average value or amount spent per transaction or customer."
    }


    const validationSchema = Yup.object({
        pan_card: Yup.string()
        .nullable()
        .required("Required")
        .max(10, "PAN should be exactly 10 characters long"),
        website: Yup.string()
            .nullable()
            .required('Website is required')
            .matches(
                Regex.urlFormate, RegexMsg.urlFormate
            ),
        is_pan_verified: Yup.string().nullable(),
        platform_id: Yup.string()
            .required("Select the platform")
            .nullable(),
        expected_transactions: Yup.string().trim().required("Required").nullable(),
        avg_ticket_size: Yup.string()
            .trim()
            .required("Required").nullable(),
    })
    //////////////////APi for Platform
    useEffect(() => {
        dispatch(platformType())
            .then((resp) => {
                const data = convertToFormikSelectJson(
                    "platformId",
                    "platformName",
                    resp.payload
                );
                setPlatform(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const slabOptions = convertToFormikSelectJson(
        "id",
        "slab_range",
        transactionRangeOption
    );

    useEffect(() => {
        getExpectedTransactions("1");
        getExpectedTransactions("2");
    }, []);
    const getExpectedTransactions = async (slabId) => {
        try {
            const response = await kycOperationService.expectedTransactions(slabId);
            if (response.status === 200) {
                if (slabId == 1) {
                    setTransactionRangeOption(response.data.data);
                } else if (slabId == 2) {
                    setAvgTicketAmount(response.data.data);
                }
            }
        } catch (err) {
            // console.log(err);
        }
    };

    const ticketOptions = convertToFormikSelectJson(
        "id",
        "slab_range",
        avgTicketAmount
    );

    const handleSubmit = (value) => {
        setSubmitLoader(true)

        if (value.is_pan_verified === "") {
            // PAN card is not verified, show an error message and stop submission
            toastConfig.errorToast("Please verify your PAN before submitting the form.");
            setSubmitLoader(false); // Stop loader
            return; // Exit the function, do not proceed with submission
        }


        const postData = {
            website_app_url: value.website,
            is_website_url: "True",
            pan_card: value.pan_card,
            login_id: merchantLoginId,
            updated_by: auth?.user?.loginId,
            platform_id: value.platform_id,
            avg_ticket_size: value.avg_ticket_size,
            expected_transactions: value.expected_transactions,
            name_on_pancard: value.name_on_pancard
        }


        dispatch(businessDetailsSlice(postData)).then((resp) => {
            if (resp?.payload?.detail) {
                toastConfig.errorToast(resp?.payload?.detail)
            }

            if (resp?.payload?.status === true) {
                toastConfig.successToast(resp?.payload?.message)
                dispatch(kycDetailsByMerchantLoginId({ login_id: merchantLoginId, password_required: true }))
            }
        }).catch(err => toastConfig.errorToast("Something went wrong!"))
        setSubmitLoader(false)
        // tabHandler(4)

    }

    const trimFullName = (strOne, strTwo) => {
        let fullStr = isNull(strOne) ? "" : strOne
        fullStr += isNull(strTwo) ? "" : " " + strTwo
        return fullStr
    }

    const panValidate = (values, key, setFieldValue) => {
        dispatch(
            panValidation({
                pan_number: values,
            })
        ).then((res) => {
            if (
                res.meta.requestStatus === "fulfilled" &&
                res.payload.status === true &&
                res.payload.valid === true
            ) {
                const fullNameByPan = trimFullName(res?.payload?.first_name, res?.payload?.last_name)
                // console.log(key, fullNameByPan)
                setFieldValue(key, fullNameByPan)
                setFieldValue("pan_card", values)
                setFieldValue("is_pan_verified", 1)
                toast.success(res?.payload?.message);
            } else {
                setFieldValue(key, "")
                setFieldValue("is_pan_verified", "")
                toast.error(res?.payload?.message);
            }
        }).catch(err => { console.log("err", err) })
        // setRegisterWithGstState(false)
    };

    const checkInputIsValid = async (err, val, setErr, setFieldTouched, key, setFieldValue = () => { }) => {
        const hasErr = err.hasOwnProperty(key);
        const fieldVal = val[key];
        let isValidVal = true;
        if (fieldVal === null || fieldVal === undefined) {
            isValidVal = false;
            setFieldTouched(key, true);
        }
        if (hasErr) {
            if (val[key] === "") {
                setErr(key, true);
            }
        }
        if (!hasErr && isValidVal && val[key] !== "" && key === "pan_card") {
            // for  -Business PAN 
            panValidate(val[key], "name_on_pancard", setFieldValue);
        }
    };

    // useEffect(() => {
    //     if (merchantLoginId !== "") {
    //         dispatch(kycDetailsByMerchantLoginId({ login_id: merchantLoginId ,password_required: true}))
    //     }
    // }, [merchantLoginId]);

    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({
                    values,
                    setFieldValue,
                    errors,
                    setFieldError,
                    setFieldTouched
                }) => (
                    <Form>
                        <div className="row g-3">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <label className="col-form-label mt-0 py-1">
                                    PAN <span className="text-danger"></span>
                                </label>
                                <div className="input-group">
                                    <Field
                                        type="text"
                                        name="pan_card"
                                        className="form-control"
                                        disabled={isEditableInput}
                                        onChange={(e) => {
                                            setFieldValue("pan_card", e.target.value?.toString().toUpperCase())
                                            setFieldValue("is_pan_verified", "")
                                            setFieldValue("name_on_pancard", "")
                                        }}
                                    />

                                    {(values?.pan_card !== null &&
                                        values?.pan_card !== "" &&
                                        values?.pan_card !== undefined &&
                                        !errors.hasOwnProperty("pan_card") &&
                                        !errors.hasOwnProperty("is_pan_verified") &&

                                        (values?.is_pan_verified !== "")) ?
                                        <span className="success input-group-append">
                                            <img src={verifiedIcon} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                                        </span>
                                        : <div className="input-group-append">
                                            <a
                                                href={() => false}
                                                className="btn cob-btn-primary text-white btn btn-sm"
                                                onClick={() => {
                                                    checkInputIsValid(
                                                        errors,
                                                        values,
                                                        setFieldError,
                                                        setFieldTouched,
                                                        "pan_card",
                                                        setFieldValue
                                                    );
                                                }}
                                            >
                                                Verify
                                            </a>
                                        </div>}
                                </div>

                                {errors?.pan_card && (
                                    <p className="notVerifiedtext- text-danger mb-0">
                                        {errors?.pan_card}
                                    </p>
                                )}

                                {errors?.is_pan_verified && (
                                    <p className="notVerifiedtext- text-danger mb-0">
                                        {errors?.is_pan_verified}
                                    </p>
                                )}
                                {values?.name_on_pancard && (
                                    <p className="text-success mb-0">
                                        {values?.name_on_pancard}
                                    </p>
                                )}
                            </div>
                            <div className="col-md-6">
                                <FormikController
                                    control="input"
                                    disabled={isEditableInput}
                                    type="text"
                                    name="website"
                                    className="form-control"
                                    label="Website"
                                    placeholder="Enter Website URL"
                                />
                            </div>
                            <div></div>

                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-4">
                                <label className="col-form-label p-2 mt-0">
                                    Platform Type<span className="text-danger">*</span>
                                </label>

                                <FormikController
                                    control="select"
                                    name="platform_id"
                                    className="form-select"
                                    disabled={isEditableInput}
                                    valueFlag={false}
                                    options={platform}

                                />
                            </div>

                            <div className="col-sm-12 col-md-12 col-lg-4">
                                <label className="col-form-label p-2 mt-0" data-tip={tooltipData.expected_transaction_yr}>
                                    Expected Trans./Year
                                    <span className="text-danger">*</span>
                                </label>

                                <FormikController
                                    control="select"
                                    name="expected_transactions"
                                    valueFlag={true}
                                    className="form-select form-control"
                                    disabled={isEditableInput}
                                    options={slabOptions}
                                />
                            </div>

                            <div className="col-sm-12 col-md-12 col-lg-4">
                                <label className="col-form-label p-2 mt-0" data-tip={tooltipData.avg_ticket_amount}>
                                    Avg Ticket Amount<span className="text-danger">*</span>
                                </label>

                                <FormikController
                                    control="select"
                                    type="text"
                                    name="avg_ticket_size"
                                    className="form-select form-control"
                                    valueFlag={true}
                                    disabled={isEditableInput}
                                    options={ticketOptions}
                                />
                            </div>
                        </div>
                        <div className="col-12 mt-4 mr-5">
                            {!isEditableInput &&
                                <button type="submit" className="btn cob-btn-primary btn-sm">Save
                                    {submitLoader && <>
                                        <span className="spinner-border spinner-border-sm" role="status"
                                            aria-hidden="true" />
                                        <span className="sr-only">Loading...</span>
                                    </>}
                                </button>
                            }
                            {businessDetails?.resp?.status === true &&
                                <a className="btn active-secondary btn-sm m-2" onClick={() => setCurrentTab(4)}>Next</a>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BusinessDetailsOps