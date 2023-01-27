import React, { useState, useEffect } from 'react'
import NavBar from '../dashboard/NavBar/NavBar'
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import Spinner from './Spinner';
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import toastConfig from "../../utilities/toastTypes";
import { onboardedReport } from '../../slices/kycSlice';
import moment from "moment";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";



const validationSchema = Yup.object({
    from_date: Yup.date().required("Required").nullable(),
    to_date: Yup.date()
        .min(Yup.ref("from_date"), "End date can't be before Start date")
        .required("Required"),
        status:Yup.string().required("Required")

})


const OnboardedReport = () => {
    const [spinner, setSpinner] = useState(false);
    const [data, setData] = useState([]);
    const [verfiedMerchant, setVerifiedMerchant] = useState([]);
    const [dataCount, setDataCount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [kycIdClick, setKycIdClick] = useState(null);
    const [displayPageNumber, setDisplayPageNumber] = useState([]);
     const [isLoaded, setIsLoaded] = useState(false)
    const [onboardValue, setOnboradValue] = useState("")
    const [showData, setShowData] = useState(false)
    const [selectedvalue, setSelectedvalue] = useState("")
    const[disabled,setDisabled]=useState(false)
    console.log("this is value",selectedvalue)

    const VerierAndApproverSearch = (e) => {
        setSearchText(e.target.value);
    };


    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");

    const [todayDate, setTodayDate] = useState(splitDate);
   
    const initialValues = {
        from_date: todayDate,
        to_date: todayDate,
        status:""

    }

    const dispatch = useDispatch();



    let selectedChoice = selectedvalue === "1" ? "Verified" : selectedvalue === "2" ? "Approved" : ""
    
    console.log("this is selected",selectedChoice)

    const handleSubmit = (values) => {
        setOnboradValue(values)
        setDisabled(true)
        dispatch(onboardedReport({ page: currentPage, page_size: pageSize,selectedChoice, "from_date": values.from_date, "to_date": values.to_date }))
            .then((resp) => {
                const tableData = resp?.payload?.results.length;
                tableData.length === 0 && tableData === null || [] ? <></> : toastConfig.successToast("Data Loaded")

               
                setSpinner(false);
                setSpinner(false);

                const data = resp?.payload?.results;

                const dataCoun = resp?.payload?.count;
                // setKycIdClick(data);
                setData(data);
                setDataCount(dataCoun);
                setShowData(true)
                setVerifiedMerchant(data);
                setDisabled(false)

                // setIsLoaded(false)   
            })

            .catch((err) => {
                toastConfig.errorToast("Data not loaded");
                setDisabled(false)
            });

    }


    useEffect(() => {
        if (searchText.length > 0) {
            setData(
                verfiedMerchant.filter((item) =>
                    Object.values(item)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText?.toLocaleLowerCase())
                )
            );
        } else {
            setData(verfiedMerchant);
        }
    }, [searchText]);




    useEffect(() => {
        dispatch(onboardedReport({ page: currentPage, page_size: pageSize, selectedChoice, "from_date": onboardValue.from_date, "to_date": onboardValue.to_date }))
            .then((resp) => {
                // resp?.payload?.status_code && toastConfig.errorToast("");
                setSpinner(false);

                const data = resp?.payload?.results;
                const dataCoun = resp?.payload?.count;
                setData(data);
                setKycIdClick(data);
                setDataCount(dataCoun);
                setVerifiedMerchant(data);
                setIsLoaded(false)
            })

            .catch((err) => {
                
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize]);


    // const indexOfLastRecord = currentPage * pageSize;

    const totalPages = Math.ceil(dataCount / pageSize);
    let pageNumbers = []
    if (!Number.isNaN(totalPages)) {
        pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
    }


    const nextPage = () => {
        setIsLoaded(true)
        setData([])
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        setIsLoaded(true)
        setData([])
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    useEffect(() => {
        let lastSevenPage = totalPages - 7;
        if (pageNumbers?.length > 0) {
            let start = 0;
            let end = currentPage + 6;
            if (totalPages > 6) {
                start = currentPage - 1;

                if (parseInt(lastSevenPage) <= parseInt(start)) {
                    start = lastSevenPage;
                }
            }
            const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
                return pgNumber;
            });
            setDisplayPageNumber(pageNumber);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalPages]);

  

    const selectStatus = [
        {key:"0",value:"Select"},
        { key: "1", value: "Verified" },
        { key: "2", value: "Approved" },
    ]
 
   return (
        <section className="ant-layout">
            <div>
                <NavBar />
            </div>
            <div className="gx-main-content-wrapper">
                <div className="right_layout my_account_wrapper right_side_heading">
                    <h1 className="m-b-sm gx-float-left mt-4">Verified and Approved Merchant</h1>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    // onSubmit={(values)=>handleSubmit(values)}
                    onSubmit={(values, { resetForm }) => {
                        handleSubmit(values)

                    }}
                    enableReinitialize={true}
                >
                    {(formik, resetForm) => (
                        <Form>
                            <div className="container">
                                <div className="row">

                                    <div className="form-group col-md-3">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="From Date"
                                            name="from_date"
                                            className="form-control rounded-0"
                                        // value={startDate}
                                        // onChange={(e)=>setStartDate(e.target.value)}
                                        />

                                    </div>

                                    <div className="form-group col-md-4 mx-3">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="End Date"
                                            name="to_date"
                                            className="form-control rounded-0"
                                        />



                                    </div>
                                    <div className="form-group col-md-4 mx-3">

                                        <FormikController
                                            control="select"
                                            type="date"
                                            label="Select your choice"
                                            name="status"
                                            options={selectStatus}
                                            className="form-control rounded-0"
                                        />
                                        {formik.handleChange(
                                            "status",
                                            setSelectedvalue(formik?.values?.status)
                                        )}



                                    </div>
                                    <div className=" col-md-4 mx-3">
                                        <button
                                         type="subbmit"
                                          className="btn approve text-white btn-xs"
                                          disabled={disabled}
                                          >Submit</button>

                                    </div>
                                    {showData === true  ?
                                    
                                        <div className="container-fluid flleft">
                                            <div className="form-group col-lg-3 col-md-12 mt-2">
                                                <label>Search</label>
                                                <input
                                                    className="form-control"
                                                    onChange={VerierAndApproverSearch}
                                                    type="text"
                                                    placeholder="Search Here"
                                                />
                                            </div>
                                            <div>


                                            </div>
                                            <div className="form-group col-lg-3 col-md-12 mt-2">
                                                <label>Count Per Page</label>
                                                <select
                                                    value={pageSize}
                                                    rel={pageSize}
                                                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                                                    className="ant-input"
                                                >
                                                    <DropDownCountPerPage datalength={dataCount} />
                                                </select>
                                            </div>


                                            {/* <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=approved'} filename={"Approved"} /> */}

                                        </div>

                                        : <></> }
                                   



                                </div>
                            </div>

                        </Form>
                    )}

                </Formik>


              
                {showData === true ?
                <div className="col-md-12 col-md-offset-4">
                    <div className="scroll overflow-auto">


                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Client Code</th>
                                    <th>Company Name</th>
                                    <th>Merchant Name</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>KYC Status</th>
                                    <th>Registered Date</th>
                                    <th>Onboard Type</th>

                                </tr>
                            </thead>
                            <tbody>
                                {/* {spinner && <Spinner />} */}
                                {data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={"11"}>
                                            <div className="nodatafound text-center">No data found </div>
                                            <br /><br /><br /><br />
                                            <p className="text-center">{spinner && <Spinner />}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data?.map((user, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{user.clientCode}</td>
                                            <td>{user.companyName}</td>
                                            <td>{user.name}</td>
                                            <td>{user.emailId}</td>
                                            <td>{user.contactNumber}</td>
                                            <td>{user.status}</td>
                                            <td>{user.signUpDate}</td>
                                            <td>{user?.isDirect}</td>
                                            <td>


                                            </td>
                                            {/* <td>{user?.comments}</td> */}


                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                    <nav>
                        <ul className="pagination justify-content-center">
                            {isLoaded === true ? <Spinner /> : (
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={prevPage}>
                                        Previous
                                    </button>
                                </li>)}
                            {displayPageNumber?.map((pgNumber, i) => (
                                <li
                                    key={i}
                                    className={
                                        pgNumber === currentPage ? " page-item active" : "page-item"
                                    }
                                    onClick={() => setCurrentPage(pgNumber)}
                                >
                                    <a href={() => false} className={`page-link data_${i}`}>
                                        <span >
                                            {pgNumber}
                                        </span>
                                    </a>
                                </li>
                            ))}

                            {isLoaded === true ? <Spinner /> : (
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={nextPage}
                                        disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
                                    >
                                        Next
                                    </button>
                                </li>)}
                        </ul>
                    </nav>

                </div>
                : <></> }
                
                     


            </div>

        </section>


    )
}

export default OnboardedReport;
