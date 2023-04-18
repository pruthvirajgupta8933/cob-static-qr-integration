import React, { useState } from 'react'
import NavBar from '../dashboard/NavBar/NavBar'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import moment from "moment";
import * as Yup from "yup";
import { toast } from "react-toastify";

import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceJWT } from '../../utilities/axiosInstance';
import { exportToSpreadsheet } from '../../utilities/exportToSpreadsheet';
// import toastConfig from '../../utilities/toastTypes';


const validationSchema = Yup.object({
    start_date: Yup.date().required("Required").nullable(),
    end_date: Yup.date()
        .min(Yup.ref("start_date"), "End date can't be before Start date")
        .required("Required"),

})
const BizzAppData = () => {
    const [FormData, setFormData] = useState([]);

    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");

    const [show, setShow] = useState(false)
    const initialValues = {
        start_date: splitDate,
        end_date: splitDate,

    }



    const handleSubmit = (values) => {
        const postData = {
            "start_date": values.start_date,
            "end_date": values.end_date

        };
        let apiRes = axiosInstanceJWT
            .post(API_URL.GET_BIZZ_DATA, postData).then((resp) => {
                setFormData(resp?.data.results)
                setShow(true)

            }).catch((error) => {
                apiRes = error.response;
                toast.error(apiRes?.data?.message)
            })
    }

    const exportToExcelFn = () => {
        const excelHeaderRow = [
            "S. No.",
            "Merchant Business Name",
            "Merchant Legal Name",
            "Merchant Address",
            "Product Name",
            "Types Of Entity",
            "Year Of Establishment",
            "Merchant Portal",
            "Average Transaction Amount",
            "Expected Transactions Numbers",
            "Annual Transaction Value",
            "Account Details",
            "Authorized Person Name",
            "Authorized Person Email Id",
            "Authorized Person Contact Number",
            "Technical Person Name",
            "Technical Person Email Id",
            "Technical Person Contact Number",
            "Mcc",
            "Nature  of Business",
            "Zone",
            "Entity Pan Card Number",
            "GST Number",
            "Created On"
        ];
        let excelArr = [excelHeaderRow];
        // eslint-disable-next-line array-callback-return
        FormData.map((SingleFormData, index) => {

            const allowDataToShow = {
                srNo: index + 1,
                merchant_business_name: SingleFormData?.merchant_business_name === null ? "" : SingleFormData?.merchant_business_name,
                merchant_legal_name: SingleFormData?.merchant_legal_name === null ? "" : SingleFormData?.merchant_legal_name,
                merchant_address: SingleFormData?.merchant_address === null ? "" : SingleFormData?.merchant_address,
                product_name: SingleFormData?.product_name === null ? "" : SingleFormData?.product_name,
                types_of_entity: SingleFormData?.types_of_entity === null ? "" : SingleFormData?.types_of_entity,
                year_of_establishment: SingleFormData?.year_of_establishment === null ? "" : SingleFormData?.year_of_establishment,
                merchant_portal: SingleFormData?.merchant_portal === null ? "" : SingleFormData?.merchant_portal,
                average_transaction_amount: SingleFormData?.average_transaction_amount === null ? "" : SingleFormData?.average_transaction_amount,
                expected_transactions_numbers: SingleFormData?.expected_transactions_numbers === null ? "" : SingleFormData?.expected_transactions_numbers,
                annual_transaction_value: SingleFormData?.annual_transaction_value === null ? "" : SingleFormData?.annual_transaction_value,
                account_details: SingleFormData?.account_details === null ? "" : SingleFormData?.account_details,
                authorized_contact_person_name: SingleFormData?.authorized_contact_person_name === null ? "" : SingleFormData?.authorized_contact_person_name,
                authorized_contact_person_email_id: SingleFormData?.authorized_contact_person_email_id === null ? "" : SingleFormData?.authorized_contact_person_email_id,
                authorized_contact_person_contact_number: SingleFormData?.authorized_contact_person_contact_number === null ? "" : SingleFormData?.authorized_contact_person_contact_number,
                technical_contact_person_name: SingleFormData?.technical_contact_person_name === null ? "" : SingleFormData?.technical_contact_person_name,
                technical_contact_person_email_id: SingleFormData?.technical_contact_person_email_id === null ? "" : SingleFormData?.technical_contact_person_email_id,
                technical_contact_person_contact_number: SingleFormData?.technical_contact_person_contact_number === null ? "" : SingleFormData?.technical_contact_person_contact_number,
                mcc: SingleFormData?.mcc === null ? "" : SingleFormData?.mcc,
                nature_of_business: SingleFormData?.nature_of_business === null ? "" : SingleFormData?.nature_of_business,
                zone: SingleFormData?.zone === null ? "" : SingleFormData?.zone,
                entity_pan_card_number: SingleFormData?.entity_pan_card_number === null ? "" : SingleFormData?.entity_pan_card_number,
                gst_number: SingleFormData?.gst_number === null ? "" : SingleFormData?.gst_number,
                created_on: SingleFormData?.created_on === null ? "" : SingleFormData?.created_on,
            }
            excelArr.push(Object.values(allowDataToShow));
        });
        const fileName = "Bizz-App-Data";
        exportToSpreadsheet(excelArr, fileName);
    };




    return (
        <section className="ant-layout">
            <div>
                <NavBar />
            </div>
            <main className="gx-layout-content ant-layout-content">
                <div className="gx-main-content-wrapper">
                    <div className="right_layout my_account_wrapper right_side_heading">
                        <h1 className="btn approve text-white btn-xs">Bizz App Data</h1>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values)

                        }}
                        enableReinitialize={true}
                    >
                        <Form>
                            <div className="container">
                                <div className="row">

                                    <div className="form-group col-md-4">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="From Date"
                                            name="start_date"
                                            className="form-control rounded-0"
                                        // value={startDate}
                                        // onChange={(e)=>setStartDate(e.target.value)}
                                        />

                                    </div>

                                    <div className="form-group col-md-4 mx-4">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="End Date"
                                            name="end_date"
                                            className="form-control rounded-0"
                                        />
                                    </div>
                                    <div className=" col-md-4 ">
                                        <button type="subbmit" className="btn approve text-white btn-xs">Submit</button>
                                           {FormData?.length > 0 ? (
                                                <button
                                                className="btn btn-sm text-white"
                                                type="button"
                                                onClick={() => exportToExcelFn()}
                                                style={{ backgroundColor: "rgb(1, 86, 179)" }}
                                            >
                                                Export
                                            </button> ) : <></>}

                                    </div>
                                    
                                </div>
                                {FormData?.length === 0 || FormData?.length === undefined ? <></> : <h4>Total Records :  {FormData?.length}</h4>}

                            </div>
                        </Form>

                    </Formik>
                    <div className="col-md-12 col-md-offset-4">
                        <div className="scroll overflow-auto">
                            {show === true ? (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>S. No.</th>
                                            <th>Merchant Business Name</th>
                                            <th>Merchant Legal Name</th>
                                            <th>Merchant Address</th>
                                            <th>Product Name</th>
                                            <th>Types Of Entity</th>
                                            <th>Year Of Establishment</th>
                                            <th>Merchant Portal</th>
                                            <th>Average Transaction Amount</th>
                                            <th>Expected Transactions Numbers</th>
                                            <th>Annual Transaction Value</th>
                                            <th>Account Details</th>
                                            <th>Authorized Person Name</th>
                                            <th>Authorized Person Email Id</th>
                                            <th>Authorized Person Contact Number</th>
                                            <th>Technical Person Name</th>
                                            <th>Technical Person Email Id</th>
                                            <th>Technical Person Contact Number</th>
                                            <th>Mcc</th>
                                            <th>Nature  of Business</th>
                                            <th>Zone</th>
                                            <th>Entity Pan Card Number</th>
                                            <th>GST Number</th>
                                            <th>Created On</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {FormData?.length === 0 || FormData?.length === undefined ? (
                                            <tr>
                                                <td colSpan={"8"}>
                                                    <h1 className="nodatafound">No data found</h1>
                                                </td>
                                            </tr>
                                        ) :
                                            (
                                                FormData?.map((SingleFormData, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{SingleFormData?.merchant_business_name}</td>
                                                        <td>{SingleFormData?.merchant_legal_name}</td>
                                                        <td>{SingleFormData?.merchant_address}</td>
                                                        <td>{SingleFormData?.product_name}</td>
                                                        <td>{SingleFormData?.types_of_entity}</td>
                                                        <td>{SingleFormData?.year_of_establishment}</td>
                                                        <td>{SingleFormData?.merchant_portal}</td>
                                                        <td>{SingleFormData?.average_transaction_amount}</td>
                                                        <td>{SingleFormData?.expected_transactions_numbers}</td>
                                                        <td>{SingleFormData?.annual_transaction_value}</td>
                                                        <td>{SingleFormData?.account_details}</td>
                                                        <td>{SingleFormData?.authorized_contact_person_name}</td>
                                                        <td>{SingleFormData?.authorized_contact_person_email_id}</td>
                                                        <td>{SingleFormData?.authorized_contact_person_contact_number}</td>
                                                        <td>{SingleFormData?.technical_contact_person_name}</td>
                                                        <td>{SingleFormData?.technical_contact_person_email_id}</td>
                                                        <td>{SingleFormData?.technical_contact_person_contact_number}</td>
                                                        <td>{SingleFormData?.mcc}</td>
                                                        <td>{SingleFormData?.nature_of_business}</td>
                                                        <td>{SingleFormData?.zone}</td>
                                                        <td>{SingleFormData?.entity_pan_card_number}</td>
                                                        <td>{SingleFormData?.gst_number}</td>
                                                        <td>{SingleFormData?.created_on}</td>
                                                    </tr>
                                                ))
                                            )}
                                    </tbody>
                                </table>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default BizzAppData
