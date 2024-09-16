import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const DocViewerComponent = ({ mediaUrl }) => {
  // Create a document object for the media URL
  const docs = [
    {
      uri: mediaUrl, // You can directly pass the mediaUrl via props
    },
  ];

  return (
    <div>
      <DocViewer
        documents={docs} // Pass the document array
        pluginRenderers={DocViewerRenderers} // Use the default renderers
        style={{ height: "600px", width: "100%" }} // Adjust size as needed
      />
    </div>
  );
};

export default DocViewerComponent;
