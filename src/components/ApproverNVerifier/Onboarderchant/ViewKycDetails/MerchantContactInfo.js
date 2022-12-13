import React from 'react'

function MerchantContactInfo(props) {
  const { merchantKycId } = props


  return (
    <div className="row mb-4 border">
      <div className="col-lg-12">
        <h3 className="font-weight-bold">Merchant Contact Info</h3>
      </div>

      <div class="col-sm-6 col-md-6 col-lg-6 ">
        <label class="col-form-label mt-0 p-2">
          Contact Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.name}
        />
      </div>

      <div class="col-sm-6 col-md-6 col-lg-6 ">
        <label class="col-form-label mt-0 p-2">
          Aadhaar Number <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.aadharNumber}
        />
      </div>


      <div class="col-sm-6 col-md-6 col-lg-6 ">
        <label class="col-form-label mt-0 p-2">
          Contact Number<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.contactNumber}
        />

        <span>
          {merchantKycId?.isContactNumberVerified === 1 ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
      </div>
      <div class="col-sm-6 col-md-6 col-lg-6 ">
        <label class="col-form-label mt-0 p-2">
          Email Id<span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.emailId}
        />
        <span>
          {merchantKycId?.isEmailVerified === 1 ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>

      </div>

      <div class="col-lg-6"></div>
        <div class="col-lg-6">
          <button type="button" class="btn btn-primary">Verify</button>
          <button type="button" class="btn btn-primary">Reject</button>
      
        </div>
      

      

    </div>

  )
}

export default MerchantContactInfo