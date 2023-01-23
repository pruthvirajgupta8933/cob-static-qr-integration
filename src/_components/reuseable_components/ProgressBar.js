import React from 'react'

function ProgressBar() {
    return (
        <div className='col-lg-10 col-md-10 mrg-btm- bgcolor' >
            <div className="text-center">
                <div className="spinner-border text-success" style={{width: '3rem', height: '3rem'}} >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar
