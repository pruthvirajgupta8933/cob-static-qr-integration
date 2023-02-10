import React, { useState, useEffect} from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import { Formik, Form } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../_components/reuseable_components/convertToFormikSelectJson";
import { useHistory } from "react-router-dom";
import { challanTransactions } from "../slices/backTobusinessSlice";
import toastConfig from "../utilities/toastTypes";
import Spinner from "../components/ApproverNVerifier/Spinner";
import DropDownCountPerPage from "../_components/reuseable_components/DropDownCountPerPage";
import { exportToSpreadsheet } from "../utilities/exportToSpreadsheet";



const ChallanTransactReport = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth} = useSelector((state) => state);
  const { user } = auth;

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [showData,setShowData] = useState(false)
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
    const [dataCount, setDataCount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [displayPageNumber, setDisplayPageNumber] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false)
    const [saveData,setSaveData] = useState()
    const [disable,setDisable]=useState(false)



  const validationSchema = Yup.object({
    from_date: Yup.date()
      .required("Required")
      .nullable(),
    to_date: Yup.date()
      .min(Yup.ref("from_date"), "End date can't be before Start date")
      .required("Required"),
      clientCode: Yup.string().required("Required"),
  });

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  // const [todayDate, setTodayDate] = useState(splitDate);


  let todayDate = splitDate;

  const initialValues = {
    from_date: todayDate,
    to_date: todayDate,
    clientCode: ""
  };

  let clientMerchantDetailsList = [];
  if (
    user &&
    user?.clientMerchantDetailsList === null &&
    user?.roleId !== 3 &&
    user?.roleId !== 13
  ) {
    history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    {},
    false,
    true
  );

  const challanSearch = (e) => {
        setSearchText(e.target.value);
    };


  useEffect(() => {

    dispatch(challanTransactions({page: currentPage, page_size: pageSize,"from_date": saveData?.from_date,"to_date": saveData?.to_date}))
        .then((resp) => {
            // resp?.payload?.status_code && toastConfig.errorToast("");
            setSpinner(false);

            const data = resp?.payload?.results;
            const dataCoun = resp?.payload?.count;
            setData(data);
            setDataCount(dataCoun);
            setVerifiedMerchant(data);
            setIsLoaded(false)
        })

        .catch((err) => {
            
        });
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
}, [currentPage, totalPages]);

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


