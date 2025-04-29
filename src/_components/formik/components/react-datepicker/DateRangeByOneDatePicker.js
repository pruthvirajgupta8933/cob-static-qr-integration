import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangeByOneDatePicker = ({
    initialStartDate = new Date(),
    initialEndDate = null,
    onDateChange,
    dateFormat = "dd/MM/yyyy",
    placeholderText = "Select a date range"
}) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const handleChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (onDateChange) {
            onDateChange({ startDate: start, endDate: end });
        }
    };

    return (
        <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Select Date</label>
            <DatePicker
                selected={startDate}
                onChange={handleChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                dateFormat={dateFormat}
                placeholderText={placeholderText}
                isClearable
                className="form-control"
            />
        </div>

    );


};

export default DateRangeByOneDatePicker;