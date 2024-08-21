import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import CustomReactSelect from '../../_components/formik/components/CustomReactSelect';
import { getAllCLientCodeSlice } from '../../slices/approver-dashboard/approverDashboardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { kycUserList } from '../../slices/kycSlice';
import { createFilter } from 'react-select';
import FormikController from '../../_components/formik/FormikController';

const IpWhiteList = () => {

    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const[showInput,setShowInput]=useState(false)
    
    const { kyc } = useSelector((state) => state);
    const KycList = kyc?.kycUserList;
    

    const dispatch = useDispatch();

    const initialValues = {
        react_select: "",
        website_app_url: KycList?.website_app_url
    };

    useEffect(() => {
        dispatch(getAllCLientCodeSlice()).then((resp) => {
            setCliencodeList(resp?.payload?.result);
        });
    }, []);

    useEffect(() => {
        if (selectedId) {
            dispatch(kycUserList({ login_id: selectedId }));
        }
    }, [selectedId]);

   

    const handleSelectChange = (selectedOption) => {
        setSelectedId(selectedOption ? selectedOption.value : null);
        setShowInput(true)
    };

    const clientCodeOption = [
        { value: '', label: 'Select Client Code' },
        ...clientCodeList.map((data) => ({
            value: data.loginMasterId,
            label: `${data.clientCode} - ${data.name}`
        }))
    ];

    const onSubmit = (values) => {
        console.log('Form Data', values);
    };

    return (
        <section className="">
            <main className="">
                <h5 className="">IP WhiteList</h5>
                <section className="">
                    <div className="container-fluid p-0">
                        <div className="row">
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onSubmit}
                                enableReinitialize={true}
                            >
                                {(formik) => {
                                  
                                    return (
                                        <Form>
                                            <div className="form-row mt-4">
                                                <div className="form-group col-lg-4">
                                                    <CustomReactSelect
                                                        name="react_select"
                                                        options={clientCodeOption}
                                                        placeholder="Select Client Code"
                                                        filterOption={createFilter({ ignoreAccents: false })}
                                                        label="Select Client Code"
                                                        onChange={handleSelectChange}
                                                    />
                                                </div>
                                            </div>
                                            {showInput &&
                                            <div className="form-row mt-3">
                                                <div className="form-group col-md-12 col-sm-12 col-lg-4">
                                                    <label className="col-form-label mt-0 p-2">
                                                        Website<span className="text-danger"> </span>
                                                    </label>

                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="website_app_url"
                                                        className="form-control"
                                                    />
                                                    <button
                                                        className="btn btn-sm text-white cob-btn-primary mt-4"
                                                        type="submit"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>}
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default IpWhiteList;
