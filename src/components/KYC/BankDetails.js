import React, {useEffect, useState} from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import API_URL from '../../config'
import axios from "axios";
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'


function BankDetails() {


  const [data, setData] = useState([]);


  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    account_holder_name: "",
    account_number: "",
    confirm_account_number:"",
    ifsc_code: "",
    bank_id: "",
    account_type: "",
    branch: "",
  }
  const validationSchema = Yup.object({
    account_holder_name: Yup.string().required("Required"),
    account_number: Yup.string().required("Required"),
    confirm_account_number:Yup.string().oneOf([Yup.ref('account_number'), null], 'Account Number  must match').required("Confirm Account Number Required"),
    ifsc_code: Yup.string().required("Required"),
    account_type: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    bank_id:Yup.string().required("Required"),
  })


  //---------------GET ALL BANK NAMES DROPDOWN--------------------
  
  useEffect(() => {
    axios.get(API_URL.GET_ALL_BANK_NAMES).then((resp) => {
      const data = convertToFormikSelectJson('bankId', 'bankName', resp.data);
      setData(data)
    }).catch(err => console.log(err))
  }, [])


  const onSubmit = async (values) => {
    const res = await axios.put(API_URL.Save_Settlement_Info, {

      account_holder_name: values.account_holder_name,
      account_number: values.account_number,
      ifsc_code: values.ifsc_code,
      bank_id: values.bank_id,
      account_type: values.account_type,
      branch: values.branch,
      login_id:loginId ,
      // client_code:clientCode
    });

    console.log(values,"form data")

    if (res.status === 200) {
      toast.success("Bank Details Updated")
    } else {
      toast.error("Something went wrong")
    }
};



  return (
    <div className="col-md-12 col-md-offset-4">   
   
    <div className="form-row ">
        <p>We will deposit a small amount of money in your account to verify the account.</p>
    </div>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
          {formik => (
            <Form>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Account Name *"
                        name="account_holder_name"
                        placeholder="Account Holder Name"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                    <FormikController
                        control="input"
                        type="text"
                        label="Account Type *"
                        name="account_type"
                        placeholder="Account Type"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <FormikController
                          control="select"                          
                          label="Bank Name*"
                          name="bank_id"
                          className="form-control"
                          placeholder="Enter Bank Name"
                          options={data}
                        />
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group col-md-3">
                      <FormikController
                        control="input"
                        type="text"
                        label="Branch *"
                        name="branch"
                        placeholder="Enter Branch Name"
                        className="form-control"
                      />
                    </div>

                  
                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Branch IFSC Code *"
                          name="ifsc_code"
                          placeholder="IFSC Code"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Account Number *"
                          name="account_number"
                          placeholder="Account Number"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Confirm Account Number  *"
                          name="confirm_account_number"
                          placeholder="Re-Enter Account Number"
                          className="form-control"
                        />
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit">Submit</button>
                    
            </Form>
          )}

    </Formik>
   
  </div>
  )
}

export default BankDetails