import React, { useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Classes from "./paymentLinkSolution.module.css";
import FormikController from "../../../../_components/formik/FormikController";
import moment from "moment";
import { setDateRange } from "../../../../slices/date-filter-slice/DateFilterSlice";
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required("From Date is required"),
    toDate: Yup.date()
        .required("To Date is required")
        .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
});


const today = moment().format("YYYY-MM-DD");



const getDateRange = (option) => {
    switch (option) {
        case "today":
            return { fromDate: today, toDate: today, dateRange: "today" };
        case "yesterday":
            return {
                fromDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
                toDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
                dateRange: "yesterday"
            };
        case "lastWeek":
            return {
                fromDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
                toDate: today,
                dateRange: "lastWeek"
            };
        case "lastMonth":
            return {
                fromDate: moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD"),
                toDate: moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD"),
                dateRange: "lastMonth"
            };
        case "lastSixMonths":
            return {
                fromDate: moment().subtract(6, "months").startOf("month").format("YYYY-MM-DD"),
                toDate: today,
                dateRange: "lastSixMonths"
            };
        case "financialYear":
            return {
                fromDate: moment().month(3).date(1).subtract(1, "year").format("YYYY-MM-DD"), // April 1st of the previous year
                toDate: moment().month(2).date(31).format("YYYY-MM-DD"), // March 31st of the current year
                dateRange: "financialYear"
            };

        default:
            return { fromDate: today, toDate: today, dateRange: "today" };
    }
};


const FilterModal = ({ show, onClose, filterRef, onApply }) => {
    const modalRef = useRef(null);
    const dispatch = useDispatch()
    const dateFilterData = useSelector((state) => state.dateFilterSliceReducer);

    const initialValues = { fromDate: dateFilterData?.fromDate || today, toDate: dateFilterData?.toDate || today, dateRange: dateFilterData?.dateRange || "today" };

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

    const handleSubmit = (values) => {
        // console.log(values)
        onApply(values);
        dispatch(setDateRange(values));
        onClose();
    };

    return (
        <div ref={modalRef} className={` ${Classes.filter_modal_open} position-absolute bg-white border shadow p-3 rounded`}>
            <h6>Select Range</h6>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={values => handleSubmit(values)}
            >
                {({ values, errors, setFieldValue, resetForm }) => (
                    <Form>
                        <div className="d-flex flex-wrap gap-2">
                            {[
                                { id: "today", label: "Today" },
                                { id: "yesterday", label: "Yesterday" },
                                { id: "lastWeek", label: "Last Week" },
                                { id: "lastMonth", label: "Last Month" },
                                { id: "lastSixMonths", label: "Last Six Months" },
                                { id: "financialYear", label: "Financial Year" },
                            ].map(({ id, label }) => (
                                <div className="form-check form-check-inline" key={id}>
                                    <Field
                                        className="form-check-input"
                                        type="radio"
                                        name="dateRange"
                                        id={id}
                                        value={id}
                                        onClick={() => {
                                            const { fromDate, toDate } = getDateRange(id);
                                            setFieldValue("fromDate", fromDate);
                                            setFieldValue("toDate", toDate);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor={id}>
                                        {label}
                                    </label>
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
                                    onChange={(date) =>
                                        setFieldValue("fromDate", moment(date).format("YYYY-MM-DD"))
                                    }
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
                                    label="To Date"
                                    id="to_date"
                                    name="toDate"
                                    value={values.toDate ? new Date(values.toDate) : null}
                                    onChange={(date) =>
                                        setFieldValue("toDate", moment(date).format("YYYY-MM-DD"))
                                    }
                                    format="dd-MM-yyyy"
                                    clearIcon={null}
                                    className="form-control rounded-0 p-0"
                                    required={true}
                                    errorMsg={errors["toDate"]}
                                />
                            </div>
                        </div>

                        <div className="mt-5 d-flex justify-content-end gap-5">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                    resetForm({ values: getDateRange("today") });
                                    dispatch(setDateRange(getDateRange("today")));
                                    // onClose();
                                }}
                            >
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
