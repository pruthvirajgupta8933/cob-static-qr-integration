import React from "react"
import Input from "./components/Input.js"
import TextArea from "./components/TextArea"
import Select from "./components/Select.js"
import RadioButtons from "./components/RadioButton.js"
import CheckBoxes from "./components/CheckBoxes.js"

function FormikController(props) {
  const { control, ...rest } = props
  switch (control) {
    case "input":
      return <Input {...rest} />
    case "textArea":
      return <TextArea {...rest} />
    case "file":
      return <Input {...rest} />
    case "select":
      return <Select {...rest} />
    case "radio":
      return <RadioButtons {...rest} />
    case "checkbox":
      return <CheckBoxes {...rest} />
    default:
      return null
  }
}
export default FormikController