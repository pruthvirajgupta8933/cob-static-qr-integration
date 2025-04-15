import React from "react";
import CustomModal from "../_components/custom_modal";
import classes from "./utilities.module.css"
// import testTimage from "../assets/images/Background.png"
import { saveImage } from "./saveImage";

const DocViewerComponent = ({ selectViewDoc, modalToggle, fnSetModalToggle }) => {

  const getFileType = (url) => {
    if (!url) return 'unsupported';

    // Extract the file extension using regex
    const match = url.match(/\.([a-zA-Z0-9]+)$/);
    const extension = match ? match[1].toLowerCase() : '';

    // Validate against supported types
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'unsupported';
    }
  };

  const docModalBody = () => {
    const fileType = getFileType(selectViewDoc?.documentUrl);


    return (
      <div>
        {fileType === 'image' ? (
          <React.Fragment>
            <div className="text-end p-3">
              <button className="btn btn-sm cob-btn-primary" onClick={() => saveImage(selectViewDoc?.documentUrl, selectViewDoc?.documentName)}>
                <i className="fa fa-download" />
                <span className="d-none">download</span>
              </button>
            </div>

            <img
              src={selectViewDoc?.documentUrl ?? '#'}
              alt="Doc"
              width={'100%'}
              height={'auto'}
            />
          </React.Fragment>


        ) : fileType === 'pdf' ? (
          <div style={{ position: 'relative', width: '100%', height: 610 }}>
            <iframe
              title="document"
              className={classes.pdf_preview_frame}
              src={`${selectViewDoc?.documentUrl ?? '#'}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 40,
                backgroundColor: 'transparent',
                zIndex: 999,
              }}
            />
          </div>
        ) : (
          <p>Unsupported file type</p>
        )}
      </div>
    );
  };


  const modalToggleHandler = () => {
    fnSetModalToggle(false);
  };

  return (
    <div className="document-preview-modal">
      <CustomModal headerTitle={`Document : ${selectViewDoc?.documentName}`} modalBody={docModalBody} modalToggle={modalToggle} fnSetModalToggle={modalToggleHandler} modalSize={'modal-lg'} />
    </div>

  );
};

export default DocViewerComponent;
