import React from 'react'

function ContactInfo() {
  return (
    <div className="col-md-12 col-md-offset-4">   
    <form>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Contact Name *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Contact Number *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="inputEmail4">Contact Email *</label>
        <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="inputPassword4">Contact Designation *</label>
        <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
      </div>
    </div> 
    <button type="submit" className="btn btn-primary">Save</button>
  </form>
  </div>
  )
}

export default ContactInfo