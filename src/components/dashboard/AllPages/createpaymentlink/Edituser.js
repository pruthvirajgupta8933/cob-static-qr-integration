import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios';

import { toast, Zoom } from 'react-toastify';
import { useHistory } from 'react-router-dom';

export const Edituser = (props) => {
    let history = useHistory();
    // console.log(props.items);

    // const [formData, setFormData] = useState();
    // useEffect(() => {
    //     setFormData(props.items)
    // }, [props]);

    var { myname, email, phone, editCustomerTypeId, id } = props.items;
    const [username, setUsername] = useState(myname);
    const [useremail, setUserEmail] = useState(email);
    const [usercustomer, setUserCustomer] = useState(editCustomerTypeId);
    const [userphone, setUserPhone] = useState(phone);


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
    // var clientMerchantDetailsList = user.clientMerchantDetailsList;
    // const { clientCode } = clientMerchantDetailsList[0]

    let clientMerchantDetailsList = [];
    let clientCode = '';
    if (user && user.clientMerchantDetailsList === null) {
        // console.log("edituser");
        history.push('/dashboard/profile');
    } else {
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode = clientMerchantDetailsList[0].clientCode;
    }


    // const onValueChange = e => {
    //     // console.log(e.target.value);
    //     setFormData({ ...formData, [e.target.name]: e.target.value })
    // };


    const editHandler = async e => {


        e.preventDefault();
       
        toast.success("User Updated Successfully", {
            position: "top-right",
            autoClose: 2000,
            transition: Zoom

        })
        const res = await axios.put(` https://paybylink.sabpaisa.in/paymentlink/editCustomer/`, {
            name: username,
            email: useremail,
            phone_number: userphone,
            client_code: clientCode,
            customer_type_id: usercustomer,
            id: id
        })
       
        // console.log(res.data);
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

    // console.log("username", username);

    return (
        <div className="modal fade" id="web" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New message</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Formik>
                            <Form onSubmit={editHandler}>
                                <div className="form-group">
                                    <label htmlFor="recipient-name" className="col-form-label">Name of Payer:</label>
                                    <Field name="name" rel={username}
                                        value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Your Name" className="form-control" id="namepair" />


                                    <label htmlFor="recipient-name" className="col-form-label">Mobile No.:</label>
                                    <Field name="phone_number"

                                        value={userphone} onChange={e => setUserPhone(e.target.value)} placeholder='Enter Mobile No.' className="form-control" id="emailpair" />

                                    <label htmlFor="recipient-name" className="col-form-label">Email ID:</label>
                                    <Field name="email"

                                        value={useremail} onChange={e => setUserEmail(e.target.value)} placeholder='Enter Email ID' className="form-control" id="phnpair" />

                                    <label htmlFor="recipient-name" className="col-form-label">Payer Category:</label><br></br>
                                    <select className='selct' name='customer_type_id'
                                        onChange={(e) => setUserCustomer(e.target.value)} value={usercustomer}
                                    >
                                        <option type="text" className="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                        {
                                            data.map((payer,i) => (
                                                <option value={payer.id} key={i}>{payer.type}</option>
                                            ))}
                                    </select>

                                </div>
                                <button type="button" disabled className="btn btn-primary" >Submit</button>
                                <button type="submit" className="btn btn-danger">Update</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                            </Form>
                        </Formik>

                    </div>

                </div>
            </div>
        </div>


    )
};
