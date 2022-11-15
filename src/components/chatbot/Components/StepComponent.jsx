import React, { useEffect } from "react";

const StepComponent = (props) => {

    // console.log("render stepcomponent")
    const FindAnswer = () => {

        const Id = localStorage.getItem('categoryId')
        // console.log("id", Id)
        if (Id === "1") {
            // console.log("render stepcomponent 12")
            props.triggerNextStep({ trigger: 12 })
        } else {
            // console.log("render stepcomponent 13")
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