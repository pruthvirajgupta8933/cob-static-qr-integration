
import React from 'react'
import HeaderPage from '../login/HeaderPage';
import VerifyEmailPhone from './VerifyEmailPhone';



const ForgetPassword = () => {
    return (
        <React.Fragment>
            <HeaderPage/>
            {/* <div className="container-fluid bg-info">
                <div className="row">
                <div className="col-sm-6 mx-auto">
                    <div className="card ">
                    <div className="card-header text-center">
                        Forget Password
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Please Enter the detatils. </h5>
                        <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                        </form>
                        <p className="card-text" style={{display: "none"}}>With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div className="card-footer text-muted text-center">
                        Sabpaisa.in
                    </div>
                    </div>
                </div>
                </div>
            </div>         */}

            <VerifyEmailPhone/>
        </React.Fragment>
    )
}


export default ForgetPassword;