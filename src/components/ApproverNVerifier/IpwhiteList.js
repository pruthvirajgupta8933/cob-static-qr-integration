import React, { useState, useEffect } from 'react';
import { Formik, Form } from "formik";
import CustomReactSelect from '../../_components/formik/components/CustomReactSelect';
import { getAllCLientCodeSlice } from '../../slices/approver-dashboard/approverDashboardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { kycUserList } from '../../slices/kycSlice';
import { createFilter } from 'react-select';
import FormikController from '../../_components/formik/FormikController';
import { ipWhiteListApi } from '../../services/ipWhiteList/ipWhiteList.service';
import { Regex, RegexMsg } from '../../_components/formik/ValidationRegex';
import Yup from '../../_components/formik/Yup';
import toastConfig from '../../utilities/toastTypes';

const IpWhiteList = () => {
    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [disable, setDisable] = useState(false)
    const { auth, kyc } = useSelector((state) => state);
    const { user } = auth;
    const { loginId } = user;
    const KycList = kyc?.kycUserList;

    const dispatch = useDispatch();

    const initialValues = {
        website_app_url: KycList?.website_app_url || ''
    };

    const validationSchema = Yup.object().shape({
        website_app_url: Yup.string()
            .matches(Regex.urlFormate, RegexMsg.urlFormate)
            .test('is-url', 'Please enter a valid website URL', (value) => {
                if (!value) return true;
                try {
                    new URL(value);
                    return true;
                } catch (error) {
                    return false;
                }
            })
            .nullable().required("Required").allowOneSpace(),
    });

    useEffect(() => {
        dispatch(getAllCLientCodeSlice()).then((resp) => {
            setCliencodeList(resp?.payload?.result);
        });
    }, [dispatch]);

    useEffect(() => {
        if (selectedId) {
            dispatch(kycUserList({ login_id: selectedId }));
        }
    }, [selectedId, dispatch]);

    const handleSelectChange = (selectedOption, formik) => {
        setSelectedId(selectedOption ? selectedOption.value : null);
        setShowInput(true);
        // Update the website_app_url field when client code changes
        formik.setFieldValue('website_app_url', KycList?.website_app_url || '');
    };

    const clientCodeOption = [
        { value: '', label: 'Select Client Code' },
        ...clientCodeList?.map((data) => ({
            value: data?.loginMasterId,
            label: `${data?.clientCode} - ${data?.name}`
        }))
    ];

    const onSubmit = async (values) => {
        setDisable(true)
        try {
            const postData = {
                "pclientid": KycList?.clientId,
                "purl": values.website_app_url,
                "pdoneby": loginId
            };
            const response = await ipWhiteListApi(postData)
            toastConfig.successToast("Website whitelisted successfully")
            setDisable(false)
            
        } catch (error) {
            setDisable(false)
            toastConfig.errorToast("Something went wrong")
        }
    };

    return (
        <section className="">
            <main className="">
                <h5 className="">Website whitelist</h5>
                <section className="">
                    <div className="container-fluid p-0">
                        <div className="row">
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onSubmit}
                                enableReinitialize={true}
                                validationSchema={validationSchema}
                            >
                                {(formik) => (
                                    <Form>
                                        <div className="form-row mt-4">
                                            <div className="form-group col-lg-4">
                                                <CustomReactSelect
                                                    name="react_select"
                                                    options={clientCodeOption}
                                                    placeholder="Select Client Code"
                                                    filterOption={createFilter({ ignoreAccents: false })}
                                                    label="Select Client Code"
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption, formik)}
                                                />
                                            </div>
                                        </div>
                                        {showInput &&
                                            <div className="form-row">
                                                <div className="form-group col-md-12 col-sm-12 col-lg-4">
                                                    <label className="col-form-label mt-0 p-2">
                                                        Website App URL<span className="text-danger"> </span>
                                                    </label>

                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="website_app_url"
                                                        className="form-control"
                                                        placeholder="Enter Website APP URL"
                                                    />
                                                    <button
                                                        className="btn btn-sm text-white cob-btn-primary mt-4"
                                                        type="submit"
                                                        disabled={disable}
                                                    >
                                                        {disable && (
                                                            <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                                                        )}
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default IpWhiteList;
