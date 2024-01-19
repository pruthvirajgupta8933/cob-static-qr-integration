import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
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
function BusinessDetailsOps({ setCurrentTab }) {
    const dispatch = useDispatch()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [avgTicketAmount, setAvgTicketAmount] = useState([]);
    const [transactionRangeOption, setTransactionRangeOption] = useState([]);
    const [platform, setPlatform] = useState([]);
    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const { businessDetails } = merchantReferralOnboardReducer
    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId
    const { merchantKycData } = kyc

    const initialValues = {
        pan_card: merchantKycData?.signatoryPAN ?? "",
        is_pan_verified: merchantKycData?.signatoryPAN ?? "",
        website: merchantKycData?.website_app_url ?? "",
        pan_name: "",
        platform_id: "",
        avg_ticket_size: "",
        expected_transactions: "",
    }

    const dropdownOptions = [
        { value: "Select", label: "" },
        // { value: "WordPress", label: "2" },
        // { value: "Android SDK", label: "4" },
        { value: "Java", label: "13" },
      ];

    const tooltipData = {
        "expected_transaction_yr": "Expected transaction/year refers to the estimated number of transactions that are anticipated to occur within a specific time frame, typically a year",
        "avg_ticket_amount": "Average ticket amount refers to the average value or amount spent per transaction or customer."
    }

    // const slabOptions = [
    //     { label: '0-1000', value: '0-1000' },
    //     { label: '1001-5000', value: '1001-5000' },

    // ];

    // const ticketOptions = [
    //     { label: '0-500', value: '0-500' },
    //     { label: '501-2000', value: '1001-5000' },
    // ];



    const validationSchema = Yup.object({
        pan_card: Yup.string().nullable(),
        website: Yup.string().nullable().required("Required"),
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
      console.log(err);
    }
  };

  const ticketOptions = convertToFormikSelectJson(
    "id",
    "slab_range",
    avgTicketAmount
  );

    const handleSubmit = (value) => {
       setSubmitLoader(true)
        const postData = {
            website_app_url: value.website,
            is_website_url: "True",
            pan_card: value.pan_card,
            login_id: merchantLoginId,
            updated_by: auth?.user?.loginId,
            platform_id: value.platform_id,
            avg_ticket_size: value.avg_ticket_size,
            expected_transactions: value.expected_transactions,

        }

        console.log("postData",postData)
        dispatch(businessDetailsSlice(postData)).then((resp) => {
            if (resp?.error?.message) {
                toastConfig.errorToast(resp?.error?.message)
                toastConfig.errorToast(resp?.payload?.toString()?.toUpperCase())
            }

            if (resp?.payload?.status === true) {
                toastConfig.successToast(resp?.payload?.message)
            }
        }).catch(err => toastConfig.errorToast("Something went wrong!"))
        setSubmitLoader(false)
        // tabHandler(4)
    }

    const trimFullName = (strOne, strTwo) => {
        let fullStr = isNull(strOne) ? "" : strOne
        fullStr += isNull(strTwo) ? "" : strTwo
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
            panValidate(val[key], "pan_name", setFieldValue);
        }
    };

    useEffect(() => {
        if (merchantLoginId !== "") {
            dispatch(kycDetailsByMerchantLoginId({ login_id: merchantLoginId }))
        }
    }, [merchantLoginId]);

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
                                        onChange={(e) => {
                                            setFieldValue("pan_card", e.target.value?.toString().toUpperCase())
                                            setFieldValue("is_pan_verified", "")
                                            setFieldValue("pan_name", "")
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
                                {values?.pan_name && (
                                    <p className="text-success mb-0">
                                        {values?.pan_name}
                                    </p>
                                )}
                            </div>
                            <div className="col-md-6">
                                <FormikController
                                    control="input"
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
                                    valueFlag={false}
                                    //   disabled={VerifyKycStatus === "Verified" ? true : false}
                                    //   readOnly={readOnly}
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
                                    options={slabOptions}
                                //   onClick={() => getExpectedTransactions(1)}
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
                                    // readOnly={readOnly}
                                    options={ticketOptions}

                                />
                            </div>
                             </div>
                        <div className="col-12 mt-4 mr-5">

                            <button type="submit" className="btn cob-btn-primary btn-sm">Save
                                {submitLoader && <>
                                    <span className="spinner-border spinner-border-sm" role="status"
                                        aria-hidden="true" />
                                    <span className="sr-only">Loading...</span>
                                </>}
                            </button>
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