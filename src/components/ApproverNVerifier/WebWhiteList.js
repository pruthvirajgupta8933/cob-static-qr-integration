import React, { useState, useEffect } from 'react';
import { Formik, Form } from "formik";
import CustomReactSelect from '../../_components/formik/components/CustomReactSelect';
import { getAllCLientCodeSlice } from '../../slices/approver-dashboard/approverDashboardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { kycUserList, whiteListedWebsite } from '../../slices/kycSlice';
import { createFilter } from 'react-select';
import FormikController from '../../_components/formik/FormikController';
import { webWhiteListApi } from '../../services/webWhiteList/webWhiteList.service';
import { Regex, RegexMsg } from '../../_components/formik/ValidationRegex';
import Yup from '../../_components/formik/Yup';
import toastConfig from '../../utilities/toastTypes';
import Table from '../../_components/table_components/table/Table';

const WebWhiteList = () => {
    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [disable, setDisable] = useState(false)
    const [selectedClientCode, setSelectedClientCode] = useState("")

    const { kyc } = useSelector((state) => state);
    // const { user } = auth;
    // const { loginId } = user;
    const KycList = kyc?.kycUserList;
    const { merchantWhitelistWebsite } = kyc


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

        let arrLable = selectedOption.label?.split("-")
        let lableClientCode = arrLable[0].trim()

        setSelectedId(selectedOption.value);
        setSelectedClientCode(lableClientCode)
        dispatch(whiteListedWebsite({ clientCode: lableClientCode }))

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
                "client_code": selectedClientCode,
                "whitelist": values.website_app_url
            };
            const response = await webWhiteListApi(postData)
            dispatch(whiteListedWebsite({ clientCode: selectedClientCode }))
            toastConfig.successToast(response?.data?.message)
            setDisable(false)

        } catch (error) {
            setDisable(false)
            toastConfig.errorToast("Something went wrong")
        }
    };


    const listRow = [
        {
            id: "1",
            name: "URL",
            selector: (row) => row.clientName,
            sortable: true,
            // width: "170px"
        },
        {
            id: "2",
            name: "Status",
            cell: (row) => <div className="removeWhiteSpace">{row?.clientId === 1 ? "Active" : "Inactive"}</div>,
            width: "130px",
        },
        {
            id: "3",
            name: "Client Code",
            selector: (row) => row.clientCode,
            sortable: true,

        },
    ]



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

                            <div className="scroll overflow-auto z-0">
                                <Table
                                    row={listRow}
                                    data={merchantWhitelistWebsite}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default WebWhiteList;
