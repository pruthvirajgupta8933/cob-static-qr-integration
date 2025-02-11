import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Classes from "./paymentLinkSolution.module.css";

const validationSchema = Yup.object().shape({
    dateRange: Yup.string().required("Please select a date range"),
    fromDate: Yup.date().required("From Date is required"),
    toDate: Yup.date()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
});

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
                initialValues={{ dateRange: "", fromDate: "", toDate: "" }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    // Trigger the passed dynamic API function
                    onApply(values);
                    onClose();
                }}
            >
                {({ resetForm }) => (
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
                        <ErrorMessage name="dateRange" component="div" className="text-danger small" />

                        <div className="row mt-3">
                            <div className="col-6">
                                <label className="form-label">From Date</label>
                                <Field type="date" className="form-control" name="fromDate" />
                                <ErrorMessage name="fromDate" component="div" className="text-danger small" />
                            </div>
                            <div className="col-6">
                                <label className="form-label">To Date</label>
                                <Field type="date" className="form-control" name="toDate" />
                                <ErrorMessage name="toDate" component="div" className="text-danger small" />
                            </div>
                        </div>

                        <div className="mt-5 d-flex justify-content-end gap-5">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { resetForm(); onClose(); }}>Reset Filter</button>
                            <button type="submit" className="btn btn-sm btn cob-btn-primary approve text-white ">Apply</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FilterModal;
