import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";

import { kycUserList } from "../../../slices/kycSlice";




const Disbursment = () => {
    const dispatch = useDispatch();
    const [responseData, setResponseData] = useState(null);
    const [clientCodeList, setCliencodeList] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const { kyc } = useSelector((state) => state);
    const KycList = kyc?.kycUserList;



    const initialValues = useMemo(() => ({
        rr_amount: "",
        react_select: "",
        business_cat_type: "",
        rolling_reserve_type: "",

        period_code: "",

    }), []);





    const handleChange = (selectedOption) => {

        const clientId = selectedOption ? selectedOption.value : null;
        setSelectedClientId(clientId);
        dispatch(kycUserList({ login_id: clientId, masking: 1 }));

    };




    useEffect(() => {
        dispatch(getAllCLientCodeSlice()).then((resp) => {
            setCliencodeList(resp?.payload?.result);
        });
    }, []);




    const options = [
        { value: "", label: "Select Client Code" },
        ...clientCodeList.map((data) => ({
            value: data.loginMasterId,
            label: `${data.clientCode} - ${data.name}`,
        })),
    ];

    const { address, city, state_name, pin_code } = KycList?.merchant_address_details || {};

    const clientAddress = [address, city, state_name, pin_code]
        .filter((item) => typeof item === 'string' && item.trim() || typeof item === 'number') // Keep numbers and non-empty strings
        .join(', ');




    useEffect(() => {
        const postData = {
            clientName: KycList?.clientName,
            clientCode: KycList?.clientCode,
            client_url: KycList?.website_app_url,
            clientEmail: KycList.emailId,
            clientMobileNo: KycList.contactNumber,
            clientAddress: clientAddress,
            clientPanNo: KycList.panCard,
            clientLegalName: KycList?.companyName,
            clientOwnershipType: KycList.business_type_name,
            latitude: KycList.latitude,
            longitude: KycList.longitude,
            mcc: KycList?.result?.mcc_code?.mcc,
            clientId: KycList?.clientId,
            "clientDob": KycList?.authorized_person_dob,
            "clientDoi": KycList?.pan_dob_or_doi,

            "collectionModes": "UPI",
            "turnoverType": "LARGE",
            "clientType": "CORPORATE",
            "acceptanceType": "ONLINE",
            "subMerchantId": "",
            "bankName": "YESBANK",
            "actionName": "PA_ADD_MERCHANT",

        }
        setResponseData(postData);





    }, [KycList])


    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">Disbursment</h5>
                    </div>
                    <div className="container-fluid p-0 mt-4">
                        <div className="card">

                            <div className="card-body">
                                <Formik
                                    initialValues={initialValues}


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


                                        </Form>
                                    )}


                                </Formik>

                            </div>
                        </div>
                    </div>





                </div>
                <div>

                    <h6 className="mt-3">Response</h6>
                    <pre className="w-100 bg-light p-3 border rounded">
                        {JSON.stringify(responseData, "", 2)}
                    </pre>

                </div>
            </main>
        </section >
    );
};

export default Disbursment;
