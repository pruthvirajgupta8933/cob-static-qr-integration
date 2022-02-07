import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios';

export const Edituser = (props) => { 

     console.log(props.items);
    
    // const [formData, setFormData] = useState();
    // useEffect(() => {
    //     setFormData(props.items)
    // }, [props]);

    var {myname,email,phone,editCustomerTypeId,id} = props.items;
    const [username , setUsername ] = useState(myname);
    const [useremail , setUserEmail]=useState(email);
    const [usercustomer , setUserCustomer]=useState(editCustomerTypeId);
    const [userphone , setUserPhone]=useState(phone);

 
    // const { name, email, phone_number, customer_type_id } =formData;
  // console.log(myname);
    
    useEffect(() => {
     setUsername(myname);
     setUserEmail(email);
     setUserCustomer(editCustomerTypeId);
     setUserPhone(phone);
    }, [props]);
    
    
    const { user } = useSelector((state) => state.auth);
   

    const [data, setData] = useState([])
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode,customer_type_id } = clientMerchantDetailsList[0]
    console.log(customer_type_id);
    
    // const onValueChange = e => {
    //     // console.log(e.target.value);
    //     setFormData({ ...formData, [e.target.name]: e.target.value })
    // };

   
    const editHandler = async e =>{
    
        e.preventDefault();
       
      const res=  await axios.put(` https://paybylink.sabpaisa.in/paymentlink/editCustomer/`,{
            name: username,
            email: useremail,
            phone_number: userphone,
            client_code: clientCode,
            customer_type_id: usercustomer,
            id:id
        });
        console.log(res.data);

       
     
      }; 
      const getDrop = async (e) => {
        await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes`)
            .then(res => {
                setData(res.data);

            })
            .catch(err => {
                console.log(err)
            });

    }
    useEffect(() => {
        getDrop();
    }, []);

     console.log("username",username);

  return (
    <div class="modal fade" id="web" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">New message</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <Formik>
                    <Form onSubmit={editHandler}>
                        <div class="form-group">
                            <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                            <Field name="name" rel={username}
                                value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Your Name" class="form-control" id="namepair" />

                            
                            <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                            <Field name="phone_number"

                                value={userphone} onChange={e => setUserPhone(e.target.value)} placeholder='Enter Mobile No.' class="form-control" id="emailpair" />

                            <label for="recipient-name" class="col-form-label">Email ID:</label>
                            <Field name="email"

                                value={useremail} onChange={e => setUserEmail(e.target.value)} placeholder='Enter Email ID' class="form-control" id="phnpair" />

                            <label for="recipient-name" class="col-form-label">Payer Category:</label><br></br>
                            <select className='selct' name='customer_type_id'
                                onChange={(e) => setUserCustomer(e.target.value)} value={usercustomer}
                            >
                                <option type="text" class="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                {
                                    data.map((payer) => (

                                        <option value={payer.id}>{payer.type}</option>

                                    ))}
                            </select>



                        </div>
                        <button type="button" disabled class="btn btn-primary" >Submit</button>
                <button type="submit" class="btn btn-danger">Update</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>  
                    </Form>
                </Formik>

            </div>
            
        </div>
    </div>
</div>


  )
};
