import React, { useState, useEffect } from 'react';
//import Genratelink from './Genratelink';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Genratelink from './Genratelink';
import { Edituser } from './Edituser';
import {toast} from 'react-toastify';


const initialValues = {
    name: "",
    email: "",
    phone_number: ""
}

const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        phone_number: Yup.string().required("Required"),
        email: Yup.string().email("Enter valid email").required("Required")
    })

const PayerDetails = () => {

    const [item, setItem] = useState({
        newName: "",
        NewEmail: "",
        NewPhoneNumber: "",
        newCustomerTypeId: ""
    });
    const[editform, setEditForm]=useState({
        myname:"",
        email:"",
        phone:"",
        editCustomerTypeId:"",
        id:""
    })
    const[genrateform,setGenrateForm]=useState({
        customer_id: '',
    })
    
    const { newName, NewEmail, NewPhoneNumber, newCustomerTypeId } = item;
    const [name , setName ] = useState('');

    const [myemail , setMyEmail]=useState('');
    const [customerTypeId , setCustomerTypeId]=useState('');
    const [phoneNumber , setPhoneNumber]=useState('');
    const [searchText, SetSearchText] = useState("");

    const { user } = useSelector((state) => state.auth);
    // const [formData, setFormData] = useState(initialValues)

    const [data, setData] = useState([])
    const [customerType,setCustomerType]= useState([]);
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode } = clientMerchantDetailsList[0];
    // console.log(clientMerchantDetailsList);
    //console.log(clientCode)
    // const onInputChange = e => {
    //     // console.log(e.target.value);
    //     setItem({ ...item, [e.target.name]: e.target.value })
    // };


    const loadUser = async () => {
        const result = await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}` )
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
    const getSearchTerm = (e) => {
        SetSearchText(e.target.value);
        console.log(e);
        if (searchText !== "") {
          setData(
            data.filter((item) =>{
              item.join("")
              
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            })
          );
        }
      };
    // const getFileName = async () => {
    //     // console.log(clientCode,'hello')
    //     await axios(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)  //MPSE1
    //         .then(res => {
    //             // console.log(res)
    //             setData(res.data);
    //         })
    //         .catch(err => {
    //             console.log(err)

    //         });

    // }
    
    const getDrop = async (e) => {
        await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getCustomerTypes`)
            .then(res => {
                setCustomerType(res.data);
            })
            .catch(err => {
                console.log(err)
            });

    }
    const onSubmit = async e => {
        e.preventDefault();
        toast.success("Payment Link success")
        // if(item.status===200)
        // alert("succes")
        // else{
        //     alert("Payer Name required !")
        // }
        console.log(item);

        setName('');
        setMyEmail('');
        setCustomerTypeId('');
        setPhoneNumber('');

        const res = await axios.post('https://paybylink.sabpaisa.in/paymentlink/addCustomers', {
            name: name,
            email:myemail,
            phone_number: phoneNumber,
            client_code: clientCode,
            customer_type_id: customerTypeId
        });

        console.log(res)
            .then((res) => {
                
                console.log(JSON.stringify(res.data))

            })


           



        // setItem([])
};
const handleClick = (id) => {
//console.log(id);
    data.filter((dataItem) => {
        if (dataItem.id === id) {
            setEditForm(
                {
                    myname: dataItem.name,
                    email:dataItem.email,
                    phone:dataItem.phone_number,
                   editCustomerTypeId:dataItem.customer_type_id,
                   id:dataItem.id

                }
            )
            // Working on it
        }
})
}

const generateli = (id) => {
    console.log(id);
    data.filter((dataItem) => {
        if (dataItem.id === id) {
    setGenrateForm({
        customer_id : id
    })

}
    })}
    


        //console.log('this is harry');
        //console.log(id);
  
 
    
    const deleteUser = async id => {
        // confirm("do you confirm to delete it");
        var iscConfirm = window.confirm("Are you sure you want to delete it");
        if(iscConfirm){
            await axios.delete(`https://paybylink.sabpaisa.in/paymentlink/deleteCustomer?Client_Code=${clientCode}&Customer_id=${id}`);
            loadUser();
        }     
    };
    useEffect(() => {
     loadUser();
     getDrop();
    }, []);
    
      
    



    // const genrateLinkFc=(id)=>{
    //     console.log(id);
    // }

    //console.log("data=",data);
    console.log("editform",editform);
    return (
        <div>
            <Edituser items={editform} />
           <Genratelink generatedata= {genrateform}/>
            
            {/* <button type="button" className='btn' class="btn btn-primary">Add Single Payer</button> */}
            
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
                            <Formik 
                             initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmit}>
                                {(props) => (
                                    <Form onSubmit={e => onSubmit(e)} >
                                        <div class="form-group">
                                            <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                                            <Field name="name" value={name} onChange={e => setName(e.target.value)}
                                                placeholder="Enter Name of Payer" class="form-control" id="pairname" />
                                            <ErrorMessage name="name">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>
                                            <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                            <Field name="phone_number"
                                                value={phoneNumber}
                                                onChange={e => setPhoneNumber(e.target.value)} helperText={<ErrorMessage name="phone_number" />} placeholder='Enter Mobile No.' class="form-control" id="pairemail" />
                                            <ErrorMessage name="phone_number">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>

                                            <label for="recipient-name" class="col-form-label">Email ID:</label>
                                            <Field name="email"
                                                value={myemail}
                                                onChange={e => setMyEmail(e.target.value)} placeholder='Enter Email ID' class="form-control" id="pairphn" />

                                            <ErrorMessage name="email">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>


                                            <label for="recipient-name" class="col-form-label">Payer Category:</label>
                                            <select className='selct' name='customer_type_id'
                                                onChange={(e) => setCustomerTypeId(e.target.value)} value={customerTypeId}
                                            >
                                                <option type="text" class="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                                {
                                                    customerType.map((payer) => (
                                                        <option value={payer.id}>{payer.type}</option>
                                                    ))}
                                            </select>


                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-primary"  >Submit</button>
                                            <button type="button" disabled class="btn btn-danger">Update</button>
                                            <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                                        </div>

                                    </Form>
                                )}
                            </Formik>

                        </div>
                    </div>
                </div>
            </div>
        {/* end add form */}
                
                <div className="main_filter_area">
                    <div className='Form_add_btn'>
                        <button type="button" class="btn joshi btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ marginLeft: '-200px', marginTop: '-70px' }} >Add Single Payer</button>
                    </div>
                    <div className="filter_area">
                    <p className='para'>Total Records:{data.length}</p>
                        <input value={searchText} onChange={getSearchTerm} type="text" placeholder="Search Here" style={{ position: 'absolute', top: 320, left: 12, width: 700 }} />
                        <h3 style={{ position: 'absolute', top: 320, left: 800 }}>Count per page</h3>
                        <select style={{ position: 'absolute', top: 320, left: 930, width: 130 }}>
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

            
            <div class="full-screen-scroller">

                <table data-spy="scroll" data-offset="50" class="table table-striped" style={{ position: 'absolute', top: 380, left: 12, height: 200 }}>
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

                        {data.map((user,i) => (

                            <tr>
                                <td>{i+1}</td>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{user.customer_type}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#web" onClick={(e) => handleClick(user.id)}    >Edit</button>
                                </td>
                                <td>
                                    <button class="btn btn-primary mt-2"  onClick={() => deleteUser(user.id)}  >Delete</button>
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
            

        </div>


                        
    )
};

export default PayerDetails;
