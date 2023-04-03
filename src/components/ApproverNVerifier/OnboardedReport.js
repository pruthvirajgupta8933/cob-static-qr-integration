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
import { exportToSpreadsheet } from '../../utilities/exportToSpreadsheet';



const validationSchema = Yup.object({
    from_date: Yup.date().required("Required").nullable(),
    to_date: Yup.date()
        .min(Yup.ref("from_date"), "End date can't be before Start date")
        .required("Required"),
    status: Yup.string().required("Required")

})


const OnboardedReport = () => {
    const [spinner, setSpinner] = useState(false);
    const [data, setData] = useState([]);
    const [verfiedMerchant, setVerifiedMerchant] = useState([]);
    const [dataCount, setDataCount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    // eslint-disable-next-line no-unused-vars
    const [kycIdClick, setKycIdClick] = useState(null);
    const [displayPageNumber, setDisplayPageNumber] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false)
    const [onboardValue, setOnboradValue] = useState("")
    const [showData, setShowData] = useState(false)
    const [selectedvalue, setSelectedvalue] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [authDate,setAuthDate] = useState("")

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

    // eslint-disable-next-line no-unused-vars
    const [todayDate, setTodayDate] = useState(splitDate);

    const initialValues = {
        from_date: todayDate,
        to_date: todayDate,
        status: ""

    }

    const dispatch = useDispatch();



    let selectedChoice = selectedvalue === "1" ? "Verified" : selectedvalue === "2" ? "Approved" : ""




    const handleSubmit = (values) => {
        setOnboradValue(values)
        setDisabled(true)
        dispatch(onboardedReport({ page: currentPage, page_size: pageSize, selectedChoice,"from_date": values.from_date, "to_date": values.to_date }))
            .then((resp) => {
                resp?.payload?.results.length ? toastConfig.successToast("Data Loaded") : toastConfig.errorToast("No Data Found")

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);




    useEffect(() => {
        dispatch(onboardedReport({ page: currentPage, page_size: pageSize, selectedChoice, "from_date": onboardValue.from_date, "to_date": onboardValue.to_date }))
            .then((resp) => {

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
        { key: "0", value: "Select" },
        { key: "1", value: "Verified" },
        { key: "2", value: "Approved" },
    ]


    const exportToExcelFn = () => {
        const excelHeaderRow = [
            "S.No",
            "Name",
            "Email",
            "Mobile Number",
            "Created Date",
            "Status",
            "Business Category Name",
            "Business Category Code",
            "Company Name",
            "Company's Website",
            "GST Number",
            "Business Type",
            "Expected Transactions",
            "Zone Code",
            "Address",
            "Product Name",
            "Plan Name",
            "Landing  Page Name",
            "Platform",
        ];
        let excelArr = [excelHeaderRow];
        // eslint-disable-next-line array-callback-return
        data.map((item, index) => {

            const allowDataToShow = {
                srNo: item.srNo === null ? "" : index + 1,
                name: item.name === null ? "" : item.name,
                email: item.email === null ? "" : item.email,
                mobileNumber: item.mobileNumber === null ? "" : item.mobileNumber,
                createdDate: item.createdDate === null ? "" : item.createdDate,
                status: item.status === null ? "" : item.status,
                business_category_name: item.business_category_name === null ? "" : item.business_category_name,
                business_cat_code: item.business_cat_code === null ? "" : item.business_cat_code,
                company_name: item.company_name === null ? "" : item.company_name,
                companyWebsite: item.companyWebsite === null ? "" : item.companyWebsite,
                gstNumber: item.gstNumber === null ? "" : item.gstNumber,
                businessType: item.businessType === null ? "" : item.businessType,
                expectedTransactions: item.businessType === null ? "" : item.expectedTransactions,
                zone_code: item.zone_code === null ? "" : item.zone_code,
                address: item.address === null ? "" : item.address,
                product_name: item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.appName,
                plan_name: item?.website_plan_details?.planName === null ? "" : item?.website_plan_details?.planName,
                landing_page_name: item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.page,
                platForm: item?.website_plan_details?.appName === null ? "" : item?.website_plan_details?.platform,
            };

            excelArr.push(Object.values(allowDataToShow));
        });
        const fileName = "Onboarded-Report";
        exportToSpreadsheet(excelArr, fileName);
    };

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

                                    <div className="form-group col-md-4">
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

                                    <div className="form-group col-md-4 ">
                                        <FormikController
                                            control="input"
                                            type="date"
                                            label="End Date"
                                            name="to_date"
                                            className="form-control rounded-0"
                                        />



                                    </div>
                                    <div className="form-group col-md-4">
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
                                    <div className=" col-md-3 ">
                                        <button
                                            type="subbmit"
                                            className="btn approve text-white btn-xs"
                                            disabled={disabled}

                                        >Submit</button>


                                    </div>
                                    {showData === true ?


                                        <div className="container-fluid flleft">
                                            <div className="form-group col-lg-4 col-md-12 mt-2">
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
                                            <div className="form-group col-lg-4 col-md-12 mt-2">
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

                                            <div className="form-group col-lg-4 col-md-12 mt-5">
                                                <button
                                                    className="btn btn-sm text-white"
                                                    type="button"
                                                    onClick={() => exportToExcelFn()}
                                                    style={{ backgroundColor: "rgb(1, 86, 179)" }}
                                                >
                                                    Export
                                                </button>
                                            </div>


                                            {/* <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=approved'} filename={"Approved"} /> */}

                                        </div>

                                        : <></>}




                                </div>
                            </div>

                        </Form>
                    )}

                </Formik>



                {showData === true ?
                    <div className="col-md-12 col-md-offset-4">
                        <h5 className="font-weight-bold">Total Records:{data?.length}</h5>
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
                    : <></>}




            </div>

        </section>


    )
}

export default OnboardedReport;
