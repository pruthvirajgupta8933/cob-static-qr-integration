import React from 'react'
import { DefaultRateMapping } from '../../utilities/DefaultRateMapping'
import { useParams } from "react-router-dom";
// import {useParams}


function ManualRateMapping() {
    const param = useParams();
    const {loginid} = param 
    console.log("loginid",loginid)
    return (
        <DefaultRateMapping setFlag={()=>{}} merchantLoginId={param?.loginid} />
  )
}

export default ManualRateMapping