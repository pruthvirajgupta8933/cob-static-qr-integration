import React from 'react'

function ProgressBar() {
    return (
        <div className='col-lg-12' >
            <div className="text-center p-4 m-4">
                <div className="spinner-border" style={{ width: '2rem', height: '2rem' }} >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar
