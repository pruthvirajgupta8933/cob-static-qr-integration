import React from 'react'

function ProgressBar() {
    return (
        <div className='col-lg-12 col-md-12 mrg-btm- bgcolor' >
            <div className="text-center">
                <div className="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar
