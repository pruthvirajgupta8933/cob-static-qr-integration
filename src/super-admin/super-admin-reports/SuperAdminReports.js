import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CardLayout from '../../utilities/CardLayout';
import FormikController from '../../_components/formik/FormikController';
import moment from 'moment';
import { tableList, superAdminFilters, superAdminReports } from '../../slices/super-admin-slice/superAdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import CustomReactSelect from '../../_components/formik/components/CustomReactSelect';
import { createFilter } from "react-select";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from '../../_components/loader';
import { superAdminExportToXl } from '../../services/super-admin-service/superAdmin.service';

const SuperAdminReports = () => {
    const { superAdminSliceReducer } = useSelector((state) => state);
    const [dynamicFormValue, setDynamicFormValue] = useState([]);
    const [dataCount, setDataCount] = useState(0);
    const [data, setData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchBodyData, setSearchBodyData] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const tableListData = superAdminSliceReducer?.tableListData?.data;
    const dispatch = useDispatch();
    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");
    const initialValues = {
        react_select: '',
        client_code: '',
        from_date: splitDate,
        to_date: splitDate,
    };

    const validationSchema = Yup.object({
        react_select: Yup.object().required('Table is required').nullable(),
        client_code: Yup.string().required('Client Code is required'),
        from_date: Yup.date().required('From date is required'),
        to_date: Yup.date().required('To date is required'),
    });

    useEffect(() => {
        dispatch(tableList());
    }, [dispatch]);

    useEffect(() => {
        if (data && data.length > 0) {
            const firstRow = data[0];
            const dynamicRowData = Object.keys(firstRow).map((key, index) => {
                const isDateColumn = key.toLowerCase().includes('date') || key.toLowerCase().includes('at');
                const isMobileNumberColumn = key.toLowerCase().includes('mobile') || key.toLowerCase().includes('contact');

                const headerName = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                let selectorFunction = (row) => row[key];

                if (isDateColumn) {
                    selectorFunction = (row) => moment(row[key]).format('DD-MM-YYYY');
                } else if (isMobileNumberColumn) {
                    selectorFunction = (row) => `+${row[key]}`;
                }

                return {
                    id: (index + 1).toString(),
                    name: headerName,
                    selector: selectorFunction,
                    sortable: true,
                };
            });
            setRowData(dynamicRowData);
        } else {
            setRowData([]);
        }
    }, [data]);

    const handleChange = async (selectedOption) => {
        setData([])
        setDataCount(0)
        const dynamicValue = selectedOption ? selectedOption.value : null;
        dispatch(superAdminFilters({ table_name: dynamicValue })).then((resp) => {
            if (resp?.payload?.filters) {
                setDynamicFormValue(resp.payload.filters);
            } else {
                setDynamicFormValue([]);
            }
        });
    };

    const options = [
        { value: "", label: "Select Table" },
        ...(Array.isArray(tableListData)
            ? tableListData.map((data) => ({
                value: data?.value,
                label: `${data?.key}`,
            }))
            : []),
    ];

    const onSubmit = (values) => {
        setLoadingState(true);
        const filtersPayload = {};
        dynamicFormValue.forEach(filter => {
            if (values[filter.key]) {
                filtersPayload[filter.key] = values[filter.key];
            }
        });

        const bodyData = {
            table_name: values.react_select.value,
            filters: filtersPayload,
            start_date: values.from_date,
            end_date: values.to_date,
            client_code: values.client_code,
        };

        setSearchBodyData(bodyData);
        fetchData(bodyData, 1);
    };

    const fetchData = (body, page) => {
        const queryParams = {
            page: page,
            page_size: pageSize,
        };

        dispatch(superAdminReports({ body, query: queryParams }))
            .then((resp) => {
                if (resp?.payload?.results) {
                    setDataCount(resp.payload.count);
                    setData(resp.payload.results);
                } else {
                    setDataCount(0);
                    setData([]);
                }
            })
            .finally(() => {
                setLoadingState(false);
            });
    };

    const handleExport = (values) => {
        setExportLoading(true);
        const exportPayload = {
            table_name: values.react_select.value,
        };
        superAdminExportToXl(exportPayload)
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Admin_report.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error("Export failed:", error);
            })
            .finally(() => {
                setExportLoading(false);
            });
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
        if (searchBodyData) {
            fetchData(searchBodyData, page);
        }
    };

    return (
        <CardLayout title="Admin Reports">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {formik => (
                    <Form>
                        <div className="row">
                            <div className="form-group col-md-3">
                                <CustomReactSelect
                                    name="react_select"
                                    options={options}
                                    placeholder="Select Table"
                                    filterOption={createFilter({ ignoreAccents: false })}
                                    label="Select Table"
                                    onChange={(selectedOption) => {
                                        formik.setFieldValue('react_select', selectedOption);
                                        handleChange(selectedOption);
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="client_code"
                                    label="Client Code"
                                    placeholder="Enter Client Code"
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <FormikController
                                    control="date"
                                    label="From Date"
                                    id="from_date"
                                    name="from_date"
                                    value={formik.values.from_date ? new Date(formik.values.from_date) : null}
                                    onChange={date => formik.setFieldValue('from_date', date)}
                                    format="dd-MM-y"
                                    clearIcon={null}
                                    className="form-control rounded-0 p-0"
                                    errorMsg={formik.errors.from_date}
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <FormikController
                                    control="date"
                                    label="End Date"
                                    id="to_date"
                                    name="to_date"
                                    value={formik.values.to_date ? new Date(formik.values.to_date) : null}
                                    onChange={date => formik.setFieldValue('to_date', date)}
                                    format="dd-MM-y"
                                    clearIcon={null}
                                    className="form-control rounded-0 p-0"
                                    errorMsg={formik.errors.to_date}
                                />
                            </div>
                        </div>
                        <div className="row">
                            {dynamicFormValue.map((filter) => (
                                <div className="form-group col-md-3" key={filter.key}>
                                    <FormikController
                                        control="input"
                                        type="text"
                                        name={filter.key}
                                        label={filter.display_name}
                                        placeholder={`Enter ${filter.display_name}`}
                                        className="form-control"
                                    />

                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <button
                                className="btn cob-btn-primary approve text-white"
                                type="submit"
                                disabled={loadingState}
                            >
                                {loadingState ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                            {data.length > 0 && (
                                <button
                                    className="btn cob-btn-primary approve text-white ms-4"
                                    type="button"
                                    onClick={() => handleExport(formik.values)}
                                    disabled={!formik.values.react_select || exportLoading}
                                >
                                    {exportLoading ? (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    ) : (
                                        "Export"
                                    )}
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>


            <div className="container p-0 mt-5 ">
                <div className="scroll overflow-auto">
                    {loadingState ? (
                        <CustomLoader loadingState={loadingState} />
                    ) : (
                        <>
                            {data.length === 0 ? "" : <h6>Total Count : {dataCount}</h6>}
                            <Table
                                row={rowData}
                                data={data}
                                dataCount={dataCount}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                changeCurrentPage={changeCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </CardLayout>
    );
};

export default SuperAdminReports;
