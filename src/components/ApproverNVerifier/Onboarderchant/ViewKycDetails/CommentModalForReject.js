import React from 'react'
import FormikController from '../../../../_components/formik/FormikController'
import { Formik, Form } from "formik";

const CommentModalForReject = () => {
    return (
        <div>
             <div class="modal fade max-width-50" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="container">
                                <Formik
                                 enableReinitialize={true}
                                >
                                    <Form>
                                        <div className="container">
                                            <div className="row">
                                                <div>
                                                    <div className="col-lg-12-" style={{ width: "315px" }}>
                                                        <label
                                                            className="string optional text-bold"
                                                            htmlFor="comments"
                                                        >
                                                            Comments
                                                        </label>
                                                        <FormikController
                                                            control="textArea"
                                                            name="general_info_"
                                                            className="form-control"
                                                            placeholder="Enter reject resion"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm" style={{ marginTop: "52px" }}>
                                                    <button
                                                        type="submit"
                                                        className="btn approve text-white  cob-btn-primary  btn-sm"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default CommentModalForReject
