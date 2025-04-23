/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllByKycStatus, clearFetchAllByKycStatus } from "../../../slices/kycSlice";
import toastConfig from "../../../utilities/toastTypes";
// import ViewMidManagementModal from "../../ApproverNVerifier/ViewMidManagementModal";
import Table from "../../../_components/table_components/table/Table";
import SearchFilter from "../../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../../_components/loader";
import DateFormatter from "../../../utilities/DateConvert";
import { KYC_STATUS_APPROVED, KYC_STATUS_NOT_FILLED, KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_REJECTED, KYC_STATUS_VERIFIED } from "../../../utilities/enums";
import DateRangeByOneDatePicker from "../../../_components/formik/components/react-datepicker/DateRangeByOneDatePicker";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from "react-select";
import { getMidClientCode } from "../../../services/generate-mid/generate-mid.service";
import { Form, Formik } from "formik";

const MidManagement = () => {

    function capitalizeFirstLetter(param) {
        return param?.charAt(0).toUpperCase() + param?.slice(1);
    }
    const [data, setData] = useState([]);
    const [assignZone, setAssignzone] = useState([]);
    const [dataCount, setDataCount] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modalDisplayData, setModalDisplayData] = useState({});
    const [openZoneModal, setOpenModal] = useState(false);
    const [refereshRequired, setRefreshRequired] = useState(false);
    const [serachByDropDown, setSearchByDropDown] = useState(false);
    const [merchantStatus, setMerchantStatus] = useState(KYC_STATUS_APPROVED);
    const [clientCodeList, setCliencodeList] = useState([])
    const [selectedClientId, setSelectedClientId] = useState(null);
    const { kyc } = useSelector((state) => state);

    const { allKycData } = kyc


    const MidManagementData = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row.sno,
            sortable: true,
            width: "86px",
        },
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row.clientCode,
            cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
            width: "130px",
        },
        {
            id: "3",
            name: "Merchant Name",
            selector: (row) => row.name,
            sortable: true,
            cell: (row) => (
                <div className="removeWhiteSpace">
                    {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
                </div>
            ),
            width: "150px",
        },
        {
            id: "4",
            name: "Email",
            selector: (row) => row.emailId,
            cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
            width: "220px",
        },
        {
            id: "5",
            name: "Contact Number",
            selector: (row) => row.contactNumber,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.contactNumber}</div>
            ),
            width: "150px",
        },
        {
            id: "6",
            name: "Sourcing Point",
            selector: (row) => row.sourcing_point,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.sourcing_point}</div>
            ),
        },
        {
            id: "7",
            name: "Sourcing Code",
            selector: (row) => row.sourcing_code,
            cell: (row) => (
                <div className="removeWhiteSpace">{row?.sourcing_code}</div>
            ),
            width: "150px",
        },
        {
            id: "8",
            name: "Emp. Code",
            selector: (row) => row.emp_code,
        },
        {
            id: "9",
            name: "Zone Name",
            selector: (row) => row.zoneName,
        },
        {
            id: "10",
            name: "KYC Status",
            selector: (row) => row.status,
        },
        {
            id: "11",
            name: "Registered Date",
            selector: (row) => row.signUpDate,
            sortable: true,
            cell: (row) => <div>{DateFormatter(row.signUpDate)}</div>,
            width: "150px",
        },
        {
            id: "12",
            name: "Onboard Type",
            selector: (row) => row.isDirect,
        },
        {
            id: "13",
            name: "Add Sourcing Partner",
            cell: (row) => (
                <button
                    type="submit"
                    onClick={() => {
                        setModalDisplayData(row);
                        setOpenModal(true);
                    }}
                    className="approve cob-btn-primary btn-sm text-white"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                >
                    Update
                </button>
            ),
        },
    ];


    useEffect(() => {

        getMidClientCode().then((resp) => {
            setCliencodeList(resp?.data?.result)
        })
    }, [])


    // console.log("openZoneModal",openZoneModal)
    const dispatch = useDispatch();
    const selectStatus = [
        { key: "1", value: KYC_STATUS_NOT_FILLED },
        { key: "2", value: KYC_STATUS_PENDING },
        { key: "3", value: KYC_STATUS_PROCESSING },
        { key: "4", value: KYC_STATUS_VERIFIED },
        { key: "5", value: KYC_STATUS_APPROVED },
        { key: "6", value: KYC_STATUS_REJECTED },
    ]


    const refreshAfterRefer = (d) => { setRefreshRequired(d) }

    useEffect(() => {
        dispatch(
            FetchAllByKycStatus(
                {
                    page: currentPage,
                    page_size: pageSize,
                    searchquery: searchText,
                    kycStatus: merchantStatus,
                    isDirect: ""
                }

            ));

        return () => {
            dispatch(clearFetchAllByKycStatus())
        }
    }, [searchText, merchantStatus, currentPage, pageSize, refereshRequired])


    useEffect(() => {
        setData(allKycData?.result);
        setDataCount(allKycData?.count);
        setAssignzone(allKycData?.result);

        allKycData?.error && toastConfig.successToast("Data is not loading, Try again")

    }, [allKycData])





    const kycSearch = (e, fieldType) => {
        setCurrentPage(1)
        fieldType === "text"
            ? setSearchByDropDown(false)
            : setSearchByDropDown(true);
        setSearchText(e);
    };



    const searchByText = (text) => {
        // console.log("search by text")
        setData(
            assignZone?.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText?.toLocaleLowerCase())
            )
        );
    };

    //function for change current page
    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedClientId(selectedOption ? selectedOption.value : null)
    }


    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };


    const options = [
        { value: '', label: 'Select Client Code' },
        ...clientCodeList.map((data) => ({
            value: data.merchantId,
            label: `${data.clientCode} - ${data.clientName}`
        }))
    ]

    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="d-flex justify-content-between">
                        <h5>
                            MID Management
                        </h5>
                        <button type="button" className="btn cob-btn-primary btn-sm">
                            Create MID
                        </button>
                    </div>

                    <div className="container-fluid p-0 mt-4">
                        <div className="row">
                            <Formik
                            //   initialValues={initialValues}
                            //   validationSchema={validationSchema}
                            //   onSubmit={onSubmit}
                            >
                                {(formik) => (
                                    <Form className="d-flex ">

                                        <div className="form-group col-lg-3 col-md-12 mt-2">
                                            <CustomReactSelect
                                                name="react_select"
                                                options={options}
                                                placeholder="Select Client Code"
                                                filterOption={createFilter({ ignoreAccents: false })}
                                                label="Client Code"
                                                onChange={handleSelectChange}

                                            />
                                        </div>
                                        <div className="form-group col-lg-3 col-md-12 mt-2">
                                            <DateRangeByOneDatePicker />
                                        </div>
                                        <div className="form-group col-lg-3 col-md-12 mt-2">
                                            <label className="form-label">Merchant KYC Status</label>
                                            <select className="form-select" onChange={e => setMerchantStatus(e.target.value)} value={merchantStatus}>
                                                {selectStatus?.map(item => (<option key={item.key} value={item.value}>{item.value}</option>))}
                                            </select>
                                        </div>
                                    </Form>)}
                            </Formik>



                        </div>


                        <div className="">
                            <div className="scroll overflow-auto">
                                <h6>Total Count : {dataCount}</h6>
                                {!allKycData?.loading && data?.length !== 0 && (
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
                            <CustomLoader loadingState={allKycData?.loading} />
                            {data?.length == 0 && !allKycData?.loading && (
                                <h5 className="text-center font-weight-bold">No Data Found</h5>
                            )}
                        </div>
                    </div>
                </div>

            </main>
            <div>

                {/* {openZoneModal === true && (
                    <ViewMidManagementModal
                        userData={modalDisplayData}
                        setOpenModal={setOpenModal}
                        refreshAfterRefer={refreshAfterRefer}
                    />
                )} */}
            </div>
        </section>
    );
};

export default MidManagement;
