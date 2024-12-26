import React from 'react'

const PasswordGuideline = () => {
    return (
        <div className="mb-3">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Password Guidelines</h5>
                    <button
                        className="btn btn-link text-white text-decoration-none fw-bold"
                        data-bs-toggle="collapse"
                        data-bs-target="#passwordGuidelines"
                        aria-expanded="false"
                        aria-controls="passwordGuidelines"
                    >
                        <i className="fa fa-chevron-down"></i>
                    </button>
                </div>
                <div id="passwordGuidelines" className="collapse">
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Password must include both alpha (A-Z) and numeric (0-9) characters.
                            </li>
                            <li className="list-group-item">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Password should contain any special character(s) from (!, @, #, $, etc.).
                            </li>
                            <li className="list-group-item">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                Password should be minimum 6 characters and maximum 12 characters in length.
                            </li>
                            <li className="list-group-item">
                                <i className="fa fa-check-circle text-success me-2"></i>
                                For security purposes, passwords will expire every 14 days.
                            </li>
                            <li className="list-group-item">
                                <i className="fa fa-info-circle text-primary me-2"></i>
                                <strong>Example:</strong> abc@123 is your password for Jan 1-14. Your password for Jan 15-28 can be xyz@123.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordGuideline
