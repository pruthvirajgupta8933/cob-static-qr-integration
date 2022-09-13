import React from "react"
import { Field, ErrorMessage } from "formik"

function TextArea(props) {
  const { label, name, ...rest } = props
  return (
    <React.Fragment>
     {typeof(label)!=="undefined"?<label htmlFor={name}> {label}</label> : <></>}
      <Field as="textarea" id={name} name={name} {...rest} />
      <p className="text-danger"><ErrorMessage name={name} /></p>
    </React.Fragment>
  )
}
export default TextArea