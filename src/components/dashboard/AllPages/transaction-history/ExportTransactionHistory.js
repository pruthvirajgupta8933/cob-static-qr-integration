import React, { useState } from 'react';
import CustomModal from '../../../../_components/custom_modal';
import FormikController from '../../../../_components/formik/FormikController';
import { useDispatch } from 'react-redux';
import Blob from "blob";
import { exportTxnHistory } from '../../../../slices/dashboardSlice';
import { Formik, Form } from "formik";
import Yup from '../../../../_components/formik/Yup';
import { saveAs } from 'file-saver';
import moment from "moment";
import toastConfig from '../../../../utilities/toastTypes';
import downloadTransactionHistory from "../../../../services/dashboard.service"

const ExportTransactionHistory = ({ openModal, setOpenModal, downloadData, checkValidation, clientCodeListArr }) => {
    const [disable, setDisable] = useState(false);

    const initialValues = {
        password: ""
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required("Required")
    });

    const dispatch = useDispatch();

const handleSubmit = (values) => {
        setDisable(true)
        const dateRangeValid = checkValidation(downloadData?.fromDate, downloadData?.endDate);
        
        if (dateRangeValid) {
            let strClientCode = '';
            let clientCodeArrLength = '';
    
            if (values.clientCode === "All") {
                const allClientCode = clientCodeListArr?.map((item) => item.client_code);
                clientCodeArrLength = allClientCode.length.toString();
                strClientCode = allClientCode.join();
            } else {
                strClientCode = values.clientCode;
                clientCodeArrLength = "1";
            }
    
            dispatch(
                exportTxnHistory({
                    clientCode: downloadData?.clientCode,
                    paymentStatus: downloadData?.transaction_status,
                    paymentMode: downloadData?.payment_mode,
                    fromDate: moment(downloadData?.fromDate).startOf('day').format('YYYY-MM-DD'),
                    endDate: moment(downloadData?.endDate).startOf('day').format('YYYY-MM-DD'),
                    length: "0",
                    page: "0",
                    noOfClient: clientCodeArrLength,
                    profile_password: values.password,
                })
            ).then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                     const blob = new Blob([res.payload], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    saveAs(blob, 'transaction_history.xlsx');
                    setDisable(false);
                    setOpenModal(false);
                } else {
                    toastConfig.errorToast(res?.payload);
                    setDisable(false);
                    setOpenModal(true);
                }
            });
        }
    };

    const modalBody = () => {
        return (
            <div className="container-fluid">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values);
                        resetForm();
                    }}
                >
                    {({ resetForm }) => (
                        <Form>
                            <div className="modal-body">
                                <div className="row justify-content-center">
                                    <div className="col-lg-10">
                                        <label className="col-form-label mt-0">
                                            Password<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormikController
                                            control="input"
                                            type="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-center mt-4">
                                    <div className="col-lg-10 text-center">
                                        <button
                                            type="submit"
                                            className="cob-btn-primary text-white btn btn-sm w-100"
                                            disabled={disable}
                                        >
                                            {disable && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    };

    return (
        <div>
            <CustomModal modalBody={modalBody} headerTitle={"Enter Password"} modalSize={"modal-md"} modalToggle={openModal} fnSetModalToggle={setOpenModal} />
        </div>
    );
};

export default ExportTransactionHistory;
