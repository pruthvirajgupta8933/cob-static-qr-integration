import React from 'react'

function ContactDetailsOps() {
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <form className="row g-3">

                <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">Client Name</label>
                    <input type="text" className="form-control" id="inputCity" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Email ID</label>
                    <input type="email" className="form-control" id="inputEmail4" />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Contact Number</label>
                    <input type="password" className="form-control" id="inputPassword4" />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                </div>
            </form>

        </div>
    )
}

export default ContactDetailsOps