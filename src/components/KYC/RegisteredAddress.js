import React, {useEffect, useState} from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import { useSelector , useDispatch } from 'react-redux';
import { toast } from 'react-toastify'


const RegisteredAddress = () => {
  const dispatch = useDispatch();
  
  const [check,setCheck] = useState(false);
  


  const [data, setData] = useState([]);


  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    address: "",
    city: "",
    state:"",
    pincode: "",
  
  }
  const validationSchema = Yup.object({
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    pin_code: Yup.string().required("Required"),
  })



  const onSubmit =  (values) => {
   console.log("Form Submitted")
};



  return (
    <div className="col-md-12 col-md-offset-4">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(onSubmit)}
    >
      {formik => (

        <Form>
          {console.log(formik)}

          <div class="form-group row">
              <label class="col-sm-2 col-form-label p-2">
                <h4 class="font-weight-bold text-nowrap">
                  Address<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-8 ml-5">
                <FormikController
                  control="input"
                  type="text"
                  name="address"
                  className="form-control"
                
                />
              </div>
            </div>

       
            <div class="form-group row">
              <label class="col-sm-2 col-form-label p-2">
                <h4 class="font-weight-bold text-nowrap">
                  City<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-8 ml-5">
                <FormikController
                  control="input"
                  type="text"
                  name="city"
                  className="form-control"
                 
                />
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-2 col-form-label p-2">
                <h4 class="font-weight-bold text-nowrap">
                  State<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-8 ml-5">
                <FormikController
                  control="input"
                  type="text"
                  name="state"
                  className="form-control"
                />
              </div>
            </div>
          
            <div class="form-group row">
              <label class="col-sm-2 col-form-label p-2">
                <h4 class="font-weight-bold text-nowrap">
                  Pincode<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-8 ml-5">
                <FormikController
                  control="input"
                  type="text"
                  name="pin_code"
                  className="form-control"

                />
                  <p>
            <input class="form-check-input" type="checkbox" value={check} id="flexCheckDefault" />
            Operational address is same as the business address
            </p>
              </div>
            </div>
          

         

            <div class="my-5 p-2">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div class="mt-3">
       
          <button className="btn float-lg-right"
                    type="submit"
                    style={{ backgroundColor: "#0156B3" }}>
          <h4 className="text-white font-weight-bold"> &nbsp; &nbsp; Save & Next &nbsp; &nbsp;</h4>
          </button>
          </div>
          </div>
        </Form>
        
      )}
    </Formik>

  </div>
 )
}

export default RegisteredAddress