import React from 'react'

const Loader = () => {
  return (
    <div>
        {/* <button class="btn btn-primary" type="button" disabled>
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  <span class="sr-only">Loading...</span>
</button> */}
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>
      
    </div>
  )
}

export default Loader
