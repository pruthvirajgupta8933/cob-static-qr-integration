import React from 'react'

const Loader = () => {
  return (
    <div>
        <button className="btn btn-primary" type="button" disabled>
  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>
      
    </div>
  )
}

export default Loader
