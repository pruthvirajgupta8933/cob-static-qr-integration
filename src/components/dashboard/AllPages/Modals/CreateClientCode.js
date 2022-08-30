import React, { useState } from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../../../_components/formik/FormikController'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import API_URL from '../../../../config'
import { createClientProfile } from '../../../../slices/auth'
import { toast} from 'react-toastify';



const initialValues = {
    new_client_code: "",
    isCodeUnique:""
  }
  const validationSchema = Yup.object ({
    new_client_code: Yup.string().min(5, "Client Code length minimum 6 characters")
    .max(6, "Client Code length must be 6 characters")
    .required("Required"),
    isCodeUnique:Yup.string()
    
  })


  

//   const checkClientCodeValid=(clientCode)=>{
//     console.log(clientCode)
//   }



function CreateClientCode(props) {

    const { user } = useSelector((state) => state.auth);
    const [isCodeValid, setIsCodeValid] = useState(null)
    const dispatch = useDispatch();

    const {fnClientCodeCreated} = props;
 

    // console.log(user);
    const handleOnChange = (event) => {
        const inputText = event.target.value;
        setIsCodeValid(null);
        if(inputText.length===6 || inputText.length===5){
            const data  = {"client_code": inputText}
            axios.post("https://stgcobapi.sabpaisa.in/auth-service/account/check-clientcode",data).then(
                res=>{
                    // console.log(res.data.status)
                    setIsCodeValid(res.data.status);
                }
            ).catch(err => {setIsCodeValid(false);});
        }
        
    };


    
  const onSubmit = values => {
    // console.log(values.new_client_code)
    const clientCodeNew = values.new_client_code;

    const data = {
        "loginId" : user?.loginId,
        "clientName" : user?.clientContactPersonName,
        "clientCode": clientCodeNew,
        "phone" : user?.clientMobileNo,
        "state" : "Delhi",
        "accountHolderName" :  user?.clientContactPersonName,
        "bankName" : "bank",
        "accountNumber" : "11111000",
        "ifscCode" : "IFSC",
        "pan" : "PAN",
        "address" : "ADD",
        "clientAuthenticationType" : "NB"
    }

  
    
    dispatch(createClientProfile(data)).then(res=>{
      fnClientCodeCreated(false); // hide createClientProfile
      toast.success("Client Code created successfully");
    }).catch(err=>{fnClientCodeCreated(false);
      toast.success("Something went wrong creating client code");
     })
    
  }

  return (
    <div className="modal fade" id="exampleModal" style={{ top: "25%" }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Create Client Code !</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
            <span aria-hidden="true" >&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(onSubmit)}
  
    >
      {formik => (
        <Form onChange={handleOnChange}>
        <div className="form-group">
    
        {/* { isCodeValid===false ? formik.setFieldError("new_client_code","Client Code already exists"):""} */}
          <FormikController
            control="input"
            type="text"
            label="Create Client Code"
            name="new_client_code"
            className="form-control"
          />
          {isCodeValid ? <p>Client Code is valid</p> : "" }
          {isCodeValid===false ? <p>Client Code already exists</p> : "" }
            <button className="btn btn-primary"  type="submit">Submit</button>
            
            </div>
          </Form>
          
      )}
      </Formik>
      {/* <button className="btn btn-primary" onClick={()=>{fnClientCodeCreated(false)}} >onclien</button> */}
        </div>
  
      </div>
    </div>
    )
  </div>
  )
}

export default CreateClientCode