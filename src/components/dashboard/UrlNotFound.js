import React from 'react'
import { Link } from 'react-router-dom'

const UrlNotFound = () => {
  return (
    <div className='row'>
		<div className="col-md-12 d-flex flex-column justify-content-center align-items-center text-white vh-100">
			<h1>404</h1>
			<h4>Page not found</h4>
			<p>Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
			<a href={()=>false} >Back To Home</a>
		</div>
	</div>
  )
}

export default UrlNotFound
