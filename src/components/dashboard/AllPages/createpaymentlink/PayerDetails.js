/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory} from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import _ from 'lodash';
import * as Yup from 'yup'
import Genratelink from './Genratelink';
import { Edituser } from './Edituser';
// import { toast, Zoom } from 'react-toastify';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
import DropDownCountPerPage from '../../../../_components/reuseable_components/DropDownCountPerPage';


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
    const [displayList, setDisplayList] = useState([])
    const [data, setData] = useState([])
    const [customerType, setCustomerType] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [paginatedata, setPaginatedData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount,setPageCount ] = useState(data ? Math.ceil(data.length/pageSize) : 0);


    let clientMerchantDetailsList=[]
    let clientCode =''
    if(user && user.clientMerchantDetailsList===null){
        // console.log("payerDetails");
        history.push('/dashboard/profile');
      }else{
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode =  clientMerchantDetailsList[0].clientCode;
      }

// Alluser data API INTEGRATION
const loadUser = async () => {
    await axios.get(API_URL.GET_CUSTOMERS + clientCode)
        .then(res => {
            // console.log(res)
            setData(res.data);
            setDisplayList(res.data);
            setPaginatedData(_(res.data).slice(0).take(pageSize).value())
        })
        .catch(err => {
            console.log(err)
        })
}

    useEffect(() => {
        loadUser();
        getDrop();
    }, []);


    // SEARCH FILTER 

    useEffect(() => {
        if (searchText.length > 0) {
            setDisplayList(data.filter((item) => 
            Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
        } else {
            setDisplayList(data)
        }
    }, [searchText])

    const getSearchTerm = (e) => {
        setSearchText(e.target.value);
    };


    useEffect(()=>{
        setPaginatedData(_(displayList).slice(0).take(pageSize).value())
        setPageCount(displayList.length>0 ? Math.ceil(displayList.length/pageSize) : 0)
      },[pageSize, displayList]);
      
      useEffect(() => {
        // console.log("page chagne no")
        const startIndex = (currentPage - 1) * pageSize;
       const paginatedPost = _(displayList).slice(startIndex).take(pageSize).value();
       setPaginatedData(paginatedPost);
      
      }, [currentPage])
      

      const pages = _.range(1, pageCount + 1)



    // ADD User Dropdown api integration

    const getDrop = async (e) => {
        await axios.get(API_URL.GET_CUSTOMER_TYPE)
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
        const res = await axios.post(API_URL.ADD_CUSTOMER, {
            name: e.name,
            email: e.email,
            phone_number: e.phone_number,
            client_code: clientCode,
            customer_type_id: e.customer_type_id
        });


        loadUser();
        if (res.status === 200) {
            toastConfig.successToast("Payee added successfully")
        } else {
            toastConfig.errorToast("something went wrong")
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
    await axios.delete(`${API_URL.DELETE_CUSTOMER}?Client_Code=${clientCode}&Customer_id=${id}`);
            loadUser();
        }
    };



    
const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }

  const edit = () =>{
    loadUser();
  }

    return (

        <React.Fragment>

            <Edituser items={editform} callBackFn={edit} />
            <Genratelink generatedata={genrateform} />
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
                                                    type="button"
                                                    className="btn btn-danger text-white"
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

        {/* filter area */}
        <section className="features8 cid-sg6XYTl25a " id="features08-3-1">
                <div className="container-fluid">
                <div className="row">    
                    <div className="col-lg-4 pl-4">
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add Single Payer</button>
                    </div>
                </div>

                    <div className="row">  
                    <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Search</label>
                        <input className='form-control' onChange={getSearchTerm} type="text" placeholder="Search Here" />
                    </div>
                    <div className="col-lg-4 mrg-btm- bgcolor">
                        <label>Count Per Page</label>
                        <select value={pageSize} rel={pageSize} className="ant-input" onChange={(e) =>setPageSize(parseInt(e.target.value))} >
                        <DropDownCountPerPage datalength={data.length} />
                        </select>
                    </div>
                    
                    </div>
                    <div className="row">
                    <div className="col-lg-4 mrg-btm- bgcolor">
                            <p>Total Records:{data.length}</p>
                    </div>
                    </div>
                    
                </div>
            </section>

    <section className="">
        <div className="container-fluid  p-3 my-3 ">
            <div className="scroll overflow-auto">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Name of Payer</th>
                        <th scope="col">Mobile No.</th>
                        <th scope="col">Email ID</th>
                        <th scope="col">Payer  Category</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                        <tbody>
                        {paginatedata.map((user, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.email}</td>
                                <td>{user.customer_type}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#web" onClick={(e) => handleClick(user.id)} >Edit</button>
                                </td>
                                <td>
                                    <button className="btn btn-primary mt-7" onClick={() => deleteUser(user.id)}  >Delete</button>
                                </td>
                                <td>
                                    <button onClick={(e) => generateli(user.id)}
                                        type="button"
                                        className="btn btn-primary"
                                        data-toggle="modal"
                                        data-target="#bhuvi"
                                        data-whatever="@getbootstrap"
                                    >Generate Link
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
                {paginatedata.length>0  ? 
                    <nav aria-label="Page navigation example"  >
                    <ul className="pagination">
                    <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={()=>false}>Previous</a>
                    { 
                      pages.slice(currentPage-1,currentPage+6).map((page,i) => (
                        <li key={i} className={
                          page === currentPage ? " page-item active" : "page-item"
                        }> 
                            <a href={()=>false} className={`page-link data_${i}`} >  
                              <p onClick={() => pagination(page)}>
                              {page}
                              </p>
                            </a>
                        </li>
                      
                      ))
                    }
                { pages.length!==currentPage? <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === (pages.length>9) ? nex : nex + 1)} href={()=>false}>
                      Next</a> : <></> }
                    </ul>
                  </nav>
                  : <></> }
            </div>

    </div>
    </section>
</React.Fragment>
)
};

export default PayerDetails;
