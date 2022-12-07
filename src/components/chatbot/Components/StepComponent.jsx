import React, { useEffect } from "react";

const StepComponent = (props) => {

    // console.log("render stepcomponent")
    const FindAnswer = () => {

        const Id = localStorage.getItem('categoryId')
        
        if (Id === "1") {
            props.triggerNextStep({ trigger: 12 })
        } else {
            props.triggerNextStep({ trigger: 13 })
        }

    }
    useEffect(() => {
        FindAnswer()
    }, [])

    return (
        <>
        </>
    )
}


export default StepComponent