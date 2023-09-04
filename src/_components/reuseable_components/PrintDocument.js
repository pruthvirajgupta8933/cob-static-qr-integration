import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

// import sabpaisalogo from '../../assets/images/sabpaisalogo.png'

function PrintDocument(props) {
    const { data } = props;
    const [firstCol, setFirstCol] = useState(data)

    useEffect(() => {
        setFirstCol(data)
    }, [data])


    return (
        <div className='print-document' style={{ "display": "none" }} id="print_docuement">
            <table width="100%" cellSpacing={0} cellPadding={0} border={0} bgcolor="#fff" >
                <tbody>
                    <tr>
                        <td>
                            <table width="100%" cellSpacing={0} cellPadding={0} border={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ color: "#000" }}>
                                            <table width="100%" cellSpacing={0} cellPadding={0} border={0}>
                                                <tbody>
                                                    <tr>
                                                        <td width="100%">
                                                            <table
                                                                width="100%"
                                                                cellSpacing={0}
                                                                cellPadding={5}
                                                                border={0}
                                                            >
                                                                <tbody>
                                                                    <tr>

                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
                                <tbody>
                                    <tr>
                                        <td height={3} style={{ fontSize: 0 }}>
                                            &nbsp;
                                        </td>
                                    </tr>
                                    <tr>

                                        <td width="100%">
                                            <table width="100%" cellPadding={8} cellSpacing={0} border={0}>
                                                <tbody>
                                                    <tr>
                                                        <th
                                                            height={34}
                                                            colSpan={6}
                                                            align="left"
                                                            bgcolor="#f6f5f5"
                                                            style={{
                                                                fontSize: 14,
                                                                border: "1px solid #e4e4e4",
                                                                color: "#000000"
                                                            }}
                                                        >
                                                            <strong>TRANSACTION ENQUIRY</strong>
                                                        </th>
                                                    </tr>
                                                    {firstCol.map((d, i) => (
                                                        <tr key={uuidv4()}>
                                                            <th
                                                                align="left"
                                                                width="22%"
                                                                style={{ border: "1px solid #e4e4e4" }}
                                                            >
                                                                <strong>{d.key}</strong>
                                                            </th>
                                                            <td width="78%" style={{ border: "1px solid #e4e4e4" }}>
                                                                {d.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br pagebreak="true" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PrintDocument