import React, { useState, useEffect } from "react";
import { DatePicker } from "rsuite";

const CustomDatePicker = ({ label, value, onChange, error, placeholder }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        import("rsuite/dist/rsuite.min.css").then(() => {
            setShowDatePicker(true);
        });
    }, []);

    // Function to disable past dates
    const disablePastDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    return (
        <div>
            <label>{label}</label>
            {showDatePicker ? (
                <DatePicker
                    format="yyyy-MM-dd"
                    value={value}
                    onChange={onChange}
                    className="w-100"
                    placement="bottomStart"
                    placeholder={placeholder}
                    showMeridian={false}
                    disabledDate={(date) => !disablePastDates(date)}
                />
            ) : null}
            {error && <div className="text-danger">{error}</div>}
        </div>
    );
};

export default CustomDatePicker;
