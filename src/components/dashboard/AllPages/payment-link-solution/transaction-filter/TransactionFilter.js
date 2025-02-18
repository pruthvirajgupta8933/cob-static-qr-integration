import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";

const TransactionFilter = ({ fromDate, toDate }) => {
    const dispatch = useDispatch()
    const [selectedOption, setSelectedOption] = useState("daily");
    const [availableOptions, setAvailableOptions] = useState([]);


    useEffect(() => {
        const start = moment(fromDate, "YYYY-MM-DD");
        const end = moment(toDate, "YYYY-MM-DD");
        const daysDiff = end.diff(start, "days");
        console.log("daysDiff ", daysDiff);

        let options = [];
        if (daysDiff === 0) {
            options = ["hourly"];
        } else if (daysDiff > 0 && daysDiff < 7) {
            options = ["hourly", "daily"];
        } else if (daysDiff >= 7 && daysDiff <= 60) {
            options = ["daily", "weekly"];
        } else if (daysDiff > 60 && daysDiff < 364) {
            options = ["daily", "weekly", "monthly"];
        } else if (daysDiff >= 364) {
            options = ["monthly", "yearly"];
        }



        setAvailableOptions(options);
        setSelectedOption(options[0] || "daily");
    }, [fromDate, toDate]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="mb-2">
            {availableOptions.map((option) => (
                <div key={option} className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="transactionFilter"
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                    />
                    <label className="form-check-label text-capitalize">{option}</label>
                </div>
            ))}
        </div>
    );
};

export default TransactionFilter;
