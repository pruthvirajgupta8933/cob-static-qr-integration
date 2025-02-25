import React from 'react'
import { v4 as uuidv4 } from 'uuid';


function SelectFilter(props) {
    const { label, name, options, onChange, ...rest } = props;
    return (
        <select className="form-select form-select-sm" onChange={(e) => onChange(e.target.value)} >
            {options?.map((option, i) => {
                return (
                    <option
                        key={uuidv4()}
                        value={option.value}
                        disabled={option?.disabled}
                    >
                        {option?.value}
                    </option>
                );
            })}
        </select>

    )
}

export default SelectFilter