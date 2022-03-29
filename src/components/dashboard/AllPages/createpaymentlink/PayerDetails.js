import React, { useState, useEffect } from 'react';
//import Genratelink from './Genratelink';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link ,useHistory} from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Genratelink from './Genratelink';
import { Edituser } from './Edituser';
import { toast, Zoom } from 'react-toastify';
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/




const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "It's too short").matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").required("Required"),
    phone_number: Yup.string()
    .required("required")
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, "to short")
    .max(10, "to long"),
    email: Yup.string().email("Enter valid email").required("Required")
})

const PayerDetails = () => {
    let history = useHistory();
 const [editform, setEditForm] = useState({
        myname: "",
        email: "",
        phone: "",
        editCustomerTypeId: "",
        id: ""
    })
    const [genrateform, setGenrateForm] = useState({
        customer_id: '',
    })
    const [searchText, setSearchText] = useState("");
    const { user } = useSelector((state) => state.auth);
    // const [formData, setFormData] = useState(initialValues)

    const [data, setData] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [customerType, setCustomerType] = useState([]);
    let clientMerchantDetailsList=[]
    let clientCode =''
    if(user && user.clientMerchantDetailsList===null){
        console.log("payerDetails");
        history.push('/dashboard/profile');
      }else{
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode =  clientMerchantDetailsList[0].clientCode;
      }
  
    // console.log(clientMerchantDetailsList);
    
    // console.log(clientMerchantDetailsList);
    //console.log(clientCode)
    // const onInputChange = e => {
    //     // console.log(e.target.value);
    //     setItem({ ...item, [e.target.name]: e.target.value })
    // };

    useEffect(() => {
        loadUser();
        getDrop();
    }, []);

// Alluser data API INTEGRATION

    const loadUser = async () => {
        const result = await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)
            // const data = result.data;
            // console.log(result.data);  
            .then(res => {
                // console.log(res)
                setData(res.data);
            })
            .catch(err => {
                console.log(err)

            })
    }
    // SEARCH FILTER 

    useEffect(() => {
        if (searchText.length > 0) {
            setData(data.filter((item) => 
            
            Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
        } else {
            loadUser()
        }
    }, [searchText])

    const getSearchTerm = (e) => {
        setSearchText(e.target.value);
    };

    // ADD User Dropdown api integration

    const getDrop = async (e) => {
        await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes`)
            .then(res => {
                setCustomerType(res.data);
            })
            .catch(err => {
                console.log(err)
            });

    }

    //ADD user API Integration
    const onSubmit = async (e) => {
        // console.log(e)
        const res = await axios.post('https://paybylink.sabpaisa.in/paymentlink/addCustomers', {
            name: e.name,
            email: e.email,
            phone_number: e.phone_number,
            client_code: clientCode,
            customer_type_id: e.customer_type_id
        });


        // console.log(res, 'succes')
        loadUser();
        if (res.status === 200) {
            ;
            toast.success("Payment Link success", {
                position: "top-right",
                autoClose: 2000,
                transition: Zoom
            })
        } else {
            toast.error("something went wrong", {
                position: "top-right",
                autoClose: 2000,
                transition: Zoom
            })
        }
    };

    // USE FOR EDIT FORM

    const handleClick = (id) => {
        //console.log(id);
        data.filter((dataItem) => {
            if (dataItem.id === id) {
                setEditForm(
                    {
                        myname: dataItem.name,
                        email: dataItem.email,
                        phone: dataItem.phone_number,
                        editCustomerTypeId: dataItem.customer_type_id,
                        id: dataItem.id

                    }
                )

            }
        })
    }
    // USE FOR GENERETE LINK
    const generateli = (id) => {
        // console.log(id);
        data.filter((dataItem) => {
            if (dataItem.id === id) {
                setGenrateForm({
                    customer_id: id
                })

            }
        })
    }

    const deleteUser = async id => {
        // confirm("do you confirm to delete it");
        var iscConfirm = window.confirm("Are you sure you want to delete it");
        if (iscConfirm) {
    await axios.delete(`https://paybylink.sabpaisa.in/paymentlink/deleteCustomer?Client_Code=${clientCode}&Customer_id=${id}`);
            loadUser();
        }
    };

    return (
        <div className='col-lg-12'>
            <Edituser items={editform} />
            <Genratelink generatedata={genrateform} />

            {/* <button type="button" className='btn' className="btn btn-primary">Add Single Payer</button> */}

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <Formik
                            initialValues={
                                {
                                    name: "",
                                    email: "",
                                    phone_number: "",
                                    customer_type_id: 0
                                }
                            }
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                onSubmit(values)                 // this onsubmit used for api integration
                                resetForm()
                            }}>
                            {({ resetForm }) => (

                                <>
                                    <div className="modal-header">
                                        <h3 className="modal-title" id="exampleModalLabel">Add Payer Details</h3>
                                        <button type="button" className="close" onClick={resetForm} data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="recipient-name"
                                                    className="col-form-label">Name of Payer:</label>
                                                <Field
                                                    name="name"
                                                    placeholder="Enter Name of Payer"
                                                    className="form-control"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessage name="name">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label htmlFor="recipient-name" className="col-form-label">Mobile No.:</label>
                                                <Field
                                                    name="phone_number"
                                                    id="phoneNumber"
                                                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder='Enter Mobile No.'
                                                    className="form-control"
                                                    pattern="\d{10}"
                                                    minLength="4" maxLength="10"
                                                />
                                                <ErrorMessage name="phone_number">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label htmlFor="recipient-name" className="col-form-label">Email ID:</label>
                                                <Field name="email"
                                                    autoComplete="off"
                                                    placeholder='Enter Email'
                                                    id="pairphn"
                                                    className="form-control" />
                                                <ErrorMessage name="email">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label htmlFor="recipient-name" className="col-form-label">Payer Category:</label>
                                                <Field name="customer_type_id" className="selct" component="select">
                                                    <option
                                                        type="text"
                                                        className="form-control"
                                                        id="recipient-name"
                                                    >Select Your Payer Category</option>
                                                    {
                                                        customerType.map((payer,i) => (
                                                            <option value={payer.id} key={i}>{payer.type}</option>
                                                        ))}
                                                </Field>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary" >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button" disabled
                                                    className="btn btn-danger">
                                                    Update
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    data-dismiss="modal"
                                                    onClick={resetForm}>
                                                    Cancel
                                                </button>
                                            </div>

                                        </Form>
                                    </div>
                                </>
                            )}
                        </Formik>

                    </div>
                </div>
            </div>
            {/* end add form */}

            <div className="main_filter_area">
             
                <div className="filter_area" style={{margin:"14px"}}>
                    <div>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add Single Payer</button>
                   
                    </div>
                   
                    <div className="row">
                        <div className='col-lg-6'>
                            <label> &nbsp;</label>
                            <input className='form-control marright' onChange={getSearchTerm} type="text" placeholder="Search Here" style={{width: "600px", marginRight: "5em"}} />
                        </div>
                        <div className='col-lg-6'>
                            <label>Count per page</label>
                            <select className='form-control'>
                                <option value="10">10</option>
                                <option value="20">25</option>
                                <option value="30">50</option>
                                <option value="60">100</option>
                                <option value="70">200</option>
                                <option value="70">300</option>
                                <option value="70">400</option>
                                <option value="70">500</option>
                            </select>
                        </div>
                    </div>
                    <label className=''>Total Records:{data.length}</label>
                </div>
                
            </div>


            <div className="full-screen-scroller">

                <table data-spy="scroll" border="0" data-offset="50" className="table table-striped" width="100%">
                    <thead>
                        <tr>
                            <th scope='col'>Serial.No</th>
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

                        {data.map((user, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{user.customer_type}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#web" onClick={(e) => handleClick(user.id)}    >Edit</button>
                                </td>
                                <td>
                                    <button className="btn btn-primary mt-7" onClick={() => deleteUser(user.id)}  >Delete</button>
                                </td><td>
                                    <button onClick={(e) => generateli(user.id)}

                                        type="button"
                                        className="btn btn-primary"
                                        data-toggle="modal"
                                        data-target="#bhuvi"
                                        data-whatever="@getbootstrap"

                                    >
                                        Genrate Link
                                    </button>
                                    <div>

                                    </div>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
            </div>
        </div>



    )
};

export default PayerDetails;
