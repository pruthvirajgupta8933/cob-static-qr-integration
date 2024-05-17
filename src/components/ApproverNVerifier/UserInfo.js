import React, { useState } from 'react'
import FormikController from '../../_components/formik/FormikController';
import { Formik, Form } from "formik";
import Yup from '../../_components/formik/Yup';
import { fetchUserInfoData } from '../../services/user-info/userInfo.service';
import Table from '../../_components/table_components/table/Table';
import toastConfig from '../../utilities/toastTypes';
import CustomLoader from '../../_components/loader';
import ReactTooltip from "react-tooltip";

const UserInfo = () => {
    const options1 = [
        { key: "", value: "Select" },
        { key: "1", value: "Client Code" },
        { key: "2", value: "Username" },

    ];

    const userInfoDetailsTableCol = [
        { id: "1", name: "Login ID", width: "80px", cell: (row) => <div className="removeWhiteSpace">{row?.loginMasterId}</div> },
        { id: "2", name: "Name", width: "140px", cell: (row) => <div className="removeWhiteSpace">{row?.name}</div> },
        { id: "3", name: "Email", width: "180px", cell: (row) => <div className="removeWhiteSpace">{row?.email}</div> },
        {
            id: "4",
            name: "Username",
            width: "250px",
            cell: (row) => <CopyableCell text={row?.username} />
        },
        {
            id: "5",
            name: "Password",
            cell: (row) => <CopyableCell text={row?.password} />
        },
        { id: "6", name: "Mobile Number", cell: (row) => <div className="removeWhiteSpace">{row?.mobileNumber}</div> },

    ]

    const CopyableCell = ({ text }) => {
        const [isCopied, setIsCopied] = useState(false);
        const copyToClipboard = () => {
            navigator.clipboard.writeText(text).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        };

        return (
            <div className="d-flex align-items-center">
                <div className="removeWhiteSpace mr-2">{text}</div>
                <span
                    className="input-group-text p-1"
                    onClick={copyToClipboard}
                    data-tip
                    data-for={`copy-tooltip-${text}`}
                >
                    <i className="fa fa-copy"></i>
                </span>
                <ReactTooltip
                    id={`copy-tooltip-${text}`}
                    place="top"
                    effect="solid"
                    offset={{ top: 20 }}
                    arrowColor="transparent"
                    className="custom-tooltip"
                >
                    {isCopied ? "Copied!" : "Copy"}
                </ReactTooltip>
            </div>
        );
    }


    const initialValues = {
        searchBy: "",
        userName: "",
    };

    const validationSchema = Yup.object({
        searchBy: Yup.string().required('Required'),
        userName: Yup.string().required('Required'),

    });


    const [resultData, setResultData] = useState([])
    const [disable, setDisable] = useState(false)
    const [loadingState, setLoadingState] = useState(false)
    const [show, setShow] = useState(false)
    const [placeholder, setPlaceholder] = useState('Enter Client Code or Username');

    const handleSearchByChange = (event) => {
        const value = event.target.value;
        if (value === "1") {
            setPlaceholder('Enter Client Code');
        } else if (value === "2") {
            setPlaceholder('Enter Username');
        } else {
            setPlaceholder('Enter Client Code or Username');
        }
    };


    const handleSubmit = async (values) => {
        setDisable(true)
        setLoadingState(true)

        const { searchBy, userName } = values;
        let body = {}

        if (searchBy === "1") {
            body = { client_code: userName, username: "" };
        } else if (searchBy === "2") {
            body = { client_code: "", username: userName };
        }
        await fetchUserInfoData(body)
            .then((resp) => {
                const data = resp?.data?.result
                setResultData(data)
                setDisable(false)
                setLoadingState(false)
                setShow(true)
                if (resp?.data?.status == true) {
                    toastConfig.successToast(resp?.data?.message)
                } else {
                    toastConfig.errorToast(resp?.data?.message)
                }
            })
            .catch((error) => {
                setLoadingState(false)
                setShow(false)
                setDisable(false)
                if (error.response && error.response.status === 500) {
                    toastConfig.errorToast("Something went wrong");
                    setLoadingState(false)
                }
            });
    };

    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="mb-5">
                        <h5 className="">User Info</h5>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values);
                        }}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form>
                                <div className="row">
                                    <div className="form-group  col-md-3 ">
                                        <FormikController
                                            control="select"
                                            label="Search By"
                                            name="searchBy"
                                            className="form-select"
                                            options={options1}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                handleSearchByChange(e);
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-3 ml-3">
                                        <FormikController
                                            control="input"
                                            type="text"
                                            name="userName"
                                            label="Client Code / Username"
                                            placeholder={placeholder}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-4 mt-4 ml-4">
                                        <button
                                            type="submit"
                                            className="btn cob-btn-primary approve text-white"
                                            disabled={disable}
                                        >
                                            {disable && (
                                                <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                                            )}
                                            Submit
                                        </button>



                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {loadingState ? <CustomLoader loadingState={loadingState} /> : show && (


                        <div className="scroll overflow-auto mt-4">
                            <Table
                                row={userInfoDetailsTableCol}
                                dataCount={0}
                                data={resultData}
                            />

                        </div>
                    )}

                </div>
            </main>
        </section>
    )
}

export default UserInfo
