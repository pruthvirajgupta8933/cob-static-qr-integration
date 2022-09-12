import React from 'react'
import  "../../assets/css/kyc-document.css"

import $ from 'jquery';




function UploadDocTest() {
    
function readURL(input) {
    // console.log(33);
    console.log(333);
    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        // $('.image-upload-wrap').hide();
  
        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } else {
      removeUpload();
    }
  }
  
  function removeUpload() {
    console.log(222);
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }
  $('.image-upload-wrap').bind('dragover', function () {
          $('.image-upload-wrap').addClass('image-dropping');
      });
      $('.image-upload-wrap').bind('dragleave', function () {
          $('.image-upload-wrap').removeClass('image-dropping');
  });
  

  const handleChange = function (e) {
    console.log("change event")
    readURL(e.target)
  }

  const handleClick = function () {
    console.log("click event")    
    removeUpload()
  }


  return (
    <div className="file-upload">
  <div className="image-upload-wrap">
  {/* handleChange(e) */}
    <input className="file-upload-input" type="file" onChange={handleChange}  />
    <div className="drag-text">
      <h3>Drag and drop a file or select add Image</h3>
    </div>
  </div>
  <div className="file-upload-content">
    <img className="file-upload-image" src="#" alt="Document" />
    <div className="image-title-wrap">
      <button type="button" onClick={handleClick} className="remove-image">Remove <span className="image-title">Uploaded Image</span></button>
    </div>
  </div>
</div>

  )
}

export default UploadDocTest