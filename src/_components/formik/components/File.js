import React from "react"
import { Field, ErrorMessage } from "formik"

function File(props) {
  const { name, label, ...rest } = props
  return (
    <React.Fragment>
      {typeof(label)!=="undefined"?<label htmlFor={name}> {label}</label> : <></>}
      <input name="name" {...rest} />
      <ErrorMessage name={name}>{msg => <p className="text-danger">{msg}</p>}</ErrorMessage>
    </React.Fragment>
  )
}
export default File