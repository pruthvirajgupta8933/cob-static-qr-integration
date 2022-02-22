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
    let clientSuperMasterList=[]
    let clientCode =''
    if(user && user.clientSuperMasterList===null){
        history.push('/dashboard/profile');
      }else{
        clientSuperMasterList = user.clientSuperMasterList;
        clientCode =  clientSuperMasterList[0].clientCode;
      }
  
    // console.log(clientSuperMasterList);
    
    // console.log(clientSuperMasterList);
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
            setData(data.filter((item) => item.name.toLowerCase().includes(searchText.toLocaleLowerCase())))
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


        console.log(res, 'succes')
loadUser()
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
        console.log(id);
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
        <div>
            <Edituser items={editform} />
            <Genratelink generatedata={genrateform} />

            {/* <button type="button" className='btn' class="btn btn-primary">Add Single Payer</button> */}

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
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
                                    <div class="modal-header">
                                        <h3 class="modal-title" id="exampleModalLabel">Add Payer Details</h3>
                                        <button type="button" class="close" onClick={resetForm} data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <Form>
                                            <div class="form-group">
                                                <label for="recipient-name"
                                                    class="col-form-label">Name of Payer:</label>
                                                <Field
                                                    name="name"
                                                    placeholder="Enter Name of Payer"
                                                    class="form-control"
                                                    autoComplete="off"
                                                />
                                                <ErrorMessage name="name">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                                <Field
                                                    name="phone_number"
                                                    id="phoneNumber"
                                                    onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder='Enter Mobile No.'
                                                    class="form-control"
                                                    pattern="\d{10}"
                                                    minlength="4" maxlength="10"
                                                />
                                                <ErrorMessage name="phone_number">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label for="recipient-name" class="col-form-label">Email ID:</label>
                                                <Field name="email"
                                                    autoComplete="off"
                                                    placeholder='Enter Email'
                                                    id="pairphn"
                                                    className="form-control" />
                                                <ErrorMessage name="email">
                                                    {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                                </ErrorMessage>

                                                <label for="recipient-name" class="col-form-label">Payer Category:</label>
                                                <Field name="customer_type_id" className="selct" component="select">
                                                    <option
                                                        type="text"
                                                        class="form-control"
                                                        id="recipient-name"
                                                    >Select Your Payer Category</option>
                                                    {
                                                        customerType.map((payer) => (
                                                            <option value={payer.id}>{payer.type}</option>
                                                        ))}
                                                </Field>
                                            </div>
                                            <div class="modal-footer">
                                                <button
                                                    type="submit"
                                                    class="btn btn-primary" >
                                                    Submit
                                                </button>
                                                <button
                                                    type="button" disabled
                                                    class="btn btn-danger">
                                                    Update
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn btn-primary"
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
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add Single Payer</button>
                   
                    </div>
                   
                    <div style={{display:"flex" }}>
                        <div>
                            <input onChange={getSearchTerm} type="text" placeholder="Search Here" style={{width: "600px", marginRight: "5em"}} />
                        </div>
                        <div style={{margin:"0px ​4px 0px 18em"}}>
                            <span style={{marginRight:"5px"}}>Count per page</span>
                            <select style={{ width: 130 }}>
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
                    <p className=''>Total Records:{data.length}</p>
                </div>
            </div>


            <div class="full-screen-scroller">

                <table data-spy="scroll" data-offset="50" class="table table-striped" style={{ position: 'absolute'}}>
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

                            <tr>
                                <td>{i + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{user.customer_type}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#web" onClick={(e) => handleClick(user.id)}    >Edit</button>
                                </td>
                                <td>
                                    <button class="btn btn-primary mt-7" onClick={() => deleteUser(user.id)}  >Delete</button>
                                </td><td>
                                    <button onClick={(e) => generateli(user.id)}

                                        type="button"
                                        class="btn btn-primary"
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


        </div >



    )
};

export default PayerDetails;
