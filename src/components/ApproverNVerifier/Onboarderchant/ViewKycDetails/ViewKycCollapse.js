import React from 'react'
import Collapse from 'react-collapse';

const ViewKycCollapse = ({ title, formContent, isOpen, onToggle, icon }) => {
  return (
    <div className="col-lg-12 border m-1 p-2">

      <div onClick={onToggle} className="d-flex align-items-center cursor_pointer">
        {isOpen ? (
          <i className="fa fa-caret-down me-2"></i>
        ) : (
          <i className="fa fa-caret-right me-2"></i>
        )}
        <h6 className={`mb-0 text-primary pan_title`}>{title}</h6>
      </div>

      <Collapse isOpened={isOpen} >
        {formContent}
      </Collapse>
    </div>
  );
}

export default ViewKycCollapse