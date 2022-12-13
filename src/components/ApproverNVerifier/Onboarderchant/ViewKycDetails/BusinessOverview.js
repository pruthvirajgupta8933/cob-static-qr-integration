import React from 'react'

const BusinessOverview = (props) => {
    const {businessTypeResponse,businessCategoryResponse,merchantKycId} =props;
  return (
    <div className="row mb-4 border">
    <div class="col-lg-12">
      <h3 className="font-weight-bold">Business Overview</h3>
    </div>
    <div class="col-sm-6 col-md-6 col-lg-6">
      <label class="col-form-label mt-0 p-2">
        Business Type<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        disabled="true"
        value={businessTypeResponse}
      />
    </div>

    <div class="col-sm-6 col-md-6 col-lg-6">
      <label class="p-2 mt-0">
        Business Category<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        disabled="true"
        value={businessCategoryResponse}
      />
    </div>


    <div class="col-sm-6 col-md-6 col-lg-6">
      <label class="col-form-label p-2 mt-0">
        Business Label <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.billingLabel
        }
      />
    </div>

    <div class="col-sm-6 col-md-6 col-lg-6">
      <label class="col-form-label p-2 mt-0">
        {merchantKycId?.is_website_url === true ?
          <p className="font-weight-bold"> Merchant wish to accept payments on (Web/App URL) {merchantKycId?.website_app_url}</p> :
          `Merchant has accepted payments without any web/app `}
      </label>
    </div>


    <div class="col-sm-4 col-md-4 col-lg-4">
      <label class="col-form-label p-2 mt-0">
        Company Website<span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.companyWebsite
        }
      />
    </div>

    <div class="col-sm-4 col-md-4 col-lg-4">
      <label
        class="col-form-label p-0"
        style={{ marginTop: "15px" }}
      >
        Expected Transactions/Year{" "}
        <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.expectedTransactions
        }
      />
    </div>

    <div class="col-sm-4 col-md-4 col-lg-4">
      <label class="col-form-label p-2 mt-0">
        Avg Ticket Amount<span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.avg_ticket_size
        }
      />
    </div>
  </div>
  )
}

export default BusinessOverview
