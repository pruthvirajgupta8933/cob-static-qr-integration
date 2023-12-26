import React from 'react'
import { v4 as uuidv4 } from 'uuid';

function DropDownCountPerPage({ datalength }) {

    const length = datalength
    let PerPageCount = []

    if (length >= 1) {
        PerPageCount.push(10)
    }
    if (length > 10 || length >= 20) {
        PerPageCount.push(20)
    }
    if (length >= 20 || length >= 50) {
        PerPageCount.push(50)
    }
    if (length >= 50 || length >= 100) {
        PerPageCount.push(100)
    }
    if (length >= 100 || length >= 200) {
        PerPageCount.push(200)
    }
    if (length >= 200 || length >= 300) {
        PerPageCount.push(300)
    }
    if (length >= 300 || length >= 500) {
        PerPageCount.push(500)
    }

    return (
        <React.Fragment>
            {PerPageCount.map((item, i) => (
                <option value={item} key={uuidv4()} >{item}</option>
            ))}
        </React.Fragment>
    )
}

export default DropDownCountPerPage