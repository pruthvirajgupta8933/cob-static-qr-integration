import React from 'react'

const BusinessDetails = (props) => {
    const {merchantKycId}=props;
  return (
    <div className="row mb-4 border">
                <div class="col-lg-12">
                  <h3 className="font-weight-bold">Business Details</h3>
                </div>

                <div class="col-sm-12 col-md-12 col-lg-12 marg-b">
                  <label class="col-form-label mt-0 p-2">
                    GSTIN<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.gstNumber
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Business PAN<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.panCard}
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Authorized Signatory PAN{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.signatoryPAN
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Business Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.companyName ? merchantKycId?.companyName : ""
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    PAN Owner's Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.nameOnPanCard
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Address<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.operationalAddress
                    }
                  />
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    City<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.cityId}
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    State<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.state_name
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Pincode<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.pinCode}
                  />
                </div>

              </div>
  )
}

export default BusinessDetails
