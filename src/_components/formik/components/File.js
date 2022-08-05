import React from "react"
import { Field, ErrorMessage } from "formik"

function File(props) {
  const { name, label, ...rest } = props
  return (
    <React.Fragment>
      <label htmlFor={name}> {label}</label>
      <input name="name" {...rest} />
      <p className="text-danger"> <ErrorMessage  name={name}/> </p>
    </React.Fragment>
  )
}
export default File