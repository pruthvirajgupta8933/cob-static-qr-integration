import React from 'react';
import { v4 as uuidv4 } from 'uuid';

function SelectFilter(props) {
    const { label, name, options, onChange, filterBy, value, ...rest } = props;

    return (
        <div className="mb-2">
            {label && (
                <label className="form-label mb-1">
                    {label}
                </label>
            )}
            <select
                className="form-select form-select-sm"
                value={value}
                onChange={(e) => onChange(e.target.value, filterBy)}
                {...rest}
            >
                {options?.map((option) => (
                    <option
                        key={uuidv4()}
                        value={option.value}
                        disabled={option?.disabled}
                    >
                        {option?.value}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectFilter;
