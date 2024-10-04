import React from "react";
import CustomModal from "../_components/custom_modal";
import classes from "./utilities.module.css"

const DocViewerComponent = ({ selectViewDoc, modalToggle, fnSetModalToggle }) => {
  const getFileType = (url) => {
    const extension = url?.split('.')?.pop()?.toLowerCase(); // Get the file extension
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'unsupported';
    }
  };

  const docModalBody = () => {
    // console.log(selectViewDoc?.filePath)
    const fileType = getFileType(selectViewDoc?.documentUrl);
    const disableRightClick = (e) => {
      e.preventDefault();
    };

    return (
      <div>
        {fileType === 'image' ? (
          <img
            src={selectViewDoc?.documentUrl ?? '#'}
            alt="Doc"
            width={'100%'}
            height={'auto'}
            onContextMenu={disableRightClick}
          />
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
