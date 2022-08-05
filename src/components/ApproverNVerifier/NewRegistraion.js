import React, {useEffect, useState} from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import API_URL from '../../config'
import axios from "axios";
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'


function NewRegistraion() {


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
       modified_by:loginId
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
   
   
  </div>
  )
}

export default NewRegistraion
