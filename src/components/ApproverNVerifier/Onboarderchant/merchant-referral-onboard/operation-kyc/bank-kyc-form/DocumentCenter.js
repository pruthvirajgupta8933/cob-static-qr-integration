import React from "react";
import FileUpload from "../../../../../../_components/reuseable_components/react-dropzone/FileUpload";

function DocumentCenter({ setCurrentTab, isEditableInput, editKyc }) {
  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-link1"
      role="tabpanel"
      aria-labelledby="v-pills-link1-tab"
    >
      Document center
      <FileUpload
        setCurrentTab={setCurrentTab}
        isEditableInput={isEditableInput}
        editKyc={editKyc}
      />
    </div>
  );
}

export default DocumentCenter;
