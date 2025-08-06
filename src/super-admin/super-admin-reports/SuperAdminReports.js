import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CardLayout from '../../utilities/CardLayout';
import FormikController from '../../_components/formik/FormikController';
import moment from 'moment';



const SuperAdminReports = () => {

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
        table: '',
        client_code: '',
        from_date: splitDate,
        to_date: splitDate,
    };

    const validationSchema = Yup.object({
        table: Yup.string().required('Table is required'),
        client_code: Yup.string().required('Client Code is required'),
        from_date: Yup.date().required('From date is required'),
        to_date: Yup.date().required('To date is required'),
    });

    const onSubmit = values => {
        console.log('Submitted values:', values);
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
                                <FormikController
                                    control="select"
                                    label="Select Table"
                                    id="table"
                                    name="table"
                                    options={[
                                        { label: 'Select Table', value: '' },
                                        { label: 'User Logs', value: 'user_logs' },
                                        { label: 'Transaction Report', value: 'transaction_report' },
                                    ]}
                                // value={formik.values.table}
                                // onChange={value => formik.setFieldValue('table', value)}
                                // errorMsg={formik.errors.table}
                                // touched={formik.touched.table}
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


                        <div className="">
                            <button className="btn cob-btn-primary approve text-white" type="submit">
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </CardLayout>
    );
};

export default SuperAdminReports;
