import React from 'react'
import { Link } from 'react-router-dom'

const UrlNotFound = () => {
  return (
    
    
  
    <div className="row container-fluid bgblue">
      <div className="col-lg-12 col-md-12 d-flex flex-column justify-content-center align-items-center text-white vh-100">
        <h1>404</h1>
        <h4>Page not found</h4>
        <p>Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
        <Link className='btn btn-primary' to={`/login`}>Back To Home</Link>
      </div>

    </div>
    
    
  )
}

export default UrlNotFound
