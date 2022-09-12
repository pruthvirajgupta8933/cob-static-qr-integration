import React from 'react'
import  "../../assets/css/kyc-document.css"

function UploadDocTest() {
  return (
   
    <div className="file-upload">
  <div className="image-upload-wrap">
    <input className="file-upload-input" type="file" onchange="readURL(this);" accept="image/*" />
    <div className="drag-text">
      <h3>Drag and drop a file or select add Image</h3>
    </div>
  </div>
  <div className="file-upload-content">
    <img className="file-upload-image" src="#" alt="Document" />
    <div className="image-title-wrap">
      <button type="button" onclick="removeUpload()" className="remove-image">Remove <span className="image-title">Uploaded Image</span></button>
    </div>
  </div>
</div>

  )
}

export default UploadDocTest