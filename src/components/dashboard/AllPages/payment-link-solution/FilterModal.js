import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import Classes from "./paymentLinkSolution.module.css";
import FormikController from "../../../../_components/formik/FormikController";
import moment from "moment";

const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required("From Date is required"),
    toDate: Yup.date()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
});

// Format today's date properly for Formik's initialValues
const today = moment().format("YYYY-MM-DD");

const initialValues = {
    fromDate: today,
    toDate: today,
};

const FilterModal = ({ show, onClose, filterRef, onApply }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !filterRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose, filterRef]);

    if (!show) return null;

    return (
        <div ref={modalRef} className={` ${Classes.filter_modal_open} position-absolute bg-white border shadow p-3 rounded`}>
            <h6>Select Range</h6>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    onApply(values);
                    onClose();
                }}
            >
                {({ values, errors, setFieldValue, resetForm }) => (
                    <Form>
                        <div className="d-flex flex-wrap gap-2">
                            {[
                                { id: "today", label: "Today" },
                                { id: "lastWeek", label: "Last Week" },
                                { id: "lastMonth", label: "Last Month" },
                                { id: "lastSixMonths", label: "Last Six Months" },
                                { id: "financialYear", label: "Financial Year" },
                            ].map(({ id, label }) => (
                                <div className="form-check form-check-inline" key={id}>
                                    <Field className="form-check-input" type="radio" name="dateRange" id={id} value={id} />
                                    <label className="form-check-label" htmlFor={id}>{label}</label>
                                </div>
                            ))}
                        </div>

                        <div className="row mt-3">
                            <div className="col-6">
                                <FormikController
                                    control="date"
                                    label="From Date"
                                    id="fromDate"
                                    name="fromDate"
                                    value={values.fromDate ? new Date(values.fromDate) : null}
                                    onChange={(date) => setFieldValue("fromDate", moment(date).format("YYYY-MM-DD"))}
                                    format="dd-MM-yyyy"
                                    clearIcon={null}
                                    className="form-control rounded-0 p-0"
                                    required={true}
                                    errorMsg={errors["fromDate"]}
                                />
                            </div>
                            <div className="col-6">
                                <FormikController
                                    control="date"
                                    label="End Date"
                                    id="to_date"
                                    name="toDate"
                                    value={values.toDate ? new Date(values.toDate) : null}
                                    onChange={(date) => setFieldValue("toDate", moment(date).format("YYYY-MM-DD"))}
                                    format="dd-MM-yyyy"
                                    clearIcon={null}
                                    className="form-control rounded-0 p-0"
                                    required={true}
                                    errorMsg={errors["toDate"]}
                                />
                            </div>
                        </div>

                        <div className="mt-5 d-flex justify-content-end gap-5">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { resetForm(); onClose(); }}>
                                Reset Filter
                            </button>
                            <button type="submit" className="btn btn-sm btn cob-btn-primary approve text-white">
                                Apply
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FilterModal;
