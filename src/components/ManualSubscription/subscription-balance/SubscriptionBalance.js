/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch } from "react-redux";
// import FormikController from "../../../_components/formik/FormikController";
import { Formik, Form } from "formik";
// import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
// import { fetchPaymentMode, fetchBankName, getMidClientCode } from "../../../services/generate-mid/generate-mid.service";
import { createFilter } from 'react-select';
// import CustomModal from "../../../_components/custom_modal";
import Yup from "../../../_components/formik/Yup";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";

// import toastConfig from "../../../utilities/toastTypes";
// import { createMidApi } from "../../../slices/generateMidSlice";
// import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
// import API_URL from "../../../config";
import { subscriptionBalance } from "../../../services/approver-dashboard/subscription-balance/subscription-balance.service";
import Table from "../../../_components/table_components/table/Table";
import CustomLoader from "../../../_components/loader";
import { getMidClientCode } from "../../../services/generate-mid/generate-mid.service";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import { useDispatch, useSelector } from "react-redux";



function SubscriptionBalance() {

    const dispatch = useDispatch()
    const [clientCodeList, setCliencodeList] = useState([])
    const [balData, setBalData] = useState([]);
    const [loading, setLoading] = useState(false)

    const { approverDashboard, kyc, verifierApproverTab } = useSelector((state) => state);




    let initialValues = {
        client_code: ""
    };

    const validationSchema = Yup.object().shape({
        client_code: Yup.object().required("Required").nullable(),
    });


    useEffect(() => {
        dispatch(getAllCLientCodeSlice())
    }, [])


    const clientCodeOption = useMemo(() => [
        { value: '', label: 'Select Client Code' },
        ...approverDashboard?.clientCodeList.map((data) => ({
            value: data.clientCode,
            label: `${data.clientCode} - ${data.name}`
        }))
    ], [approverDashboard?.clientCodeList]);



    const onSubmit = async (values) => {
        try {
            setBalData([])
            setLoading(true)
            const respData = await subscriptionBalance({ clientCode: values.client_code?.value })
            setBalData(respData?.data?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }

    }



    const rowHeader = [
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row.client_code
        },
        {
            id: "4",
            name: "Client Name",
            selector: (row) => row.clientName,
        },

        {
            id: "3",
            name: "Charges",
            selector: (row) => parseFloat(row.charges).toFixed(2),
        },


        {
            id: "5",
            name: "Initial Subscription Amount",
            selector: (row) => parseFloat(row.initial_subscription_amount).toFixed(2),
        },

        {
            id: "6",
            name: "Updated Subscription Amount",
            selector: (row) => parseFloat(row.updated_subscription_amount).toFixed(2),
        },

    ];





    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="">
                        <h5>Subscription Balance</h5>
                    </div>
                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {(formik) => (
                                <Form className="mt-5">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <CustomReactSelect
                                                name="client_code"
                                                options={clientCodeOption}
                                                placeholder="Select Client Code"
                                                filterOption={createFilter({ ignoreAccents: false })}
                                                label="Client Code"
                                            />
                                        </div>
                                        <div className="col-lg-3 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-sm cob-btn-primary ">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="container p-0">
                    <div className="scroll overflow-auto">
                        {!loading && (
                            <>
                                {balData?.length > 0 && <h6>Total Balance : INR {parseFloat(balData[0]?.updated_subscription_amount).toFixed(2)}</h6>}
                                <Table
                                    row={rowHeader}
                                    data={balData}

                                />
                            </>
                        )}
                    </div>
                    <CustomLoader loadingState={loading} />
                </div>
            </main>

        </section>
    );
}

export default SubscriptionBalance;

