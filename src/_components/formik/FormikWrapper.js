import React, { useEffect } from "react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from "./FormikController"
import { LocalConvenienceStoreOutlined } from "@mui/icons-material"
import { useState } from "react"
import moment from "moment"

function FormikWrapper() {

  // get today date
  var now = moment().format('YYYY-M-D');
  var splitDate = now.split("-");
  if(splitDate[1].length===1){
    splitDate[1] = '0'+splitDate[1]; 
  }  
  if(splitDate[2].length===1){
    splitDate[2] = '0'+splitDate[2];
  }
  splitDate =splitDate.join('-');
  



  const choices = [
    { key: "choice a", value: "choicea" },
    { key: "choice b", value: "choiceb" },
  ]


  const [todayDate, setTodayDate] = useState(splitDate);




  const initialValues = {
    email: "",
    description: "",
    selectChoice: "",
    radioChoice: "",
    checkBoxChoice: "",
    file:"",
    date:todayDate
    // date:"2022-09-01"
  }


  // console.log(initialValues)
  const validationSchema = Yup.object ({
    // email: Yup.string().required("Required"),
    // description: Yup.string().required("Required"),
    // selectChoice: Yup.string().required("Required"),
    // radioChoice: Yup.string().required("Required"),
    // checkBoxChoice: Yup.array().required("Required"),
    // file: Yup.mixed().required("Required" ),
    date:Yup.date().required("Required")
  })

  const imageHandler = e =>{
      // console.log(e.target.files[0])
  }

  const onSubmit = values => values
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(onSubmit)}
      enableReinitialize={true}
    >
      {formik => (
        <Form>
        <FormikController
            control="input"
            type="date"
            label="date"
            name="date"
            onChange={(e)=>{
              formik.setFieldValue("date",e.target.value)
              // setTodayDate(e.target.value)
              }}
              
            // value={'2013-01-08'}
          />
          <FormikController
            control="input"
            type="email"
            label="Email"
            name="email"
          />
          <FormikController
            control="textArea"
            label="Description"
            name="description"
          />
          <FormikController
            control="select"
            label="Select your choice"
            name="selectChoice"
            options={choices}
          />
          <FormikController
            control="radio"
            label="Click your choice"
            name="radioChoice"
            options={choices}
          />
          <FormikController
            control="checkbox"
            label="select your choices"
            name="checkBoxChoice"
            options={choices}
          />
          {/* <FormikController
            control="file"
            label="select your file"
            name="file" 
            onChange={(e)=>{
              formik.setFieldValue("file",e.target.files[0].name)
              imageHandler(e)
              }}
          /> */}

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  )
}
export default FormikWrapper