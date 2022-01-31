import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
const initialValues = {
    name: "",
    email: "",
    phone_number: ""
}
const PayerDetails = () => {



    const [item, setItem] = useState({
        name: "",
        email: "",
        phone_number: "",
        customer_type_id: ""
    });
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        phone_number: Yup.string().required("Required"),
        email: Yup.string().email("Enter valid email").required("Required")
    })
    const { name, email, phone_number, customer_type_id } = item;
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = React.useState([])
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode } = clientMerchantDetailsList[0];
    // console.log(clientMerchantDetailsList);
    //console.log(clientCode)
    const onInputChange = e => {
        // console.log(e.target.value);
        setItem({ ...item, [e.target.name]: e.target.value })
    };

    useEffect(() => {
        loadUser();
    }, []);
  
    const loadUser = async () => {
        const result = await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)
        const data = result.data;
        // console.log(result.data);              
        setItem(data);
    }
    const getFileName = async () => {
        await axios(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)  //MPSE1
            .then(res => {
                // console.log(res)
                setData(res.data);
            })
            .catch(err => {
                console.log(err)
            });

    }
    React.useEffect(() => {
        getFileName();
    }, []);
    const getDrop = async (e) => {
        await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes`)
            .then(res => {
                setData(res.data);

            })
            .catch(err => {
                console.log(err)
            });

    }
    React.useEffect(() => {
        getDrop();
    }, []);
    const onSubmit = async e => {
        e.preventDefault();
        console.log(item);
        const res = await axios.post('https://paybylink.sabpaisa.in/paymentlink/addCustomers', {
            name: item.name,
            email: item.email,
            phone_number: item.phone_number,
            client_code: clientCode,
            customer_type_id: item.customer_type_id
        });

        console.log(res)
.then((res) => {
                 console.log(JSON.stringify(res.data))
             })

        setItem([])




    };
const  handleClick=(id)=> {
    //console.log('this is harry');
    //console.log(id);
            data.filter((data)=>{
                if(data.id === id) {console.log(data);}
            })

        
        
    
  }


    return (
        <div>
            <h3 className='sample'>Payer Details</h3>
            {/* <button type="button" className='btn' class="btn btn-primary">Add Single Payer</button> */}
            <button type="button" class="btn joshi btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ marginLeft: '-157px', marginTop: '-70' }} >Add Single Payer</button>
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title" id="exampleModalLabel">Add Payer Details</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                {(props) => (
                                    <Form onSubmit={e => onSubmit(e)} >
                                        <div class="form-group">
                                            <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                                            <Field name="name" value={name} onChange={e => onInputChange(e)}
                                                placeholder="Enter Name of Payer" class="form-control" id="recipient-name" />
                                            <ErrorMessage name="name">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>
                                            <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                            <Field name="phone_number"
                                                value={phone_number}
                                                onChange={e => onInputChange(e)} helperText={<ErrorMessage name="phone_number" />} placeholder='Enter Mobile No.' class="form-control" id="recipient-name" />
                                            <ErrorMessage name="phone_number">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>

                                            <label for="recipient-name" class="col-form-label">Email ID:</label>
                                            <Field name="email"
                                                value={email}
                                                onChange={e => onInputChange(e)} placeholder='Enter Email ID' class="form-control" id="recipient-name" />

                                            <ErrorMessage name="email">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>

                                            {/* <label for="recipient-name"  class="col-form-label">Payer Category:</label>
            <input type="text" placeholder='Select your payer category' class="form-control" id="recipient-name"/> */}

                                            <label for="recipient-name" class="col-form-label">Payer Category:</label>
                                            <select className='selct' name='customer_type_id'
                                                onChange={(e) => onInputChange(e)} value={customer_type_id}
                                            >
                                                <option type="text" class="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                                {
                                                    data.map((payer) => (

                                                        <option value={payer.id}>{payer.type}</option>

                                                    ))}
                                            </select>


                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary"  >Submit</button>
                                            <button type="button" class="btn btn-danger">Update</button>
                                            <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>

                        </div>
                    </div>
                </div>
            </div>

            <p className='para'>Total Records: 8</p>
            <input type="text" placeholder="Search Here" style={{ position: 'absolute', top: 370, left: 124, width: 700 }} />
            <h3 style={{ position: 'absolute', top: 370, left: 900 }}>Count per page</h3>
            <select style={{ position: 'absolute', top: 370, left: 1070, width: 100 }}>
                <option value="10">10</option>
                <option value="20">25</option>
                <option value="30">50</option>
                <option value="60">100</option>
                <option value="70">200</option>
                <option value="70">300</option>
                <option value="70">400</option>
                <option value="70">500</option>
            </select>

            {/* <table style={{ position: 'absolute', top: 450, left: 300, width: 800 }}  > */}

            {/* <tr>
                    <th>Pair Name</th>
                    <th >Mobile No.</th>
                    <th >Email ID</th>
                    <th >Payer  Category</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Action</th>
                </tr>
                
           
                


            </table>

 */}
            <div class="full-screen-scroller">

                <table data-spy="scroll" data-offset="50" class="table table-striped" style={{ position: 'absolute', top: 450, left: 124, width: 800, height: 200 }}>
                    <thead>
                        <tr>
                            <th scope='col'>Name of Payer</th>
                            <th scope='col'>Mobile No.</th>
                            <th scope='col'>Email ID</th>
                            <th scope='col'>Payer  Category</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Delete</th>

                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {data.map((user) => (
                            <tr>
                                <td>{user.name}</td>
                                <td>8920885489</td>
                                <td>rahul.singh@srslive.in</td>
                                <td>customer</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#web" onClick={(e) => handleClick(user.id)}    >Edit</button>
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
                                                    <Form>
                                                    <div class="form-group">
                                            <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                                            <Field name="name"  
                                               value={name} onChange={e => onInputChange(e)}  placeholder="Enter Name of Payer" class="form-control" id="recipient-name" />
                                                
                                                
                                                <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                            <Field name="phone_number"
                                                
                                                value={phone_number} onChange={e => onInputChange(e)} placeholder='Enter Mobile No.' class="form-control" id="recipient-name" />
                                                 
                                                 <label for="recipient-name" class="col-form-label">Email ID:</label>
                                            <Field name="email"
                                                
                                                value={email} onChange={e => onInputChange(e)} placeholder='Enter Email ID' class="form-control" id="recipient-name" />
                                                 
                                            <label for="recipient-name" class="col-form-label">Payer Category:</label><br></br>
                                            <select className='selct' name='customer_type_id'
                                                onChange={(e) => onInputChange(e)} value={customer_type_id}
                                            >
                                                <option type="text" class="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                                {
                                                    data.map((payer) => (

                                                        <option value={payer.id}>{payer.type}</option>

                                                    ))}
                                            </select>

   

</div>  
                                                    </Form>
                                                    </Formik>
                                                   
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="submit" class="btn btn-primary" >Submit</button>
                                                    <button type="button" class="btn btn-danger">Update</button>
                                                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>     </div>
                                            </div>
                                        </div>
                                    </div>


                                </td>
                                <td>
                                    <button class="btn btn-primary   mt-2"  >Delete</button>
                                </td><td>
                                    <button class="btn btn-primary   mt-2"  >Genrate Link</button>

                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
        </div>

    )
};

export default PayerDetails;
