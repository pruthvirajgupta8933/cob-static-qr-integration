import React,{useState} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const PayerDetails = () => {
    const [item, setItem] = useState({
        name: "",
        email: "",
        phone_number: "",
        customer_type: "shopkeeper"
    });
    const {name, email,phone_number}= item;
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = React.useState([])
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode } = clientMerchantDetailsList[0];
    console.log(clientMerchantDetailsList);
    //console.log(clientCode)


    const onInputChange = e => {
        console.log(e.target.value);
        setItem({ ...item, [e.target.name]: e.target.value })
    };






    const getFileName = async () => {
        // console.log(clientCode,'hello')
        await axios(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)  //MPSE1
            .then(res => {

                console.log(res)
                setData(res.data);
            })
            .catch(err => {
                console.log(err)

            });

    }



    React.useEffect(() => {
        getFileName();
    }, []);


    //    const onSubmit= async()=>{

    //         const response = await axios.post('https://paybylink.sabpaisa.in/paymentlink/addCustomers')





    //        .then((response) => {  
    //         console.warn(response);
    //       setItem(response.data);

    //          console.log(JSON.stringify(response.data));
    //        })
    //        .catch((error) => { 
    //          console.log(error);
    //        }

    //        )}
    //        const submitHandler={

    //        }
    const onSubmit= async e =>{
        e.preventDefault();
        await axios.post('https://paybylink.sabpaisa.in/paymentlink/addCustomers',item);
        console.log(item)
    
      }; 



        // const data = res.json(
    




    return (
        <div>
            <h1 className='bholu'>Create Payment Link</h1>

            <h3 className='sample'>Payer Details</h3>
            {/* <button type="button" className='btn' class="btn btn-primary">Add Single Payer</button> */}
            <button type="button" class="btn joshi btn-primary" data-toggle="modal" data-target="#exampleModal" >Add Single Payer</button>
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
                            <form onSubmit={e => onSubmit(e)} >
                                <div class="form-group">
                                    <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                                    <input type="text" name="name" value={name} onChange={e => onInputChange(e)}
                                        placeholder="Enter Name of Payer" class="form-control" id="recipient-name" />


                                    <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                    <input type="text" name="phone_number"
                                    value={phone_number}
                                    onChange={e => onInputChange(e)} placeholder='Enter Mobile No.' class="form-control" id="recipient-name" />


                                    <label for="recipient-name" class="col-form-label">Email ID:</label>
                                    <input type="text" name="email"
                                        value={email}
                                        onChange={e => onInputChange(e)} placeholder='Enter Email ID' class="form-control" id="recipient-name" />



                                    {/* <label for="recipient-name"  class="col-form-label">Payer Category:</label>
            <input type="text" placeholder='Select your payer category' class="form-control" id="recipient-name"/> */}

                                    <label for="recipient-name" class="col-form-label">Payer Category:</label><br></br>
                                    <select className='selct' >

                                        <option type="text" class="form-control" id="recipient-name"  >Select Your Payer Category</option>
                                        <option type="text" class="form-control" id="recipient-name"  >Customer</option>
                                        <option type="text" class="form-control" id="recipient-name"  >IT Company</option>
                                        <option type="text" class="form-control" id="recipient-name"  >Reseller</option>
                                        <option type="text" class="form-control" id="recipient-name"  >Shopkeeper</option>
                                        <option type="text" class="form-control" id="recipient-name"  >Vendor</option>
                                        <option type="text" class="form-control" id="recipient-name"  >Whole saler</option>
                                    </select>


                                </div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-primary" >Submit</button>
                                    <button type="button" class="btn btn-danger">Update</button>
                                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>

            <p className='para'>Total Records: 8</p>
            <input type="text" placeholder="Search Here" style={{ position: 'absolute', top: 370, left: 300, width: 700 }} />
            <h3 style={{ position: 'absolute', top: 370, left: 1150 }}>Count per page</h3>
            <select style={{ position: 'absolute', top: 370, left: 1300, width: 100 }}>
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

                <table data-spy="scroll" data-offset="50" class="table table-striped" style={{ position: 'absolute', top: 450, left: 300, width: 800, height: 200 }}>
                    <thead>
                        <tr>
                            <th scope='col'>Pair Name</th>
                            <th scope='col'>Mobile No.</th>
                            <th scope='col'>Email ID</th>
                            <th scope='col'>Payer  Category</th>
                            <th scope='col'>Edit</th>
                            <th scope='col'>Delete</th>

                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        console.log(data)
                    }

                        {data.map((user) => (
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{user.customer_type}</td>
                                <td>
                                    <button class="btn bhuvi btn-primary mt-2 "  >Edit</button>

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
