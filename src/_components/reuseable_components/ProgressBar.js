import React from 'react'

function ProgressBar() {
    return (
        <div className='col-lg-12 col-md-12 mrg-btm- bgcolor' >
            <div class="text-center">
                <div class="spinner-border" style={{width: '3rem', height: '3rem'}} role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar
