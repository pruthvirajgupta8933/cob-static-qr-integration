import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import axios from 'axios';

import { toast, Zoom } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import API_URL from '../../../../config';
import FormikController from '../../../../_components/formik/FormikController';
import {Regex, RegexMsg} from '../../../../_components/formik/ValidationRegex';
import { axiosInstance } from '../../../../utilities/axiosInstance';

export const Edituser = (props) => {

    let history = useHistory();
    const { myname, email, phone, editCustomerTypeId, id } = props.items;
    const callBackFn = props.callBackFn
    // const [username, setUsername] = useState(myname);
    // const [useremail, setUserEmail] = useState(email);
    // const [usercustomer, setUserCustomer] = useState(editCustomerTypeId);
    // const [userphone, setUserPhone] = useState(phone);


      const initialValues = {
        name: myname,
        email: email,
        phone_number: Number(phone),
        customer_type_id: editCustomerTypeId,
      }

    const validationSchema = Yup.object({
    name: Yup.string().matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet).required("Required"),
    email: Yup.string().email('Must be a valid email').required("Required"),
    phone_number: Yup.string().matches(Regex.acceptNumber, RegexMsg.acceptNumber).required("Required"),
    customer_type_id: Yup.string().required("Required"),
    })

    const { user } = useSelector((state) => state.auth);


    const [data, setData] = useState([])
    let clientMerchantDetailsList = [];
    let clientCode = '';
    if (user && user.clientMerchantDetailsList === null) {
        // console.log("edituser");
        history.push('/dashboard/profile');
    } else {
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode = clientMerchantDetailsList[0].clientCode;
    }


    const editHandler =  values => {
        axiosInstance.put(API_URL.EDIT_CUSTOMER, {
            name: values.name,
            email: values.email,
            phone_number: values.phone_number,
            client_code: clientCode,
            customer_type_id: values.customer_type_id,
            id: id
        }).then(res=>{
            // console.log(res)
            callBackFn();
            toast.success("User Updated Successfully", {
                position: "top-right",
                autoClose: 2000,
                transition: Zoom
            })
        }).catch(e=>{console.log(e)
            toast.error("Data not Updated", {
                position: "top-right",
                autoClose: 2000,
                transition: Zoom
    
            })
        })
       
    };
    const getDrop = async (e) => {
        await axiosInstance.get(API_URL.GET_CUSTOMER_TYPE)
            .then(res => {
                let res_data = res.data
                let data_arr = []
                res_data.map((d,i)=>(
                    data_arr.push({key:d.id, value:d.type})
                ))
                setData(data_arr);
            })
            .catch(err => {
                // console.log(err)
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
                        <h5 className="modal-title" id="exampleModalLabel">Edit <i className="fa fa-pencil"></i> </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(editHandler)}
                        enableReinitialize ={true}
                        >
                        {formik => (
                            <Form>
                            <div className="form-group">
                            <FormikController
                                control="input"
                                type="text"
                                label="Name of Payer"
                                name="name"
                                className="form-control"
                            />
                            <FormikController
                                control="input"
                                type="text"
                                label="Mobile No"
                                name="phone_number"
                                className="form-control"
                            />
                            <FormikController
                                control="input"
                                type="text"
                                label="Email ID"
                                name="email"
                                className="form-control"
                            />
                           
                            <FormikController
                                control="select"
                                label="Payer Category"
                                name="customer_type_id"
                                options={data}
                                className="form-control"
                            />
                            <button type="submit" className=" cratepaymentlinkclrsfigma text-white " >Update</button>
                            <button type="button" className="ColrsforDeletefigma ml-2 text-white " data-dismiss="modal" >Cancel</button>
                            </div>
                            
                            </Form>
                        )}
                        </Formik>
                    </div>

                </div>
            </div>
        </div>


    )
};
