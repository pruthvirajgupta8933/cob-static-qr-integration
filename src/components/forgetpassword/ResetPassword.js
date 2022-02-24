import React from 'react'

function ResetPassword(props) {
       
    const {handleFormSubmit} = props;

    function handleSubmit(e) {
        e.preventDefault();
        handleFormSubmit("a3");
        console.log('You clicked submit.');
      }


  return (
    <div className="container-fluid bg-info">
    <div className="row " >
    <div className="col-sm-6 mx-auto">
        <div className="card ">
        <div className="card-header text-center">
            Reset Password
        </div>
        <div className="card-body">
            <h5 className="card-title">Please Enter the detatils. </h5>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">New Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" aria-describedby="PasswordHelp" placeholder="Enter New Password" />
                <small id="passwordHelp" className="form-text text-muted">Password validation message.</small>
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputpassword2">Confirm Password</label>
                <input type="password" className="form-control" id="exampleInputpassword2" aria-describedby="password2Help" placeholder="Enter Confirm Password" />
                <small id="password2Help" className="form-text text-muted">Password validation message</small>
            </div>
            <button className="btn btn-primary" onClick={()=>props.props('a4')}>Submit</button>
            </form>
            <p className="card-text" style={{display: "none"}}>With supporting text below as a natural lead-in to additional content.</p>
        </div>
        <div className="card-footer text-muted text-center">
            Sabpaisa.in
        </div>
        </div>
    </div>
    </div>
</div>  
  )
}

export default ResetPassword