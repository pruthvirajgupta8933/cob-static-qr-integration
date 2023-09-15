import React from 'react'
import Basic from '../../../../../../_components/reuseable_components/react-dropzone/Basic'

function DocumentCenter() {
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <Basic />
            <div className="col-12">
                    <button type="submit" className="btn cob-btn-primary btn-sm">Submit</button>
                </div>
        </div>
    )
}

export default DocumentCenter