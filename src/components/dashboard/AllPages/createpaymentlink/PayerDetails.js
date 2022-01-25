
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const PayerDetails = () => {
    const initialState = {
        name: "",
        email: "",
        phone_number: "",
        customer_type: ""
    }
    const { user } = useSelector((state) => state.auth);
    const [data, setData] = React.useState([])
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode } = clientMerchantDetailsList[0];
    console.log(clientMerchantDetailsList);






    const getFileName = async () => {
        await axios(`https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`)  //MPSE1
            .then(res => {
                console.log(res.data)
                setData(res.data);
            })
            .catch(err => {
                console.log(err)
            });

    }



    React.useEffect(() => {
        getFileName();
    }, []);



<<<<<<< HEAD
    return (
        <div>
            <h1 className='bholu'>Create Payment Link</h1>
=======
  return(
      <div>
          <h1 >Create Payment Link</h1>
>>>>>>> phase_hrry

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
                            <form>
                                <div class="form-group">
                                    <label for="recipient-name" class="col-form-label">Name of Payer:</label>
                                    <input type="text" placeholder="Enter Name of Payer" class="form-control" id="recipient-name" />


                                    <label for="recipient-name" class="col-form-label">Mobile No.:</label>
                                    <input type="text" placeholder='Enter Mobile No.' class="form-control" id="recipient-name" />


                                    <label for="recipient-name" class="col-form-label">Email ID:</label>
                                    <input type="text" placeholder='Enter Email ID' class="form-control" id="recipient-name" />



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

                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" >Add user</button>
                            <button type="button" class="btn btn-danger">Send message</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
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
            <table class="table table-striped" style={{ position: 'absolute', top: 450, left: 300, width: 800 }}>
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
                    
                         {data.map((user) => ( 
                            <tr>
                                <td>{user.name}</td>
                                <td>8920885489</td>
                                <td>rahul.singh@srslive.in</td>
                                <td>customer</td>
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

    )
};

export default PayerDetails;
