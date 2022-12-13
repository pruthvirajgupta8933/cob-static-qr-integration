import React from 'react'

const BankDetails = (props) => {
    const {merchantKycId}=props;
   
  return (
    <div className="row mb-4 border">
    <div class="col-lg-12">
      <h3 className="font-weight-bold">Bank Details</h3>
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6 ">
      <label class="col-form-label mt-0 p-2">
        IFSC Code<span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.ifscCode}
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Business Account Number
        <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountNumber
        }
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Account Holder Name<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountHolderName
        }
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Account Type<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountType
        }
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Bank Name<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.bankName}
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Branch<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.branch}
      />
      
    </div>
    <div class="col-lg-6 "></div>
        <div class="col-lg-6 mt-3">
          <button type="button" class="btn btn-primary">Verify</button>
          <button type="button" class="btn btn-primary">Reject</button>
      
        </div>
    
  </div>
     )
}

export default BankDetails
