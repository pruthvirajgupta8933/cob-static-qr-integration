import React from 'react'
import  "../../assets/css/kyc-document.css"

import $ from 'jquery';




function UploadDocTest() {
    
function readURL(input) {
  // var id = input.id;
        console.log(input)

    if (input.files && input.files[0]) {
  
      var reader = new FileReader();
  
      reader.onload = function(e) {
        // $('.image-upload-wrap').hide();
        
       

        $('.file-upload-image').attr('src', e.target.result);
        $('.file-upload-content').show();
  
        // $('.image-title').html(input.files[0].name);
      };
  
      reader.readAsDataURL(input.files[0]);
  
    } 
  }
  
  // function removeUpload() {
  //   console.log(222);
  //   $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  //   $('.file-upload-content').hide();
  //   $('.image-upload-wrap').show();
  // }
  // $('.image-upload-wrap').bind('dragover', function () {
  //         $('.image-upload-wrap').addClass('image-dropping');
  //     });
  //     $('.image-upload-wrap').bind('dragleave', function () {
  //         $('.image-upload-wrap').removeClass('image-dropping');
  // });
  

  const handleChange = function (e,id) {
    // console.log("change event")
    console.log(id)
    readURL(e.target)
  }


  return (
  <div className="file-upload">
  <div className="image-upload-wrap">
    <input className="file-upload-input" id="1" type="file" onChange={(e)=>handleChange(e,1)}  />
    <div className="drag-text">
      <h3>Drag and drop a file or select add Image</h3>
    </div>
  </div>

  <div className="image-upload-wrap">
    <input className="file-upload-input" id="2" type="file" onChange={(e)=>handleChange(e,2)}  />
    <div className="drag-text">
      <h3>Drag and drop a file or select add Image</h3>
    </div>
  </div>

  {/* uploaded document preview */}
  <div className="file-upload-content imagepre_1">
    <img className="file-upload-image imagepre_sub_1" src="#" alt="Document" />
  </div>

  <div className="file-upload-content imagepre_2">
    <img className="file-upload-image imagepre_sub_2" src="#" alt="Document" />
  </div>
</div>

  )
}

export default UploadDocTest