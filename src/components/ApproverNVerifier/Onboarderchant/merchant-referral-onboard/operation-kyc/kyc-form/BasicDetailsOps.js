import React from 'react'

function BasicDetailsOps() {
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <form className="row g-3">

                <div className="col-md-6">
                    <label  className="form-label">Full Name</label>
                    <input type="text" className="form-control"  />
                </div>
                <div className="col-md-6">
                    <label  className="form-label">Email ID</label>
                    <input type="email" className="form-control"  />
                </div>
                <div className="col-md-6">
                    <label  className="form-label">Contact Number</label>
                    <input type="text" className="form-control"  />
                </div>
                <div className="col-md-6">
                    <label  className="form-label">Business Category</label>
                    <input type="text" className="form-control"  />
                </div>
                <div className="col-md-6">
                    <label  className="form-label">Create Password</label>
                    <input type="password" className="form-control"  />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                </div>
            </form>

        </div>
    )
}

export default BasicDetailsOps