import React, { useState } from 'react';
import Collapse from 'react-collapse';

const CollapsibleForm = ({ title, formContent, isOpen, onToggle }) => {
 

  return (
    <div className="col-lg-12 border m-1 p-2">
    <div onClick={onToggle} style={{ cursor: 'pointer' }}>
    <h6 className="mb-0 text-primary">{title}</h6>
    </div>
    <Collapse isOpened={isOpen}>
      <form>
        {formContent}
      </form>
    </Collapse>
  </div>
  );
};

export default CollapsibleForm;