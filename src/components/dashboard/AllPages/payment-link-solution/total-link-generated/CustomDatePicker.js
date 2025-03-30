import React, { useState, useEffect } from "react";
import { DatePicker } from "rsuite";

const CustomDatePicker = ({ label, value, onChange, error, placeholder }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {

        import("rsuite/dist/rsuite.min.css").then(() => {
            setShowDatePicker(true);
        });
    }, []);

    return (
        <div>
            <label>{label}</label>
            {showDatePicker ? (
                <DatePicker
                    format="yyyy-MM-dd HH:mm"
                    value={value}
                    onChange={onChange}
                    className="w-100"
                    placement="bottomStart"
                    placeholder={placeholder}
                    showMeridian={false}
                />
            ) : (
                null
            )}
            {error && <div className="text-danger">{error}</div>}
        </div>
    );
};

export default CustomDatePicker;
