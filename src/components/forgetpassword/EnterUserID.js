import React from 'react'

function EnterUserID(props) {

    // const {handleFormSubmit} = props;
    function handleSubmit(e) {
        e.preventDefault();      
        console.log('You clicked submit.');
      }
    
  return (
   <div className="container-fluid bg-info">
                <div className="row " >
                <div className="col-sm-6 mx-auto">
                    <div className="card ">
                    <div className="card-header text-center">
                        Forget Password
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Please Enter the detatils. </h5>
                        <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <button className="btn btn-primary"  onClick={()=>props.props('a2')} >Submit</button>
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

export default EnterUserID