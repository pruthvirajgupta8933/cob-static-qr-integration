/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../_components/table_components/table/Table";
import SearchFilter from "../../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../../_components/loader";
import DateFormatter from "../../../utilities/DateConvert";
import DateRangeByOneDatePicker from "../../../_components/formik/components/react-datepicker/DateRangeByOneDatePicker";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getMidClientCode } from "../../../services/generate-mid/generate-mid.service";
import { Form, Formik } from "formik";
import { subMerchantFetchDetailsApi, deactivateSubMerchantApi, reactivateSubMerchantApi } from "../../../slices/generateMidSlice";
import FormikController from "../../../_components/formik/FormikController";
import moment from 'moment';
import Yup from "../../../_components/formik/Yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"
import CustomModal from "../../../_components/custom_modal";
import ViewMidManagementModal from "./ViewMidManagementModal";
import UpdateMidDetailsModal from "./UpdateMidDetailsModal";

const MidManagement = () => {

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }
    const [data, setData] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [assignZone, setAssignzone] = useState([]);
    const [saveData, setSaveData] = useState('')
    const [dataCount, setDataCount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalDisplayData, setModalDisplayData] = useState({});
    const [openZoneModal, setOpenModal] = useState(false);
    const [refereshRequired, setRefreshRequired] = useState(false);
    const [serachByDropDown, setSearchByDropDown] = useState(false);
    const [showDetails, setShowDetails] = useState({})
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedMerchantId, setSelectedMerchantId] = useState('');
    console.log("selectedMerchantId", selectedMerchantId)

    const [clientCodeList, setCliencodeList] = useState([])
    const [selectedClientId, setSelectedClientId] = useState(null);
    const { kyc } = useSelector((state) => state);

    const { midFetchDetails } = useSelector((state) => state.mid || {});
    const subMerchantDetails = midFetchDetails?.subMerchantData?.content;
    const totalCount = midFetchDetails?.subMerchantData?.numberOfElements;
    const loadingState = midFetchDetails?.loading;

    const initialValues = {
        react_select: null,
        status: null,
        startDate: '',
        endDate: ''
    }

    const validationSchema = Yup.object({
        startDate: Yup.date().required("Required").nullable(),
        endDate: Yup.date()
            .min(Yup.ref("startDate"), "End date can't be before Start date")
            .required("Required"),
        status: Yup.string().required("Required").nullable(),
        react_select: Yup.object().required("Required").nullable(),
    });






    let clientMerchantDetailsList = [];
    let clientCode = "";

    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;





    const MidManagementData = [
        // {
        //     id: "1",
        //     name: "S.No",
        //     selector: (row) => row.sno,
        //     sortable: true,
        //     width: "86px",
        // },
        {
            id: "1",
            name: "Client Code",
            selector: (row) => row.clientCode,
            cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
            width: "130px",
        },


        {
            id: "2",
            name: "Client Name",
            selector: (row) => row.clientName,
            cell: (row) => <div className="removeWhiteSpace">{row?.clientName}</div>,
            width: "130px",
        },

        {
            id: "3",
            name: "Client PAN No.",
            selector: (row) => row.clientPanNo,
            cell: (row) => <div className="removeWhiteSpace">{row?.clientPanNo}</div>,
            width: "130px",
        },




        {
            id: "4",
            name: "Bank Name",
            selector: (row) => row.bankName
            ,
            sortable: true,
            cell: (row) => (
                <div className="removeWhiteSpace">
                    {row?.bankName}
                </div>
            ),
            width: "150px",
        },
        {
            id: "5",
            name: "Bank Req ID",
            selector: (row) => row.bankRequestId,
            cell: (row) => <div className="removeWhiteSpace">{row?.bankRequestId
            }</div>,
            width: "220px",
        },
        {
            id: "6",
            name: "Account Number",
            selector: (row) => row.
                clientAccountNumber
            ,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.
                    clientAccountNumber
                }</div>
            ),
            width: "150px",
        },
        {
            id: "7",
            name: "Email",
            selector: (row) => row.clientEmail,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.clientEmail}</div>
            ),
        },
        {
            id: "8",
            name: "Client URL",
            selector: (row) => row.clientUrl,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.clientUrl}</div>
            ),
            width: "150px",
        },

        {
            id: "9",
            name: "Status",
            selector: (row) => row.onboardStatus,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.onboardStatus}</div>
            ),
            width: "150px",
        },
        {
            id: "10",
            name: "Dis. Onboard Status",
            selector: (row) => row.disbursementOnboardingStatus,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.disbursementOnboardingStatus}</div>
            ),
            width: "150px",
        },

        {
            id: "11",
            name: "Dis. Merchant MID Status",
            selector: (row) => row.disbursementMerchantMidAdditionStatus,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.disbursementMerchantMidAdditionStatus}</div>
            ),
            width: "150px",
        },
        {
            id: "12",
            name: "Disbursement Registration Status",
            selector: (row) => row.disbursementRegistrationStatus,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.disbursementRegistrationStatus}</div>
            ),
            width: "150px",
        },





        {
            id: "10",
            name: "Action",
            cell: (row) => (
                <div className="d-flex gap-2">
                    {/* <button
                        type="button"
                        // onClick={() => {
                        //     setModalDisplayData(row);
                        //     setOpenModal(true);
                        // }}
                        className="approve cob-btn-primary btn-sm text-white"
                    >
                        Update
                    </button> */}

                    <button
                        type="button"
                        onClick={() => {
                            setModalDisplayData(row);
                            setOpenModal(true);
                        }}
                        className="approve cob-btn-primary btn-sm text-white"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowDetails(row);
                            setOpenUpdateModal(true);
                        }}
                        className="approve cob-btn-primary btn-sm text-white"
                    >
                        Update
                    </button>


                    <button
                        type="button"
                        onClick={() => handleDeactivate(row)}
                        className="approve cob-btn-primary btn-sm text-white"
                    >
                        Deactivate
                    </button>

                    <button
                        type="button"
                        onClick={() => handleReactivate(row)}
                        className="approve cob-btn-primary btn-sm text-white"
                    >
                        Reactivate
                    </button>
                </div>
            ),
            width: "250px",
        }

    ];




    const handleDeactivate = (row) => {
        const confirmDeactivate = window.confirm("Are you sure you want to deactivate this?");

        if (confirmDeactivate) {
            const postData = {
                action: "D",
                clientVirtualAdd: row?.clientVirtualAdd,
                bankName: row?.bankName,
                clientCode: row?.clientCode

            };

            dispatch(deactivateSubMerchantApi(postData)).then((resp) => {



                if (resp?.meta?.requestStatus === "fulfilled") {
                    if (resp.payload.
                        onboardStatus === "DEACTIVATED"
                    ) {
                        toast.success(resp?.payload?.description)
                    }
                    else {
                        toast.success(resp?.payload?.udf10)

                    }
                }

            });
        }
    };


    const handleReactivate = (row) => {
        const confirmReactivate = window.confirm("Are you sure you want to reactivate this?");
        if (confirmReactivate) {
            const postData = {
                action: "R",
                bankName: row?.bankName,
                clientVirtualAdd: row?.clientVirtualAdd,
                clientCode: row?.clientCode
            };
            dispatch(reactivateSubMerchantApi(postData)).then((resp) => {
                if (resp?.meta?.requestStatus === "fulfilled") {
                    if (resp.payload.
                        onboardStatus === "REACTIVATED"
                    ) {
                        toast.success(resp?.payload?.description)
                    }
                    else {
                        toast.success(resp?.payload?.udf10)

                    }
                }

            }
            )
        }
    };



    useEffect(() => {

        getMidClientCode().then((resp) => {
            setCliencodeList(resp?.data?.result)
        })
    }, [])


    // console.log("openZoneModal",openZoneModal)
    const dispatch = useDispatch();


    const selectStatus = [
        { key: "", value: "Select Status" },
        { key: "SUCCESS", value: "SUCCESS" },
        { key: "FAILED", value: "FAILED" },

    ]




    useEffect(() => {

        if (saveData) {
            dispatch(
                subMerchantFetchDetailsApi(

                    {
                        startDate: saveData.startDate ? moment(saveData.startDate).format('YYYY-MM-DD') : null,
                        endDate: saveData.endDate ? moment(saveData.endDate).format('YYYY-MM-DD') : null,
                        clientCode: saveData.react_select?.value || "",
                        status: saveData.status || "",
                        page: currentPage,
                        size: pageSize,
                        sortOrder: "DSC"
                    }

                ))
        }


    }, [currentPage, pageSize, refereshRequired])


    useEffect(() => {
        setData(subMerchantDetails);
        setDataCount(totalCount);
        setAssignzone(subMerchantDetails);
    }, [midFetchDetails])







    const kycSearch = (e, fieldType) => {
        setCurrentPage(1)
        fieldType === "text"
            ? setSearchByDropDown(false)
            : setSearchByDropDown(true);
        setSearchText(e);
    };



    // const searchByText = (text) => {
    //     // console.log("search by text")
    //     setData(
    //         assignZone?.filter((item) =>
    //             Object.values(item)
    //                 .join(" ")
    //                 .toLowerCase()
    //                 .includes(searchText?.toLocaleLowerCase())
    //         )
    //     );
    // };

    const searchByText = (text) => {
        if (searchText?.length !== 0) {
            setData(
                assignZone?.filter((item) =>
                    Object.values(item)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText?.toLocaleLowerCase())
                )
            );
        } else {
            setData(subMerchantDetails)
        }

    };

    //function for change current page
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const handleSelectChange = (selectedOption) => {
        const value = selectedOption.value
        const selectedClient = clientCodeList.find(client => client.clientCode === value);
        if (selectedClient) {
            setSelectedMerchantId(selectedClient.merchantId);
        } else {
            setSelectedMerchantId('');
        }
    }


    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };


    const options = [
        { value: '', label: 'Select Client Code' },
        ...clientCodeList.map((data) => ({
            value: data.clientCode,
            label: `${data.clientCode} - ${data.clientName}`
        }))
    ]


    const onSubmit = (values) => {
        setSaveData(values)
        const payload = {
            startDate: values.startDate ? moment(values.startDate).format('YYYY-MM-DD') : null,
            endDate: values.endDate ? moment(values.endDate).format('YYYY-MM-DD') : null,
            clientCode: values.react_select?.value || "",
            status: values.status || "",
            page: currentPage,
            size: pageSize,
            sortOrder: "DSC"
        };

        dispatch(subMerchantFetchDetailsApi(payload));
    };


    return (
        <section className="">
            <main className="">
                <div className="">

                    <div className="d-flex justify-content-between">
                        <h5 className="ml-3">
                            MID Management
                        </h5>
                        <Link
                            to="/dashboard/generatemid"
                            className="text-decoration-none"

                        >
                            <button type="button" className="btn cob-btn-primary btn-sm">
                                Create MID
                            </button>
                        </Link>
                    </div>



                    <div className="container-fluid p-0 mt-4">
                        <div className="row">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {(formik) => (
                                    <Form className="d-flex">

                                        <div className="position-relative col-lg-3 col-md-12">
                                            <CustomReactSelect
                                                name="react_select"
                                                options={options}
                                                placeholder="Select Client Code"
                                                filterOption={createFilter({ ignoreAccents: false })}
                                                label="Client Code"
                                                onChange={handleSelectChange}
                                            />
                                        </div>

                                        <div className="form-group col-lg-3 col-md-12 date_range_picker zindexforDropdown">
                                            <DateRangeByOneDatePicker
                                                initialStartDate={formik.values.startDate}
                                                initialEndDate={formik.values.endDate}
                                                onDateChange={({ startDate, endDate }) => {
                                                    formik.setFieldValue("startDate", startDate);
                                                    formik.setFieldValue("endDate", endDate);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-lg-3 col-md-12 ">


                                            <FormikController
                                                control="select"
                                                label="Status"
                                                name="status"
                                                options={selectStatus}
                                                className="form-select"

                                            />
                                        </div>

                                        <div className="form-group col-lg-3 col-md-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn cob-btn-primary approve text-white"
                                                disabled={loadingState}

                                            >
                                                {loadingState && (
                                                    <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                                                )}
                                                Submit
                                            </button>
                                        </div>

                                    </Form>)}
                            </Formik>



                        </div>

                        {data?.length > 0 &&
                            <div className="row mt-4">

                                <div className="form-group col-lg-3 ml-2">
                                    <SearchFilter
                                        kycSearch={kycSearch}
                                        searchText={searchText}
                                        searchByText={searchByText}
                                        setSearchByDropDown={setSearchByDropDown}
                                        searchTextByApiCall={false}

                                    />

                                </div>
                                {/* } */}

                                <div className="form-group col-lg-3">
                                    <CountPerPageFilter
                                        pageSize={pageSize}
                                        dataCount={dataCount}
                                        changePageSize={changePageSize}
                                    />
                                </div>
                                {/* } */}
                            </div>
                        }


                        <div className="">
                            <div className="scroll overflow-auto">
                                {data && <h6>Total Count : {dataCount}</h6>}
                                {!midFetchDetails?.loading && data?.length !== 0 && (
                                    <Table
                                        row={MidManagementData}
                                        data={data}
                                        dataCount={dataCount}
                                        pageSize={pageSize}
                                        currentPage={currentPage}
                                        changeCurrentPage={changeCurrentPage}
                                    />
                                )}
                            </div>
                            <CustomLoader loadingState={loadingState} />
                            {data?.length == 0 && !loadingState && (
                                <h5 className="text-center font-weight-bold">No Data Found</h5>
                            )}
                        </div>
                    </div>

                </div>

            </main>
            <div>


                <ViewMidManagementModal
                    userData={modalDisplayData}
                    setOpenModal={setOpenModal}
                    openZoneModal={openZoneModal}

                />
                <UpdateMidDetailsModal
                    userDetails={showDetails}
                    setOpenUpdateModal={setOpenUpdateModal}
                    openUpdateModal={openUpdateModal}
                    selectedMerchantId={selectedMerchantId}

                />

            </div>
        </section>
    );
};

export default MidManagement;
