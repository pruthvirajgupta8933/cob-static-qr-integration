import React from 'react'

function BusinessDetailsOps() {
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <form className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="accountNumber">PAN :</label>
                    <input type="text" className="form-control" id="accountNumber" placeholder="Enter PAN" required />
                </div>
                <div className="col-md-6">
                    <label htmlFor="ifsc">Website URL :</label>
                    <input type="text" className="form-control" id="ifsc" placeholder="Enter Website URL" required />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                </div>
            </form>
        </div>
    )
}

export default BusinessDetailsOps