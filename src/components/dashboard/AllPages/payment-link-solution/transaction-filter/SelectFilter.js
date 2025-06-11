import React from 'react'
import { v4 as uuidv4 } from 'uuid';


function SelectFilter(props) {
    const { label, name, options, onChange, filterBy, value, ...rest } = props;
    console.log("lablllllllll", label)
    return (
        <select className="form-select form-select-sm" value={value} onChange={(e) => onChange(e.target.value, filterBy)} >
            {options?.map((option, i) => {
                return (
                    <option
                        key={uuidv4()}
                        value={option.value}
                        disabled={option?.disabled}
                        label={label}
                    >
                        {option?.value}
                    </option>
                );
            })}
        </select>

    )
}

export default SelectFilter