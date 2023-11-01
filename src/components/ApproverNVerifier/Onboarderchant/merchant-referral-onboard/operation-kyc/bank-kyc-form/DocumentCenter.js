import React from 'react'
import FileUpload from '../../../../../../_components/reuseable_components/react-dropzone/FileUpload'

function DocumentCenter({setCurrentTab}) {
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            Document center
            <FileUpload setCurrentTab={setCurrentTab}  />
        </div>
    )
}

export default DocumentCenter