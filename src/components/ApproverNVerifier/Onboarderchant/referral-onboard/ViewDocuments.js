import React, { useEffect, useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { kycDocumentUploadList } from "../../../../slices/kycSlice";
import DocViewerComponent from "../../../../utilities/DocViewerComponent";

const ViewDocuments = () => {
  const [docViewer, setDocViewer] = useState();
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const { KycDocUpload } = useSelector((state) => state.kyc);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      kycDocumentUploadList({
        login_id: basicDetailsResponse.data?.loginMasterId,
      })
    );
  }, []);
  return (
    <div className="table-responsive">
      {docViewer && (
        <DocViewerComponent
          modalToggle={docViewer}
          fnSetModalToggle={setDocViewer}
          selectViewDoc={{
            documentUrl: docViewer?.filePath,
            documentName: docViewer?.doc_type_name,
          }}
        />
      )}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Type</th>
            <th scope="col">Name</th>
            {/* <th scope="col">Description</th> */}
            <th scope="col">View</th>
          </tr>
        </thead>
        <tbody>
          <Suspense fallback={<div>Loading...</div>}></Suspense>
          {KycDocUpload.map((doc) => (
            <tr>
              <td>{doc.doc_type_name}</td>
              <td>{doc.name}</td>
              {/* <td>{doc.description}</td> */}
              <td
                className="text-primary cursor_pointer text-decoration-underline"
                onClick={() => setDocViewer(doc)}
              >
                View Document
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDocuments;
