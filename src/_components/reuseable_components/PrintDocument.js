import React, { useEffect, useState } from 'react'
import sabpaisalogo from '../../assets/images/sabpaisalogo.png'

function PrintDocument(props) {
    const {data} = props;
    console.log("data printdoc",data)
    const [firstCol, setFirstCol] = useState(data)
    // const [ScndCol, setScndCol] = useState([])

  

        useEffect(() => {
            setFirstCol(data)

            // if(printData?.length > 0){
            //     const objData = printData[0];
            //     const lenObj = Object.keys(objData).length;
                
            //     const firstLen = Math.ceil(lenObj/2);
            //     const scndLen = lenObj - firstLen;
    
            //     console.log(Object.keys(objData))
                
            //     // first column print
            //     const tempArr = []
            //     for(var i=0; i <= lenObj ; i++){
            //         const firstColKey = Object.keys(objData);
            //         const firstColVal = Object.values(objData);
            //         tempArr.push({key:firstColKey[i], value:firstColVal[i]});
            //     }
            //     setFirstCol(tempArr)
            //     // console.log(firstCol)
    
    
            //     // second column print
            //     // console.log(scndLen,lenObj)
            //     const tempArr1 = [] 
            //     for(var j= (firstLen+1); j < lenObj ; j++){
            //         const SndColKey = Object.keys(objData);
            //         const SndColVal = Object.values(objData);
            //         tempArr1.push({key:SndColKey[j] , value: SndColVal[j]})
            //     }
            //     setScndCol(tempArr1)
    
            // }
    
        
        }, [data])
        

        return (
<div className='print-document' style={{"display":"none"}} id="print_docuement">
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
                                    <td align="left">
                                        <img
                                        src={sabpaisalogo}
                                        alt="sabpaisa"
                                        data-pagespeed-url-hash={706682889}
                                        onload="pagespeed.CriticalImages.checkImageForCriticality(this);"
                                        style={{ width: "10%" }}
                                        />
                                    </td>
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
                                <strong>TRANSACTION ENQUIERY</strong>
                            </th>
                            </tr>
                            { firstCol.map((d,i) => (
                                <tr>
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