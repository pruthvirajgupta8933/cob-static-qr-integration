import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../NavBar/NavBar';
import { uniqueId } from 'lodash';
import CustomModal from "../../../_components/custom_modal";
import { fetchChiledDataList } from '../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import ReferralOnboardForm
    from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
// import BasicDetailsOps
//     from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/bank-kyc-form/BasicDetailsOps";
import Table from '../../../_components/table_components/table/Table';
import { RefrerChiledList } from '../../../utilities/tableData';
import SearchFilter from '../../../_components/table_components/filters/SearchFilter';
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage"
function ClientList() {

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }



    const RefrerChiledList = [

        // {
        //   id: "1",
        //   name: "S.No",
        //   selector: (row) => row.s_no,
        //   sortable: true,
        //   // width: "86px",
        //   cell: (row) => <div className="removeWhiteSpace">{row?.s_no}</div>,
        // },

        {
            key: "name",
            // id: "3",P
            name: "Merchant Name",
            selector: (row) => row?.name,
            sortable: true,
            cell: (row) => (
                <div className="removeWhiteSpace">
                    {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
                </div>
            ),
            // width: "200px",
        },



        {
            id: "4",
            name: "Mobile Number",
            selector: (row) => row?.mobileNumber,
            cell: (row) => <div className="removeWhiteSpace">{row?.mobileNumber}</div>,
            // width: "250px",
        },
        {
            id: "5",
            name: "createdDate",
            selector: (row) => row.createdDate,
            cell: (row) => <div className="removeWhiteSpace">{row?.createdDate}</div>,
            // width: "130px",
        },
        {
            id: "6",
            name: "Password",
            selector: (row) => row.password,
            cell: (row) => (
                <PasswordCell password={row.password} />
            ),
            // width: "150px",
        },


    ]

    const PasswordCell = ({ password }) => {
        const [visible, setVisible] = useState(false);

        const toggleVisibility = () => {
            setVisible((prevVisible) => !prevVisible);
        };

        return (
            <div className="removeWhiteSpace">
                {visible ? (
                    password
                ) : (
                    "*****"
                )}
                <button className="btn btn-link" onClick={toggleVisibility}>
                    {visible ? (
                        <i className="fa fa-eye"></i>
                    ) : (
                        <i className="fa fa-eye-slash"></i>
                    )}
                </button>
            </div>
        );
    };
    // const [isLoading,setIsLoading] = useState(false);
    const [search, SetSearch] = useState("");

    const [modalToggle, setModalToggle] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [searchText, setSearchText] = useState("");

    const [isSearchByDropDown, setSearchByDropDown] = useState(false);

    var { user } = useSelector((state) => state.auth);
    const { auth } = useSelector(state => state)

    const dispatch = useDispatch();

    const rowData = RefrerChiledList;


    const refrerDataList = useSelector(
        (state) => state.merchantReferralOnboardReducer.refrerChiledList.resp
    );
    const [clientListData, setClientListData] = useState([]);
    const [data, setData] = useState([]);
    const [dataCount, setDataCount] = useState("")
    useEffect(() => {
        const chiledReferList = refrerDataList?.results;
        const dataCount = refrerDataList?.count;

        if (chiledReferList) {
            setData(chiledReferList);
            setClientListData(chiledReferList);
            setDataCount(dataCount)
        }
    }, [refrerDataList]);



    const kycSearch = (e, fieldType) => {
        if (fieldType === "text") {
            setSearchByDropDown(false)
            setSearchText(e);
        }
        if (fieldType === "dropdown") {
            setSearchByDropDown(true)

        }


    };
    const searchByText = (text) => {
        setData(
            clientListData?.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText?.toLocaleLowerCase())
            )
        );
    };


    const mappedData = data?.map((item) => {
        return {
            sno: item.sno,
            name: item.name,
            password: item.password,
            mobileNumber: item.mobileNumber,
            createdDate: item.createdDate
        };
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        dispatch(
            fetchChiledDataList({
                page: currentPage,
                page_size: pageSize,
                referrer_login_id: auth?.user?.loginId,
                type: "referrer",
                // searchquery: searchText,

            })
        )

    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };
    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };

    const handleChange = (e) => {
        SetSearch(e);
    }

    // console.log(user?.roleId)
    const modalBody = () => {
        return (<ReferralOnboardForm referralChild={true} fetchData={fetchData} />)
    }
    return (
        <section className="">

            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">Client List</h5>
                    </div>
                    <section className="">
                        <div className="container">
                            <div className="row mt-4">

                                <div className='row'>
                                    <div className="col-lg-3 p-0 mr-3">
                                        <SearchFilter
                                            kycSearch={kycSearch}
                                            searchText={searchText}
                                            searchByText={searchByText}
                                            setSearchByDropDown={setSearchByDropDown}
                                        />
                                        {/* <label>Search</label>
                                        <input type="text" className="form-control" onChange={(e) => {
                                            handleChange(e.currentTarget.value)
                                        }} placeholder="Search from here" /> */}
                                    </div>

                                    <div className="col-lg-3 p-0">
                                        <CountPerPageFilter
                                            pageSize={pageSize}
                                            dataCount={dataCount}
                                            changePageSize={changePageSize}
                                        />
                                    </div>

                                </div>

                                <div className="col-lg-12 mt-5 mb-2 d-flex justify-content-between">
                                    <div><h6>Number of Record: {dataCount}</h6></div>

                                    <div>
                                        {user?.roleId === 13 && <button className="btn btn-sm cob-btn-primary"
                                            onClick={() => setModalToggle(true)}>Add Child
                                            Client</button>}
                                    </div>

                                </div>

                                {/* {!loadingState && data?.length !== 0 && ( */}
                                <Table
                                    row={RefrerChiledList}
                                    dataCount={dataCount}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    changeCurrentPage={changeCurrentPage}
                                    data={data}
                                />
                                {/* )} */}
                                {/* <div className="overflow-scroll">
                                    <table cellspaccing={0} cellPadding={10} border={0} width="100%"
                                        className="tables border">
                                        <tbody>
                                            <tr>
                                                <th>Client Code</th>
                                                <th>Client Name</th>
                                                <th>Contact No.</th>
                                            </tr>
                                            {clientListData && clientListData.map((item, i) =>
                                            (
                                                <tr key={uniqueId()}>
                                                    <td className='border'>{item.clientCode}</td>
                                                    <td className='border'>{item.clientName}</td>
                                                    <td className='border'>{item.clientContact}</td>
                                                </tr>
                                            )
                                            )}
                                        </tbody>
                                    </table>
                                </div> */}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <CustomModal headerTitle={"Add Child Client"} modalBody={modalBody} modalToggle={modalToggle} fnSetModalToggle={() => setModalToggle()} />
        </section>
    )
}

export default ClientList