// console.log(pageSize,"page Size")


  const handleSubmit = (values) => {

    // console.log(values);
    setDisable(true)
    const formData = {
      from_date: values.from_date,
      to_date: values.to_date,
      client_code:values.clientCode,
      page: currentPage,
      page_size: pageSize
      
    };


    setSaveData(values)

    

    dispatch(challanTransactions(formData))
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count
       
        if(data?.length === 0 && data !== null) {
          // Return null value 
        } else {
         toastConfig.successToast("Data loaded")
        }
        
        setData(data)
        setSpinner(true);
        setDataCount(dataCoun)
        setShowData(true)
        setVerifiedMerchant(data)
        setDisable(false)
        
      })

      .catch((err) => {
        toastConfig.errorToast(err);
        setDisable(false)
      });
  };


  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "S.No",
      "Client Code",
      "Bank Code",
      "Amount",
      "Bank Reference No.",
      "Challan No.",
      // "Enquiry Id",
      "IFSC Code",
      "Status",
      "Created On",
      // "Udf1",
      // "Udf2",
      // "Udf3",
      // "Udf4",
      // "Udf5",
      // "Udf6",
    ];
    let excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    data?.map((item, index) => {

      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        client_code: item.client_code === null ? "" : item.client_code,
        bank_code: item.bank_code === null ? "" : item.bank_code,
        amount: item.amount === null ? "" : item.amount,
        bank_reference_number: item.bank_reference_number === null ? "" : item.bank_reference_number,
        challan_number: item.challan_number === null ? "" : item.challan_number,
        // enquiry_id: item.enquiry_id === null ? "" : item.enquiry_id,
        ifsc: item.ifsc === null ? "" : item.ifsc,
        type: item.type === null ? "" : item.type,
        created_on: item.created_on === null ? "" : item.created_on,
        // udf1: item.udf1 === null ? "" : item.udf1,
        // udf2: item.udf2 === null ? "" : item.udf2,
        // udf3: item.udf3 === null ? "" : item.udf3,
        // udf4: item.udf4 === null ? "" : item.udf4,
        // udf5: item.udf5 === null ? "" : item.udf5,
        // udf6: item.udf6 === null ? "" : item.udf6,
        
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Challan Transactions";
    exportToSpreadsheet(excelArr, fileName);
  };

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h1 className="m-b-sm gx-float-left mt-3">
            Challan Transactions Report
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values)
          }}
          enableReinitialize={true}
        >
          <Form>
            <div className="container">
              <div className="row">
                <div className="form-group col-lg-4">
                  <FormikController
                    control="select"
                    label="Client Code"
                    name="clientCode"
                    className="form-control rounded-0 mt-0"
                    options={clientCodeOption}
                  />
                </div>


                <div className="form-group col-lg-4">
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

                <div className="form-group col-lg-4">
                  <FormikController
                    control="input"
                    type="date"
                    label="End Date"
                    name="to_date"
                    className="form-control rounded-0"
                  />
                </div>

                <div className=" col-lg-4">
                  <button type="subbmit" disabled={disable} className="btn approve text-white  btn-xs">
                    Submit
                  </button>
                </div>

                {showData === true ?
                <div className="container-fluid flleft">
                  <div className="form-group col-lg-4 col-md-12 mt-2">
                    <label>Search</label>
                    <input
                      className="form-control"
                        onChange={challanSearch}
                      type="text"
                      placeholder="Search Here"
                    />
                  </div>
                <div></div>
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
                   className="btn btn-sm text-white  "
                   type="button"
                   onClick={() => exportToExcelFn()}
                   style={{ backgroundColor: "rgb(1, 86, 179)" }}
                 >
                   Export
                 </button>
                </div>
                </div>
                : <></>}


              </div>
            </div>
          </Form>
        </Formik>
        {showData === true ?
       
        <div className="col-md-12 col-md-offset-4">
           <h5 className="font-weight-bold">Total Records: {data?.length}</h5>
          <div className="scroll overflow-auto">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Client Code</th>
                  <th>Bank Code</th>
                  <th>Amount</th>
                  <th>Bank Reference No.</th>
                  <th>Challan No.</th>
                  {/* <th>Enquiry Id</th> */}
                  <th>IFSC Code</th>
                  <th>Status</th>
                  <th>Created On</th>
                  {/* <th>Udf1</th>
                  <th>Udf2</th>
                  <th>Udf3</th>
                  <th>Udf4</th>
                  <th>Udf5</th>
                  <th>Udf6</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 ? (
                <tr>
                  <td colSpan={"15"}>
                  <h1 className="nodatafound">No Data Found</h1>
                    <br /><br />
                  
                  </td>
                </tr>
              ) : <></> }
              
             {
              data === null || data === [] ? (
                <tr>
                <td colSpan={"11"}>
                      <p className="text-center">{spinner === true && <Spinner /> }</p>
                      </td>
                </tr>)
                : <></> }

                    { data?.map((user, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{user?.client_code}</td>
                        <td>{user?.bank_code}</td>
                        <td>{user?.amount}</td>
                        <td>{user?.bank_reference_number}</td>
                        <td>{user?.challan_number}</td>
                        {/* <td>{user?.enquiry_id}</td> */}
                        <td>{user?.ifsc}</td>
                        <td>{user?.type}</td>
                        <td>{user?.created_on}</td>
                        {/* <td>{user?.udf1}</td>
                        <td>{user?.udf2}</td>
                        <td>{user?.udf3}</td>
                        <td>{user?.udf4}</td>
                        <td>{user?.udf5}</td>
                        <td>{user?.udf6}</td> */}
                      </tr>
                    ))}
                <tr></tr>
              </tbody>
            </table>
          </div>
          { data?.length !== 0 ?  
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
                    : <></> }
        </div>
        : <></> }
      </div>
    </section>
  );
};

export default ChallanTransactReport;
