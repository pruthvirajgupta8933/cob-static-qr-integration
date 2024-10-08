import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from "../../../_components/custom_modal";
import { fetchChildDataList } from '../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import ReferralOnboardForm from "../../ApproverNVerifier/Onboarderchant/merchant-referral-onboard/operation-kyc/ReferralOnboardForm/ReferralOnboardForm";
import Table from '../../../_components/table_components/table/Table';
import SearchFilter from '../../../_components/table_components/filters/SearchFilter';
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage"
import { roleBasedAccess } from '../../../_components/reuseable_components/roleBasedAccess';
import { Link } from 'react-router-dom';
import CustomLoader from '../../../_components/loader';
import { clientListExportApi } from '../../../services/approver-dashboard/merchantReferralOnboard.service';
import toastConfig from '../../../utilities/toastTypes';
import moment from "moment";
import { saveAs } from 'file-saver';
import Blob from "blob";

function ClientList() {
    const convertDate = (yourDate) => {
        let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
        return date;
    };

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }
    const PasswordCell = ({ password }) => {
        const [visible, setVisible] = useState(false);
        const toggleVisibility = () => {
            setVisible((prevVisible) => !prevVisible);
        };

        return (<div className="removeWhiteSpace">
            {visible ? (password) : ("*****")}
            <button className="btn btn-link" onClick={toggleVisibility}>
                {visible ? (<i className="fa fa-eye"></i>) : (<i className="fa fa-eye-slash"></i>)}
            </button>
        </div>);
    };


    const [modalToggle, setModalToggle] = useState(false)
    const [modalToggleFormessage, setModalTogalforMessage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false)
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);
    const { auth } = useSelector(state => state)
    const { user } = auth

    const dispatch = useDispatch();

    const RefrerChiledList = [

        {
            id: "1",
            name: "S.No",
            selector: (row) => row.s_no,
            sortable: true,
            width: "90px",
            cell: (row) => <div className="removeWhiteSpace">{row?.s_no}</div>,
        },

        {
            id: "2",
            key: "client_code", // id: "3",P
            name: "Client Code",
            selector: (row) => row?.client_code,
            sortable: true,
            cell: (row) => (<div className="removeWhiteSpace">
                {row?.client_code}
            </div>), // width: "200px",
        },


        {
            id: "3",
            key: "name", // id: "3",P
            name: "Merchant Name",
            selector: (row) => row?.name,
            sortable: true,
            cell: (row) => (<div className="removeWhiteSpace">
                {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
            </div>),
            width: "200px",
        },



        {
            id: "4",
            name: "Mobile Number",
            selector: (row) => row?.mobileNumber,
            cell: (row) => <div className="removeWhiteSpace">{row?.mobileNumber}</div>, // width: "250px",
        }, {
            id: "5",
            name: "Created Date",
            selector: (row) => row.createdDate,
            cell: (row) => <div className="removeWhiteSpace">{convertDate(row?.createdDate)}</div>,
            width: "180px",
        },

        {
            id: "6",
            key: "email", // id: "3",P
            name: "Email",
            selector: (row) => row?.email,
            sortable: true,
            cell: (row) => (<div className="removeWhiteSpace">
                {row?.email}
            </div>),
            width: "200px",
        },


        {
            id: "7",
            key: "username", // id: "3",P
            name: "User Name",
            selector: (row) => row?.username,
            sortable: true,
            cell: (row) => (<div className="removeWhiteSpace">
                {row?.username}
            </div>),
            width: "200px",
        }, {
            id: "8",
            name: "Password",
            selector: (row) => row.password,
            cell: (row) => (<PasswordCell password={row.password} />),
            width: "170px",
        },


        {
            id: "9", name: "Action",
            cell: (row) => (<div>
                <Link
                    to={`kyc?kycid=${row?.loginMasterId}`}
                    type="button"
                    className="approve text-white  cob-btn-primary   btn-sm"
                    data-toggle="modal"
                    onClick={() => {
                        setModalTogalforMessage(true);
                    }}
                    data-target="#exampleModal"
                >
                    Kyc Complete
                </Link>
            </div>),
            omit: user?.roleId === 3
        },

        {
            id: "10", name: "Action",
            cell: (row) => (<div>
                <Link
                    className="approve text-white cob-btn-primary btn-sm"
                    to={`bank-onboarding/?cmid=${row?.loginMasterId}&edit=true`}
                >
                    Edit Details
                </Link>
            </div>),
            omit: user?.roleId !== 3
        }


    ]



    const exportToExcelFn = async () => {
        setLoading(true);
        setDisable(true);
        const roleType = roleBasedAccess();
        const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";

        clientListExportApi({ bank_login_id: user?.loginId, type }).then((res) => {
            if (res.status === 200) {
                const data = res?.data;
                console.log("data", data)
                setLoading(false);
                setDisable(false);
                const blob = new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                saveAs(blob, `Client-List-Report.xlsx`)
            }
        }).catch((err) => {
            if (err.response?.status === 500) {
                toastConfig.errorToast("Something went wrong.");
            }
            setLoading(false);
            setDisable(false);
        });
    }



    const refrerDataList = useSelector((state) => state.merchantReferralOnboardReducer.refrerChiledList.resp);

    const loadingState = useSelector((state) => state.merchantReferralOnboardReducer.isLoading)

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
        setData(clientListData?.filter((item) => Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())));
    };


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = () => {
        // Determine the type based on the result of roleBasedAccess()
        const roleType = roleBasedAccess();
        const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
        let postObj = {
            page: currentPage, page_size: pageSize, type: type,  // Set the type based on roleType
            login_id: user?.loginId
        }
        //  console.log(postObj)
        dispatch(fetchChildDataList(postObj));
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
        // alert("d")
    };
    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
        setCurrentPage(1);
    };




    // console.log(user?.roleId)
    const modalBody = () => {
        return (<ReferralOnboardForm referralChild={true} fetchData={fetchData} />)


    }

    const modalBodyForMessage = () => {
        return <div>
            <h6>To complete the KYC process, please use the provided username and password to log in to the partner
                dashboard. Once logged in, proceed with the KYC verification.</h6>
        </div>
    }

    return (
        <section className="">

            <main className="">
                <div className="">
                    <div className="d-flex justify-content-between">
                        <h5 className="">Client List</h5>
                        {(user?.roleId === 13 && user.loginId !== 27458) && (
                            <div className="col-lg-2 col-md-3 col-sm-4 mb-md-0">
                                <button className="btn btn-sm cob-btn-primary w-100" onClick={() => setModalToggle(true)}>
                                    Add Child Client
                                </button>
                            </div>
                        )}
                    </div>
                    <section className="">
                        <div className="container-fluid p-0">
                            <div className="row mt-4">
                                <div className="col-lg-3 col-md-3 col-sm-4 mb-3 mb-md-0">
                                    <SearchFilter
                                        kycSearch={kycSearch}
                                        searchText={searchText}
                                        searchByText={searchByText}
                                        setSearchByDropDown={setSearchByDropDown}
                                    />
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 mb-3 mb-md-0">
                                    <CountPerPageFilter
                                        pageSize={pageSize}
                                        dataCount={dataCount}
                                        changePageSize={changePageSize}
                                    />
                                </div>

                                <div className="col-lg-1 col-md-3 col-sm-4 mb-3 mb-md-0 mt-4">
                                    {data.length > 0 && (
                                        <button
                                            className="btn btn-sm cob-btn-primary"
                                            type="button"
                                            disabled={disable}
                                            onClick={() => exportToExcelFn()}
                                        >
                                            <i className="fa fa-download" /> {loading ? "Downloading..." : "Export"}
                                        </button>
                                    )}
                                </div>




                            </div>


                            {!loadingState && data?.length !== 0 && (
                                <>
                                    <div className="col-lg-12 mt-5 mb-2 d-flex justify-content-between">
                                        <div><h6>Number of Record: {dataCount}</h6></div>
                                    </div>
                                    <Table
                                        row={RefrerChiledList}
                                        dataCount={dataCount}
                                        pageSize={pageSize}
                                        currentPage={currentPage}
                                        changeCurrentPage={changeCurrentPage}
                                        data={data}
                                    />
                                </>
                            )}

                            <CustomLoader loadingState={loadingState} />
                        </div>
                    </section>
                </div>
            </main>

            <CustomModal headerTitle={"Add Child Client"} modalBody={modalBody} modalToggle={modalToggle}
                fnSetModalToggle={() => setModalToggle()} />


            <CustomModal headerTitle={"Message"} modalBody={modalBodyForMessage} modalToggle={modalToggleFormessage}
                fnSetModalToggle={() => setModalTogalforMessage()} />
        </section>)
}

export default ClientList
